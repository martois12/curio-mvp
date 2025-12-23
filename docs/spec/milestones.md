# Curio 1.3 — User Stories & Milestones

> **This is the single source of truth for milestones.**
> Any other milestone/spec copies elsewhere in the repo are outdated and must not be used.

---

## Milestone 1: Skeleton app and access control

**What it is:** Secure sign in plus role based access control for Super Admin, Organisation Admin, and User.

**What it unlocks:** A safe foundation where you can build features without exposing the wrong pages or actions to the wrong role.

- As a Super Admin, I want to sign in securely, so that I can manage the platform.
- As the system, I want role based access control (Super Admin, Organisation Admin, User), so that each role only sees permitted actions.

---

## Milestone 2: Organisations and groups

**What it is:** The admin backbone, create organisations, invite org admins, org admin dashboard, and group creation.

**What it unlocks:** You can set up a real organisation and create groups, meaning the product has a clear container for members and introductions.

- As a Super Admin, I want to create an organisation, so that an org can be managed in Curio.
- As a Super Admin, I want to invite Organisation Admins to an organisation, so that they can manage it.
- As an Organisation Admin, I want to accept an admin invite and set a password, so that I can access the org admin area.
- As an Organisation Admin, I want to see an org dashboard with my groups and key stats, so that I can manage my organisation.
- As an Organisation Admin, I want to create a group with name, type, and description, so that I can help members meet one another.

---

## Milestone 3: Invite and join flow

**What it is:** Onboarding mechanics, CSV invites, shareable invite links, invite status tracking, and user account creation from invites.

**What it unlocks:** You can populate a group with real members at scale and reliably track who has joined.

- As an Organisation Admin, I want to invite users to a group via CSV upload (name, email), so that I can onboard a list quickly.
- As an Organisation Admin, I want to generate a shareable invite link for a group, so that I can invite users without a CSV.
- As The System, I want to track invite status (invited, joined), so that admins can see onboarding progress.
- As a User, I want to accept a group invitation and create an account (email, password, first name, last name), so that I can join the group.

---

## Milestone 3.5: UI foundation and component system

**What it is:** A small, reusable UI kit that is used across all screens, so new features stay consistent without rework. This is not pixel perfect design, it is structure and consistency.

**What it unlocks:** Faster feature development, less styling thrash, and a clean base for later Lovable fidelity work.

- As the system, I want shared UI components (Page layout, headings, cards, buttons, inputs, badges, tables, empty states), so that screens are consistent by default.
- As a user, I want forms and actions to look and behave consistently across the app, so that I do not have to relearn interactions on each page.
- As a developer, I want new pages to be built using existing primitives, so that UI improvements can be made centrally later.
- As a developer, I want the existing pages (/org, /invite/[token], /dashboard) migrated onto the shared components, so that the foundation is proven early.

---

## Milestone 4: Profile creation and completeness gating

**What it is:** User profiles with professional basics, skills, interests, dislikes, optional contact details, intro participation toggle, and a clear definition of profile completeness.

**What it unlocks:** You have enough structured data to generate high quality matches and can exclude incomplete profiles from introductions.

- As a User, I want to add basic professional details (role/title, company, tagline), so that others understand what I do.
- As a User, I want to select skills with a proficiency level (1 tap, 2 taps, 3 taps), so that Curio can match me well.
- As a User, I want to mark skills I want to learn, so that Curio can identify learning opportunities.
- As a User, I want a skills selection progress indicator and a clear "continue" state, so that I am guided to add enough signal.
- As a User, I want to select personal interests with an interest level (1 tap, 2 taps, 3 taps), so that Curio can surface common ground.
- As a User, I want to mark interests I dislike, so that Curio can include "shared dislikes" as conversation fuel.
- As a User, I want to optionally add contact details (LinkedIn, email, phone number), so that contact sharing works.
- As a User, I want an introductions toggle for the group I joined (default on), so that I control whether I am included in intros.
- As the system, I want to treat a profile as "complete" only when required onboarding fields are done, so that matching excludes incomplete profiles.

---

## Milestone 4.5: Including LinkedIn data (pending approval)

**What it is:** LinkedIn consent, upload flow, prompts to encourage upload, secure storage, Super Admin upload on behalf, audit trail, and extracting key LinkedIn details into a usable summary.

**What it unlocks:** Richer professional context for each member, which improves the specificity and usefulness of introductions, without blocking initial onboarding.

- As the system, I want to store user consent for LinkedIn data collection, so that manual enrichment workflows are allowed.
- As a User, I want to upload a LinkedIn PDF, so that Curio can capture richer professional context. (Make this optional, likely after onboarding, not blocking completion.)
- As a User, I want to be prompted after onboarding to upload my LinkedIn PDF, so that I understand it will improve the quality of my introductions.
- As a User, I want to skip LinkedIn PDF upload and do it later from Edit Profile, so that I can finish onboarding quickly on mobile.
- As the system, I want to store a user's uploaded LinkedIn PDF securely and associate it to their profile, so that it can be referenced when generating introductions.
- As the system, I want to extract structured professional data from the LinkedIn PDF (roles, companies, dates, headline skills and keywords), so that it can be used in intro copy and matching.
- As the system, I want to generate a concise "LinkedIn highlights" summary for each user, so that introduction copy can reference their background clearly.
- As a Super Admin, I want to upload a LinkedIn PDF on behalf of a user who has provided consent, so that we can bootstrap richer intros in the early stages.
- As the system, I want to record who uploaded a LinkedIn PDF (user or Super Admin) and when, so that there is an audit trail.

