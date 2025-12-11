-- ============================================================================
-- Curio MVP Initial Database Schema
-- Migration: 0001_init_curio_schema.sql
-- Description: Creates all core tables for Curio introductions platform
-- ============================================================================

-- ============================================================================
-- ENUMS
-- ============================================================================

-- User roles in the system
CREATE TYPE user_role AS ENUM ('super_admin', 'community_admin', 'participant');

-- Programme types
CREATE TYPE programme_type AS ENUM ('community_connection', 'cohort_blitz', 'event');

-- Cadence options for programmes
CREATE TYPE cadence AS ENUM (
  'daily',
  'every_2_days',
  'every_3_days',
  'weekly',
  'fortnightly',
  'monthly',
  'quarterly',
  'one_time'
);

-- Match size options
CREATE TYPE match_size AS ENUM ('pairs', 'pairs_with_trios');

-- Delivery channel options
CREATE TYPE channel AS ENUM ('email_manual', 'email_auto', 'slack', 'teams');

-- Programme participant status
CREATE TYPE programme_participant_status AS ENUM ('active', 'opted_out', 'removed');

-- Round status in the approval workflow
CREATE TYPE round_status AS ENUM ('draft', 'matched', 'pending_approval', 'sent', 'completed');

-- Match type (pair or trio)
CREATE TYPE match_type AS ENUM ('pair', 'trio');

-- Preferred cadence for participants
CREATE TYPE preferred_cadence AS ENUM ('weekly', 'fortnightly', 'monthly', 'quarterly');

-- ============================================================================
-- TABLES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Communities
-- ----------------------------------------------------------------------------
CREATE TABLE communities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_communities_slug ON communities(slug);
CREATE INDEX idx_communities_is_active ON communities(is_active);

COMMENT ON TABLE communities IS 'Top-level organizational units that contain programmes and participants';

-- ----------------------------------------------------------------------------
-- Users
-- Note: This extends Supabase auth.users with application-specific data
-- ----------------------------------------------------------------------------
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'participant',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_login_at TIMESTAMPTZ
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

COMMENT ON TABLE users IS 'Application user records linked to Supabase auth';

-- ----------------------------------------------------------------------------
-- Profiles
-- Participant profile data for matching and intro generation
-- ----------------------------------------------------------------------------
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,

  -- Required fields
  role_title TEXT NOT NULL,
  organisation TEXT NOT NULL,
  linkedin_url TEXT NOT NULL,
  location TEXT NOT NULL,
  timezone TEXT NOT NULL,

  -- Consent
  linkedin_data_consent BOOLEAN NOT NULL DEFAULT false,
  consent_given_at TIMESTAMPTZ,

  -- Professional context (stored as arrays)
  professional_tags TEXT[] NOT NULL DEFAULT '{}',
  intro_goals TEXT[] NOT NULL DEFAULT '{}',

  -- Personal interests with weights: [{interest: string, weight: 1-3}]
  personal_interests JSONB NOT NULL DEFAULT '[]',

  -- Preferences
  preferred_cadence preferred_cadence NOT NULL DEFAULT 'monthly',
  opt_in_status BOOLEAN NOT NULL DEFAULT true,
  sitting_out_until DATE,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_organisation ON profiles(organisation);
CREATE INDEX idx_profiles_opt_in_status ON profiles(opt_in_status);
CREATE INDEX idx_profiles_professional_tags ON profiles USING GIN(professional_tags);
CREATE INDEX idx_profiles_intro_goals ON profiles USING GIN(intro_goals);

COMMENT ON TABLE profiles IS 'Participant profiles containing info for matching and intro generation';
COMMENT ON COLUMN profiles.personal_interests IS 'Array of {interest: string, weight: 1-3} objects';

-- ----------------------------------------------------------------------------
-- Community Admins
-- Junction table linking users to communities they administer
-- ----------------------------------------------------------------------------
CREATE TABLE community_admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE(user_id, community_id)
);

CREATE INDEX idx_community_admins_user_id ON community_admins(user_id);
CREATE INDEX idx_community_admins_community_id ON community_admins(community_id);

COMMENT ON TABLE community_admins IS 'Maps users to communities they can administer';

