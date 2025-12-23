# Curio MVP Specification

> **This markdown is a mirror of the canonical spec.** Do not drift terminology. Refer to `docs/spec/milestones.md` for scope and user stories.

---

## 1. User Roles and Permissions

Curio defines three roles with escalating privileges:

### Super Admin (system-level)

Internal Curio administrators with the highest level of control. Super Admins can:

- Create organisations and assign the Organisation Admins.
- Create, review, or edit any group under any organisation.
- Approve or create all new intro rounds.
- Trigger the sending of all introduction emails/messages (the core output of the platform).
- View global analytics, billing, and operational metrics.
- Impersonate any Organisation Admin or User for support or troubleshooting.

Super Admins are the only role able to approve rounds and trigger introductions.

### Organisation Admin

Organisation Admins manage Curio for a specific organisation, such as a member organisation, co-working space, founder group, innovation hub, or chamber of commerce. An organisation will want to introduce their users more effectively by creating groups for specific purposes. Some organisations may only have one group, for instance a small co-working space to introduce members, where others may have multiple groups, such as a co-working space that also runs regular events and wants separate groups for events and members.

Organisation Admins can:

- Create new groups within their organisation.
- Configure and manage introduction rounds within those groups.
- Invite members by uploading or inputting user email lists.
- Invite members by sharing a unique URL for a group.
- Trigger rounds of introductions
- Monitor high-level metrics for their organisation, including:
  - Number of active users
  - Introductions made in the last 30 days
  - Invited vs joined counts
  - Number of connections made within their group.
- View aggregated analytics dashboards.

They cannot:

- Approve rounds themselves or send introductions.
- Create new organisations.
- See data outside their own organisation.
- Edit individual user profiles or view private profile responses (they only see aggregated insights).

In short: Organisation Admins set up programmes and manage membership, but do not have permission to modify sensitive user data or trigger introduction sends.

### User

A user manages their own Curio profile for the purpose of professional networking.

Users can:

- Build and manage their own Curio profile.
- Opt in and out of introduction rounds for groups that they are part of.
- View other users within groups that they are part of
- Add users to their "people" section of their profile. Adding someone as a user shares their contact information with the other user automatically.
- Respond to contact detail shares: when someone is added by another user, they will receive their contact information and can share their contact information back with that person by confirming a share request in "people".
- Add notes and tasks to people who they have added on their people page.
- Add a PDF of their LinkedIn profile to their account

They cannot:

- Edit other users' data.
- Change organisation settings.
- Configure or approve groups
- See user data beyond what they have in common (e.g. they can't see the entire data on someone's profile, just where they overlap)

---

## 2. User Journey: Users

User onboarding remains a guided, multi-step process, with clarifications incorporated from your feedback.

### Invite & Account Creation

A user will be onboarded to Curio via the following flows:

- **Through an invite to join a group (most common):** this is where a group will invite users through either a URL or by adding their email addresses to the group on the Curio platform.
- **Through another user's invite:** by joining another user on Curio by scanning their QR code or a URL for connecting with them directly. (*this flow can be descoped in the MVP if too difficult to achieve)

Accepting the invite to join a group will take the user through the following steps:

#### Enter Email & Password

To start with the user enters:

- Email
- Password
- First and last name

This allows them to accept the invitation and kick off the account creation process. Note: that for some groups, to ensure only approved members join, each user is given a unique code to use on joining. Once that code is used, it cannot be reused again.

#### Add basic account details

Next the user will add some basic details about what they do professionally, including:

- Role/title
- Company
- Tagline: a short description of their main focus with their job.

There are also some basic instructions on this page to foreshadow for the user why they are adding this profile detail (e.g. what Curio does, how it will use their data and what is the value for them in participating).

*Note: there is an option for users to add more than one company, given that especially in the startup scene people can be involved in multiple projects.*

#### Skills mapping

This section allows the user to select the skills they have and the skills that they are looking to learn.

They are able to:

- **Tap once:** for a skill that they know a little
- **Tap twice:** for a skill that they are building
- **Tap three times:** for a skill they are expert in

They are also able to tap the left corner of the tile, where a light globe icon is positioned to indicate a skill that they are looking to learn.

