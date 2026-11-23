# Erzeugt data/merkmale.js: Merkmalsprofile je Art für den Artenvergleich.
# Grundlage: die Bestimmungsschlüssel (data/bestimmung.js). Jede Art erhält die Ausprägungen aller Schlüsselstellen,
# über die man zu ihr gelangt (Ordnungs-, Familien-, Gattungs- und Artschlüssel; Merkmale von Familie und Gattung werden geerbt).
# Dazu Körpermaße aus Texten (Schlüssel, Soothsayer, Plazi), soweit vorhanden.
# Aufruf: python3 -I bestimmung-quellen/merkmale_build.py [maße.json]
import json, re, sys, os, collections

R = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'data') + '/'
def load(f):
    s = open(R + f, encoding='utf8').read(); return json.loads(s[s.index('=', s.index('window.')) + 1:s.rindex('}') + 1])
B = load('bestimmung.js'); SP = load('species.js')['species']
BYK = {x['k']: x for x in SP}

REG = [  # Reihenfolge = Anzeige-Reihenfolge der Körperregionen
    ('groesse', 'Größe und Gestalt', r'\bKörper|\bgroß|\bklein|\bschlank|\bgedrungen|\bplump|\bmm\b|Gestalt|Länge des Körpers|Habitus'),
    ('kopf', 'Kopf', r'Kopf|Scheitel|Stirn|Auge|Ocell|Gesicht|Clypeus|Juxtaocular|Hinterhaupt|Mundwerk|Kiefer|Kopfschild'),
    ('fuehler', 'Fühler', r'Fühler|Antenn'),
    ('halsschild', 'Halsschild (Pronotum)', r'Halsschild|Pronot|Prozon|Metazon|Vorderbrust|Supracoxal|Prothorax'),
    ('fangbeine', 'Fangbeine', r'Vorderhüft|Vordercox|Vorderschenkel|Vorderschien|Vorderfemur|Vordertibia|Fangbein|Scheibendorn|Discoidaldorn|Klauenfurche|Vordertars|Vorderbein|Vorderfu|Femoraldorn|Tibialdorn|Vordertibi|Hüftgelenk|Außendorn|Innendorn'),
    ('laufbeine', 'Laufbeine', r'Mittel- und Hinter|Mittelbein|Hinterbein|Mittelschenkel|Hinterschenkel|Mittelschien|Hinterschien|Laufbein|Tars|Metatars|Schenkel|Schiene|Beine'),
    ('fluegel', 'Flügel', r'Flügel|Tegmin|Elytr|Stigma|Ader|Analfeld|Costal|Vorderrandfeld|Discoidalfeld|geflügelt|flügellos|brachypter|Flugorgan'),
    ('abdomen', 'Hinterleib', r'Hinterleib|Abdomen|Tergit|Sternit|Segment|Subgenital|Supraanal|Lamina|Afterdeckplatte|Analplatte|Subgenitalplatte'),
    ('cerci', 'Cerci', r'Cerc|Raife'),
    ('genital', 'Genitalien', r'Genital|Phall|Penis|Titillator|Ovipositor|Legeröhre|Hypophall|Epiphall|Pseudophall'),
    ('faerbung', 'Färbung und Zeichnung', r'Färbung|gefärbt|Farbe|grün|braun|Fleck|schwarz|weiß|gelb|rot|Binde|Zeichnung|dunkel|hell|gebändert|Querbänder|Punkt'),
]
ERK = ['kopf', 'fuehler', 'halsschild', 'fangbeine', 'laufbeine', 'fluegel', 'abdomen', 'cerci', 'genital', 'faerbung', 'groesse']
def region(t):
    for k, _, rx in sorted(REG, key=lambda r: ERK.index(r[0])):
        if re.search(rx, t, re.I): return k
    return 'sonst'

# ---------- Schlüssel durchlaufen: welche Taxa erreicht man über eine Aussage?
leaf_cache = {}
def reach_couplet(kn, i, stack=()):
    key = (kn, i)
    if key in leaf_cache: return leaf_cache[key]
    if key in stack: return {'s': set(), 'a': set(), 'g': set(), 'f': set()}
    res = {'s': set(), 'a': set(), 'g': set(), 'f': set()}
    for o in B['keys'][kn]['c'][i]:
        r = reach_option(kn, o, stack + (key,))
        for t in res: res[t] |= r[t]
    leaf_cache[key] = res
    return res
def reach_option(kn, o, stack=()):
    z = o['z']
    if isinstance(z, int): return reach_couplet(kn, z - 1, stack)
    res = {'s': set(z.get('s', [])), 'a': set(z.get('a', [])), 'g': set(z.get('g', [])), 'f': set(z.get('f', []))}
    if 'k' in z and z['k'] in B['keys']:
        r = reach_couplet(z['k'], 0, stack)
        for t in res: res[t] |= r[t]
    return res

LVL = {'gattung': 3, 'familie': 2, 'erdteil': 1, 'ordnung': 1, 'erdteil-wahl': 1, 'fossil': 1}
rows = {}            # zeilen-id -> {r, l, opts:[text], q}
ass = collections.defaultdict(lambda: collections.defaultdict(set))   # taxon -> zeile -> {opt idx (negativ = unsicher)}

