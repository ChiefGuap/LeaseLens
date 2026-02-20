"""
normalize_data.py — Normalize addresses from Yelp and city-violation datasets.

Uses the `usaddress` library to parse raw address strings into components,
expands common abbreviations, and reassembles each address into a canonical
form so that records from different sources can be matched by address.

Canonical format:
    {AddressNumber} {StreetName} {StreetSuffix}, {Unit}, {City}, {State} {Zip}
"""

import json
import re
import sys
from collections import OrderedDict

import usaddress


# ── Abbreviation expansion map ─────────────────────────────────────────────────
# Covers USPS Publication 28 standard abbreviations.
STREET_SUFFIX_MAP: dict[str, str] = {
    "st": "Street",
    "str": "Street",
    "ave": "Avenue",
    "av": "Avenue",
    "blvd": "Boulevard",
    "bvd": "Boulevard",
    "cir": "Circle",
    "ct": "Court",
    "dr": "Drive",
    "drv": "Drive",
    "hwy": "Highway",
    "ln": "Lane",
    "pkwy": "Parkway",
    "pl": "Place",
    "plz": "Plaza",
    "rd": "Road",
    "sq": "Square",
    "ter": "Terrace",
    "trl": "Trail",
    "way": "Way",
}

DIRECTIONAL_MAP: dict[str, str] = {
    "n": "North",
    "s": "South",
    "e": "East",
    "w": "West",
    "ne": "Northeast",
    "nw": "Northwest",
    "se": "Southeast",
    "sw": "Southwest",
}

OCCUPANCY_MAP: dict[str, str] = {
    "apt": "Apartment",
    "ste": "Suite",
    "bldg": "Building",
    "fl": "Floor",
    "rm": "Room",
    "unit": "Unit",
    "#": "Unit",
}

# File paths (defaults — can be overridden via CLI)
YELP_INPUT = "yelp_data.json"
VIOLATIONS_INPUT = "city_violations_clean.json"
YELP_OUTPUT = "normalized_yelp.json"
VIOLATIONS_OUTPUT = "normalized_violations.json"


# ── Helpers ────────────────────────────────────────────────────────────────────

def _expand(value: str, lookup: dict[str, str]) -> str:
    """Title-case a value and expand it if it's a known abbreviation."""
    key = value.strip().rstrip(".").lower()
    return lookup.get(key, value.title())


def _clean_whitespace(text: str) -> str:
    """Collapse runs of whitespace and strip outer whitespace / commas."""
    text = re.sub(r"\s+", " ", text)
    return text.strip().strip(",").strip()


def normalize_address(raw_address: str) -> str:
    """
    Parse a raw US address string into components with `usaddress.tag()`,
    expand abbreviations, and reassemble into a canonical form.

    Returns the normalized address string, or the cleaned original on failure.
    """
    if not raw_address or not raw_address.strip():
        return ""

    raw_address = _clean_whitespace(raw_address)

    try:
        tagged: OrderedDict
        addr_type: str
        tagged, addr_type = usaddress.tag(raw_address)
    except usaddress.RepeatedLabelError:
        # Ambiguous parse — return a best-effort cleaned version
        return raw_address.title()

    # ── Build canonical parts ──────────────────────────────────────────────
    number = tagged.get("AddressNumber", "")
    number_prefix = tagged.get("AddressNumberPrefix", "")
    number_suffix = tagged.get("AddressNumberSuffix", "")

    pre_dir = _expand(tagged.get("StreetNamePreDirectional", ""), DIRECTIONAL_MAP)
    street = tagged.get("StreetName", "").title()
    post_type = _expand(tagged.get("StreetNamePostType", ""), STREET_SUFFIX_MAP)
    post_dir = _expand(tagged.get("StreetNamePostDirectional", ""), DIRECTIONAL_MAP)

    occ_type = _expand(tagged.get("OccupancyType", ""), OCCUPANCY_MAP)
    occ_id = tagged.get("OccupancyIdentifier", "")

    city = tagged.get("PlaceName", "").title()
    state = tagged.get("StateName", "").upper()
    zipcode = tagged.get("ZipCode", "")

    # ── Reassemble ─────────────────────────────────────────────────────────
    street_parts = [
        p for p in [number_prefix, number, number_suffix, pre_dir, street, post_type, post_dir]
        if p
    ]
    street_line = " ".join(street_parts)

    unit_line = f"{occ_type} {occ_id}".strip() if (occ_type or occ_id) else ""

    city_state_zip_parts = []
    if city:
        city_state_zip_parts.append(city)
    if state:
        city_state_zip_parts.append(state)
    csz = " ".join(city_state_zip_parts)
    if zipcode:
        csz = f"{csz} {zipcode}".strip()

    parts = [p for p in [street_line, unit_line, csz] if p]
    return ", ".join(parts)


def normalize_records(records: list[dict], address_key: str = "address") -> list[dict]:
    """Add a 'normalized_address' field to each record."""
    for rec in records:
        raw = rec.get(address_key, "") or ""
        rec["normalized_address"] = normalize_address(raw)
    return records


def find_address_matches(
    yelp_records: list[dict],
    violation_records: list[dict],
) -> list[str]:
    """Return normalized addresses that appear in both datasets."""
    yelp_addrs = {r.get("normalized_address", "").lower() for r in yelp_records}
    viol_addrs = {r.get("normalized_address", "").lower() for r in violation_records}
    return sorted(yelp_addrs & viol_addrs - {""})


# ── Main ───────────────────────────────────────────────────────────────────────

def load_json(path: str) -> list[dict]:
    """Load a JSON array from a file. Returns [] if file is missing."""
    try:
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"  ⚠  {path} not found — skipping.")
        return []


def save_json(data: list[dict], path: str) -> None:
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"  ✓ Saved {len(data)} records → {path}")


def main() -> None:
    print("normalize_data.py — Address normalization for LeaseLens\n")

    # ── Load datasets ──────────────────────────────────────────────────────
    print("Loading datasets…")
    yelp = load_json(YELP_INPUT)
    violations = load_json(VIOLATIONS_INPUT)

    if not yelp and not violations:
        print("\n⚠  No data files found. Run scrape_yelp.py and/or "
              "ingest_city_data.py first.")
        sys.exit(1)

    # ── Normalize ──────────────────────────────────────────────────────────
    print("\nNormalizing Yelp addresses…")
    if yelp:
        yelp = normalize_records(yelp, address_key="address")
        save_json(yelp, YELP_OUTPUT)

        # Show a sample
        sample = yelp[0]
        print(f"    Example: '{sample.get('address')}' → '{sample['normalized_address']}'")

    print("\nNormalizing violation addresses…")
    if violations:
        violations = normalize_records(violations, address_key="address")
        save_json(violations, VIOLATIONS_OUTPUT)

        sample = violations[0]
        print(f"    Example: '{sample.get('address')}' → '{sample['normalized_address']}'")

    # ── Cross-match ────────────────────────────────────────────────────────
    if yelp and violations:
        matches = find_address_matches(yelp, violations)
        print(f"\n✓ {len(matches)} address(es) found in BOTH datasets:")
        for addr in matches[:20]:
            print(f"    • {addr}")
        if len(matches) > 20:
            print(f"    … and {len(matches) - 20} more")
    else:
        print("\n(Cross-matching skipped — need both datasets loaded.)")

    print("\nDone.")


if __name__ == "__main__":
    main()
