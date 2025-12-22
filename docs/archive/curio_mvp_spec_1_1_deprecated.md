> ⚠️ **DEPRECATED** — This document is outdated and retained for historical reference only.
>
> This is Spec 1.1. The current specification is **Spec 1.3**, which uses updated terminology:
> - "communities" → "organisations"
> - "programmes" → "groups"
> - "community_admin" → "organisation_admin"
> - "participant" → "user"
>
> See `docs/spec/source-of-truth.md` for the current Spec 1.3 terminology and `docs/spec/` for the latest specification documents.

---

# Curio for Communities — MVP Specification

> **Version:** 1.1
> **Status:** Draft
> **Last Updated:** 2025-12-09

---

## Table of Contents

1. [Overview](#overview)
2. [User Roles & Permissions](#user-roles--permissions)
3. [Onboarding & Profiles](#onboarding--profiles)
4. [Programmes & Rounds](#programmes--rounds)
5. [Matching Rules](#matching-rules)
6. [Intro Generation](#intro-generation)
7. [Dashboards](#dashboards)
8. [Analytics & Reporting](#analytics--reporting)
9. [Out of Scope / Future Features](#out-of-scope--future-features)

---

## Overview

### What is Curio?

Curio is a **smart introductions platform** that powers better professional introductions for communities. It connects people who should meet by intelligently matching participants based on their profiles, goals, and context.

### MVP Goals

The MVP focuses on enabling **Community Admins** to run structured introduction programmes for their members, with:

- Simple participant onboarding and profile management
- Configurable programme settings (cadence, matching rules)
- Intelligent matching based on professional goals and personal interests
- Generated intro messages ready to copy into email
- Basic dashboards for participants and admins
- Essential metrics to track programme health

### Key Assumptions (MVP)

- **Email-only delivery:** Intro messages are generated and displayed in the admin interface; admins manually copy and send via email.
- **Manual trigger:** Admins manually trigger matching rounds (no automated scheduling).
- **Pairs by default:** Matches are pairs, with trios only when there's an odd number of participants.
- **Single community focus:** While the data model supports multiple communities, the MVP UI is optimised for managing one community at a time.

---

## User Roles & Permissions

### Role Hierarchy

```
Super Admin
    └── Community Admin
            └── Participant
```

### Super Admin

**Purpose:** Platform-wide administration, oversight, and final approval of introduction rounds.

| Permission | Description |
|------------|-------------|
| Manage organisations/communities | Create, edit, archive communities |
| Manage Community Admins | Invite, remove, reassign admins to communities |
| View all programmes | Full visibility across all community programmes |
| Access global settings | Configure platform-wide defaults (e.g., default tags, matching parameters) |
| View platform analytics | Cross-community metrics and health dashboards |
| **Approve rounds** | Review and approve matched rounds prepared by Community Admins |
| **Mark rounds as Sent** | Only Super Admin can finalise a round and mark intros as "Sent" |

**MVP Scope:** Basic CRUD for communities and admin assignment. Global settings and cross-community analytics are minimal.

**Future Enhancement:** Ability to upload LinkedIn PDFs on behalf of participants (for bulk onboarding or profile enrichment).

### Community Admin

**Purpose:** Configure programmes, manage participants, and prepare rounds for Super Admin approval.

| Permission | Description |
|------------|-------------|
| Configure programmes | Create, edit, archive programmes within their community |
| Manage participants | Invite participants, view profiles, remove members |
| Trigger matching rounds | Initiate a new matching round for a programme |
| View/copy intro messages | Access generated intro content for review |
| Edit intro messages | Make adjustments to generated intros before approval |
| Submit round for approval | Send a matched round to Super Admin for final review |
| View programme analytics | See metrics for their programmes |
| Manage exclusion lists | Add/remove participant pairs from the "never match" list |

**Important (MVP):** Community Admins **cannot** mark a round as "Sent" or finalise introductions. All rounds must be approved by a Super Admin before intros are dispatched.

**Note:** A Community Admin can manage multiple communities if assigned by a Super Admin.

### Participant

**Purpose:** Community member who receives introductions.

| Permission | Description |
|------------|-------------|
| Complete onboarding | Fill out profile information |
| Update profile | Edit their own profile at any time |
| Manage preferences | Opt in/out of programmes, set cadence, sit out rounds |
| View intro history | See past introductions they've received |
| Block participants | Request not to be matched with specific people |

---

*[Remainder of document truncated for brevity — see original file for full content]*
