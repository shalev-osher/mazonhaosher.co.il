-- Create public storage bucket for assets
INSERT INTO storage.buckets (id, name, public) VALUES ('assets', 'assets', true);

-- Allow public read access to assets
CREATE POLICY "Public can view assets"
ON storage.objects
FOR SELECT
USING (bucket_id = 'assets');

-- Allow authenticated users to upload assets (for admin)
CREATE POLICY "Authenticated users can upload assets"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'assets');

CREATE POLICY "Authenticated users can update assets"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'assets');

CREATE POLICY "Authenticated users can delete assets"
ON storage.objects
FOR DELETE
USING (bucket_id = 'assets');