-- social_tokens: one row per platform, stores OAuth credentials
CREATE TABLE social_tokens (
  id                   uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  platform             text        NOT NULL UNIQUE CHECK (platform IN ('youtube','tiktok','instagram','threads')),
  access_token         text        NOT NULL,
  refresh_token        text,
  expires_at           timestamptz,
  platform_user_id     text,
  platform_username    text,
  platform_avatar_url  text,
  scopes               text[],
  raw_token_response   jsonb,
  created_at           timestamptz NOT NULL DEFAULT now(),
  updated_at           timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE social_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_only" ON social_tokens
  FOR ALL
  USING (auth.role() = 'authenticated');
