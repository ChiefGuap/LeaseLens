"""
seed_properties.py — Seed Supabase with real Davis, CA apartment complexes.

Inserts ~10 well-known student-housing properties into the `properties` table,
along with sample violations and reviews, so the mobile app has data to display.

Usage:
    python seed_properties.py
"""

import json
import os
import sys
import urllib.request
import urllib.error
import ssl

ssl._create_default_https_context = ssl._create_unverified_context

# ── Supabase config ─────────────────────────────────────────────────────────────
SUPABASE_URL = os.environ.get(
    "SUPABASE_URL",
    "https://rwxvntnqrnqvasubpqys.supabase.co"
)
SUPABASE_KEY = os.environ.get(
    "SUPABASE_SERVICE_KEY",
    os.environ.get(
        "SUPABASE_ANON_KEY",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3eHZudG5xcm5xdmFzdWJwcXlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1NTY5NTMsImV4cCI6MjA4NzEzMjk1M30.RhlrETQdhwPsDzTI1JOYI7BKYgYhM6JVSx34eeXbiRY"
    )
)

API = f"{SUPABASE_URL}/rest/v1"
HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation",
}


def post(table: str, rows: list[dict]) -> list[dict]:
    """POST rows to a Supabase table and return the inserted records."""
    url = f"{API}/{table}"
    data = json.dumps(rows).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers=HEADERS, method="POST")
    try:
        with urllib.request.urlopen(req) as resp:
            body = json.loads(resp.read().decode("utf-8"))
            return body
    except urllib.error.HTTPError as e:
        error_body = e.read().decode("utf-8")
        print(f"  ✗ Error inserting into {table}: {e.code} {error_body}")
        sys.exit(1)


def rpc(fn_name: str, params: dict) -> dict:
    """Call a Supabase RPC function."""
    url = f"{SUPABASE_URL}/rest/v1/rpc/{fn_name}"
    data = json.dumps(params).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers=HEADERS, method="POST")
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        error_body = e.read().decode("utf-8")
        print(f"  ✗ RPC {fn_name} error: {e.code} {error_body}")
        return {}


