import json
from seed_properties import PROPERTIES, VIOLATIONS, REVIEWS

# The first 10 are already in the DB as verified. We just insert the remaining 20.
new_props = PROPERTIES[10:]

sql = ["-- ============================================================================",
       "-- Seed 20 new properties for Davis, CA",
       "-- Generated to bypass RLS restrictions on the anonymous key",
       "-- ============================================================================\n"]

for p in new_props:
    name = p["name"].replace("'", "''")
    addr = p["address_normalized"].replace("'", "''")
    loc = p["location"]
    risk = p["risk_score"]
    
    sql.append(f"""DO $$ 
DECLARE
    new_prop_id bigint;
BEGIN
    INSERT INTO public.properties (name, address_normalized, location, risk_score)
    VALUES ('{name}', '{addr}', '{loc}', {risk})
    RETURNING id INTO new_prop_id;
""")
    
    vs = VIOLATIONS.get(p["name"], [])
    if vs:
        v_vals = []
        for v in vs:
            case_num = v["case_number"].replace("'", "''")
            vtype = v["type"].replace("'", "''")
            status = v["status"].replace("'", "''")
            date = v["date"]
            v_vals.append(f"    (new_prop_id, '{case_num}', '{vtype}', '{status}', '{date}')")
        sql.append(f"    INSERT INTO public.violations (property_id, case_number, type, status, date) VALUES\n" + ",\n".join(v_vals) + ";")
    
    rs = REVIEWS.get(p["name"], [])
    if rs:
        r_vals = []
        for r in rs:
            source = r["source"].replace("'", "''")
            rating = r["rating"]
            r_vals.append(f"    (new_prop_id, '{source}', {rating})")
        sql.append(f"    INSERT INTO public.reviews (property_id, source, rating) VALUES\n" + ",\n".join(r_vals) + ";")
        
    sql.append("END $$;\n")

with open("seed_new_properties.sql", "w") as f:
    f.write("\n".join(sql))

print("Generated seed_new_properties.sql")
