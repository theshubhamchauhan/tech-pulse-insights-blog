
-- Create a storage bucket for public assets (including category images)
INSERT INTO storage.buckets (id, name, public, avif_autodetection)
VALUES ('public', 'Public', TRUE, FALSE)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policy to allow public access to the bucket
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'public');

-- Create RLS policy to allow authenticated users to insert into the bucket
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'public');

-- Create RLS policy to allow authenticated users to update objects they own
CREATE POLICY "Authenticated users can update own objects"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'public' AND auth.uid() = owner);

-- Create RLS policy to allow authenticated users to delete objects they own
CREATE POLICY "Authenticated users can delete own objects"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'public' AND auth.uid() = owner);