# ── Seed data ────────────────────────────────────────────────────────────────────
# Real Davis, CA apartment complexes with actual coordinates
PROPERTIES = [
    {
        "name": "West Village",
        "address_normalized": "200 Sage Street, Davis, CA 95616",
        "location": "SRID=4326;POINT(-121.7837 38.5450)",
        "risk_score": 7.2,
    },
    {
        "name": "The Colleges at La Rue",
        "address_normalized": "175 La Rue Road, Davis, CA 95616",
        "location": "SRID=4326;POINT(-121.7683 38.5484)",
        "risk_score": 3.5,
    },
    {
        "name": "Primero Grove",
        "address_normalized": "1 Primero Grove Circle, Davis, CA 95616",
        "location": "SRID=4326;POINT(-121.7561 38.5452)",
        "risk_score": 2.1,
    },
    {
        "name": "The Green at West Village",
        "address_normalized": "1010 Dairy Road, Davis, CA 95616",
        "location": "SRID=4326;POINT(-121.7810 38.5418)",
        "risk_score": 5.8,
    },
    {
        "name": "Tandem Properties",
        "address_normalized": "117 D Street, Davis, CA 95616",
        "location": "SRID=4326;POINT(-121.7418 38.5443)",
        "risk_score": 8.4,
    },
    {
        "name": "The Arbors",
        "address_normalized": "1280 Olive Drive, Davis, CA 95616",
        "location": "SRID=4326;POINT(-121.7555 38.5337)",
        "risk_score": 6.1,
    },
    {
        "name": "The Lexington",
        "address_normalized": "401 Anderson Road, Davis, CA 95616",
        "location": "SRID=4326;POINT(-121.7351 38.5508)",
        "risk_score": 4.3,
    },
    {
        "name": "Pine Hall",
        "address_normalized": "600 Sycamore Lane, Davis, CA 95616",
        "location": "SRID=4326;POINT(-121.7487 38.5375)",
        "risk_score": 2.8,
    },
    {
        "name": "J Street Apartments",
        "address_normalized": "220 J Street, Davis, CA 95616",
        "location": "SRID=4326;POINT(-121.7389 38.5426)",
        "risk_score": 9.1,
    },
    {
        "name": "Russell Park",
        "address_normalized": "850 Russell Boulevard, Davis, CA 95616",
        "location": "SRID=4326;POINT(-121.7600 38.5465)",
        "risk_score": 5.0,
    },
    {
        "name": "Aggie Square Apartments",
        "address_normalized": "644 Alvarado Avenue, Davis, CA 95616",
        "location": "SRID=4326;POINT(-121.7480 38.5580)",
        "risk_score": 3.4,
    },
    {
        "name": "Almondwood Apartments",
        "address_normalized": "1212 Alvarado Avenue, Davis, CA 95616",
        "location": "SRID=4326;POINT(-121.7485 38.5680)",
        "risk_score": 4.1,
    },
    {
        "name": "Arlington Farm",
        "address_normalized": "2901 Portage Bay West, Davis, CA 95616",
        "location": "SRID=4326;POINT(-121.7780 38.5530)",
        "risk_score": 2.5,
    },
    {
        "name": "Aspen Village",
        "address_normalized": "1111 J Street, Davis, CA 95616",
        "location": "SRID=4326;POINT(-121.7380 38.5500)",
        "risk_score": 6.8,
    },
    {
        "name": "Cambridge House Apartments",
        "address_normalized": "619 Pole Line Road, Davis, CA 95618",
        "location": "SRID=4326;POINT(-121.7250 38.5480)",
        "risk_score": 5.4,
    },
    {
        "name": "Casitas Apartments",
        "address_normalized": "721 J Street, Davis, CA 95616",
        "location": "SRID=4326;POINT(-121.7385 38.5440)",
        "risk_score": 4.7,
    },
    {
        "name": "Chaparral Apartments",
        "address_normalized": "2680 Sycamore Lane, Davis, CA 95616",
        "location": "SRID=4326;POINT(-121.7580 38.5700)",
        "risk_score": 3.2,
    },
    {
        "name": "Chautauqua Apartments",
        "address_normalized": "717 Alvarado Avenue, Davis, CA 95616",
        "location": "SRID=4326;POINT(-121.7482 38.5590)",
        "risk_score": 2.9,
    },
    {
        "name": "Cranbrook Apartments",
        "address_normalized": "2600 Sycamore Lane, Davis, CA 95616",
        "location": "SRID=4326;POINT(-121.7585 38.5680)",
        "risk_score": 5.1,
    },
    {
        "name": "The Drake Apartments",
        "address_normalized": "280 W 8th Street, Davis, CA 95616",
        "location": "SRID=4326;POINT(-121.7460 38.5460)",
        "risk_score": 6.3,
    },
    {
        "name": "Fountain Circle Townhomes",
        "address_normalized": "1213 Alhambra Drive, Davis, CA 95616",
        "location": "SRID=4326;POINT(-121.7180 38.5520)",
        "risk_score": 4.8,
    },
    {
        "name": "Glacier Point Apartments",
        "address_normalized": "1225 F Street, Davis, CA 95616",
        "location": "SRID=4326;POINT(-121.7440 38.5520)",
        "risk_score": 3.7,
    },
    {
        "name": "Greystone Apartments",
        "address_normalized": "2505 5th Street, Davis, CA 95618",
        "location": "SRID=4326;POINT(-121.7200 38.5440)",
        "risk_score": 7.5,
    },
    {
        "name": "Parkside Apartments",
        "address_normalized": "1420 F Street, Davis, CA 95616",
        "location": "SRID=4326;POINT(-121.7445 38.5550)",
        "risk_score": 4.2,
    },
    {
        "name": "Silver Bow Apartments",
        "address_normalized": "1215 J Street, Davis, CA 95616",
        "location": "SRID=4326;POINT(-121.7380 38.5520)",
        "risk_score": 5.9,
    },
    {
        "name": "Stonegate Village",
        "address_normalized": "650 Drake Drive, Davis, CA 95616",
        "location": "SRID=4326;POINT(-121.7700 38.5350)",
        "risk_score": 2.1,
    },
    {
        "name": "Sycamore Lane Apartments",
        "address_normalized": "660 Sycamore Lane, Davis, CA 95616",
        "location": "SRID=4326;POINT(-121.7485 38.5385)",
        "risk_score": 6.5,
    },
    {
        "name": "Tanglewood Apartments",
        "address_normalized": "1880 Cowell Boulevard, Davis, CA 95618",
        "location": "SRID=4326;POINT(-121.7140 38.5330)",
        "risk_score": 3.8,
    },
    {
        "name": "The Spoke",
        "address_normalized": "711 Sycamore Lane, Davis, CA 95616",
        "location": "SRID=4326;POINT(-121.7485 38.5410)",
        "risk_score": 8.0,
    },
    {
        "name": "University Court",
        "address_normalized": "415 East 11th Street, Davis, CA 95616",
        "location": "SRID=4326;POINT(-121.7410 38.5490)",
        "risk_score": 4.5,
    },
]

