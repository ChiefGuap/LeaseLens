-- ============================================================================
-- Seed 20 new properties for Davis, CA
-- Generated to bypass RLS restrictions on the anonymous key
-- ============================================================================

DO $$ 
DECLARE
    new_prop_id bigint;
BEGIN
    INSERT INTO public.properties (name, address_normalized, location, risk_score)
    VALUES ('Aggie Square Apartments', '644 Alvarado Avenue, Davis, CA 95616', 'SRID=4326;POINT(-121.7480 38.5580)', 3.4)
    RETURNING id INTO new_prop_id;

    INSERT INTO public.violations (property_id, case_number, type, status, date) VALUES
    (new_prop_id, 'DV-2024-101', 'Plumbing/Mold', 'closed', '2024-02-14');
    INSERT INTO public.reviews (property_id, source, rating) VALUES
    (new_prop_id, 'yelp', 3.5),
    (new_prop_id, 'google', 3.8);
END $$;

DO $$ 
DECLARE
    new_prop_id bigint;
BEGIN
    INSERT INTO public.properties (name, address_normalized, location, risk_score)
    VALUES ('Almondwood Apartments', '1212 Alvarado Avenue, Davis, CA 95616', 'SRID=4326;POINT(-121.7485 38.5680)', 4.1)
    RETURNING id INTO new_prop_id;

    INSERT INTO public.violations (property_id, case_number, type, status, date) VALUES
    (new_prop_id, 'DV-2024-102', 'Pest Infestation', 'open', '2024-05-10');
    INSERT INTO public.reviews (property_id, source, rating) VALUES
    (new_prop_id, 'yelp', 4.0),
    (new_prop_id, 'google', 4.2);
END $$;

DO $$ 
DECLARE
    new_prop_id bigint;
BEGIN
    INSERT INTO public.properties (name, address_normalized, location, risk_score)
    VALUES ('Arlington Farm', '2901 Portage Bay West, Davis, CA 95616', 'SRID=4326;POINT(-121.7780 38.5530)', 2.5)
    RETURNING id INTO new_prop_id;

    INSERT INTO public.violations (property_id, case_number, type, status, date) VALUES
    (new_prop_id, 'DV-2023-103', 'Electrical Hazard', 'closed', '2023-11-22');
    INSERT INTO public.reviews (property_id, source, rating) VALUES
    (new_prop_id, 'yelp', 2.5),
    (new_prop_id, 'google', 3.1);
END $$;

DO $$ 
DECLARE
    new_prop_id bigint;
BEGIN
    INSERT INTO public.properties (name, address_normalized, location, risk_score)
    VALUES ('Aspen Village', '1111 J Street, Davis, CA 95616', 'SRID=4326;POINT(-121.7380 38.5500)', 6.8)
    RETURNING id INTO new_prop_id;

    INSERT INTO public.violations (property_id, case_number, type, status, date) VALUES
    (new_prop_id, 'DV-2024-104', 'HVAC Failure', 'closed', '2024-01-05');
    INSERT INTO public.reviews (property_id, source, rating) VALUES
    (new_prop_id, 'yelp', 3.0),
    (new_prop_id, 'google', 2.8);
END $$;

DO $$ 
DECLARE
    new_prop_id bigint;
BEGIN
    INSERT INTO public.properties (name, address_normalized, location, risk_score)
    VALUES ('Cambridge House Apartments', '619 Pole Line Road, Davis, CA 95618', 'SRID=4326;POINT(-121.7250 38.5480)', 5.4)
    RETURNING id INTO new_prop_id;

    INSERT INTO public.violations (property_id, case_number, type, status, date) VALUES
    (new_prop_id, 'DV-2024-105', 'Plumbing/Mold', 'open', '2024-08-11');
    INSERT INTO public.reviews (property_id, source, rating) VALUES
    (new_prop_id, 'yelp', 4.5),
    (new_prop_id, 'google', 4.4);
END $$;

DO $$ 
DECLARE
    new_prop_id bigint;
BEGIN
    INSERT INTO public.properties (name, address_normalized, location, risk_score)
    VALUES ('Casitas Apartments', '721 J Street, Davis, CA 95616', 'SRID=4326;POINT(-121.7385 38.5440)', 4.7)
    RETURNING id INTO new_prop_id;

    INSERT INTO public.violations (property_id, case_number, type, status, date) VALUES
    (new_prop_id, 'DV-2023-106', 'Fire Safety Violation', 'closed', '2023-03-12');
    INSERT INTO public.reviews (property_id, source, rating) VALUES
    (new_prop_id, 'yelp', 3.5),
    (new_prop_id, 'google', 3.6);
END $$;

DO $$ 
DECLARE
    new_prop_id bigint;
