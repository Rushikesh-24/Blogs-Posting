-- ensure required extensions exist (trigram for search; uuid-ossp for ids)
create extension if not exists "pg_trgm";
create extension if not exists "uuid-ossp";