def lcp_label(texts):
    ws = [t.split() for t in texts]
    pre = []
    for col in zip(*ws):
        if all(w == col[0] for w in col): pre.append(col[0])
        else: break
    lab = ' '.join(pre).rstrip(',:;')
    if len(pre) >= min(len(w) for w in ws): pre = pre[:-1]; lab = ' '.join(pre).rstrip(',:;')
    if len(lab) >= 4: return lab + ' …'
    # kein gemeinsamer Anfang: Substantive (großgeschrieben) aus beiden Aussagen, z. B. "Augen, Hinterschenkel"
    nom = []
    for t in texts:
        for w_ in re.findall(r'\b[A-ZÄÖÜ][a-zäöüß\-]{3,}', t):
            if w_ not in nom and w_ not in ('Männchen', 'Weibchen', 'Beim', 'Die', 'Der', 'Das'): nom.append(w_)
    return ', '.join(nom[:3])

for kn, v in B['keys'].items():
    if v.get('r') == 'ordnung' or kn == 'start': continue   # Ordnungsmerkmale ("Vorderbeine sind Fangbeine") trennen keine Arten
    for i, grp in enumerate(v['c']):
        texts = [o['t'] for o in grp]
        if any(t.startswith('Fundort') for t in texts) or len(grp) < 2: continue
        if all(region(t) == 'sonst' for t in texts) and any(re.search(r'Afrika|Amerika|Asien|Europa|Australien|Madagaskar|Bernstein|Gestein|fossil', t) for t in texts): continue
        parts = [[p.strip() for p in re.split(r';\s+', t)] for t in texts]
        n = len(parts[0])
        sub = n if n > 1 and all(len(p) == n for p in parts) else 1
        reaches = [reach_option(kn, o) for o in grp]
        for si in range(sub):
            opts = [p[si] for p in parts] if sub > 1 else texts
            norm = tuple(sorted(set(re.sub(r'\s*\((?:Abb|Fig)[^)]*\)', '', t).strip() for t in opts)))
            if len(norm) < 2: continue
            rid = '|'.join(norm)
            reg = collections.Counter(region(t) for t in norm).most_common(1)[0][0]
            if rid not in rows: rows[rid] = {'r': reg, 'l': lcp_label(list(norm)), 'o': list(norm), 'q': grp[0].get('q', ''), 'k': kn}
            pos = {t: norm.index(re.sub(r'\s*\((?:Abb|Fig)[^)]*\)', '', t).strip()) for t in opts}
            for oi0, r in enumerate(reaches):
                oi = pos[opts[oi0]]
                for s_ in r['s']: ass[s_][rid].add(oi)
                for s_ in r['a']: ass[s_][rid].add(-oi - 1)
                for g in r['g']: ass['G:' + g][rid].add(oi)
                for f in r['f']: ass['F:' + f][rid].add(oi)

def pack(d):
    out = {}
    for rid, ois in d.items():
        sure = sorted(o for o in ois if o >= 0); unsure = sorted(-o - 1 for o in ois if o < 0 and -o - 1 not in sure)
        out[rid] = sure + [~u for u in unsure]   # ~u = unsicher ("auch möglich")
    return out
arten = {k: pack(ass[k]) for k in BYK if k in ass}
gatt = {g[2:]: pack(d) for g, d in ass.items() if g.startswith('G:')}
fam = {f[2:]: pack(d) for f, d in ass.items() if f.startswith('F:')}
# nur Zeilen behalten, die irgendwo vorkommen
used = set()
for D in (arten, gatt, fam):
    for v in D.values(): used |= set(v)
rows = {k: v for k, v in rows.items() if k in used}
# Zeilen-IDs kürzen
ids = {rid: i for i, rid in enumerate(sorted(rows))}
Z = [[rows[r]['r'], rows[r]['l'], rows[r]['o'], rows[r]['q'], rows[r]['k']] for r in sorted(rows)]
short = lambda D: {k: {str(ids[r]): v for r, v in d.items()} for k, d in D.items()}

# ---------- Körpermaße (optional, aus vorab gesammelten Texten)
masse = json.load(open(sys.argv[1], encoding='utf8')) if len(sys.argv) > 1 and os.path.exists(sys.argv[1]) else {}

Q = {k: (v.get('t') or v.get('z', ''))[:80] for k, v in B['quellen'].items()}
out = {'stand': B.get('stand'), 'regionen': [[k, n] for k, n, _ in REG] + [['sonst', 'Weitere Merkmale']], 'zeilen': Z,
       'art': short(arten), 'gattung': short(gatt), 'familie': short(fam), 'quellen': Q, 'masse': masse}
open(R + 'merkmale.js', 'w', encoding='utf8').write('// erzeugt von bestimmung-quellen/merkmale_build.py – nicht von Hand ändern\nwindow.MANTODEA_MM=' +
                                                      json.dumps(out, ensure_ascii=False, separators=(',', ':')) + ';\n')
mit = sum(1 for x in SP if x['k'] in arten or x['g'] in gatt or x['f'] in fam)
print('Zeilen', len(Z), 'Arten mit eigenen Merkmalen', len(arten), 'Gattungen', len(gatt), 'Familien', len(fam), 'Arten mit irgendeinem Merkmal', mit)
print('Regionen', collections.Counter(z[0] for z in Z).most_common())
