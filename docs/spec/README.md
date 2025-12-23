# Curio Specifications

This directory contains the canonical specifications for the Curio platform.

---

## Source of Truth

### Milestones

**`docs/spec/milestones.docx`** and **`docs/spec/milestones.md`** are the **only** sources of truth for milestones and user stories.

- If any other milestones or spec copies exist elsewhere in the repository, they are **outdated** and **must not be used**.
- Always reference these files when planning or implementing features.

### Terminology

The correct terminology for Curio is:

| Term | Description |
|------|-------------|
| **organisation** | Top-level container entity (not "community") |
| **group** | Introduction series within an organisation (not "programme") |
| **user** | End-user / member receiving introductions (not "participant") |
| **organisation_admin** | Admin role for an organisation (not "community_admin") |
| **super_admin** | Platform-wide administration |

See `docs/spec/source-of-truth.md` for the complete terminology mapping and schema details.

---

### Progress Tracking

| File | Purpose |
|------|---------|
| `milestones.md` | Current status and planned work (source of truth) |
| `progress-log.md` | Append-only narrative history of what shipped |

**Rule:** Keep `milestones.md` updated as the plan evolves. Optionally add a `progress-log.md` entry whenever a meaningful slice ships.

---

## Files in This Directory

| File | Purpose |
|------|---------|
| `milestones.docx` | Milestones & user stories (Word format) |
| `milestones.md` | Milestones & user stories (Markdown format) |
| `progress-log.md` | Append-only history of milestone progress |
| `source-of-truth.md` | Terminology mapping & schema reference |

---

## Important

Do not create alternative milestone documents. If updates are needed, edit the files in this directory directly.
