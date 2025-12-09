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

## Onboarding & Profiles

### Onboarding Flow

1. **Invitation:** Participant receives email invite from Community Admin with a signup link.
2. **Account creation:** Create account with email + password (MVP). Magic links and OAuth are future enhancements.
3. **Profile completion:** Multi-step form collecting required and optional information.
4. **Consent:** Explicit consent checkbox for using public LinkedIn data as input to matching and intro generation.
5. **Programme enrolment:** Confirm participation in the programme(s) they were invited to.
6. **Confirmation:** Welcome screen with next steps.

**MVP Authentication:** Email + password only. Magic links and OAuth (Google, LinkedIn) are planned for future iterations.

### Profile Fields

#### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `full_name` | string | Display name |
| `email` | string | Primary contact email (from auth) |
| `role_title` | string | Current job title / role |
| `organisation` | string | Current company or organisation name |
| `linkedin_url` | string | LinkedIn profile URL (required for matching and intro generation) |
| `location` | string | City, Country format |
| `timezone` | string | IANA timezone (e.g., `Europe/London`) |

#### Consent

| Field | Type | Description |
|-------|------|-------------|
| `linkedin_data_consent` | boolean | Explicit consent for using public LinkedIn data as input to matching and intro generation |
| `consent_given_at` | timestamp | When consent was granted |

**Note:** Participants must grant `linkedin_data_consent` to proceed with onboarding. This consent covers using publicly available LinkedIn information (name, headline, summary, experience) to improve match quality and generate more personalised intro messages.

#### Professional Context

| Field | Type | Description |
|-------|------|-------------|
| `professional_tags` | string[] | 3–5 tags from predefined list (e.g., "Product", "Sales", "Engineering", "Marketing", "Finance", "Operations", "Design", "Founder", "Investor") |
| `intro_goals` | string[] | 1–3 goals from predefined list |

**Intro Goals Options (MVP):**
- Peer support / learning from others in similar roles
- Finding customers or partners
- Hiring or being hired
- Mentorship (giving or receiving)
- General networking / expanding my network
- Exploring new industries or sectors

#### Personal Interests

| Field | Type | Description |
|-------|------|-------------|
| `personal_interests` | object[] | 2–4 interests, each with a weight from 1–3 |

Each interest entry contains:
- `interest`: string (from predefined list)
- `weight`: integer (1–3)

**Weight Interpretation:**
- **1** = Casual interest ("I enjoy this sometimes")
- **2** = Moderate interest ("I'm fairly into this")
- **3** = Strong passion ("This is a big part of my life")

**UX Note:** Weights can be set by tapping/clicking an interest tile multiple times (1 tap = weight 1, 2 taps = weight 2, 3 taps = weight 3), or via a simple slider/selector.

**Personal Interest Options (MVP):**
- Travel
- Sports & fitness
- Food & cooking
- Music
- Reading / books
- Gaming
- Outdoors / nature
- Arts & culture
- Parenting
- Volunteering / social impact
- Tech & gadgets
- Pets

#### Preferences

| Field | Type | Description |
|-------|------|-------------|
| `preferred_cadence` | enum | `weekly`, `fortnightly`, `monthly`, `quarterly` |
| `opt_in_status` | boolean | Whether currently opted in to receive intros |
| `sitting_out_until` | date (nullable) | If set, skip matching until this date |
| `blocked_participants` | uuid[] | List of participant IDs to never match with |

### Profile Visibility

- **To other participants:** Name, role, organisation, and one-line summary (generated from tags) are visible in intro messages.
- **To Community Admins:** Full profile visible for programme management.
- **To Super Admins:** Full profile visible (read-only).

---

## Programmes & Rounds

### Programme Configuration

A **programme** is a recurring introduction series within a community (e.g., "Monthly Founder Intros", "Q1 New Joiner Connections").

