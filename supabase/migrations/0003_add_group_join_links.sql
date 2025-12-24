-- Migration: Add group join links for multi-use invite URLs
-- These are separate from single-use invites and can be reused by multiple users

-- ============================================================================
-- TABLES
-- ============================================================================

-- Group join links (multi-use invite links)
CREATE TABLE group_join_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  max_uses INTEGER NULL, -- NULL means unlimited
  uses_count INTEGER NOT NULL DEFAULT 0,
  expires_at TIMESTAMPTZ NULL, -- NULL means no expiry
  created_by UUID NULL REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_group_join_links_group_id ON group_join_links(group_id);
CREATE INDEX idx_group_join_links_token ON group_join_links(token);
CREATE INDEX idx_group_join_links_is_active ON group_join_links(is_active);

COMMENT ON TABLE group_join_links IS 'Multi-use join links for groups, can be used by multiple users';
COMMENT ON COLUMN group_join_links.max_uses IS 'Maximum number of uses allowed, NULL for unlimited';
COMMENT ON COLUMN group_join_links.uses_count IS 'Current number of times this link has been used';

-- Join link redemptions (tracks who used which link)
CREATE TABLE group_join_link_redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  join_link_id UUID NOT NULL REFERENCES group_join_links(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  redeemed_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Prevent same user from redeeming same link twice
  UNIQUE(join_link_id, user_id)
);

CREATE INDEX idx_group_join_link_redemptions_join_link_id ON group_join_link_redemptions(join_link_id);
CREATE INDEX idx_group_join_link_redemptions_user_id ON group_join_link_redemptions(user_id);

COMMENT ON TABLE group_join_link_redemptions IS 'Tracks which users have redeemed which join links';

-- ============================================================================
-- TRIGGER: Auto-increment uses_count on redemption
-- ============================================================================

-- Function to increment uses_count when a redemption is inserted
-- Also deactivates the link if max_uses is reached
CREATE OR REPLACE FUNCTION increment_join_link_uses_on_redemption()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE group_join_links
  SET
    uses_count = uses_count + 1,
    is_active = CASE
      WHEN max_uses IS NOT NULL AND uses_count + 1 >= max_uses THEN false
      ELSE is_active
    END
  WHERE id = NEW.join_link_id;

  RETURN NEW;
END;
$$;

-- Trigger that fires after insert on redemptions
CREATE TRIGGER trg_increment_join_link_uses
  AFTER INSERT ON group_join_link_redemptions
  FOR EACH ROW
  EXECUTE FUNCTION increment_join_link_uses_on_redemption();

COMMENT ON FUNCTION increment_join_link_uses_on_redemption() IS 'Automatically increments uses_count when a user redeems a join link';

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE group_join_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_join_link_redemptions ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- group_join_links policies
-- ----------------------------------------------------------------------------

-- SELECT: Anyone can read active, valid links (for public validation)
CREATE POLICY "Anyone can read active valid join links"
  ON group_join_links
  FOR SELECT
  USING (
    is_active = true
    AND (expires_at IS NULL OR expires_at > now())
    AND (max_uses IS NULL OR uses_count < max_uses)
  );

-- INSERT: Only super_admin or org admin for the organisation
CREATE POLICY "Admins can insert join links"
  ON group_join_links
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'super_admin'
    )
    OR EXISTS (
      SELECT 1 FROM organisation_admins
      WHERE user_id = auth.uid()
        AND organisation_id = group_join_links.organisation_id
    )
  );

-- UPDATE: Only super_admin or org admin for the organisation
CREATE POLICY "Admins can update join links"
  ON group_join_links
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'super_admin'
    )
    OR EXISTS (
      SELECT 1 FROM organisation_admins
      WHERE user_id = auth.uid()
        AND organisation_id = group_join_links.organisation_id
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'super_admin'
    )
    OR EXISTS (
      SELECT 1 FROM organisation_admins
      WHERE user_id = auth.uid()
        AND organisation_id = group_join_links.organisation_id
    )
  );

-- DELETE: Only super_admin or org admin for the organisation
CREATE POLICY "Admins can delete join links"
  ON group_join_links
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'super_admin'
    )
    OR EXISTS (
      SELECT 1 FROM organisation_admins
      WHERE user_id = auth.uid()
        AND organisation_id = group_join_links.organisation_id
    )
  );

-- SELECT for admins: Allow admins to see all links for their orgs (including inactive)
CREATE POLICY "Admins can read all join links for their orgs"
  ON group_join_links
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'super_admin'
    )
    OR EXISTS (
      SELECT 1 FROM organisation_admins
      WHERE user_id = auth.uid()
        AND organisation_id = group_join_links.organisation_id
    )
  );

-- ----------------------------------------------------------------------------
-- group_join_link_redemptions policies
-- ----------------------------------------------------------------------------

-- INSERT: Users can only insert their own redemptions
CREATE POLICY "Users can insert own redemptions"
  ON group_join_link_redemptions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- SELECT: Users can only read their own redemptions
CREATE POLICY "Users can read own redemptions"
  ON group_join_link_redemptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- SELECT: Admins can read redemptions for their org's join links
CREATE POLICY "Admins can read redemptions for their orgs"
  ON group_join_link_redemptions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'super_admin'
    )
    OR EXISTS (
      SELECT 1 FROM group_join_links gjl
      JOIN organisation_admins oa ON oa.organisation_id = gjl.organisation_id
      WHERE gjl.id = group_join_link_redemptions.join_link_id
        AND oa.user_id = auth.uid()
    )
  );