-- ----------------------------------------------------------------------------
-- Programmes
-- Introduction programmes within communities
-- ----------------------------------------------------------------------------
CREATE TABLE programmes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,

  -- Basic info
  name TEXT NOT NULL,
  description TEXT,
  programme_type programme_type NOT NULL DEFAULT 'community_connection',
  audience_description TEXT,

  -- Configuration
  cadence cadence NOT NULL DEFAULT 'monthly',
  match_size match_size NOT NULL DEFAULT 'pairs',
  intro_window_days INTEGER NOT NULL DEFAULT 14,
  channel channel NOT NULL DEFAULT 'email_manual',

  -- Matching rules
  avoid_same_org BOOLEAN NOT NULL DEFAULT true,
  avoid_repeat_matches BOOLEAN NOT NULL DEFAULT true,
  repeat_match_cooldown INTEGER NOT NULL DEFAULT 6,

  -- Status
  is_active BOOLEAN NOT NULL DEFAULT true,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_programmes_community_id ON programmes(community_id);
CREATE INDEX idx_programmes_is_active ON programmes(is_active);
CREATE INDEX idx_programmes_programme_type ON programmes(programme_type);

COMMENT ON TABLE programmes IS 'Introduction programmes that run within a community';
COMMENT ON COLUMN programmes.repeat_match_cooldown IS 'Number of rounds before a pair can be matched again';

-- ----------------------------------------------------------------------------
-- Programme Participants
-- Links users to programmes they are enrolled in
-- ----------------------------------------------------------------------------
CREATE TABLE programme_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  programme_id UUID NOT NULL REFERENCES programmes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status programme_participant_status NOT NULL DEFAULT 'active',
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  left_at TIMESTAMPTZ,

  UNIQUE(programme_id, user_id)
);

CREATE INDEX idx_programme_participants_programme_id ON programme_participants(programme_id);
CREATE INDEX idx_programme_participants_user_id ON programme_participants(user_id);
CREATE INDEX idx_programme_participants_status ON programme_participants(status);

COMMENT ON TABLE programme_participants IS 'Enrollment records linking users to programmes';

-- ----------------------------------------------------------------------------
-- Rounds
-- Individual matching rounds within a programme
-- ----------------------------------------------------------------------------
CREATE TABLE rounds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  programme_id UUID NOT NULL REFERENCES programmes(id) ON DELETE CASCADE,
  round_number INTEGER NOT NULL,
  status round_status NOT NULL DEFAULT 'draft',

  -- Timestamps for workflow stages
  triggered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  matched_at TIMESTAMPTZ,
  submitted_for_approval_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ,
  approved_by UUID REFERENCES users(id),
  sent_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,

  -- Statistics
  participant_count INTEGER NOT NULL DEFAULT 0,
  match_count INTEGER NOT NULL DEFAULT 0,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE(programme_id, round_number)
);

CREATE INDEX idx_rounds_programme_id ON rounds(programme_id);
CREATE INDEX idx_rounds_status ON rounds(status);
CREATE INDEX idx_rounds_triggered_at ON rounds(triggered_at);

COMMENT ON TABLE rounds IS 'Individual matching rounds within a programme';
COMMENT ON COLUMN rounds.round_number IS 'Sequential round number within the programme';

-- ----------------------------------------------------------------------------
-- Matches
-- Individual matches (pairs or trios) within a round
-- ----------------------------------------------------------------------------
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  round_id UUID NOT NULL REFERENCES rounds(id) ON DELETE CASCADE,

  -- Participant IDs in this match (2 or 3 UUIDs)
  participant_ids UUID[] NOT NULL,
  match_type match_type NOT NULL DEFAULT 'pair',

  -- Calculated compatibility score (0.0 to 1.0)
  compatibility_score REAL NOT NULL DEFAULT 0.0,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT valid_participant_count CHECK (
    (match_type = 'pair' AND array_length(participant_ids, 1) = 2) OR
    (match_type = 'trio' AND array_length(participant_ids, 1) = 3)
  )
);

CREATE INDEX idx_matches_round_id ON matches(round_id);
CREATE INDEX idx_matches_participant_ids ON matches USING GIN(participant_ids);
CREATE INDEX idx_matches_match_type ON matches(match_type);

COMMENT ON TABLE matches IS 'Individual matches (pairs or trios) created during a round';
COMMENT ON COLUMN matches.compatibility_score IS 'Score from 0.0 to 1.0 based on matching algorithm';

