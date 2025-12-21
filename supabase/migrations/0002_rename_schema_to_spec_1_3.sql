-- ============================================================================
-- Migration: 0002_rename_schema_to_spec_1_3.sql
-- Description: Rename schema objects to align with Spec 1.3 terminology
--              community -> organisation, programme -> group, participant -> user
-- ============================================================================

-- ============================================================================
-- STEP 1: RENAME ENUM VALUES
-- Must happen before any table/column renames that might reference them
-- ============================================================================

-- user_role: community_admin -> organisation_admin, participant -> user
ALTER TYPE user_role RENAME VALUE 'community_admin' TO 'organisation_admin';
ALTER TYPE user_role RENAME VALUE 'participant' TO 'user';

-- programme_type -> group_type (rename enum itself)
ALTER TYPE programme_type RENAME TO group_type;

-- Rename value within group_type enum
ALTER TYPE group_type RENAME VALUE 'community_connection' TO 'organisation_connection';

-- programme_participant_status -> group_member_status
ALTER TYPE programme_participant_status RENAME TO group_member_status;

-- ============================================================================
-- STEP 2: DROP TRIGGERS (before renaming tables they reference)
-- ============================================================================

DROP TRIGGER IF EXISTS update_communities_updated_at ON communities;
DROP TRIGGER IF EXISTS update_programmes_updated_at ON programmes;

-- ============================================================================
-- STEP 3: RENAME TABLES
-- ============================================================================

ALTER TABLE communities RENAME TO organisations;
ALTER TABLE community_admins RENAME TO organisation_admins;
ALTER TABLE programmes RENAME TO groups;
ALTER TABLE programme_participants RENAME TO group_members;
ALTER TABLE blocked_participants RENAME TO blocked_users;

-- ============================================================================
-- STEP 4: RENAME COLUMNS
-- ============================================================================

-- organisation_admins: community_id -> organisation_id
ALTER TABLE organisation_admins RENAME COLUMN community_id TO organisation_id;

-- groups: community_id -> organisation_id, programme_type -> group_type
ALTER TABLE groups RENAME COLUMN community_id TO organisation_id;
ALTER TABLE groups RENAME COLUMN programme_type TO group_type;

-- group_members: programme_id -> group_id
ALTER TABLE group_members RENAME COLUMN programme_id TO group_id;

-- rounds: programme_id -> group_id, participant_count -> member_count
ALTER TABLE rounds RENAME COLUMN programme_id TO group_id;
ALTER TABLE rounds RENAME COLUMN participant_count TO member_count;

-- matches: participant_ids -> user_ids
ALTER TABLE matches RENAME COLUMN participant_ids TO user_ids;

-- exclusions: programme_id -> group_id, participant_1_id -> user_1_id, participant_2_id -> user_2_id
ALTER TABLE exclusions RENAME COLUMN programme_id TO group_id;
ALTER TABLE exclusions RENAME COLUMN participant_1_id TO user_1_id;
ALTER TABLE exclusions RENAME COLUMN participant_2_id TO user_2_id;

-- connections: programme_id -> group_id, participant_ids -> user_ids
ALTER TABLE connections RENAME COLUMN programme_id TO group_id;
ALTER TABLE connections RENAME COLUMN participant_ids TO user_ids;

-- ============================================================================
-- STEP 5: RENAME INDEXES
-- ============================================================================

-- organisations (was communities)
ALTER INDEX idx_communities_slug RENAME TO idx_organisations_slug;
ALTER INDEX idx_communities_is_active RENAME TO idx_organisations_is_active;

-- organisation_admins (was community_admins)
ALTER INDEX idx_community_admins_user_id RENAME TO idx_organisation_admins_user_id;
ALTER INDEX idx_community_admins_community_id RENAME TO idx_organisation_admins_organisation_id;

