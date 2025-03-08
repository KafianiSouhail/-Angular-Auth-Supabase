import { createClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

export const createSupabaseClient = () => createClient(environment.projectUrl,environment.apiKey)