-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create destinations table
CREATE TABLE public.destinations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  category TEXT NOT NULL,
  rating DECIMAL(2,1) DEFAULT 0,
  duration TEXT,
  price DECIMAL(10,2),
  visitor_count INTEGER DEFAULT 0,
  highlights TEXT[],
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create products table for marketplace
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  price DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL,
  rating DECIMAL(2,1) DEFAULT 0,
  artisan_name TEXT,
  village TEXT,
  stock_quantity INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create events table
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  event_date DATE NOT NULL,
  event_time TIME,
  location TEXT NOT NULL,
  category TEXT NOT NULL,
  price DECIMAL(10,2) DEFAULT 0,
  expected_attendees INTEGER DEFAULT 0,
  highlights TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  booking_type TEXT NOT NULL CHECK (booking_type IN ('destination', 'event', 'product')),
  item_id UUID NOT NULL,
  booking_date DATE NOT NULL,
  quantity INTEGER DEFAULT 1,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  special_requests TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create reviews table
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN ('destination', 'product', 'event')),
  item_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);
  
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for destinations (public read, admin write)
CREATE POLICY "Anyone can view destinations" ON public.destinations
  FOR SELECT USING (true);

-- RLS Policies for products (public read, admin write)
CREATE POLICY "Anyone can view products" ON public.products
  FOR SELECT USING (true);

-- RLS Policies for events (public read, admin write)
CREATE POLICY "Anyone can view events" ON public.events
  FOR SELECT USING (true);

-- RLS Policies for bookings
CREATE POLICY "Users can view their own bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "Users can create their own bookings" ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY "Users can update their own bookings" ON public.bookings
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for reviews
CREATE POLICY "Anyone can view reviews" ON public.reviews
  FOR SELECT USING (true);
  
CREATE POLICY "Users can create reviews" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY "Users can update their own reviews" ON public.reviews
  FOR UPDATE USING (auth.uid() = user_id);
  
CREATE POLICY "Users can delete their own reviews" ON public.reviews
  FOR DELETE USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_destinations_updated_at
  BEFORE UPDATE ON public.destinations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name');
  RETURN NEW;
END;
$$;

-- Create trigger for new user profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample data for destinations
INSERT INTO public.destinations (name, description, image_url, category, rating, duration, price, visitor_count, highlights, location) VALUES
  ('Betla National Park', 'Experience the wilderness of Jharkhand with diverse wildlife including tigers, elephants, and deer in their natural habitat.', '/src/assets/eco-tourism.jpg', 'eco', 4.8, '2-3 days', 2999.00, 15420, ARRAY['Tiger Safari', 'Watchtower Views', 'Tribal Culture'], 'Latehar District'),
  ('Jagannath Temple, Ranchi', 'A magnificent replica of the famous Puri Jagannath Temple, showcasing traditional Odishan architecture and spiritual significance.', '/src/assets/cultural-festival.jpg', 'cultural', 4.6, '4-6 hours', 0.00, 28340, ARRAY['Temple Architecture', 'Religious Significance', 'Cultural Heritage'], 'Ranchi'),
  ('Dassam Falls', 'A spectacular waterfall cascade dropping from 144 feet, perfect for nature photography and peaceful retreats.', '/src/assets/eco-tourism.jpg', 'adventure', 4.7, '1 day', 1499.00, 12680, ARRAY['Waterfall Trek', 'Photography', 'Natural Beauty'], 'Taimara Village');

-- Insert sample data for products
INSERT INTO public.products (name, description, image_url, price, category, rating, artisan_name, village, stock_quantity) VALUES
  ('Dokra Horse Figurine', 'Traditional brass figurine crafted using the ancient lost-wax technique, representing the rich tribal art of Jharkhand.', '/src/assets/handicrafts.jpg', 1299.00, 'dokra', 4.9, 'Ramesh Mahato', 'Charhi Village', 25),
  ('Handwoven Tussar Silk Saree', 'Exquisite Tussar silk saree with traditional tribal motifs, handwoven by skilled artisans.', '/src/assets/handicrafts.jpg', 3499.00, 'textiles', 4.8, 'Sunita Devi', 'Dumka', 12),
  ('Tribal Bamboo Craft Set', 'Beautiful set of bamboo crafts including baskets and decorative items, showcasing traditional weaving techniques.', '/src/assets/handicrafts.jpg', 899.00, 'bamboo', 4.7, 'Budhan Soren', 'Mayurbhanj', 18);

-- Insert sample data for events
INSERT INTO public.events (name, description, image_url, event_date, event_time, location, category, price, expected_attendees, highlights) VALUES
  ('Sohrai Festival', 'Celebrate the traditional harvest festival of tribal communities with vibrant wall paintings, folk dances, and cultural performances.', '/src/assets/cultural-festival.jpg', '2024-11-15', '10:00:00', 'Hazaribagh', 'cultural', 0.00, 500, ARRAY['Wall Art Painting', 'Folk Dance', 'Traditional Music']),
  ('Tribal Art Workshop', 'Learn traditional Warli and Gond painting techniques from master artists in an immersive cultural experience.', '/src/assets/cultural-festival.jpg', '2024-10-20', '09:00:00', 'Ranchi Cultural Center', 'workshop', 1500.00, 30, ARRAY['Hands-on Learning', 'Traditional Techniques', 'Take Home Art']),
  ('Eco-Tourism Awareness Drive', 'Join environmental experts and local communities to learn about sustainable tourism practices and conservation efforts.', '/src/assets/eco-tourism.jpg', '2024-10-25', '08:00:00', 'Betla National Park', 'educational', 500.00, 100, ARRAY['Nature Walk', 'Conservation Talk', 'Community Interaction']);