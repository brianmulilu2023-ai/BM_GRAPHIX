/**
 * Supabase Client
 * Used for cross-device persistent media & project storage.
 *
 * Set these environment variables in Vercel:
 *   VITE_SUPABASE_URL     → your Supabase project URL
 *   VITE_SUPABASE_ANON_KEY → your Supabase anon/public key
 *
 * Database schema (run in Supabase SQL editor):
 *
 *   -- Media table
 *   create table if not exists media_items (
 *     id text primary key,
 *     data jsonb not null,
 *     created_at timestamptz default now()
 *   );
 *   alter table media_items enable row level security;
 *   create policy "Allow all" on media_items for all using (true) with check (true);
 *
 *   -- Projects table
 *   create table if not exists projects (
 *     id text primary key,
 *     data jsonb not null,
 *     created_at timestamptz default now()
 *   );
 *   alter table projects enable row level security;
 *   create policy "Allow all" on projects for all using (true) with check (true);
 *
 * Storage bucket (create in Supabase dashboard → Storage):
 *   Name: media
 *   Public: YES (toggle on)
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

let _client = null;

export function getSupabaseClient() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;
  if (!_client) {
    _client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return _client;
}

export const isSupabaseConfigured = () =>
  Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
