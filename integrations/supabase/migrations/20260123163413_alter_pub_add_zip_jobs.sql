alter publication supabase_realtime add table zip_jobs;
ALTER TABLE zip_jobs REPLICA IDENTITY FULL;
