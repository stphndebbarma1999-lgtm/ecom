-- Adds Footwear, Sunglasses and Watches as selectable departments, and adds
-- Ingredients / How to Use fields to products (used for Beauty products in
-- place of Color / Material & Care). Safe to re-run.

alter table categories drop constraint if exists categories_department_check;
alter table categories add constraint categories_department_check
  check (department in ('men', 'women', 'beauty', 'footwear', 'sunglasses', 'watches'));

alter table products drop constraint if exists products_department_check;
alter table products add constraint products_department_check
  check (department in ('men', 'women', 'beauty', 'footwear', 'sunglasses', 'watches'));

alter table products add column if not exists ingredients text[] not null default '{}';
alter table products add column if not exists how_to_use text[] not null default '{}';

-- Handbags is removed from the site entirely.
delete from categories where department = 'women' and slug = 'handbags';

-- Watches, Sunglasses and Footwear are now their own departments instead of
-- categories nested under Men/Women, so the old category rows are stale.
-- This only removes the CATEGORY (taxonomy) rows — it does not touch any
-- existing PRODUCT rows. If you already have real products tagged with one
-- of these old department/category pairs (men/watches, men/sunglasses,
-- men/casual-shoes, men/formal-shoes, men/sports-shoes, women/sunglasses,
-- women/watches, women/footwear), they will keep showing up under their old
-- department (e.g. a men/watches product still appears on the "Men" page)
-- until you manually re-assign them to the new department/category via
-- /admin/products — re-assigning them automatically here would silently
-- change live product URLs and listings, so that step is left to you.
delete from categories where (department, slug) in (
  ('men', 'casual-shoes'),
  ('men', 'formal-shoes'),
  ('men', 'sports-shoes'),
  ('men', 'watches'),
  ('men', 'sunglasses'),
  ('women', 'sunglasses'),
  ('women', 'watches'),
  ('women', 'footwear')
);