BEGIN
    INSERT INTO public.properties (name, address_normalized, location, risk_score)
    VALUES ('Chaparral Apartments', '2680 Sycamore Lane, Davis, CA 95616', 'SRID=4326;POINT(-121.7580 38.5700)', 3.2)
    RETURNING id INTO new_prop_id;

    INSERT INTO public.violations (property_id, case_number, type, status, date) VALUES
    (new_prop_id, 'DV-2024-107', 'Electrical Hazard', 'closed', '2024-04-18');
    INSERT INTO public.reviews (property_id, source, rating) VALUES
    (new_prop_id, 'yelp', 4.0),
    (new_prop_id, 'google', 4.1);
END $$;

DO $$ 
DECLARE
    new_prop_id bigint;
BEGIN
    INSERT INTO public.properties (name, address_normalized, location, risk_score)
    VALUES ('Chautauqua Apartments', '717 Alvarado Avenue, Davis, CA 95616', 'SRID=4326;POINT(-121.7482 38.5590)', 2.9)
    RETURNING id INTO new_prop_id;

    INSERT INTO public.violations (property_id, case_number, type, status, date) VALUES
    (new_prop_id, 'DV-2023-108', 'Structural Damage', 'closed', '2023-09-09');
    INSERT INTO public.reviews (property_id, source, rating) VALUES
    (new_prop_id, 'yelp', 3.5),
    (new_prop_id, 'google', 3.7);
END $$;

DO $$ 
DECLARE
    new_prop_id bigint;
BEGIN
    INSERT INTO public.properties (name, address_normalized, location, risk_score)
    VALUES ('Cranbrook Apartments', '2600 Sycamore Lane, Davis, CA 95616', 'SRID=4326;POINT(-121.7585 38.5680)', 5.1)
    RETURNING id INTO new_prop_id;

    INSERT INTO public.violations (property_id, case_number, type, status, date) VALUES
    (new_prop_id, 'DV-2024-109', 'Plumbing/Mold', 'open', '2024-07-25');
    INSERT INTO public.reviews (property_id, source, rating) VALUES
    (new_prop_id, 'yelp', 3.0),
    (new_prop_id, 'google', 3.3);
END $$;

DO $$ 
DECLARE
    new_prop_id bigint;
BEGIN
    INSERT INTO public.properties (name, address_normalized, location, risk_score)
    VALUES ('The Drake Apartments', '280 W 8th Street, Davis, CA 95616', 'SRID=4326;POINT(-121.7460 38.5460)', 6.3)
    RETURNING id INTO new_prop_id;

    INSERT INTO public.violations (property_id, case_number, type, status, date) VALUES
    (new_prop_id, 'DV-2024-110', 'Pest Infestation', 'closed', '2024-02-28');
    INSERT INTO public.reviews (property_id, source, rating) VALUES
    (new_prop_id, 'yelp', 4.0),
    (new_prop_id, 'google', 4.3);
END $$;

DO $$ 
DECLARE
    new_prop_id bigint;
BEGIN
    INSERT INTO public.properties (name, address_normalized, location, risk_score)
    VALUES ('Fountain Circle Townhomes', '1213 Alhambra Drive, Davis, CA 95616', 'SRID=4326;POINT(-121.7180 38.5520)', 4.8)
    RETURNING id INTO new_prop_id;

    INSERT INTO public.violations (property_id, case_number, type, status, date) VALUES
    (new_prop_id, 'DV-2023-111', 'HVAC Failure', 'closed', '2023-10-14');
    INSERT INTO public.reviews (property_id, source, rating) VALUES
    (new_prop_id, 'yelp', 4.5),
    (new_prop_id, 'google', 4.6);
END $$;

DO $$ 
DECLARE
    new_prop_id bigint;
BEGIN
    INSERT INTO public.properties (name, address_normalized, location, risk_score)
    VALUES ('Glacier Point Apartments', '1225 F Street, Davis, CA 95616', 'SRID=4326;POINT(-121.7440 38.5520)', 3.7)
    RETURNING id INTO new_prop_id;

    INSERT INTO public.violations (property_id, case_number, type, status, date) VALUES
    (new_prop_id, 'DV-2024-112', 'Fire Safety Violation', 'open', '2024-06-03');
    INSERT INTO public.reviews (property_id, source, rating) VALUES
    (new_prop_id, 'yelp', 3.5),
    (new_prop_id, 'google', 3.4);
END $$;

DO $$ 
DECLARE
    new_prop_id bigint;
BEGIN
    INSERT INTO public.properties (name, address_normalized, location, risk_score)
    VALUES ('Greystone Apartments', '2505 5th Street, Davis, CA 95618', 'SRID=4326;POINT(-121.7200 38.5440)', 7.5)
    RETURNING id INTO new_prop_id;

    INSERT INTO public.violations (property_id, case_number, type, status, date) VALUES
    (new_prop_id, 'DV-2024-113', 'Plumbing/Mold', 'closed', '2024-01-19');
    INSERT INTO public.reviews (property_id, source, rating) VALUES
    (new_prop_id, 'yelp', 4.0),
    (new_prop_id, 'google', 4.2);
END $$;

DO $$ 
DECLARE
    new_prop_id bigint;
