import { createClient } from '@supabase/supabase-js';

// Essas variáveis devem ser definidas no .env na raiz do projeto
// Aqui estamos pegando do projeto de backend
// É importante que sejam chaves públicas de anon
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://blgmlmiegssuttllcfyt.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJsZ21sbWllZ3NzdXR0bGxjZnl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEzMTkxMzYsImV4cCI6MjA1Njg5NTEzNn0._sQ1lKlW-0J6OVSYMIGvU-A4jH24eTKQ3gqOLbBdJPU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Buckets no Supabase Storage
export enum BucketName {
  PRODUTO_IMAGES = 'produto-images',
  MODULO_IMAGES = 'modulo-images',
  AULA_VIDEOS = 'aula-videos',
}

/**
 * Função para obter URL pública de um arquivo no Storage
 * @param bucket Nome do bucket
 * @param path Caminho do arquivo no bucket
 * @returns URL pública do arquivo
 */
export const getPublicUrl = (bucket: BucketName, path: string): string => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}; 