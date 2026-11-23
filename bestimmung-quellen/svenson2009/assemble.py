"""Gesamtbaum (Artebene) aus den 5 Seiten zusammensetzen: Spitzen benennen, Handergänzungen einsetzen, Seiten an den Markierungen verbinden."""
import sys, json, re
sys.setrecursionlimit(10000)
from leaves import leaves
from labels import L, PATCH

# Anschlussstellen (Seite: (x, y) unten = Fortsetzung, oben = Einstieg)
CONT = {13: (149.3, 688.1), 14: (87.4, 657.0), 15: (115.6, 690.3), 16: (91.2, 672.2)}
ENTRY = {14: (75.5, 84.0), 15: (78.2, 85.2), 16: (83.8, 86.5), 17: (59.8, 88.6)}

def parse_newick(s):
    pos = 0
    def node():
        nonlocal pos
        if s[pos] == '(':
            pos += 1; kids = [node()]
            while s[pos] == ',': pos += 1; kids.append(node())
            assert s[pos] == ')'; pos += 1
            return ('N', kids)
        m = re.match(r'[^,()]+', s[pos:]); pos += m.end()
        return ('S', m.group(0).strip())
    return node()

def tips(n):
    if n[0] == 'S': return [n[1]]
    if n[0] == 'N': return [t for c in n[1] for t in tips(c)]
    return []

def page_tree(p):
    t, ys = leaves(p)
    names = [x for x in L[p] if not x.startswith('+')]
    assert len(names) == len(ys), (p, len(names), len(ys))
    def lab(n):
        if n[0] == 'L': return ('S', names[n[1]])
        if n[0] == 'M':
            x, y = n[1]
            if p in CONT and abs(x - CONT[p][0]) < 1 and abs(y - CONT[p][1]) < 1: return ('C',)
            return None   # Einstieg oder Störstelle
        k = [z for z in (lab(c) for c in n[1]) if z]
        return None if not k else (k[0] if len(k) == 1 else ('N', k))
    return lab(t)

def replace_clade(t, anchors, new):
    # kleinster Teilbaum, der alle Anker enthält, wird ersetzt
    best = [None]
    def walk(n, path):
        if n[0] != 'N': return
        ts = tips(n)
        if all(a in ts for a in anchors):
            best[0] = path
        for i, c in enumerate(n[1]): walk(c, path + [i])
    walk(t, [])
    path = best[0]; assert path is not None, anchors
    old = t
    for i in path: old = old[1][i]
    lost = [x for x in tips(old) if x not in tips(new)]
    # gleich viele Vorkommen prüfen
    import collections
    co, cn = collections.Counter(tips(old)), collections.Counter(tips(new))
    extra = {k: cn[k] - co.get(k, 0) for k in cn if cn[k] > co.get(k, 0)}
    print('  Ergänzung', anchors[0], '… ersetzt', len(tips(old)), 'Spitzen durch', len(tips(new)), '; neu:', extra, '; verloren:', [k for k in co if co[k] > cn.get(k, 0)])
    def put(n, path):
        if not path: return new
        k = list(n[1]); k[path[0]] = put(k[path[0]], path[1:]); return ('N', k)
    return put(t, path)

def splice(a, b):
    if a[0] == 'C': return b
    if a[0] == 'N': return ('N', [splice(c, b) for c in a[1]])
    return a

full = None
for p in range(17, 12, -1):
    t = page_tree(p)
    for pp, anchors, nw in PATCH:
        if pp == p: t = replace_clade(t, anchors, parse_newick(nw))
    full = t if full is None else splice(t, full)
ts = tips(full)
print('Spitzen gesamt', len(ts), '; davon Mantodea', len(ts) - 15)
json.dump(full, open('sw_full.json', 'w'))

# Mehrfachverzweigungen nach der Abbildung auflösen (erster Name des jeweiligen Asts -> Gruppierung)
FIX = [
 (['Pseudomiopteryx guyanensis', 'Brunneria sp.', 'Metallyticus fallax'], [[0, 1], 2]),        # Knoten (8)
 (['Brunneria sp.', 'Hagiomantis superba', 'Macromantis nicaraguae'], [0, [1, 2]]),           # Knoten 28
 (['Bolbella punctigera', 'Dystactula grisea', 'Rogermantis royi'], [[0, 1], 2]),            # Knoten (58)
 (['Nilomantis edmundsi', 'Sceptuchus simplex', 'Tylomantis sp.'], [0, [1, 2]]),             # Knoten (99)
 (['Tylomantis sp.', 'Neomantis hyalina', 'Bolbe pallida'], [0, [1, 2]]),                    # Knoten (109)
 (['Oxyophthalma engaea', 'Schizocephala bicornis', 'Antistia maculipennis'], [0, [1, 2]]),  # Knoten (148)
 (['Idolomantis diabolica', 'Theopompella chopardi', 'Danuriini unbestimmt'], [0, [1, 2]]),  # Knoten (252)
 (['Phyllocrania paradoxa', 'Euantissa pulchra', 'Ceratocrania macra'], [0, [1, 2]]),        # Knoten (205)
 (['Hymenopus coronatus', 'Creobroter apicalis', 'Pseudocreobotra ocellata'], [0, [1, 2]]),  # Knoten (213)
 (['Ceratomantis ghatei', 'Ephestiasula intermedia', 'Junodia amoena'], [[0, 1], 2]),        # Knoten (226)
]
def fix(n):
    if n[0] != 'N': return n
    kids = [fix(c) for c in n[1]]
    if len(kids) > 2:
        first = [tips(c)[0] for c in kids]
        for names, spec in FIX:
            if first == names:
                g = lambda s: kids[s] if isinstance(s, int) else ('N', [g(x) for x in s])
                return ('N', [g(s) for s in spec])
        print('  ungelöst:', first)
    return ('N', kids)
full = fix(full)
poly = [0]
def cntp(n):
    if n[0] == 'N':
        if len(n[1]) > 2: poly[0] += 1
        [cntp(c) for c in n[1]]
cntp(full); print('verbleibende Mehrfachverzweigungen', poly[0])
json.dump(full, open('sw_full.json', 'w'))