BEGIN
    INSERT INTO public.properties (name, address_normalized, location, risk_score)
    VALUES ('Parkside Apartments', '1420 F Street, Davis, CA 95616', 'SRID=4326;POINT(-121.7445 38.5550)', 4.2)
    RETURNING id INTO new_prop_id;

    INSERT INTO public.violations (property_id, case_number, type, status, date) VALUES
    (new_prop_id, 'DV-2023-114', 'Structural Damage', 'closed', '2023-12-01');
    INSERT INTO public.reviews (property_id, source, rating) VALUES
    (new_prop_id, 'yelp', 3.0),
    (new_prop_id, 'google', 3.5);
END $$;

DO $$ 
DECLARE
    new_prop_id bigint;
BEGIN
    INSERT INTO public.properties (name, address_normalized, location, risk_score)
    VALUES ('Silver Bow Apartments', '1215 J Street, Davis, CA 95616', 'SRID=4326;POINT(-121.7380 38.5520)', 5.9)
    RETURNING id INTO new_prop_id;

    INSERT INTO public.violations (property_id, case_number, type, status, date) VALUES
    (new_prop_id, 'DV-2024-115', 'Electrical Hazard', 'open', '2024-08-30');
    INSERT INTO public.reviews (property_id, source, rating) VALUES
    (new_prop_id, 'yelp', 2.5),
    (new_prop_id, 'google', 2.9);
END $$;

DO $$ 
DECLARE
    new_prop_id bigint;
BEGIN
    INSERT INTO public.properties (name, address_normalized, location, risk_score)
    VALUES ('Stonegate Village', '650 Drake Drive, Davis, CA 95616', 'SRID=4326;POINT(-121.7700 38.5350)', 2.1)
    RETURNING id INTO new_prop_id;

    INSERT INTO public.violations (property_id, case_number, type, status, date) VALUES
    (new_prop_id, 'DV-2023-116', 'Pest Infestation', 'closed', '2023-11-15');
    INSERT INTO public.reviews (property_id, source, rating) VALUES
    (new_prop_id, 'yelp', 4.5),
    (new_prop_id, 'google', 4.7);
END $$;

DO $$ 
DECLARE
    new_prop_id bigint;
BEGIN
    INSERT INTO public.properties (name, address_normalized, location, risk_score)
    VALUES ('Sycamore Lane Apartments', '660 Sycamore Lane, Davis, CA 95616', 'SRID=4326;POINT(-121.7485 38.5385)', 6.5)
    RETURNING id INTO new_prop_id;

    INSERT INTO public.violations (property_id, case_number, type, status, date) VALUES
    (new_prop_id, 'DV-2024-117', 'HVAC Failure', 'closed', '2024-03-22');
    INSERT INTO public.reviews (property_id, source, rating) VALUES
    (new_prop_id, 'yelp', 3.5),
    (new_prop_id, 'google', 3.8);
END $$;

DO $$ 
DECLARE
    new_prop_id bigint;
BEGIN
    INSERT INTO public.properties (name, address_normalized, location, risk_score)
    VALUES ('Tanglewood Apartments', '1880 Cowell Boulevard, Davis, CA 95618', 'SRID=4326;POINT(-121.7140 38.5330)', 3.8)
    RETURNING id INTO new_prop_id;

    INSERT INTO public.violations (property_id, case_number, type, status, date) VALUES
    (new_prop_id, 'DV-2024-118', 'Plumbing/Mold', 'open', '2024-05-18');
    INSERT INTO public.reviews (property_id, source, rating) VALUES
    (new_prop_id, 'yelp', 4.0),
    (new_prop_id, 'google', 4.1);
END $$;

DO $$ 
DECLARE
    new_prop_id bigint;
BEGIN
    INSERT INTO public.properties (name, address_normalized, location, risk_score)
    VALUES ('The Spoke', '711 Sycamore Lane, Davis, CA 95616', 'SRID=4326;POINT(-121.7485 38.5410)', 8.0)
    RETURNING id INTO new_prop_id;

    INSERT INTO public.violations (property_id, case_number, type, status, date) VALUES
    (new_prop_id, 'DV-2023-119', 'Fire Safety Violation', 'closed', '2023-08-08');
    INSERT INTO public.reviews (property_id, source, rating) VALUES
    (new_prop_id, 'yelp', 2.0),
    (new_prop_id, 'google', 2.2);
END $$;

DO $$ 
DECLARE
    new_prop_id bigint;
BEGIN
    INSERT INTO public.properties (name, address_normalized, location, risk_score)
    VALUES ('University Court', '415 East 11th Street, Davis, CA 95616', 'SRID=4326;POINT(-121.7410 38.5490)', 4.5)
    RETURNING id INTO new_prop_id;

    INSERT INTO public.violations (property_id, case_number, type, status, date) VALUES
    (new_prop_id, 'DV-2024-120', 'Pest Infestation', 'closed', '2024-04-11');
    INSERT INTO public.reviews (property_id, source, rating) VALUES
    (new_prop_id, 'yelp', 3.5),
    (new_prop_id, 'google', 3.6);
END $$;
