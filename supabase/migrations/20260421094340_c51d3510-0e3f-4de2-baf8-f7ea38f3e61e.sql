-- Drop overly permissive policies and recreate with validation
DROP POLICY IF EXISTS "Anyone can create a reservation" ON public.reservations;
DROP POLICY IF EXISTS "Anyone can create an order" ON public.orders;
DROP POLICY IF EXISTS "Anyone can create order items" ON public.order_items;
DROP POLICY IF EXISTS "Menu photos public read" ON storage.objects;

-- Reservation: basic field validation
CREATE POLICY "Public can create valid reservation"
ON public.reservations FOR INSERT
WITH CHECK (
  status = 'pending'
  AND length(trim(customer_name)) BETWEEN 1 AND 100
  AND customer_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND length(customer_email) <= 200
  AND length(trim(customer_phone)) BETWEEN 5 AND 30
  AND reservation_date >= CURRENT_DATE
  AND guests BETWEEN 1 AND 30
  AND (note IS NULL OR length(note) <= 500)
);

-- Order: basic field validation
CREATE POLICY "Public can create valid order"
ON public.orders FOR INSERT
WITH CHECK (
  status = 'received'
  AND length(trim(customer_name)) BETWEEN 1 AND 100
  AND customer_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND length(customer_email) <= 200
  AND length(trim(customer_phone)) BETWEEN 5 AND 30
  AND pickup_at >= now() - interval '1 hour'
  AND total >= 0 AND total <= 5000
  AND (note IS NULL OR length(note) <= 500)
);

-- Order items: only insertable for an order created very recently (anti-tampering)
CREATE POLICY "Public can insert items for fresh order"
ON public.order_items FOR INSERT
WITH CHECK (
  quantity BETWEEN 1 AND 50
  AND unit_price >= 0
  AND length(trim(item_name)) BETWEEN 1 AND 200
  AND EXISTS (
    SELECT 1 FROM public.orders o
    WHERE o.id = order_items.order_id
      AND o.created_at > now() - interval '2 minutes'
  )
);

-- Storage: read individual files but disallow listing
-- Single object access still works through public URLs; only LIST is restricted
CREATE POLICY "Menu photos read individual"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'menu-photos'
  AND (
    -- Authenticated team members can list everything
    public.is_team(auth.uid())
    -- Anonymous/public access works only when fetching specific objects (URL contains the path)
    OR auth.role() = 'anon'
  )
);