# Violations keyed by property name
VIOLATIONS: dict[str, list[dict]] = {
    "West Village": [
        {"case_number": "DV-2024-001", "type": "Plumbing/Mold", "status": "closed", "date": "2024-01-15"},
        {"case_number": "DV-2024-012", "type": "Electrical Hazard", "status": "open", "date": "2024-06-22"},
        {"case_number": "DV-2023-045", "type": "Fire Safety Violation", "status": "closed", "date": "2023-09-10"},
    ],
    "Tandem Properties": [
        {"case_number": "DV-2024-003", "type": "Pest Infestation", "status": "open", "date": "2024-03-08"},
        {"case_number": "DV-2023-067", "type": "Structural Damage", "status": "closed", "date": "2023-11-20"},
        {"case_number": "DV-2024-018", "type": "Plumbing/Mold", "status": "open", "date": "2024-07-14"},
        {"case_number": "DV-2023-089", "type": "HVAC Failure", "status": "closed", "date": "2023-05-03"},
    ],
    "J Street Apartments": [
        {"case_number": "DV-2024-005", "type": "Plumbing/Mold", "status": "open", "date": "2024-02-10"},
        {"case_number": "DV-2024-019", "type": "Pest Infestation", "status": "open", "date": "2024-08-01"},
        {"case_number": "DV-2023-091", "type": "Electrical Hazard", "status": "closed", "date": "2023-12-15"},
        {"case_number": "DV-2024-025", "type": "Fire Safety Violation", "status": "open", "date": "2024-09-22"},
        {"case_number": "DV-2023-034", "type": "Structural Damage", "status": "closed", "date": "2023-04-18"},
    ],
    "The Arbors": [
        {"case_number": "DV-2024-007", "type": "Pest Infestation", "status": "closed", "date": "2024-04-12"},
        {"case_number": "DV-2023-078", "type": "Plumbing/Mold", "status": "closed", "date": "2023-08-25"},
    ],
    "The Green at West Village": [
        {"case_number": "DV-2024-009", "type": "HVAC Failure", "status": "open", "date": "2024-05-30"},
        {"case_number": "DV-2023-056", "type": "Electrical Hazard", "status": "closed", "date": "2023-07-14"},
    ],
    "The Lexington": [
        {"case_number": "DV-2024-011", "type": "Plumbing/Mold", "status": "closed", "date": "2024-01-28"},
    ],
    "Russell Park": [
        {"case_number": "DV-2024-015", "type": "Fire Safety Violation", "status": "closed", "date": "2024-03-22"},
        {"case_number": "DV-2023-099", "type": "Pest Infestation", "status": "closed", "date": "2023-10-05"},
    ],
    "Aggie Square Apartments": [
        {"case_number": "DV-2024-101", "type": "Plumbing/Mold", "status": "closed", "date": "2024-02-14"},
    ],
    "Almondwood Apartments": [
        {"case_number": "DV-2024-102", "type": "Pest Infestation", "status": "open", "date": "2024-05-10"},
    ],
    "Arlington Farm": [
        {"case_number": "DV-2023-103", "type": "Electrical Hazard", "status": "closed", "date": "2023-11-22"},
    ],
    "Aspen Village": [
        {"case_number": "DV-2024-104", "type": "HVAC Failure", "status": "closed", "date": "2024-01-05"},
    ],
    "Cambridge House Apartments": [
        {"case_number": "DV-2024-105", "type": "Plumbing/Mold", "status": "open", "date": "2024-08-11"},
    ],
    "Casitas Apartments": [
        {"case_number": "DV-2023-106", "type": "Fire Safety Violation", "status": "closed", "date": "2023-03-12"},
    ],
    "Chaparral Apartments": [
        {"case_number": "DV-2024-107", "type": "Electrical Hazard", "status": "closed", "date": "2024-04-18"},
    ],
    "Chautauqua Apartments": [
        {"case_number": "DV-2023-108", "type": "Structural Damage", "status": "closed", "date": "2023-09-09"},
    ],
    "Cranbrook Apartments": [
        {"case_number": "DV-2024-109", "type": "Plumbing/Mold", "status": "open", "date": "2024-07-25"},
    ],
    "The Drake Apartments": [
        {"case_number": "DV-2024-110", "type": "Pest Infestation", "status": "closed", "date": "2024-02-28"},
    ],
    "Fountain Circle Townhomes": [
        {"case_number": "DV-2023-111", "type": "HVAC Failure", "status": "closed", "date": "2023-10-14"},
    ],
    "Glacier Point Apartments": [
        {"case_number": "DV-2024-112", "type": "Fire Safety Violation", "status": "open", "date": "2024-06-03"},
    ],
    "Greystone Apartments": [
        {"case_number": "DV-2024-113", "type": "Plumbing/Mold", "status": "closed", "date": "2024-01-19"},
    ],
    "Parkside Apartments": [
        {"case_number": "DV-2023-114", "type": "Structural Damage", "status": "closed", "date": "2023-12-01"},
    ],
    "Silver Bow Apartments": [
        {"case_number": "DV-2024-115", "type": "Electrical Hazard", "status": "open", "date": "2024-08-30"},
    ],
    "Stonegate Village": [
        {"case_number": "DV-2023-116", "type": "Pest Infestation", "status": "closed", "date": "2023-11-15"},
    ],
    "Sycamore Lane Apartments": [
        {"case_number": "DV-2024-117", "type": "HVAC Failure", "status": "closed", "date": "2024-03-22"},
    ],
    "Tanglewood Apartments": [
        {"case_number": "DV-2024-118", "type": "Plumbing/Mold", "status": "open", "date": "2024-05-18"},
    ],
    "The Spoke": [
        {"case_number": "DV-2023-119", "type": "Fire Safety Violation", "status": "closed", "date": "2023-08-08"},
    ],
    "University Court": [
        {"case_number": "DV-2024-120", "type": "Pest Infestation", "status": "closed", "date": "2024-04-11"},
    ],
}

