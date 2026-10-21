"""List every value still marked verify: true ("Sinusuri pa") across data/*.json.
Usage: python3 scripts/count_verify.py data
"""
import json, sys, pathlib

def walk(x, path, out):
    if isinstance(x, dict):
        if x.get("verify") is True:
            label = x.get("id") or x.get("name") or x.get("title_fil") or x.get("label") or ""
            out.append((path, label))
        for k, v in x.items():
            walk(v, f"{path}.{k}", out)
    elif isinstance(x, list):
        for i, v in enumerate(x):
            walk(v, f"{path}[{i}]", out)

root = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else "data")
total = 0
for f in sorted(root.glob("*.json")):
    out = []
    walk(json.loads(f.read_text()), f.stem, out)
    total += len(out)
    print(f"{f.name}: {len(out)}")
    for p, label in out:
        print(f"   {p}  {label}")
print(f"\nTotal still to verify: {total}")