| Setting | Type | Description |
|---------|------|-------------|
| `name` | string | Programme display name |
| `description` | string | Short description shown to participants |
| `community_id` | uuid | Parent community |
| `programme_type` | enum | `community_connection`, `cohort_blitz`, `event` (see below) |
| `audience_description` | string | Who this programme is for (displayed to invitees) |
| `cadence` | enum | See cadence options below |
| `match_size` | enum | `pairs` (default), `pairs_with_trios` |
| `intro_window_days` | integer | Suggested days for participants to connect (default: 14) |
| `channel` | enum | `email_manual` (MVP); future: `email_auto`, `slack`, `teams` |
| `is_active` | boolean | Whether programme is accepting new rounds |

### Programme Types

| Type | Description | Typical Cadence |
|------|-------------|-----------------|
| `community_connection` | Ongoing introductions for an established community. Members join and receive regular matches over time. | Monthly, quarterly |
| `cohort_blitz` | Intensive intro programme for a fixed cohort (e.g., accelerator batch, new hire cohort). Multiple rounds in quick succession. | Daily, every 2–3 days, weekly |
| `event` | One-off or time-boxed programme tied to a specific event (e.g., conference, retreat). Often a single round. | One-time, or 2–3 rounds during event |

**MVP Note:** The data model supports all three programme types. The MVP UI is optimised for `community_connection`, but `cohort_blitz` and `event` can be configured by adjusting cadence and round settings. More specialised UI for intensive programmes is a future enhancement.

### Cadence Options

| Cadence | Description | Best For |
|---------|-------------|----------|
| `daily` | Every day | Cohort blitz (intensive) |
| `every_2_days` | Every 2 days | Cohort blitz |
| `every_3_days` | Every 3 days | Cohort blitz |
| `weekly` | Once per week | Cohort blitz, active communities |
| `fortnightly` | Every 2 weeks | Community connection |
| `monthly` | Once per month | Community connection (default) |
| `quarterly` | Once per quarter | Low-touch communities |
| `one_time` | Single round only | Events |

**Note:** Cadence is a guideline for expected round frequency. Admins manually trigger rounds in the MVP; cadence is used for scheduling reminders and setting participant expectations.

### Programme Rules

| Rule | Type | Description |
|------|------|-------------|
| `avoid_same_org` | boolean | Prevent matching participants from the same organisation (default: true) |
| `avoid_repeat_matches` | boolean | Don't repeat a match within N rounds (default: true) |
| `repeat_match_cooldown` | integer | Number of rounds before a pair can be matched again (default: 6) |
| `exclusion_pairs` | uuid[][] | Admin-managed list of participant pairs to never match |

### Rounds

A **round** is a single execution of matching within a programme.

| Field | Type | Description |
|-------|------|-------------|
| `round_number` | integer | Sequential round number within programme |
| `status` | enum | `draft`, `matched`, `pending_approval`, `sent`, `completed` |
| `triggered_at` | timestamp | When admin initiated matching |
| `matched_at` | timestamp | When matching algorithm completed |
| `submitted_for_approval_at` | timestamp (nullable) | When Community Admin submitted for approval |
| `approved_by` | uuid (nullable) | Super Admin who approved the round |
| `participant_count` | integer | Number of participants included |
| `match_count` | integer | Number of matches (pairs + trios) generated |

### Round Lifecycle

```
[Draft] → Community Admin triggers matching → [Matched] → Community Admin reviews/edits → [Pending Approval] → Super Admin approves → [Sent] → Window closes → [Completed]
```

1. **Draft:** Round is created; participants can still update opt-in status.
2. **Matched:** Matching algorithm has run; matches and intro messages are generated. Community Admin reviews and edits as needed.
3. **Pending Approval:** Community Admin has submitted the round for Super Admin review.
4. **Sent:** Super Admin has approved and marked the round as sent; intros are dispatched.
5. **Completed:** Intro window has closed; round is archived.

**MVP Note:** Only Super Admins can transition a round from "Pending Approval" to "Sent". Community Admins prepare rounds but cannot finalise them independently.

---

## Matching Rules

### Matching Algorithm Overview

The matching algorithm creates optimal pairs (or trios when odd) based on a **weighted compatibility score**.

### Scoring Formula

```
compatibility_score = (professional_score × 0.70) + (personal_score × 0.30)
```

#### Professional Score (70% weight)