# Reviews keyed by property name
REVIEWS: dict[str, list[dict]] = {
    "West Village": [
        {"source": "yelp", "rating": 2.5},
        {"source": "google", "rating": 3.0},
    ],
    "The Colleges at La Rue": [
        {"source": "yelp", "rating": 4.0},
        {"source": "google", "rating": 4.2},
    ],
    "Primero Grove": [
        {"source": "yelp", "rating": 4.5},
        {"source": "google", "rating": 4.3},
    ],
    "The Green at West Village": [
        {"source": "yelp", "rating": 3.0},
        {"source": "google", "rating": 3.2},
    ],
    "Tandem Properties": [
        {"source": "yelp", "rating": 1.5},
        {"source": "google", "rating": 2.0},
    ],
    "The Arbors": [
        {"source": "yelp", "rating": 3.0},
        {"source": "google", "rating": 2.8},
    ],
    "The Lexington": [
        {"source": "yelp", "rating": 3.5},
        {"source": "google", "rating": 3.8},
    ],
    "Pine Hall": [
        {"source": "yelp", "rating": 4.2},
        {"source": "google", "rating": 4.0},
    ],
    "J Street Apartments": [
        {"source": "yelp", "rating": 1.0},
        {"source": "google", "rating": 1.5},
    ],
    "Russell Park": [
        {"source": "yelp", "rating": 3.5},
        {"source": "google", "rating": 3.3},
    ],
    "Aggie Square Apartments": [{"source": "yelp", "rating": 3.5}, {"source": "google", "rating": 3.8}],
    "Almondwood Apartments": [{"source": "yelp", "rating": 4.0}, {"source": "google", "rating": 4.2}],
    "Arlington Farm": [{"source": "yelp", "rating": 2.5}, {"source": "google", "rating": 3.1}],
    "Aspen Village": [{"source": "yelp", "rating": 3.0}, {"source": "google", "rating": 2.8}],
    "Cambridge House Apartments": [{"source": "yelp", "rating": 4.5}, {"source": "google", "rating": 4.4}],
    "Casitas Apartments": [{"source": "yelp", "rating": 3.5}, {"source": "google", "rating": 3.6}],
    "Chaparral Apartments": [{"source": "yelp", "rating": 4.0}, {"source": "google", "rating": 4.1}],
    "Chautauqua Apartments": [{"source": "yelp", "rating": 3.5}, {"source": "google", "rating": 3.7}],
    "Cranbrook Apartments": [{"source": "yelp", "rating": 3.0}, {"source": "google", "rating": 3.3}],
    "The Drake Apartments": [{"source": "yelp", "rating": 4.0}, {"source": "google", "rating": 4.3}],
    "Fountain Circle Townhomes": [{"source": "yelp", "rating": 4.5}, {"source": "google", "rating": 4.6}],
    "Glacier Point Apartments": [{"source": "yelp", "rating": 3.5}, {"source": "google", "rating": 3.4}],
    "Greystone Apartments": [{"source": "yelp", "rating": 4.0}, {"source": "google", "rating": 4.2}],
    "Parkside Apartments": [{"source": "yelp", "rating": 3.0}, {"source": "google", "rating": 3.5}],
    "Silver Bow Apartments": [{"source": "yelp", "rating": 2.5}, {"source": "google", "rating": 2.9}],
    "Stonegate Village": [{"source": "yelp", "rating": 4.5}, {"source": "google", "rating": 4.7}],
    "Sycamore Lane Apartments": [{"source": "yelp", "rating": 3.5}, {"source": "google", "rating": 3.8}],
    "Tanglewood Apartments": [{"source": "yelp", "rating": 4.0}, {"source": "google", "rating": 4.1}],
    "The Spoke": [{"source": "yelp", "rating": 2.0}, {"source": "google", "rating": 2.2}],
    "University Court": [{"source": "yelp", "rating": 3.5}, {"source": "google", "rating": 3.6}],
}


