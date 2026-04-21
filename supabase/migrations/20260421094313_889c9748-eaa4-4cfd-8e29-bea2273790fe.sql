-- =========================================================================
-- 1) ENUM des rôles
-- =========================================================================
CREATE TYPE public.app_role AS ENUM ('owner', 'admin', 'staff');

CREATE TYPE public.reservation_status AS ENUM ('pending', 'confirmed', 'declined', 'cancelled', 'completed');
CREATE TYPE public.order_status AS ENUM ('received', 'preparing', 'ready', 'collected', 'cancelled');

-- =========================================================================
-- 2) Fonction utilitaire updated_at
-- =========================================================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- =========================================================================
-- 3) Profiles
-- =========================================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER trg_profiles_updated
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================================================
-- 4) User roles + has_role + is_staff
-- =========================================================================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

-- True if user is owner / admin / staff (back-office access)
CREATE OR REPLACE FUNCTION public.is_team(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('owner','admin','staff')
  );
$$;

-- True if user can manage (owner / admin)
CREATE OR REPLACE FUNCTION public.is_manager(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('owner','admin')
  );
$$;

-- =========================================================================
-- 5) Trigger d'auto-création du profil + rôle (owner pour le 1er user)
-- =========================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_count INT;
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));

  SELECT COUNT(*) INTO user_count FROM auth.users;
  IF user_count = 1 THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'owner');
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Profiles RLS
CREATE POLICY "Profiles viewable by team"
ON public.profiles FOR SELECT
USING (public.is_team(auth.uid()) OR auth.uid() = id);

CREATE POLICY "Users update own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Managers can delete profiles"
ON public.profiles FOR DELETE
USING (public.is_manager(auth.uid()));

-- User roles RLS
CREATE POLICY "Team can view roles"
ON public.user_roles FOR SELECT
USING (public.is_team(auth.uid()));

CREATE POLICY "Managers can insert roles"
ON public.user_roles FOR INSERT
WITH CHECK (public.is_manager(auth.uid()));

CREATE POLICY "Managers can delete roles"
ON public.user_roles FOR DELETE
USING (public.is_manager(auth.uid()));

-- =========================================================================
-- 6) Categories
-- =========================================================================
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER trg_categories_updated
BEFORE UPDATE ON public.categories
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE POLICY "Categories public read"
ON public.categories FOR SELECT USING (true);

CREATE POLICY "Managers manage categories - insert"
ON public.categories FOR INSERT
WITH CHECK (public.is_manager(auth.uid()));

CREATE POLICY "Managers manage categories - update"
ON public.categories FOR UPDATE
USING (public.is_manager(auth.uid()));

CREATE POLICY "Managers manage categories - delete"
ON public.categories FOR DELETE
USING (public.is_manager(auth.uid()));

-- =========================================================================
-- 7) Menu items
-- =========================================================================
CREATE TABLE public.menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  image_url TEXT,
  available BOOLEAN NOT NULL DEFAULT true,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_menu_items_category ON public.menu_items(category_id);

CREATE TRIGGER trg_menu_items_updated
BEFORE UPDATE ON public.menu_items
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE POLICY "Menu items public read"
ON public.menu_items FOR SELECT USING (true);

CREATE POLICY "Managers manage menu - insert"
ON public.menu_items FOR INSERT
WITH CHECK (public.is_manager(auth.uid()));

CREATE POLICY "Managers manage menu - update"
ON public.menu_items FOR UPDATE
USING (public.is_manager(auth.uid()));

CREATE POLICY "Managers manage menu - delete"
ON public.menu_items FOR DELETE
USING (public.is_manager(auth.uid()));

-- =========================================================================
-- 8) Reservations
-- =========================================================================
CREATE TABLE public.reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  reservation_date DATE NOT NULL,
  reservation_time TIME NOT NULL,
  guests INT NOT NULL CHECK (guests > 0 AND guests <= 30),
  note TEXT,
  status public.reservation_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_reservations_date ON public.reservations(reservation_date);
CREATE INDEX idx_reservations_status ON public.reservations(status);

CREATE TRIGGER trg_reservations_updated
BEFORE UPDATE ON public.reservations
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Public peut créer une demande
CREATE POLICY "Anyone can create a reservation"
ON public.reservations FOR INSERT
WITH CHECK (true);

CREATE POLICY "Team can view reservations"
ON public.reservations FOR SELECT
USING (public.is_team(auth.uid()));

CREATE POLICY "Team can update reservations"
ON public.reservations FOR UPDATE
USING (public.is_team(auth.uid()));

CREATE POLICY "Managers can delete reservations"
ON public.reservations FOR DELETE
USING (public.is_manager(auth.uid()));

-- =========================================================================
-- 9) Orders + Order items
-- =========================================================================
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  pickup_at TIMESTAMPTZ NOT NULL,
  total NUMERIC(10,2) NOT NULL CHECK (total >= 0),
  status public.order_status NOT NULL DEFAULT 'received',
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_orders_pickup ON public.orders(pickup_at);
CREATE INDEX idx_orders_status ON public.orders(status);

