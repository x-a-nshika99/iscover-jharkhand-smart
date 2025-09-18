import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Destination {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
  category: string;
  rating: number;
  duration: string | null;
  price: number | null;
  visitor_count: number;
  highlights: string[];
  location: string | null;
  created_at: string;
  updated_at: string;
}

export const useDestinations = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const { data, error } = await supabase
          .from('destinations')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setDestinations(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  return { destinations, loading, error };
};