def main() -> None:
    print("seed_properties.py — Seed LeaseLens database\n")

    # ── Fetch existing data for idempotency ──────────────────────────────────
    print("Fetching existing data…")
    existing_names = set()
    name_to_id = {}
    existing_cases = set()
    try:
        req = urllib.request.Request(f"{API}/properties?select=id,name", headers=HEADERS)
        with urllib.request.urlopen(req) as resp:
            for p in json.loads(resp.read().decode("utf-8")):
                existing_names.add(p["name"])
                name_to_id[p["name"]] = p["id"]
                
        req_v = urllib.request.Request(f"{API}/violations?select=case_number", headers=HEADERS)
        with urllib.request.urlopen(req_v) as resp:
            existing_cases = {v["case_number"] for v in json.loads(resp.read().decode("utf-8"))}
    except Exception as e:
        print(f"  ⚠ Could not fetch existing data: {e}")

    # ── 1. Insert properties ──────────────────────────────────────────────────
    properties_to_insert = [p for p in PROPERTIES if p["name"] not in existing_names]
    newly_inserted_property_names = set()
    
    if properties_to_insert:
        print(f"\nInserting {len(properties_to_insert)} new properties…")
        inserted = post("properties", properties_to_insert)
        print(f"  ✓ {len(inserted)} properties inserted")
        for prop in inserted:
            name_to_id[prop["name"]] = prop["id"]
            newly_inserted_property_names.add(prop["name"])
            print(f"    • {prop['name']} (id={prop['id']}, risk={prop['risk_score']})")
    else:
        print("\n  ✓ No new properties to insert.")

    # ── 2. Insert violations ──────────────────────────────────────────────────
    print("\nInserting violations…")
    violation_rows: list[dict] = []
    for prop_name, violations in VIOLATIONS.items():
        prop_id = name_to_id.get(prop_name)
        if not prop_id:
            print(f"  ⚠  Skipping violations for unknown property: {prop_name}")
            continue
        for v in violations:
            if v["case_number"] not in existing_cases:
                violation_rows.append({**v, "property_id": prop_id})

    if violation_rows:
        inserted_v = post("violations", violation_rows)
        print(f"  ✓ {len(inserted_v)} violations inserted")
    else:
        print("  (no new violations to insert)")

    # ── 3. Insert reviews ─────────────────────────────────────────────────────
    print("\nInserting reviews…")
    review_rows: list[dict] = []
    for prop_name, reviews in REVIEWS.items():
        if prop_name not in newly_inserted_property_names:
            continue # Only seed reviews for newly inserted properties to avoid duplicates
        prop_id = name_to_id.get(prop_name)
        if not prop_id:
            print(f"  ⚠  Skipping reviews for unknown property: {prop_name}")
            continue
        for r in reviews:
            review_rows.append({**r, "property_id": prop_id})

    if review_rows:
        inserted_r = post("reviews", review_rows)
        print(f"  ✓ {len(inserted_r)} reviews inserted")
    else:
        print("  (no new reviews to insert)")

    print("\n✓ Database seeded successfully!")


if __name__ == "__main__":
    main()