---

## Milestone 5: Directory and profile overlap view

**What it is:** Group directory, unique profile URLs, member profile views, and clear overlap display for skills, interests, and learning opportunities.

**What it unlocks:** Members can self serve discovery and see why they should speak with someone, even outside of scheduled intro rounds.

- As the system, I want each user to have a unique profile URL, so that other members can view the profile reliably.
- As a User, I want to view a group directory, so that I can discover other members.
- As a User, I want to click a member in the directory and view our overlap (interests, skills, learning opportunities), so that I know why we should talk.
- As a User, I want the profile to clearly show which group we share, so that the context is obvious.
- As a User, I want the overlap lists ordered by the other person's strength of interest or proficiency, so that the best talking points rise to the top.

---

## Milestone 6: First intro round, manual send

**What it is:** Matching engine and intro round workflow, generate pairs, avoid repeats, handle odd numbers, save round records, and a Super Admin workflow to view and mark rounds as sent.

**What it unlocks:** The core product loop works end to end, groups are created, members join, profiles are built, introductions are generated, and intros can be sent even if delivery is manual.

- As an Organisation Admin, I want to initiate an introduction round for a group immediately, so that members get paired.
- As the system, I want matching to include only group members with completed profiles and intros enabled, so that pairings are valid.
- As the system, I want matching to avoid people who have been introduced before, so that rounds stay fresh.
- As the system, I want to handle odd group sizes by making one group of three, so that everyone can be included.
- As an Organisation Admin, I want to see the generated pairs for a round, so that I can sanity check what will be sent.
- As the system, I want each intro round saved as a record (name, date/time, participants, matches, status), so that there is an audit trail.
- As a Super Admin, I want to see rounds pending action, so that I can manage sending.
- As a Super Admin, I want to view the matches and member contact details for the round, so that I can send introductions (even if off platform).
- As a Super Admin, I want to mark an intro round as "sent", so that org metrics and history remain accurate.

---

## Milestone 6.5: Including LinkedIn data (pending approval)

**What it is:** Introductions reference LinkedIn derived highlights, with Super Admin preview and edit before sending.

**What it unlocks:** Introductions feel more personalised and credible because they reference real career history, not just selected interests and skills.

- As the system, I want the introduction copy generator to incorporate relevant LinkedIn derived details for each person, so that the introduction feels more specific and valuable than interests and skills alone.
- As a Super Admin, I want to preview and edit the LinkedIn based intro snippets before sending, so that I can ensure quality and avoid awkward or inaccurate references.

---

## Milestone 6.75: Lovable UI fidelity pass

**What it is:** Bring the app visuals up to the Lovable wireframes, by updating the shared UI components and applying the intended styling patterns consistently.

**What it unlocks:** A product that looks deliberate and polished, without rewriting every page.

- As a user, I want the app to match the Lovable design system (spacing, typography, cards, buttons, states), so that it feels trustworthy and clear.
- As a developer, I want most visual changes to happen inside shared components, so that design updates do not become a page by page rewrite.
- As a Super Admin and Organisation Admin, I want admin screens to be visually scannable, so that I can manage groups and invites quickly.

---

## Milestone 7: Basic connection tracking

**What it is:** Add a person, share contact details, list added people, and prevent re matching people who are already connected.

**What it unlocks:** Intros stay fresh over time, and Curio starts to behave like a lightweight relationship layer rather than a one off matching tool.

- As a User, I want to "add" another user, so that I can save them and share my contact details with them.
- As a User who has been added, I want to see the other person's shared contact details, so that I can follow up.
- As the system, I want to prevent matching people who have already added each other, so that intros do not duplicate existing connections.
- As a User, I want a "People" page listing everyone I have added, so that I can find them later.

---

## Milestone 8: Scheduling and repeatability

**What it is:** Schedule rounds in advance, run recurring schedules, pause schedules, and cancel scheduled rounds.

**What it unlocks:** Curio can run reliably for cohorts and communities without someone manually triggering every round.

- As an Organisation Admin, I want to schedule an intro round for a future date and time, so that intros can align with events or cohorts.
- As an Organisation Admin, I want to set a recurring schedule (weekly, fortnightly, monthly), so that communities can run ongoing intros.
- As an Organisation Admin, I want to pause a recurring schedule, so that I can stop intros without deleting history.
- As an Organisation Admin, I want to cancel a scheduled round before it is sent, so that mistakes can be corrected.

---

## Milestone 9: Share profile growth loop

**What it is:** Share profile via QR and URL, and a visitor flow that encourages account creation.

**What it unlocks:** Organic growth and easier real world usage at events, because members can share Curio profiles instantly.

- As a User, I want to share my profile via QR code and URL, so that people in the same context can view it quickly.
- As a visitor who scans a QR code, I want to view the user's profile and be prompted to create an account if I do not have one, so that Curio can grow.

---

## Milestone 10: Admin experience and reporting

**What it is:** Group onboarding stats, org level outcome metrics, and global platform metrics for Super Admin.

**What it unlocks:** Admins can prove value, diagnose drop off, and manage the programme more effectively, which supports retention and scaling.

- As an Organisation Admin, I want to view group level onboarding stats (invited vs joined, active users), so that I can drive completion.
- As an Organisation Admin, I want org level metrics (active members, intros made, connections made), so that I can prove outcomes.
- As a Super Admin, I want global analytics (active users, active orgs, operational metrics), so that I can run the platform.
