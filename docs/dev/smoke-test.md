# Smoke Test Checklist

Quick manual verification of core flows after changes.

## Pre-requisites

- Local dev server running (`pnpm dev`)
- Access to test accounts (org admin, super admin)

---

## 1. Home Page (`/`)

- [ ] When signed out, "Admin: Organisations" button should NOT appear
- [ ] When signed in as super admin, "Admin: Organisations" button appears and works

## 2. Authentication

- [ ] Log in as organisation admin
- [ ] Log in as super admin
- [ ] Sign out works

## 3. Organisation Admin Flow (`/org`)

- [ ] Access `/org` as org admin
- [ ] See assigned organisation(s) and groups
- [ ] Generate invite link for a group
- [ ] Copy invite link displays correctly
- [ ] CSV upload form visible

## 4. Invite Acceptance Flow (`/invite/[token]`)

- [ ] Open invite link in incognito/private browser
- [ ] See "Join Curio" form
- [ ] Fill in first name, last name, email, password
- [ ] Submit creates account
- [ ] Redirect to `/dashboard` after signup
- [ ] Invite status changes to "joined" in `/org`

## 5. Dashboard (`/dashboard`)

- [ ] Access `/dashboard` after login
- [ ] See role badge (super_admin, organisation_admin, user)
- [ ] Admin tools section visible for admins
- [ ] Sign out button works

## 6. CSV Upload (if testing bulk invites)

- [ ] Prepare CSV: `email,name` format
- [ ] Upload 2-row CSV
- [ ] See "X created, Y skipped" result
- [ ] New invites appear in invite list

## 7. Groups Page (`/groups`)

- [ ] From dashboard, click "My Groups" card to navigate to `/groups`
- [ ] See list of groups user belongs to (or empty state if none)
- [ ] Each group shows name, organisation, description, active badge
- [ ] Click "Leave" on a group, confirm, and group disappears from list
- [ ] Refresh page and confirm left group is still gone

## 8. Join Links (`/org` and `/join/[token]`)

### Admin Side (`/org`)
- [ ] Access `/org` as org admin
- [ ] See "Join Link" section for each group
- [ ] Click "Generate Join Link" for a group without one
- [ ] Join link appears with token path and "Multi-use" badge
- [ ] Shows uses count (starts at 0)
- [ ] Click "Copy" and verify link is copied to clipboard
- [ ] Click "Regenerate Link" to create new link (old one deactivated)

### User Side (`/join/[token]`)
- [ ] Open join link in incognito/private browser
- [ ] See signup form similar to invite page
- [ ] Fill in first name, last name, email, password
- [ ] Submit creates account and joins group
- [ ] Redirect to `/dashboard` after signup
- [ ] Uses count increments in `/org` view

### Logged-in User
- [ ] Log in as existing user who is NOT in the group
- [ ] Open join link
- [ ] See "Join Group" button (not signup form)
- [ ] Click to join, redirect to `/groups`
- [ ] Verify group appears in list

### Edge Cases
- [ ] Invalid token shows "Invalid Join Link" error
- [ ] Already a member shows "Already a Member" with link to groups
- [ ] Expired/deactivated link shows "Link Expired" message

---

## Notes

- Invalid invite tokens should show error state
- Already-used invites should show "already used" message with login link
