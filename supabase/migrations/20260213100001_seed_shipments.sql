-- Seed test shipment data
-- These shipments are NOT tied to a specific user_id so any authenticated user can see them via tracking search.
-- We'll also leave user_id NULL so they show up as "demo" data.

INSERT INTO shipments (tracking_number, bol_number, status, origin, destination, pickup_date, delivery_date, estimated_arrival, equipment_type, weight, commodity, carrier_name, shipper_name, notes) VALUES

-- 1. Delivered shipment
('FBS-2026-001', 'BOL-88401', 'delivered', 'Chicago, IL 60601', 'Dallas, TX 75201',
 '2026-02-01 08:00:00+00', '2026-02-03 14:30:00+00', '2026-02-03 14:30:00+00',
 'dry_van', 42000, 'Electronics', 'Swift Transport LLC', 'TechCorp Industries',
 'Delivered on time. Signed by warehouse manager.'),

-- 2. In transit
('FBS-2026-002', 'BOL-88402', 'in_transit', 'Atlanta, GA 30301', 'Miami, FL 33101',
 '2026-02-12 06:00:00+00', NULL, '2026-02-14 18:00:00+00',
 'reefer', 38000, 'Frozen Produce', 'ColdChain Logistics', 'FreshFarms Co',
 'Temperature controlled at -10°F. Driver checked in at Jacksonville, FL.'),

-- 3. Picked up
('FBS-2026-003', 'BOL-88403', 'picked_up', 'Los Angeles, CA 90001', 'Phoenix, AZ 85001',
 '2026-02-13 07:00:00+00', NULL, '2026-02-14 12:00:00+00',
 'flatbed', 55000, 'Steel Beams', 'HeavyHaul Inc', 'BuildRight Materials',
 'Oversized load. Escort vehicle required on I-10.'),

-- 4. Pending
('FBS-2026-004', 'BOL-88404', 'pending', 'Houston, TX 77001', 'New Orleans, LA 70112',
 '2026-02-15 09:00:00+00', NULL, '2026-02-16 15:00:00+00',
 'dry_van', 30000, 'Auto Parts', 'Lone Star Freight', 'AutoZone Distribution',
 'Awaiting carrier confirmation.'),

-- 5. Delayed
('FBS-2026-005', 'BOL-88405', 'delayed', 'Denver, CO 80201', 'Salt Lake City, UT 84101',
 '2026-02-10 10:00:00+00', NULL, '2026-02-13 20:00:00+00',
 'reefer', 35000, 'Dairy Products', 'Mountain Express', 'DairyFresh LLC',
 'Delayed due to winter storm on I-70. New ETA pending.'),

-- 6. Delivered
('FBS-2026-006', 'BOL-88406', 'delivered', 'Seattle, WA 98101', 'Portland, OR 97201',
 '2026-01-28 11:00:00+00', '2026-01-28 18:00:00+00', '2026-01-28 18:00:00+00',
 'dry_van', 22000, 'Retail Goods', 'Pacific Carriers', 'Amazon Fulfillment',
 'Same-day delivery completed.'),

-- 7. In transit
('FBS-2026-007', 'BOL-88407', 'in_transit', 'Nashville, TN 37201', 'Charlotte, NC 28201',
 '2026-02-12 14:00:00+00', NULL, '2026-02-13 22:00:00+00',
 'step_deck', 48000, 'Construction Equipment', 'Volunteer Trucking', 'CatBuilders Inc',
 'Heavy machinery — forklift required at destination.'),

-- 8. Cancelled
('FBS-2026-008', 'BOL-88408', 'cancelled', 'New York, NY 10001', 'Boston, MA 02101',
 '2026-02-14 06:00:00+00', NULL, NULL,
 'dry_van', 18000, 'Office Furniture', 'Northeast Haulers', 'WeWork Logistics',
 'Cancelled by shipper — order postponed.'),

-- 9. Delivered
('FBS-2026-009', 'BOL-88409', 'delivered', 'San Francisco, CA 94101', 'Las Vegas, NV 89101',
 '2026-02-05 08:00:00+00', '2026-02-06 16:00:00+00', '2026-02-06 16:00:00+00',
 'flatbed', 60000, 'Solar Panels', 'SunRoute Transport', 'SolarCity West',
 'Fragile cargo. No stacking.'),

-- 10. Pending
('FBS-2026-010', 'BOL-88410', 'pending', 'Minneapolis, MN 55401', 'Milwaukee, WI 53201',
 '2026-02-16 07:00:00+00', NULL, '2026-02-16 14:00:00+00',
 'reefer', 28000, 'Pharmaceuticals', 'MedTrans Corp', 'Pfizer Distribution',
 'Temperature sensitive — maintain 36-46°F.');

