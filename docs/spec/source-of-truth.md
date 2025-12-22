# Curio source of truth, Spec 1.3

This repository is aligned to Spec 1.3 terminology.

## Terminology
Organisation, Group, User

## Database tables
organisations
groups
group_members
organisation_admins
blocked_users

## Key columns
organisation_id
group_id
user_id
user_ids
user_1_id
user_2_id

## Enums
user_role values:
super_admin
organisation_admin
user

group_type values:
organisation_connection
cohort_blitz
event

## Important note
The file supabase/migrations/0001_init_curio_schema.sql contains legacy names by definition.
The current schema naming is established by supabase/migrations/0002_rename_schema_to_spec_1_3.sql.
