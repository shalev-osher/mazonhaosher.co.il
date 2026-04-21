UPDATE storage.buckets SET public = false WHERE id = 'assets';

DROP POLICY IF EXISTS "Public read individual assets" ON storage.objects;