This section consists of cascading categories. The user is first presented with 18 skills categories, which include:

- Sales
- Marketing
- Growth
- Partnerships
- Product
- Engineering
- Data analysis
- Design
- AI and Automation
- Customer Success
- Operations
- Hiring
- Finance
- Fundraising
- Investing
- Legal
- Strategy
- Community building

Once one of those categories has been selected then a series of further options is displayed below that allows the user to select more specifically the skills that they have or are trying to learn. Please see Appendix 1.1 for the list of these sub-categories for skills.

This page also includes:

- **Instructions:** to explain what they are doing and how this information will be used. These instructions will ideally appear at the top of the screen, under the progress bar and the user will be able to hide the instructions by clicking on a chevron at the top right corner of the instructions, or they will automatically hide when the user scrolls down the page.
- **Progress bar:** to track the number of options that the user selects in this section and to encourage them to select around 20 options. The progress bar will fill up gradually and the continue button at the top of the page will only show as solid when the user has selected 20 options.

#### Personal interests

The next section allows the user to choose their personal interests. Again, similar to the skills mapping section the user can provide a level of how interested they are in the topic:

- **One tap** for something they like
- **Two taps** for something they really like
- **Three taps** for one of their favorite things

The user is also able to tap an icon in the top left corner for something that they don't like. The options are designed to be conversation provoking topics that reveal what someone is interested in, while avoiding controversial options (politics), things that everyone likes (music) or options that don't spark much conversation (playing pool).

Please see Appendix 1.2 for a full list of these options.

#### Contact details

The final section of the profile build asks the user to add contact details to their profile, such as:

- LinkedIn
- Email
- Phone number

This will be important when the user goes to add another user, which will share their contact details with that user. Please also note that we will not ask the user for their profile picture, because it is not necessary for their profile as they will be in close proximity to the people that they are in these groups with (events, co-working spaces etc).

Note: we could also skip the contact details for this part of the user experience and ask the user to add them later, when they start to add or be added by other users. This would lighten the user load for this profile build, which is important given that a lot of users may be completing this on their phone before an event.

Note: ideally we would like the user to upload a PDF of their LinkedIn account to their profile. Given this will disrupt the user experience for the onboarding (they will need to navigate to LinkedIn in the separate tab), we shouldn't expect them to do this now. However, in the early stages of the product, it would be feasible to do this manually, e.g the super admin logs into their profile and uploads a LinkedIn PDF. Therefore, at this stage of the profile build, we could add a consent box for them to agree to allowing Curio to collect their LinkedIn info this way.

Also on this page is a toggle option for allowing users to enable introductions for themselves within the group that they are joining. This toggle should be set to on, by default as we want to encourage users to participate in introductions within their group.

---

### 2a. Group Directory

The group directory shows other members in that particular group. The profiles of these other users are displayed based on the overlapping data with the user who is viewing. As you can see in the profile cards, it highlights what they have in common and how they might be able to help each other by displaying:

- Overlapping personal interests
- Overlapping skills
- Opportunities to learn (e.g one has a skill that the other is looking to learn)

Also, we'd like to display a connection summary between the two users. This would involve using an LLM to compare their data and provide a summary of what they have in common. The end result would ideally seem like a mutual connection has provided an introduction for the two of them.

Note: generating unique results for the directory based on each user's data might be too technically challenging initially and it also may prove expensive in terms of AI credits to generate results every time this page is loaded. Here are some alternative options for the directory as we develop the product over time:

- **No directory:** we don't allow users to see the rest of the group, Curio just operates as an introduction tool and links directly to other users profiles
- **Random numbers for the common ground pills:** if it is complex to display the common ground pills for each user (e.g. 4 personal interests, 6 skills in common). Then we could randomly generate these numbers to start with, users won't notice if there is a discrepancy between the directory and the user profile.
- **Tagline instead of "connection summary":** a tagline is a one-to-many summary of what you do that the user can enter when they are building their profile. It requires no LLM to display.
- **Generate insights button:** rather than generate all the LLM insights for a group when the page loads, we could have the user click a "generate insights" button on the profile that they are interested in, which would then create the connection summary for them.

---

### 2b. Introductions

