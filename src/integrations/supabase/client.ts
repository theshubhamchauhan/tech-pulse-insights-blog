// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ukpifoksayhnetqdfgsp.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVrcGlmb2tzYXlobmV0cWRmZ3NwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyMzQwMjgsImV4cCI6MjA1OTgxMDAyOH0.5JC7rCxHqECnUmUznSnMDjuI5MkJG9gYcdQELPx2ox0";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);