-- groups (was programmes)
ALTER INDEX idx_programmes_community_id RENAME TO idx_groups_organisation_id;
ALTER INDEX idx_programmes_is_active RENAME TO idx_groups_is_active;
ALTER INDEX idx_programmes_programme_type RENAME TO idx_groups_group_type;

-- group_members (was programme_participants)
ALTER INDEX idx_programme_participants_programme_id RENAME TO idx_group_members_group_id;
ALTER INDEX idx_programme_participants_user_id RENAME TO idx_group_members_user_id;
ALTER INDEX idx_programme_participants_status RENAME TO idx_group_members_status;

-- rounds
ALTER INDEX idx_rounds_programme_id RENAME TO idx_rounds_group_id;

-- exclusions
ALTER INDEX idx_exclusions_programme_id RENAME TO idx_exclusions_group_id;
ALTER INDEX idx_exclusions_participants RENAME TO idx_exclusions_users;

-- connections
ALTER INDEX idx_connections_programme_id RENAME TO idx_connections_group_id;
ALTER INDEX idx_connections_participant_ids RENAME TO idx_connections_user_ids;

-- matches
ALTER INDEX idx_matches_participant_ids RENAME TO idx_matches_user_ids;

-- blocked_users (was blocked_participants)
ALTER INDEX idx_blocked_participants_blocker_id RENAME TO idx_blocked_users_blocker_id;
ALTER INDEX idx_blocked_participants_blocked_id RENAME TO idx_blocked_users_blocked_id;

-- ============================================================================
-- STEP 6: RENAME CONSTRAINTS
-- PostgreSQL doesn't support ALTER CONSTRAINT ... RENAME, so we drop and recreate
-- ============================================================================

-- matches: valid_participant_count -> valid_user_count
ALTER TABLE matches DROP CONSTRAINT valid_participant_count;
ALTER TABLE matches ADD CONSTRAINT valid_user_count CHECK (
  (match_type = 'pair' AND array_length(user_ids, 1) = 2) OR
  (match_type = 'trio' AND array_length(user_ids, 1) = 3)
);

-- exclusions: exclusion_participant_order -> exclusion_user_order
ALTER TABLE exclusions DROP CONSTRAINT exclusion_participant_order;
ALTER TABLE exclusions ADD CONSTRAINT exclusion_user_order CHECK (user_1_id < user_2_id);

-- ============================================================================
-- STEP 7: RECREATE TRIGGERS WITH NEW NAMES
-- ============================================================================

CREATE TRIGGER update_organisations_updated_at
  BEFORE UPDATE ON organisations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_groups_updated_at
  BEFORE UPDATE ON groups
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- STEP 8: UPDATE COMMENTS
-- ============================================================================

-- Table comments
COMMENT ON TABLE organisations IS 'Top-level organizational units that contain groups and users';
COMMENT ON TABLE organisation_admins IS 'Maps users to organisations they can administer';
COMMENT ON TABLE groups IS 'Introduction groups that run within an organisation';
COMMENT ON TABLE group_members IS 'Enrollment records linking users to groups';
COMMENT ON TABLE blocked_users IS 'User-initiated blocks preventing matching between two users';
COMMENT ON TABLE rounds IS 'Individual matching rounds within a group';

-- Column comments
COMMENT ON COLUMN groups.repeat_match_cooldown IS 'Number of rounds before a pair can be matched again';
COMMENT ON COLUMN matches.user_ids IS '2 or 3 user IDs in this match';
COMMENT ON COLUMN rounds.round_number IS 'Sequential round number within the group';
COMMENT ON COLUMN connections.user_ids IS '2 or 3 user IDs in this connection';

-- Enum comments
COMMENT ON TYPE user_role IS 'User role hierarchy: super_admin > organisation_admin > user';
COMMENT ON TYPE group_type IS 'Types of introduction groups';
COMMENT ON TYPE group_member_status IS 'Status of a user within a group';

-- Constraint comments
COMMENT ON CONSTRAINT exclusion_user_order ON exclusions IS 'Ensures consistent ordering to prevent duplicate exclusions';
