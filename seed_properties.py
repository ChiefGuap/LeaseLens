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
}


def main() -> None:
    print("seed_properties.py — Seed LeaseLens database\n")

    # ── 1. Insert properties ──────────────────────────────────────────────────
    print("Inserting properties…")
    inserted = post("properties", PROPERTIES)
    print(f"  ✓ {len(inserted)} properties inserted")

    # Build a name → id map for linking violations/reviews
    name_to_id: dict[str, int] = {}
    for prop in inserted:
        name_to_id[prop["name"]] = prop["id"]
        print(f"    • {prop['name']} (id={prop['id']}, risk={prop['risk_score']})")

    # ── 2. Insert violations ──────────────────────────────────────────────────
    print("\nInserting violations…")
    violation_rows: list[dict] = []
    for prop_name, violations in VIOLATIONS.items():
        prop_id = name_to_id.get(prop_name)
        if not prop_id:
            print(f"  ⚠  Skipping violations for unknown property: {prop_name}")
            continue
        for v in violations:
            violation_rows.append({**v, "property_id": prop_id})

    if violation_rows:
        inserted_v = post("violations", violation_rows)
        print(f"  ✓ {len(inserted_v)} violations inserted")
    else:
        print("  (no violations to insert)")

    # ── 3. Insert reviews ─────────────────────────────────────────────────────
    print("\nInserting reviews…")
    review_rows: list[dict] = []
    for prop_name, reviews in REVIEWS.items():
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
        print("  (no reviews to insert)")

    print("\n✓ Database seeded successfully!")


if __name__ == "__main__":
    main()