The introduction feature of Curio aims to directly connect people within a group. Initially these introductions will be made off the Curio platform, via the preferred communication channel for the group (Slack, email, teams etc). We would like to include in the introduction:

- A text summary of what the two people have in common
- A link to both of their Curio profiles

Ideally, we would like to generate the rounds of introductions through the org admin dashboard and automate as much as possible, however initially it is ok if this process is manual as these introductions are not happening in real time.

When we automate the introductions, we would like to achieve the following:

- Match people who have a lot in common with each other
- Match people who don't already know each other
- Avoid matching people who have been matched before
- Record all the introductions that have been made in the admin dashboard

Crucial to this working, is ensuring that each user's Curio profile has a unique URL that when accessed by other users, shows what they have in common.

---

### 2c. User profiles

The user profile shows what the logged in user has in common with this person. It breaks the profile into the following categories:

- **Summary card:** includes an AI generated connection summary, role title and company, add button and pill with the title of the group that they have in common.
- **Common ground:** a summary of the personal interests that they have in common. The dots indicate how interested in that option the other person is. The order should prioritise those options that overlap where the other person has indicated the most interest by tapping multiple times. As people can also dislike options, we will highlight those where they both dislike the same thing.
- **Skills overlap:** includes the professional skills which the two users have in common, again ordered by those that the other person has tapped multiple times on.
- **Learning opportunities:** this is where there is an opportunity for one person to teach the other. One user has indicated that they are looking to learn a particular skill or they are only just learning (e.g tapped once) where the other person is well skilled in that area (e.g tapped multiple times). This section will be separated into the skills that the user could teach and those that the user could learn.

**The add button:** adding a user triggers the following:

- That user's profile is listed in the page for "people" so you can find that person again in the future or add notes if you would like to.
- It will share your contact details with that user: when that user sees your profile, they will be able to see your contact details.

**Notes:** we also want to allow people to add notes to other users' profiles, so they can record important details about that person and also track any actions that they want to take with/for that person. We only want the notes and tasks to appear when the user has added the other user.

Note that for the initial version of the product, just being able to connect with another user and share contact information will be sufficient. Adding notes and tasks can come later.

---

### 2d. People

The people page is where users can see all the people that they have added from various groups. Initially, most users will only be part of one group so this page will simply track those that they have met or want to meet within those groups. Eventually, when users have multiple groups this page will store the people that they have met over time, becoming like a person CRM.

Note: initially, this page is not essential as users can simply share contact information within the groups that they are part of. This feature becomes important when the number of groups on Curio grows and users want to track the people that they have met across a variety of different contexts.

---

### 2e. Groups

The groups page allows users to manage their involvement in Curio groups, which is the main way that they will meet people on the platform. The main functions that the user will perform on this page are:

- **Toggle intros on/off:** the user can select whether or not they wish to participate in the Curio introductions for that group. Toggling the intro to off means they will not be included in the next round of introductions that is generated.
- **Leave a group:** should a user wish to leave a group entirely, they can do so by selecting the three buttons next to that group and leaving, which will remove their profile from that group so other users cannot see them any longer.

In the future on this page there may also be the ability for users to:

- **Find groups** for searching for groups that are open for people to join publicly.
- **Join groups:** if they search for a group name and find it. Some groups may require an access code to join so they are not open to all members of the public.
- **Create their own group:** should they wish to invite people to join a Curio group that they set up and manage.

---

### 2f. Edit profile

On the edit profile page, there are options for users to add more detail to their profile or edit what they currently have added. Initially, their profile will be built from a simple check box form, but eventually we want to allow users to add more details to their profile, because the more data that we have on users, the better introductions we can provide.

Here is what we currently have:

- **Profile summary card:** edit simple details such as their name, tagline and profile image.
- **Edit interests and skills:** edit the options that they selected in the form for personal interests and professional skills
- **Add LinkedIn PDF:** add their linkedin profile pdf, so we have a better understanding of their professional skills. We want to encourage users to add this as a priority when they sign up, and even can add it for them in the early stages so that users can start to experience the benefits of having their professional journey captured on Curio.
- **Add books:** not required for the initial version, but this is another datapoint that users can connect on.
- **Podcasts:** same as books in terms of another interesting data point, but not required initially.
- **Spotify:** can be connected with an O-auth
- **Strava:** can also be connected with O-auth

