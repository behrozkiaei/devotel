// supabase.service.ts
import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SuperbaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      'https://calumsumyofmqyrhjvcg.supabase.co', // Supabase URL
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhbHVtc3VteW9mbXF5cmhqdmNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgzODM1MjYsImV4cCI6MjA1Mzk1OTUyNn0.u0pJFJQLM77vmA6cmJJCvwGvMaIfiAoXQ2UsZ680psM', // Supabase Key
    );
  }

  getClient(): SupabaseClient {
    return this.supabase;
  }
}