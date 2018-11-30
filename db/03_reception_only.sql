-- Migration: adds an invited_to_reception column to app_public.family
alter table app_public.family add column invited_to_reception bool;
update app_public.family set invited_to_reception = true where true;