For the initial version of Curio, we only need the interests and skills data, however LinkedIn would certainly enhance the experience. For the others, further user testing is required to gauge the desire for introductions based around these topics.

Note: at this stage we don't want to offer an "other" option to users, because that makes the 1-1 matching logic more difficult to generate. When people add options in their own words, there will need to be a level of interpretation by the system to understand what the overlap may be with others, for instance someone who likes UFC and another that likes MMA, which is essentially the same thing, but the system will need to be intelligent to pick that up. Where if we just have an option for MMA then that reduces that issue.

---

### 2g. Share profile

Enabling users to share profiles with others, may be an important growth engine for Curio one day if we choose to go down a consumer focused path (digital business cards/personal CRM).

Initially however, Curio will be focused on enabling networking within groups, which is why a direct share of a profile with people outside of these groups, will not be a high-priority.

What we would like to enable is simple ways for users to share their Curio profile within these existing groups through either a URL or a QR code, which could be used in the following ways:

- **QR code for a physical member directory:** e.g at a co-working space, sticking a QR code on someone's profile, which is usually visible in a members area.
- **QR code for joining an event:** if there is a marketing flyer for the event, users could scan the QR code to join that event and link their Curio profile.
- **QR code for an individual user's name badge at an event,** which would allow other users to see their profile.
- **A unique URL** for pasting in a slack profile

When someone scans another users QR code they should:

- See that users profile
- Be encouraged to add them to share contact information
- If the person that scanned has not got a Curio profile then, they should still be encouraged to create one.

---

## 3. User Journey: Org admin

The org admin role grants special permission to some users to enable them to administrate groups. The people that hold these roles may include:

- Co-working space managers
- Community managers
- Event organisers
- HR teams

### 3a. Org admin invitation

Initially, organisations will be created by the super admin role to ensure that only approved organisations will be using the platform. The super admin will create a new organisation and then invite the admin team from that organisation to join the platform, either via:

- **Email invitation:** super admin adds the org admin emails and they receive an email invite
- **Unique URL:** the org admin is sent a unique URL so that when they join they are assigned the role of org admin.

Importantly, the org admin does not complete the same signup flow as normal users, as they may choose not to be involved in the introduction/community networking activity. Therefore the flow they complete to sign up simply takes them to the org admin dashboard. If they want to sign up as a user, they will need to follow the unique URL for joining the group as a user, not as a group admin.

Accepting the invite involves entering:

- Email
- Name
- Password
- Title

Completing this will take them to their org admin dashboard.

---

### 3b. Org admin dashboard

On the org admin dashboard the org admin will be able to see:

- Groups that are associated with their organisation
- A button to create a new group for their organisation
- High level stats for their organisation such as number of active members, connections amongst members and introductions made between members.
- The ability to invite new org admin users to join their org.

The main action that we expect the org admin to take from this page will be to either:

- Create a group
- Click on an existing group to manage that group

Given that the super admin can impersonate an org admin user, it will be common for the super admin to help the org admin manage their community initially.

---

### 3c. Create a group

Creating a group refers to setting up a new context for a group of people to meet on Curio, the common use cases for this are:

- An event
- An ongoing community: co-working space, online community
- A cohort: a learning program or accelerator that has a specific start and end date
- A workplace: a group of coworkers

When the org admin clicks the create group button a form with the following fields will appear:

- Group name
- Group type (dropdown with the options; event, community, cohort, workplace)
- Group description (for internal use only)

When the group is created, the first action that the org admin will be prompted to take will be to invite users to join the group. There are two ways to do this:

- Upload a CSV with names and emails
- Share a URL to invite people to join

---

### 3d. Managing a group

Once a group has been created, the org admin will manage this group by:

- **Onboarding users:** checking on the number of active users and the invites that are still pending.
- **Generating introduction rounds:** instigating a round of introductions between group members.

The introduction rounds will differ depending on the type of group and we want to give the org admin some flexibility to run introductions the way that they would like, without adding too much workload for them and their team.

