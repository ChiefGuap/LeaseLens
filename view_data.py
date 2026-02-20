"""
view_data.py — CLI data viewer for LeaseLens pipeline output.

Usage:
    python view_data.py yelp          Show normalized Yelp listings
    python view_data.py violations    Show normalized violation records
    python view_data.py matches       Show addresses appearing in both datasets
    python view_data.py all           Show all three views

Options:
    --format FORMAT    Table format: grid (default), simple, github, html
"""

import argparse
import json
import sys

from tabulate import tabulate


# ── File paths (normalized output from normalize_data.py) ──────────────────────
YELP_FILE = "normalized_yelp.json"
VIOLATIONS_FILE = "normalized_violations.json"


def load_json(path: str) -> list[dict]:
    """Load a JSON array from a file. Returns [] on failure."""
    try:
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"⚠  {path} not found. Run the pipeline first.\n")
        return []


# ── View functions ─────────────────────────────────────────────────────────────

def view_yelp(fmt: str) -> None:
    """Display normalized Yelp apartment data."""
    data = load_json(YELP_FILE)
    if not data:
        return

    rows = [
        [
            r.get("property_name", "—"),
            r.get("normalized_address") or r.get("address", "—"),
            r.get("star_rating", "—"),
        ]
        for r in data
    ]

    print("═" * 70)
    print("  YELP APARTMENTS — Davis, CA")
    print("═" * 70)
    print(tabulate(rows, headers=["Property Name", "Address", "Rating"], tablefmt=fmt))
    print(f"\n  {len(rows)} listing(s)\n")


def view_violations(fmt: str) -> None:
    """Display normalized violation data."""
    data = load_json(VIOLATIONS_FILE)
    if not data:
        return

    rows = [
        [
            r.get("normalized_address") or r.get("address", "—"),
            r.get("violation_type", "—"),
            r.get("date", "—"),
        ]
        for r in data
    ]

    print("═" * 70)
    print("  CODE COMPLIANCE VIOLATIONS — Davis, CA")
    print("═" * 70)
    print(tabulate(rows, headers=["Address", "Violation Type", "Date"], tablefmt=fmt))
    print(f"\n  {len(rows)} violation(s)\n")


def view_matches(fmt: str) -> None:
    """Display addresses that appear in both datasets."""
    yelp = load_json(YELP_FILE)
    violations = load_json(VIOLATIONS_FILE)

    if not yelp or not violations:
        print("⚠  Both datasets are needed for matching.\n")
        return

    yelp_addrs = {
        (r.get("normalized_address") or "").lower(): r for r in yelp
    }
    viol_by_addr: dict[str, list[dict]] = {}
    for r in violations:
        key = (r.get("normalized_address") or "").lower()
        if key:
            viol_by_addr.setdefault(key, []).append(r)

    common = sorted(set(yelp_addrs.keys()) & set(viol_by_addr.keys()) - {""})

    if not common:
        print("═" * 70)
        print("  ADDRESS MATCHES")
        print("═" * 70)
        print("  No matching addresses found between the two datasets.\n")
        return

    rows = []
    for addr in common:
        yelp_rec = yelp_addrs[addr]
        viol_list = viol_by_addr[addr]
        for v in viol_list:
            rows.append([
                yelp_rec.get("property_name", "—"),
                addr.title(),
                v.get("violation_type", "—"),
                v.get("date", "—"),
            ])

    print("═" * 70)
    print("  ADDRESS MATCHES — Properties with Violations")
    print("═" * 70)
    print(tabulate(
        rows,
        headers=["Property", "Address", "Violation", "Date"],
        tablefmt=fmt,
    ))
    print(f"\n  {len(rows)} match(es) across {len(common)} address(es)\n")


# ── CLI ────────────────────────────────────────────────────────────────────────

VIEWS = {
    "yelp": view_yelp,
    "violations": view_violations,
    "matches": view_matches,
}


def main() -> None:
    parser = argparse.ArgumentParser(
        description="LeaseLens — View ingested and normalized pipeline data",
    )
    parser.add_argument(
        "view",
        choices=["yelp", "violations", "matches", "all"],
        help="Which dataset to display",
    )
    parser.add_argument(
        "--format",
        dest="fmt",
        default="grid",
        choices=["grid", "simple", "github", "html"],
        help="Table output format (default: grid)",
    )
    args = parser.parse_args()

    if args.view == "all":
        for name, fn in VIEWS.items():
            fn(args.fmt)
    else:
        VIEWS[args.view](args.fmt)


if __name__ == "__main__":
    main()
