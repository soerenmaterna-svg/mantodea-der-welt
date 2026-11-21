# Liest moderne Bestimmungsschlüssel im Format
#   1. Aussage ......... 2          (oder ... Gattung art)
#   -  Gegenaussage .... Art        (auch "–", "1'", "1a/1b")
# Aufruf: python3 -I modkey_parse.py <pdf> <startregex> <endregex> -> JSON auf stdout
import re, sys, json, subprocess
pdf, start, end = sys.argv[1], sys.argv[2], sys.argv[3]
lines = subprocess.run(["pdftotext", "-layout", pdf, "-"], capture_output=True, text=True).stdout.split("\n")
i0 = next(i for i, l in enumerate(lines) if re.search(start, l, re.I))
blk = []
for l in lines[i0 + 1:]:
    if re.search(end, l, re.I) and blk: break
    blk.append(l)
leads = []
cur = None
NEW = re.compile(r"^\s*(?:(\d{1,3})\s*[\.\)]?\s*(?:[ab]\b)?|[-–—]|(\d{1,3})\s*['’′]|(\d{1,3})[ab])\s+(?=\S)")
for l in blk:
    if not l.strip() or re.search(r"Zootaxa|Magnolia Press|©|^\s*\d+\s*$", l): continue
    m = NEW.match(l)
    txt = l[m.end():] if m else l.strip()
    if m:
        cur = {"t": "", "end": None}; leads.append(cur)
    if cur is None: continue
    cur["t"] += " " + txt.strip()
for ld in leads:
    t = re.sub(r"\s+", " ", ld["t"]).strip()
    mm = re.search(r"(?:\s*\.){2,}\s*(.+)$", t) or re.search(r"\s{1}(\d{1,3})$", t)
    if mm:
        ld["end"] = mm.group(1).strip(" ."); t = t[:mm.start()].strip(" .")
    ld["t"] = t
json.dump(leads, sys.stdout, ensure_ascii=False, indent=0)
