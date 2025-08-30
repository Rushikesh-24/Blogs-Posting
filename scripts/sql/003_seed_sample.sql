-- optional: seed a couple of posts for initial testing (once schema exists)
insert into public.posts (id, author_id, title, slug, excerpt, content, tags, status, published_at)
values
  (uuid_generate_v4(), uuid_generate_v4(), 'Hello Supabase', 'hello-supabase',
   'Kickstarting the blog with Supabase-backed content.',
   'This is a sample post seeded via SQL to validate schema & RLS.',
   array['intro','supabase'], 'published', now()),
  (uuid_generate_v4(), uuid_generate_v4(), 'Black & White Design', 'black-white-design',
   'A crisp visual system focused on content.',
   'Exploring contrast, spacing, and rhythm in minimalist UI.',
   array['design','ux'], 'published', now())
on conflict do nothing;