-- ----------------------------------------------------------------------------
-- Intro Messages
-- Generated introduction messages for each match
-- ----------------------------------------------------------------------------
CREATE TABLE intro_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL UNIQUE REFERENCES matches(id) ON DELETE CASCADE,

  -- Generated content
  subject_line TEXT NOT NULL,
  body_html TEXT NOT NULL,
  body_plain TEXT NOT NULL,

  -- Edit tracking
  is_edited BOOLEAN NOT NULL DEFAULT false,
  edited_body TEXT,
  edited_at TIMESTAMPTZ,
  edited_by UUID REFERENCES users(id),

  generated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_intro_messages_match_id ON intro_messages(match_id);

COMMENT ON TABLE intro_messages IS 'Generated intro email content for each match';

-- ----------------------------------------------------------------------------
-- Exclusions
-- Admin-managed pairs that should never be matched within a programme
-- ----------------------------------------------------------------------------
CREATE TABLE exclusions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  programme_id UUID NOT NULL REFERENCES programmes(id) ON DELETE CASCADE,

  -- The two participants who should not be matched
  participant_1_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  participant_2_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Metadata
  reason TEXT,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Ensure no duplicate exclusions (order-independent)
  CONSTRAINT exclusion_participant_order CHECK (participant_1_id < participant_2_id),
  UNIQUE(programme_id, participant_1_id, participant_2_id)
);

CREATE INDEX idx_exclusions_programme_id ON exclusions(programme_id);
CREATE INDEX idx_exclusions_participants ON exclusions(participant_1_id, participant_2_id);

COMMENT ON TABLE exclusions IS 'Admin-managed pairs that should never be matched in a programme';
COMMENT ON CONSTRAINT exclusion_participant_order ON exclusions IS 'Ensures consistent ordering to prevent duplicate exclusions';

-- ----------------------------------------------------------------------------
-- Blocked Participants
-- Participant-managed blocks (personal preference not to be matched)
-- ----------------------------------------------------------------------------
CREATE TABLE blocked_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blocker_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  blocked_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Prevent duplicate blocks and self-blocks
  CONSTRAINT no_self_block CHECK (blocker_id != blocked_id),
  UNIQUE(blocker_id, blocked_id)
);

CREATE INDEX idx_blocked_participants_blocker_id ON blocked_participants(blocker_id);
CREATE INDEX idx_blocked_participants_blocked_id ON blocked_participants(blocked_id);

COMMENT ON TABLE blocked_participants IS 'Participant-initiated blocks preventing matching between two users';

-- ----------------------------------------------------------------------------
-- Connections
-- Records of introductions that have been sent (for history tracking)
-- ----------------------------------------------------------------------------
CREATE TABLE connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Participant IDs in this connection (2 or 3 UUIDs)
  participant_ids UUID[] NOT NULL,

  -- Source reference
  created_from_match_id UUID NOT NULL REFERENCES matches(id) ON DELETE SET NULL,
  programme_id UUID NOT NULL REFERENCES programmes(id) ON DELETE CASCADE,

  -- Timestamps
  connected_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_connections_participant_ids ON connections USING GIN(participant_ids);
CREATE INDEX idx_connections_programme_id ON connections(programme_id);
CREATE INDEX idx_connections_connected_at ON connections(connected_at);
CREATE INDEX idx_connections_match_id ON connections(created_from_match_id);

COMMENT ON TABLE connections IS 'Permanent record of introductions for participant history';

-- ============================================================================
-- UPDATED_AT TRIGGERS
-- Automatically update the updated_at column on row changes
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_communities_updated_at
  BEFORE UPDATE ON communities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_programmes_updated_at
  BEFORE UPDATE ON programmes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rounds_updated_at
  BEFORE UPDATE ON rounds
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- COMMENTS ON ENUMS
-- ============================================================================

COMMENT ON TYPE user_role IS 'User role hierarchy: super_admin > community_admin > participant';
COMMENT ON TYPE programme_type IS 'Types of introduction programmes';
COMMENT ON TYPE cadence IS 'Frequency options for programme rounds';
COMMENT ON TYPE round_status IS 'Workflow states for a matching round';
COMMENT ON TYPE match_type IS 'Whether a match is a pair (2 people) or trio (3 people)';