CREATE TRIGGER trg_orders_updated
BEFORE UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  menu_item_id UUID REFERENCES public.menu_items(id) ON DELETE SET NULL,
  item_name TEXT NOT NULL,
  unit_price NUMERIC(10,2) NOT NULL,
  quantity INT NOT NULL CHECK (quantity > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_order_items_order ON public.order_items(order_id);

-- Public crée commande + items
CREATE POLICY "Anyone can create an order"
ON public.orders FOR INSERT WITH CHECK (true);

CREATE POLICY "Team can view orders"
ON public.orders FOR SELECT USING (public.is_team(auth.uid()));

CREATE POLICY "Team can update orders"
ON public.orders FOR UPDATE USING (public.is_team(auth.uid()));

CREATE POLICY "Managers can delete orders"
ON public.orders FOR DELETE USING (public.is_manager(auth.uid()));

CREATE POLICY "Anyone can create order items"
ON public.order_items FOR INSERT WITH CHECK (true);

CREATE POLICY "Team can view order items"
ON public.order_items FOR SELECT USING (public.is_team(auth.uid()));

CREATE POLICY "Managers can delete order items"
ON public.order_items FOR DELETE USING (public.is_manager(auth.uid()));

-- =========================================================================
-- 10) Opening hours
-- =========================================================================
CREATE TABLE public.opening_hours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0 = dimanche
  is_closed BOOLEAN NOT NULL DEFAULT false,
  lunch_open TIME,
  lunch_close TIME,
  dinner_open TIME,
  dinner_close TIME,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (day_of_week)
);
ALTER TABLE public.opening_hours ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER trg_opening_hours_updated
BEFORE UPDATE ON public.opening_hours
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE POLICY "Opening hours public read"
ON public.opening_hours FOR SELECT USING (true);

CREATE POLICY "Managers manage hours - insert"
ON public.opening_hours FOR INSERT WITH CHECK (public.is_manager(auth.uid()));

CREATE POLICY "Managers manage hours - update"
ON public.opening_hours FOR UPDATE USING (public.is_manager(auth.uid()));

CREATE POLICY "Managers manage hours - delete"
ON public.opening_hours FOR DELETE USING (public.is_manager(auth.uid()));

-- =========================================================================
-- 11) Closed dates (fermetures exceptionnelles)
-- =========================================================================
CREATE TABLE public.closed_dates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL UNIQUE,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.closed_dates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Closed dates public read"
ON public.closed_dates FOR SELECT USING (true);

CREATE POLICY "Managers manage closed dates - insert"
ON public.closed_dates FOR INSERT WITH CHECK (public.is_manager(auth.uid()));

CREATE POLICY "Managers manage closed dates - update"
ON public.closed_dates FOR UPDATE USING (public.is_manager(auth.uid()));

CREATE POLICY "Managers manage closed dates - delete"
ON public.closed_dates FOR DELETE USING (public.is_manager(auth.uid()));

-- =========================================================================
-- 12) Storage bucket pour photos plats
-- =========================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('menu-photos', 'menu-photos', true);

CREATE POLICY "Menu photos public read"
ON storage.objects FOR SELECT
USING (bucket_id = 'menu-photos');

CREATE POLICY "Managers can upload menu photos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'menu-photos' AND public.is_manager(auth.uid()));

CREATE POLICY "Managers can update menu photos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'menu-photos' AND public.is_manager(auth.uid()));

CREATE POLICY "Managers can delete menu photos"
ON storage.objects FOR DELETE
USING (bucket_id = 'menu-photos' AND public.is_manager(auth.uid()));

-- =========================================================================
-- 13) Seed initial : catégories + horaires par défaut
-- =========================================================================
INSERT INTO public.categories (slug, label, display_order) VALUES
  ('entree',  'Entrées',           1),
  ('viande',  'Viandes maturées',  2),
  ('pates',   'Pâtes fraîches',    3),
  ('burger',  'Burgers signature', 4),
  ('dessert', 'Desserts',          5);

-- Lun-Sam midi+soir, dimanche fermé (modifiable dans l'admin)
INSERT INTO public.opening_hours (day_of_week, is_closed, lunch_open, lunch_close, dinner_open, dinner_close) VALUES
  (0, true,  NULL,    NULL,    NULL,    NULL),
  (1, false, '12:00', '14:00', '19:00', '22:00'),
  (2, false, '12:00', '14:00', '19:00', '22:00'),
  (3, false, '12:00', '14:00', '19:00', '22:00'),
  (4, false, '12:00', '14:00', '19:00', '22:30'),
  (5, false, '12:00', '14:00', '19:00', '23:00'),
  (6, false, '12:00', '14:30', '19:00', '23:00');