To achieve this we want to allow the following functionality:

- **Initiate an introduction round immediately:** being able to press a button that will match users on a 1-1 basis for a round of introductions.
- **Schedule an introduction round to take place on a certain date:** set a date and time for an introduction round to be sent out to users.
- **Create an ongoing round of introductions:** continue to run introductions on a recurring basis on a fixed schedule (e.g. weekly, fortnightly, monthly).

Each time an introduction round is generated, a record should be created with:

- The name of that introduction round (e.g. pre-event intro's for StartCon)
- The date and time that it occurred
- When the org admin clicks on the round, be able to see who was introduced to whom

The org admin should also be able to:

- Pause a recurring round of introductions
- Stop or delete a round of introductions before they have been sent out

---

### 3e. Matching logic

The matching logic refers to the logic behind who is paired with who for a round of introductions. Eventually we would like this to be intelligent, by introducing people who have the most overlap and therefore the most reason to meet. However, to keep things simple initially it will just need to follow the following rules:

- Only introduce people with completed profiles who are part of that specific group.
- Don't introduce people who have been introduced before
- Don't introduce people who have "added" each other
- If there is an odd number, create one group of three for introductions.

Even if we have to do this manually (e.g. off platform) to begin with and we just use the data gathered through Curio to generate the introduction, that will be fine.

---

## 4. User Journey: Super admin

The super admin is a member of the Curio team who will be granted special permissions to oversee the management of the Curio system, solve technical issues and support users to achieve their desired tasks.

### 4a. Super admin dashboard

The super admin dashboard provides oversight on the activity of the entire platform, including:

- Number of active users
- Number of active orgs
- Rounds that are pending approval/action
- Create a new organisation and assign org admins

The main action where the super admin will be involved is in the facilitation of the introduction rounds, by sending emails and slack messages to the users to introduce them to each other, which is why this part of the UI should be prominently displayed.

Also, super admins will often be logging in as org-admins to help them perform tasks on their accounts, so navigating to org-admin users should be simple. The super-admin will also log in as users to help with their accounts, but this will be less common than for org-admins, but the navigation should also be simple for this.

---

### 4b. Processing introduction rounds

Initially, it is expected that the super admin will be actively involved with sending the introductions before the system can automate this action.

The actions needed to be performed by the super admin here are:

- See who has been matched in an intro round
- See their contact details and preferred channel (e.g. slack or email)
- Generate the copy for the introduction round
- Send the introduction (likely this will happen off-platform initially)
- Mark the introduction as sent (for org-admin stats)

This can be stripped back even further if need be, with the copy for the introduction being generated off platform if need be.

---

## Appendix 1.1: Skills mapping — deeper options

Based on the selections above, these additional options will appear allowing people to provide more specific details on the skills they have.

### Sales
- Outbound sales
- Inbound sales
- Sales discovery
- Demos
- Enterprise sales
- Partnerships sales
- Pricing and packaging
- Sales systems

### Marketing
- Brand and messaging
- Content marketing
- Podcast creation
- LinkedIn marketing
- SEO
- Paid marketing
- Product launches
- Community marketing
- PR

### Growth
- Conversion optimisation
- Activation and onboarding
- Retention
- Experimentation
- Referral growth
- Pricing experiments
- Growth analytics
- Lifecycle journeys

### Partnerships
- Channel partnerships
- Strategic partnerships
- Co marketing
- Integration partnerships
- Affiliates
- Reseller programs
- Sponsorships
- Ecosystem partnerships

### Product
- Customer discovery
- Roadmapping
- Prioritisation
- MVP planning
- Feature design
- Product launches
- Feedback loops
- Product metrics

### Engineering
- Frontend
- Backend
- Full stack
- Mobile
- Integrations
- DevOps
- Testing
- Security basics

### Data analysis
- SQL
- Dashboards
- Funnel analysis
- Cohort analysis
- Experiment analysis
- Segmentation
- Attribution
- Reporting

### Design
- UX design
- UI design
- Prototyping
- Design systems
- Web design
- Branding
- Accessibility
- User flows

### AI and Automation
- Vibe coding
- AI workflows
- AI agents
- Prompt engineering
- Integrations
- AI product features

### Customer Success
- Onboarding
- Adoption
- Retention
- Support workflows
- Customer training
- Renewals
- Feedback management
- Community support

### Operations
- Process design
- Documentation
- Project management
- Tool stack setup
- Vendor management
- Workflow automation
- Quality assurance
- Scaling systems

### Hiring
- Role scoping
- Incentives
- Sourcing
- Screening
- Interview design
- Onboarding
- Performance reviews
- Contractor management

### Finance
- Budgeting
- Cash flow
- Runway planning
- Financial modelling
- Unit economics
- Billing and payments
- Bookkeeping
- Tax incentives

### Fundraising
- Investor targeting
- Pitch story
- Pitch deck building
- Investor outreach
- Due diligence
- Term sheets
- Cap table design
- Investor updates

### Investing
- Angel investing
- VC investing
- Deal sourcing
- Due diligence
- Thesis building
- Portfolio support
- Syndicates
- Founder introductions

### Legal
- Company setup
- Founder equity
- Contracts
- IP protection
- Privacy basics
- Employment contracts
- Compliance basics
- Negotiation

### Strategy
- Market research
- Positioning
- Go to market planning
- Competitive analysis
- Business model
- Metrics and KPIs
- Expansion strategy

### Community building
- Community design
- Member engagement
- Events and meetups
- Partnerships
- Content programming
- Moderation
- Sponsorships
- Measuring community impact

---

## Appendix 1.2: Personal interests

### Sports & Fitness
Running, Gym, Yoga, Pilates, Swimming, Cycling, Tennis, Golf, Basketball, Football, Cricket, Rugby Union, Rugby League, AFL, Netball, Badminton, Squash, Table Tennis, Padel, Pickleball, Boxing, CrossFit, HIIT, Circuit Training, Dance Fitness, Hiking, Trail Running, Trail Cycling, Mountain Biking, Climbing, Surfing, Kitesurfing, Skiing, Snowboarding, Skateboarding, Diving, Kayaking, Marathons, Triathlons, Hyrox, Adventure Races, Athletics, UFC, NFL, Formula 1, Power Walking, Spikeball, Futsal, Horse Racing, Ice Baths, Sauna

### Creative & Arts
Photography, Painting, Drawing, Digital Art, Graphic Design, Pottery, Crafting, Knitting, Woodwork, Acting, Improv, Theatre, Singing, Playing Music, Music Production, Dance, Creative Writing, DIY Projects, Home DIY

### Gaming & Puzzles
PC Gaming, Esports, Board Games, Chess, Cards, Poker, Puzzles, Crosswords, Sudoku, Wordle

### Social & Entertainment
Coffee, Restaurants, Bars, Gigs, Music Festivals, Comedy, Trivia Nights

### Outdoors & Nature
Camping, Fishing, Birdwatching, Gardening, Nature Walks, Boating, Four Wheel Driving, Horse Riding, Motorbike Riding

### Lifestyle & Food
Cooking, Baking, Barbecuing, Craft Beer, Vegan, Vegetarian, Gluten Free, Alcohol Free

### Pets
Dog, Cat

### Travel
Travel Europe, Travel Asia, Travel North America, Travel South America, Travel Africa

### Professional & Personal Development
Reading, Podcasts, Documentaries, Blogging, Tech, Business, Investing, Volunteering, Coaching, Mentoring, Meditation, Current Affairs, Politics, Philosophy, Psychology, History, Museums, Fashion, Art, Activism

---

## Appendix 1.3: Product roadmap

Beyond the features mentioned already in this document, here are some additional features that could be added in the future to enhance the user experience:

- **Group data search:** a natural language query for a group to find people with certain skills/interests.
- **In-app messaging:** to allow users to directly communicate with one another on Curio.
- **Contact import:** import users that are not currently on Curio to track your interactions with them. Ideally this would be through adding their LinkedIn PDF so there is a consistency of data being analysed.
- **Track off-platform comms:** being able to track interactions with your Curio people and have them saved on the profile such as: phones messages, emails, calendar meetings
- **Smart matching:** provide introductions based on profiles that you share the most common ground with or due to the context of a group, as opposed to random matching.
