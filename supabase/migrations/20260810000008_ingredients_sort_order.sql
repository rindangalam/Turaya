-- add sort_order to ingredients for admin ordering (matches collections/categories)

alter table public.ingredients
  add column sort_order integer not null default 0;