Calculated from overlap between participants on:

| Factor | Weight within Professional | Description |
|--------|---------------------------|-------------|
| `professional_tags` | 50% | Jaccard similarity of tag sets |
| `intro_goals` | 50% | Jaccard similarity of goal sets |

**Jaccard Similarity:** `|A ∩ B| / |A ∪ B|` — measures overlap between two sets.

#### Personal Score (30% weight)

| Factor | Weight within Personal | Description |
|--------|------------------------|-------------|
| `personal_interests` | 100% | Weighted overlap of interests (see below) |

**Weighted Interest Matching (MVP):**

For personal interests, we use a simple weighted overlap approach:

1. For each shared interest between two participants:
   - Multiply the two weights together: `weight_A × weight_B`
   - This gives a score from 1 (both casual) to 9 (both passionate)
2. Sum the scores for all shared interests.
3. Normalise by the maximum possible score (if all interests matched at max weight).

**Formula:**
```
personal_score = Σ(weight_A × weight_B for shared interests) / max_possible_score
```

**Example:**
- Alice: Travel (3), Music (2), Pets (1)
- Bob: Travel (2), Gaming (3), Pets (2)
- Shared interests: Travel, Pets
- Score: (3×2) + (1×2) = 6 + 2 = 8
- Max possible (if all Alice's interests matched at weight 3): 3×3 + 3×3 + 3×3 = 27
- Personal score: 8/27 ≈ 0.30

**Future Enhancement:** Rarity weighting — boost scores for matches on less common interests (e.g., if only 5% of participants select "Volunteering", a match on that interest is worth more than a match on "Travel" which 60% select).

### Matching Constraints (Hard Rules)

These constraints **must** be satisfied; violating pairs are excluded from consideration:

1. **No self-matching:** A participant cannot be matched with themselves.
2. **Opt-in required:** Both participants must have `opt_in_status = true`.
3. **Not sitting out:** Neither participant can have `sitting_out_until` in the future.
4. **Not blocked:** Neither participant has blocked the other.
5. **Not in exclusion list:** The pair is not in the programme's `exclusion_pairs`.
6. **Same-org avoidance (if enabled):** Participants from the same `organisation` are not matched.
7. **Repeat match cooldown:** If `avoid_repeat_matches` is enabled, pairs matched within the last N rounds are excluded.

### Matching Process

1. **Gather eligible participants:** Filter by opt-in, sitting out, programme membership.
2. **Generate all valid pairs:** Apply hard constraints.
3. **Score all valid pairs:** Calculate compatibility scores.
4. **Optimal matching:**
   - Sort pairs by score (descending).
   - Use greedy matching: select highest-scoring pair, remove those participants from pool, repeat.
   - If odd number of participants remains, merge the last selected pair with the remaining participant to form a trio.
5. **Store matches:** Save match records with scores and participants.

### Trio Handling

When there's an odd number of eligible participants:

1. Run normal pair matching until 3 participants remain.
2. Form a trio from these 3 participants.
3. Trio compatibility score = average of the three pairwise scores.

**Note:** Only one trio is created per round (when participant count is odd).

### Match Record Schema

| Field | Type | Description |
|-------|------|-------------|
| `match_id` | uuid | Unique identifier |
| `round_id` | uuid | Parent round |
| `participant_ids` | uuid[] | 2 or 3 participant IDs |
| `match_type` | enum | `pair`, `trio` |
| `compatibility_score` | float | Calculated score (0–1) |
| `intro_message` | text | Generated intro content |
| `created_at` | timestamp | When match was created |

---

## Intro Generation

### Intro Message Structure

Each match (pair or trio) generates an intro message with these components:

```
┌─────────────────────────────────────────────────┐
│  SUBJECT LINE                                   │
├─────────────────────────────────────────────────┤
│  GREETING                                       │
│                                                 │
│  PARTICIPANT SNAPSHOTS                          │
│  • Person 1: Name, Role @ Org — one-line bio   │
│  • Person 2: Name, Role @ Org — one-line bio   │
│  (• Person 3 if trio)                          │
│                                                 │
│  WHY YOU'RE CONNECTED                          │
│  Brief explanation of shared context            │
│                                                 │
│  SUGGESTED TALKING POINTS                      │
│  1. Professional topic                         │
│  2. Professional topic                         │
│  3. Personal/interest topic                    │
│  4. Personal/interest topic (optional)         │
│                                                 │
│  CALL TO ACTION                                │
│  Clear next step with timeframe                │
│                                                 │
│  SIGN-OFF                                      │
└─────────────────────────────────────────────────┘
```

### Content Generation Rules

#### Subject Line

Format: `[Community Name] Intro: {Name 1} ↔ {Name 2}` (or `↔ {Name 3}` for trios)

Example: `[Founder Network] Intro: Sarah Chen ↔ Marcus Johnson`

#### Participant Snapshots

For each participant, generate:

```
{Full Name} — {Role Title} at {Organisation}
{One-line summary based on top professional tags and intro goals}
```

Example:
```
Sarah Chen — VP Product at Acme Corp
Product leader focused on B2B SaaS, looking for peer connections and mentorship opportunities.
```

**One-line summary logic:**
- Include top 2 professional tags
- Include primary intro goal
- Keep under 100 characters

#### Why You're Connected

Generate 1–2 sentences explaining the match rationale based on:
- Overlapping professional tags
- Shared intro goals
- Common personal interests

Example:
> "You're both product leaders in B2B tech who are keen to connect with peers. You also share an interest in travel and outdoor adventures."

#### Suggested Talking Points

Generate 2–4 talking points:
- **2 professional topics** derived from overlapping tags/goals
- **1–2 personal topics** derived from overlapping interests

Format as questions or conversation starters:

Example:
```
1. How are you thinking about product-led growth in your current role?
2. What's been your biggest hiring challenge this year?
3. Any travel adventures planned for the next few months?
4. Favourite hiking spots you'd recommend?
```

**Talking point generation rules:**
- Use templates seeded by matching tags/interests
- Avoid overly generic questions ("How's work going?")
- Mix open-ended and specific questions

#### Call to Action

Standard CTA with configurable intro window:

> "We suggest finding 30 minutes to connect in the next {intro_window_days} days. Reply-all with 2–3 times that work for you, and we'll help you find a slot!"

For trios, adjust:

> "We suggest finding 30–45 minutes for a group call in the next {intro_window_days} days. Reply-all with your availability and coordinate a time that works for all three of you!"

### Intro Message Storage

| Field | Type | Description |
|-------|------|-------------|
| `match_id` | uuid | Parent match |
| `subject_line` | string | Email subject |
| `body_html` | text | HTML formatted body |
| `body_plain` | text | Plain text body |
| `generated_at` | timestamp | When content was generated |
| `is_edited` | boolean | Whether admin has modified |
| `edited_body` | text (nullable) | Admin-edited version |

### Admin Workflow (MVP)

**Community Admin:**
1. Community Admin triggers matching round.
2. System generates matches and intro messages.
3. Community Admin reviews matches in dashboard.
4. Community Admin can edit intro messages if needed.
5. Community Admin submits round for Super Admin approval.

**Super Admin:**
6. Super Admin reviews the pending round.
7. Super Admin can request changes or approve.
8. Upon approval, Super Admin copies intro content (plain text or HTML).
9. Super Admin pastes into email client and sends manually.
10. Super Admin marks round as "Sent" in dashboard.

**Note:** Only Super Admins can finalise and mark rounds as "Sent".

---

## Dashboards

### Participant Dashboard

**Purpose:** Allow participants to manage their profile and view intro history.

#### Navigation

```
├── My Profile
├── My Programmes
└── Intro History
```

#### My Profile View

- Display all profile fields with edit capability
- Show current opt-in status prominently
- Quick actions: "Sit out next round", "Update preferences"

#### My Programmes View

| Column | Description |
|--------|-------------|
| Programme name | Name and short description |
| Status | Active, Paused (sitting out), Opted out |
| Next round | Expected date based on cadence |
| Actions | Opt in/out, Sit out next round |

#### Intro History View

| Column | Description |
|--------|-------------|
| Date | When intro was sent |
| Programme | Which programme |
| Connected with | Names and organisations of match |
| Match type | Pair or Trio |
| Details | Expand to see original intro message |

**Pagination:** Show 10 most recent by default; load more on scroll.

### Connections (MVP)

Every introduction automatically creates a **connection record** in the participant's history. This provides a simple, persistent record of who each participant has been introduced to.

#### Connection Record

| Field | Description |
|-------|-------------|
| `connection_id` | Unique identifier |
| `participant_ids` | The 2 (or 3) people in this connection |
| `created_from_match_id` | Link to the original match/intro |
| `programme_id` | Which programme created this connection |
| `connected_at` | When the intro was sent |

#### MVP Scope

- **Automatic creation:** When a round is marked as "Sent", connection records are created for each match.
- **Simple list view:** Participants see a chronological list of their connections in their Intro History.
- **Basic details:** Each connection shows who they were connected with, when, and through which programme.
- **Link to intro:** Participants can view the original intro message that initiated the connection.

#### Future Enhancements (Not MVP)

| Feature | Description |
|---------|-------------|
| Richer connection list | Filterable, searchable list with status (e.g., "Met", "In touch", "Lost contact") |
| Directory view | Browse all community members with connection status indicators |
| In-depth profile pages | Rich profiles showing connection history, mutual connections, and shared context |
| Connection strength tracking | Track ongoing relationship depth and activity |
| Connection notes | Personal notes participants can add about their connections |
| Introduction requests | Request intros to specific people through mutual connections |

### Admin Dashboard

**Purpose:** Allow Community Admins to manage programmes, participants, and rounds.

#### Navigation

```
├── Overview (default)
├── Programmes
│   ├── [Programme 1]
│   │   ├── Settings
│   │   ├── Participants
│   │   ├── Rounds
│   │   └── Exclusions
│   └── [Programme 2]
│       └── ...
├── All Participants
└── Settings
```

#### Overview View

Summary cards:
- Total active participants across programmes
- Programmes with upcoming rounds
- Recent activity feed (new signups, opt-outs, completed rounds)
- Health alerts (e.g., "Programme X has only 3 active participants")

#### Programme Detail View

**Settings Tab:**
- All programme configuration fields
- Save / Archive actions

**Participants Tab:**

| Column | Description |
|--------|-------------|
| Name | Full name (link to profile) |
| Organisation | Current organisation |
| Status | Active, Sitting out, Opted out |
| Joined | Date joined programme |
| Matches | Number of matches in this programme |
| Actions | Remove, Add to exclusion |

- Bulk actions: Invite new participants, Export CSV
- Filters: By status, organisation, join date

**Rounds Tab:**

| Column | Description |
|--------|-------------|
| Round # | Sequential number |
| Status | Draft, Matched, Pending Approval, Sent, Completed |
| Date | When triggered |
| Participants | Count |
| Matches | Count (pairs + trios) |
| Actions | View matches, Edit intros, Submit for Approval |

- "Start New Round" button (triggers matching)
- **Note:** Community Admins see "Submit for Approval" action. Only Super Admins see "Approve & Mark Sent".

**Round Detail View (expanded):**

List all matches for the round:

| Column | Description |
|--------|-------------|
| Match | Participant names |
| Type | Pair / Trio |
| Score | Compatibility score |
| Actions | View intro, Copy intro, Edit intro |

- Bulk action: "Copy all intros" (concatenated for easy pasting)

**Exclusions Tab:**

| Column | Description |
|--------|-------------|
| Participant 1 | Name |
| Participant 2 | Name |
| Reason | Optional note |
| Added by | Admin name |
| Date added | Timestamp |
| Actions | Remove exclusion |

- "Add exclusion" button with participant picker

#### All Participants View

Cross-programme participant management:

| Column | Description |
|--------|-------------|
| Name | Full name (link to profile) |
| Email | Contact email |
| Programmes | List of enrolled programmes |
| Status | Overall status |
| Joined | Account creation date |
| Last active | Last login/update |

- Search and filter functionality
- Invite new participant (select programmes)

---

## Analytics & Reporting

### MVP Metrics

Focus on essential health and engagement metrics.

#### Programme-Level Metrics

| Metric | Description | Calculation |
|--------|-------------|-------------|
| Active participants | Currently opted-in | Count where `opt_in_status = true` |
| Participation rate | % active vs total enrolled | `active / enrolled × 100` |
| Opt-out rate | % who have opted out | `opted_out / enrolled × 100` |
| Sitting-out rate | % currently sitting out | `sitting_out / enrolled × 100` |
| Matches this round | Pairs + trios in latest round | Count of matches |
| Total matches | All-time matches | Sum across all rounds |
| Avg compatibility score | Quality of matches | Mean of `compatibility_score` |

#### Round-Level Metrics

| Metric | Description |
|--------|-------------|
| Participants matched | Count of participants in this round |
| Match coverage | % of active participants matched |
| Pairs created | Number of pair matches |
| Trios created | Number of trio matches (0 or 1) |
| Avg compatibility score | Mean score for this round |

#### Trend Indicators (MVP)

Simple up/down arrows comparing current vs previous round:
- Participation rate trend
- Opt-out rate trend
- Average compatibility score trend

### Dashboard Placement

- **Programme Overview:** Show key metrics in summary cards
- **Round Detail:** Show round-specific metrics
- **Admin Overview:** Aggregate metrics across all programmes

### Data Export (MVP)

- **Participants CSV:** Name, email, organisation, programme, status, join date
- **Matches CSV:** Round, participants, type, score, date
- **Metrics CSV:** Round-by-round metrics for a programme

---

## Out of Scope / Future Features

The following are explicitly **not included in the MVP** but may be considered for future iterations.

### Delivery & Channels

| Feature | Notes |
|---------|-------|
| Automated email sending | Integrate with SendGrid/Postmark for direct delivery |
| Slack integration | Post intros directly to Slack DMs or channels |
| Microsoft Teams integration | Post intros to Teams |
| Calendar integration | Auto-suggest meeting times based on calendar availability |
| In-app messaging | Native messaging between matched participants |

### Advanced Matching

| Feature | Notes |
|---------|-------|
| ML-based matching | Train models on past match success data |
| Weighted tag importance | Let participants rank their tags by priority |
| Cross-programme matching | Match across multiple programmes |
| Seniority/experience balancing | Ensure junior-senior pairings when appropriate |
| Geographic proximity weighting | Boost scores for same-city matches |
| Industry diversity rules | Ensure cross-industry exposure |

### Feedback & Success Tracking

| Feature | Notes |
|---------|-------|
| Post-intro feedback surveys | "Did you meet? How was it?" |
| Match success scoring | Track which matches led to ongoing connections |
| NPS tracking | Net Promoter Score for programme satisfaction |
| AI-generated feedback summaries | Summarise qualitative feedback themes |
| Connection strength tracking | Track ongoing relationship depth |

### Advanced Analytics

| Feature | Notes |
|---------|-------|
| Network graph visualisation | See who has connected with whom |
| Engagement heatmaps | Identify most/least engaged segments |
| Cohort analysis | Compare participant cohorts over time |
| Predictive churn modelling | Identify at-risk participants |
| ROI calculators | Quantify value of connections made |
| Custom report builder | Admin-defined report templates |

### Profile & Onboarding

| Feature | Notes |
|---------|-------|
| LinkedIn profile import | Auto-populate from LinkedIn data |
| Rich media profiles | Photos, videos, portfolio links |
| AI-generated profile summaries | Generate bio from provided info |
| Progressive profiling | Collect more data over time |
| Skills endorsements | Peer validation of skills |
| Verification badges | Verify identity, employer, credentials |

### Programme Management

| Feature | Notes |
|---------|-------|
| Automated round scheduling | Cron-based round triggering |
| Round preview & simulation | Preview matches before committing |
| A/B testing for match algorithms | Compare algorithm variants |
| Custom matching rules builder | Visual rules editor for admins |
| Segmentation & targeting | Create sub-groups within programmes |
| Waiting lists | Queue for oversubscribed programmes |
| Programme templates | Clone programmes with preset configs |

### Platform & Administration

| Feature | Notes |
|---------|-------|
| White-labelling | Custom branding per community |
| SSO integration | SAML/OIDC for enterprise |
| Role-based access control (granular) | Custom permission sets |
| Audit logging | Track all admin actions |
| API access | RESTful API for integrations |
| Webhooks | Event-driven integrations |
| Multi-language support | i18n for global communities |
| Mobile app | Native iOS/Android apps |

### Billing & Monetisation

| Feature | Notes |
|---------|-------|
| Subscription management | Tiered pricing plans |
| Usage-based billing | Charge per participant or match |
| Payment processing | Stripe integration |
| Invoicing | Automated invoice generation |

---

## Appendix

### A. Database Schema (Simplified)

```
communities
├── id (uuid, PK)
├── name (string)
├── slug (string, unique)
├── created_at (timestamp)
└── is_active (boolean)

users
├── id (uuid, PK)
├── email (string, unique)
├── full_name (string)
├── role (enum: super_admin, community_admin, participant)
├── created_at (timestamp)
└── last_login_at (timestamp)

profiles
├── id (uuid, PK)
├── user_id (uuid, FK → users)
├── role_title (string)
├── organisation (string)
├── linkedin_url (string, required)
├── linkedin_data_consent (boolean)
├── consent_given_at (timestamp)
├── location (string)
├── timezone (string)
├── professional_tags (string[])
├── intro_goals (string[])
├── personal_interests (jsonb[])  // [{interest: string, weight: 1-3}]
├── preferred_cadence (enum)
├── opt_in_status (boolean)
├── sitting_out_until (date, nullable)
└── updated_at (timestamp)

community_admins
├── id (uuid, PK)
├── user_id (uuid, FK → users)
├── community_id (uuid, FK → communities)
└── assigned_at (timestamp)

programmes
├── id (uuid, PK)
├── community_id (uuid, FK → communities)
├── name (string)
├── description (text)
├── programme_type (enum: community_connection, cohort_blitz, event)
├── audience_description (text)
├── cadence (enum: daily, every_2_days, every_3_days, weekly, fortnightly, monthly, quarterly, one_time)
├── match_size (enum)
├── intro_window_days (integer)
├── channel (enum)
├── avoid_same_org (boolean)
├── avoid_repeat_matches (boolean)
├── repeat_match_cooldown (integer)
├── is_active (boolean)
├── created_at (timestamp)
└── updated_at (timestamp)

programme_participants
├── id (uuid, PK)
├── programme_id (uuid, FK → programmes)
├── user_id (uuid, FK → users)
├── status (enum: active, opted_out, removed)
├── joined_at (timestamp)
└── left_at (timestamp, nullable)

rounds
├── id (uuid, PK)
├── programme_id (uuid, FK → programmes)
├── round_number (integer)
├── status (enum: draft, matched, pending_approval, sent, completed)
├── triggered_at (timestamp)
├── matched_at (timestamp, nullable)
├── submitted_for_approval_at (timestamp, nullable)
├── approved_by (uuid, FK → users, nullable)
├── sent_at (timestamp, nullable)
├── completed_at (timestamp, nullable)
├── participant_count (integer)
└── match_count (integer)

matches
├── id (uuid, PK)
├── round_id (uuid, FK → rounds)
├── participant_ids (uuid[])
├── match_type (enum: pair, trio)
├── compatibility_score (float)
├── created_at (timestamp)

intro_messages
├── id (uuid, PK)
├── match_id (uuid, FK → matches)
├── subject_line (string)
├── body_html (text)
├── body_plain (text)
├── is_edited (boolean)
├── edited_body (text, nullable)
├── generated_at (timestamp)
└── edited_at (timestamp, nullable)

exclusions
├── id (uuid, PK)
├── programme_id (uuid, FK → programmes)
├── participant_1_id (uuid, FK → users)
├── participant_2_id (uuid, FK → users)
├── reason (text, nullable)
├── created_by (uuid, FK → users)
└── created_at (timestamp)

blocked_participants
├── id (uuid, PK)
├── blocker_id (uuid, FK → users)
├── blocked_id (uuid, FK → users)
└── created_at (timestamp)

connections
├── id (uuid, PK)
├── participant_ids (uuid[])
├── created_from_match_id (uuid, FK → matches)
├── programme_id (uuid, FK → programmes)
├── connected_at (timestamp)
└── created_at (timestamp)
```

### B. Predefined Tag Lists

#### Professional Tags
```
Product, Engineering, Design, Marketing, Sales, Finance, Operations,
HR / People, Legal, Customer Success, Data / Analytics, Research,
Founder / CEO, Investor, Advisor, Consultant
```

#### Intro Goals
```
Peer support / learning from others in similar roles
Finding customers or partners
Hiring or being hired
Mentorship (giving or receiving)
General networking / expanding my network
Exploring new industries or sectors
```

#### Personal Interests
```
Travel, Sports & fitness, Food & cooking, Music, Reading / books,
Gaming, Outdoors / nature, Arts & culture, Parenting,
Volunteering / social impact, Tech & gadgets, Pets
```

### C. Matching Score Examples

**Example 1: High Compatibility Pair**

| Participant | Professional Tags | Intro Goals | Personal Interests (with weights) |
|-------------|-------------------|-------------|-----------------------------------|
| Alice | Product, Engineering | Peer support, Mentorship | Travel (3), Outdoors (2), Pets (1) |
| Bob | Product, Design | Peer support, Hiring | Travel (2), Music (3), Pets (2) |

**Professional Score:**
- Tag overlap: {Product} → Jaccard = 1/3 = 0.33
- Goal overlap: {Peer support} → Jaccard = 1/3 = 0.33
- Professional score: (0.33 × 0.5) + (0.33 × 0.5) = **0.33**

**Personal Score (Weighted):**
- Shared interests: Travel, Pets
- Travel: 3 × 2 = 6
- Pets: 1 × 2 = 2
- Sum: 6 + 2 = 8
- Max possible (Alice's interests at max weight matched): 3×3 + 3×3 + 3×3 = 27
- Personal score: 8/27 = **0.30**

**Final score:** (0.33 × 0.70) + (0.30 × 0.30) = 0.231 + 0.09 = **0.32**

**Example 2: Strong Interest Match**

| Participant | Professional Tags | Intro Goals | Personal Interests (with weights) |
|-------------|-------------------|-------------|-----------------------------------|
| Eve | Sales, Marketing | Customers | Travel (3), Food (3) |
| Frank | Product, Growth | Networking | Travel (3), Food (2), Music (1) |

**Professional Score:**
- Tag overlap: {} → Jaccard = 0
- Goal overlap: {} → Jaccard = 0
- Professional score: **0.00**

**Personal Score (Weighted):**
- Shared interests: Travel, Food
- Travel: 3 × 3 = 9
- Food: 3 × 2 = 6
- Sum: 9 + 6 = 15
- Max possible: 3×3 + 3×3 = 18
- Personal score: 15/18 = **0.83**

**Final score:** (0.00 × 0.70) + (0.83 × 0.30) = 0 + 0.25 = **0.25**

*Note: Despite zero professional overlap, strong shared passions still produce a moderate score.*

**Example 3: Low Compatibility Pair**

| Participant | Professional Tags | Intro Goals | Personal Interests (with weights) |
|-------------|-------------------|-------------|-----------------------------------|
| Carol | Sales, Marketing | Customers | Gaming (2), Music (1) |
| Dave | Engineering, Data | Hiring | Outdoors (3), Reading (2) |

- Professional tag overlap: {} → Jaccard = 0
- Goal overlap: {} → Jaccard = 0
- Interest overlap: {} → No shared interests
- Personal score: 0

**Final score:** **0.00**

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2024-12-09 | Claude | Initial MVP specification |
| 1.1 | 2025-12-09 | Claude | Super Admin approval workflow; LinkedIn required with consent; weighted personal interests (1-3); programme types (community_connection, cohort_blitz, event); expanded cadence options; Connections subsection |
