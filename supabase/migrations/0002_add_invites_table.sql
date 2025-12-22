-- Migration: Add invites table for group invite links
-- Uses legacy naming: programme_id references programmes table

-- Create invites table
CREATE TABLE invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  programme_id UUID NOT NULL REFERENCES programmes(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  email TEXT,
  status TEXT NOT NULL DEFAULT 'invited' CHECK (status IN ('invited', 'joined')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  joined_at TIMESTAMPTZ
);

-- Indexes for common queries
CREATE INDEX idx_invites_programme_id ON invites(programme_id);
CREATE INDEX idx_invites_token ON invites(token);
CREATE INDEX idx_invites_status ON invites(status);

-- Documentation
COMMENT ON TABLE invites IS 'Invite tokens for joining groups (programmes)';
COMMENT ON COLUMN invites.programme_id IS 'Foreign key to programmes table (legacy naming)';
COMMENT ON COLUMN invites.token IS 'Unique invite token for URL';
COMMENT ON COLUMN invites.email IS 'Optional email address for targeted invite';
COMMENT ON COLUMN invites.status IS 'Current status: invited or joined';
COMMENT ON COLUMN invites.joined_at IS 'Timestamp when invite was accepted';
