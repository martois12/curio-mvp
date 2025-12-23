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

---

## Notes

- Invalid invite tokens should show error state
- Already-used invites should show "already used" message with login link
