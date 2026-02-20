"""
ingest_city_data.py — Ingest City of Davis, CA code-compliance violation CSVs.

Reads a local CSV, extracts address / violation type / date columns using
case-insensitive matching, tags every record with Davis, CA metadata, and
saves the cleaned data to city_violations_clean.json.
"""

import json
import sys

import pandas as pd


DEFAULT_CSV = "davis_code_violations.csv"
OUTPUT_FILE = "city_violations_clean.json"

# Maps of canonical field name → possible column-name variants (lowercase).
COLUMN_ALIASES: dict[str, list[str]] = {
    "address": [
        "address", "street_address", "location", "site_address",
        "violation_address", "property_address", "addr",
        "street", "full_address", "incident_address",
    ],
    "violation_type": [
        "violation_type", "violationtype", "type", "violation",
        "violation_description", "description", "code_violation",
        "violation_code", "offense", "category",
    ],
    "date": [
        "date", "violation_date", "opened_date", "case_opened",
        "date_opened", "incident_date", "created_date", "entry_date",
        "reported_date", "case_date", "status_date",
    ],
}


def _find_column(df: pd.DataFrame, aliases: list[str]) -> str | None:
    """Return the first DataFrame column whose lowercase name matches an alias."""
    lower_map = {col.lower().strip(): col for col in df.columns}
    for alias in aliases:
        if alias in lower_map:
            return lower_map[alias]
    return None


def ingest(csv_path: str = DEFAULT_CSV) -> pd.DataFrame:
    """Read the CSV and return a cleaned DataFrame with standard columns."""
    print(f"→ Reading {csv_path} …")
    df = pd.read_csv(csv_path, dtype=str)
    print(f"  ✓ {len(df)} rows, {len(df.columns)} columns")

    # Resolve actual column names
    mapping: dict[str, str | None] = {}
    for canonical, aliases in COLUMN_ALIASES.items():
        found = _find_column(df, aliases)
        mapping[canonical] = found
        status = f"'{found}'" if found else "NOT FOUND"
        print(f"  • {canonical:16s} → {status}")

    if not mapping["address"]:
        print("\n⚠  Could not find an address column. Available columns:")
        for col in df.columns:
            print(f"     - {col}")
        sys.exit(1)

    # Build cleaned output
    records: list[dict] = []
    for _, row in df.iterrows():
        address_raw = str(row.get(mapping["address"], "")).strip()
        if not address_raw or address_raw.lower() == "nan":
            continue

        record: dict = {
            "address": address_raw,
            "violation_type": (
                str(row[mapping["violation_type"]]).strip()
                if mapping["violation_type"] else None
            ),
            "date": (
                str(row[mapping["date"]]).strip()
                if mapping["date"] else None
            ),
            # Davis-specific metadata
            "city": "Davis",
            "state": "CA",
        }
        records.append(record)

    clean_df = pd.DataFrame(records)
    print(f"\n✓ {len(clean_df)} valid records extracted")
    return clean_df


def main() -> None:
    csv_path = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_CSV
    clean_df = ingest(csv_path)

    clean_df.to_json(OUTPUT_FILE, orient="records", indent=2, force_ascii=False)
    print(f"✓ Saved to {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
