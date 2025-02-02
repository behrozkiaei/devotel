// IRepository.ts
export interface IRepository<T> {
    findOne(condition: any): Promise<T | null>;
    insert(entity: T): Promise<T>;
  }
  
  // GenericRepository.ts
  import { SuperbaseService } from './superbase.service';
  import { SupabaseClient } from '@supabase/supabase-js';
  
  export class GenericRepository<T> implements IRepository<T> {
    private readonly supabase: SupabaseClient;
  
    constructor(private readonly tableName: string, supabaseService: SuperbaseService) {
      this.supabase = supabaseService.getClient();
    }
  
    async findOne(condition: any): Promise<T | null> {
      const { data, error } = await this.supabase.from(this.tableName).select('*').match(condition).single();
      if (error) return null;
      return data;
    }
  
    async insert(entity: T): Promise<T> {
      const { data, error } = await this.supabase.from(this.tableName).insert(entity).select().single();
      if (error) throw error;
      return data;
    }
  }
  