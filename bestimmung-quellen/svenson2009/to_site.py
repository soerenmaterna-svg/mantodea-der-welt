"""Svenson & Whiting 2009 (Abb. 3, ML-Baum) -> Eintrag für data/stammbaeume.js (Familienebene wie bei den anderen Bäumen, Gattungen/Arten nach Katalog)."""
import json, collections, copy
R = '/home/user/mantodea-der-welt/data/'
s = open(R + 'stammbaum.js').read(); CAT = json.loads(s[s.index('=') + 1:s.rindex('}') + 1])
sp = open(R + 'species.js').read(); SP = json.loads(sp[sp.index('=') + 1:sp.rindex('}') + 1])['species']
NAMES = {x['n'] for x in SP}
SYN = json.loads(open(R + 'synonyme.js').read().split('=', 1)[1].rstrip().rstrip(';'))
syn = {}
for x in SP:
    for y in SYN.get(x['k'], {}).get('s', []): syn[y[0]] = x['n']
GSYN = {'Ephippiomantis': 'Majangella', 'Oromantis': 'Stagmomantis', 'Oxythespis': 'Oxyothespis', 'Phyllovates': 'Pseudovates',
        'Pseudothespis': 'Arria', 'Rogermantis': 'Dystactula', 'Xanthomantis': 'Pliacanthopus'}
# Katalog: Gattung/Tribus -> Familie; Familien-Teilbäume
FAM_OF, FAMNODE = {}, {}
def walk(n, fam):
    if n['r'] == 'family': fam = n['n']; FAMNODE[fam] = n
    if fam and n['r'] in ('genus', 'tribe', 'subfamily'): FAM_OF[n['n']] = fam
    for c in n.get('c', []): walk(c, fam)
walk(CAT, None)

t = json.load(open('sw_full.json'))
def tips(n): return [n[1]] if n[0] == 'S' else [x for c in n[1] for x in tips(c)]
mant = t[1][1]                       # Wurzel: [Außengruppe, Mantodea]
assert tips(mant)[0] == 'Chaeteessa valida'

def cur(name):
    """heutiger Artname (bzw. Gattung) für eine Spitze"""
    if name.startswith('Danuriini'): return None, 'Danuriini'
    g, ep = name.split()[0], name.split()[1]
    g2 = GSYN.get(g, g)
    if ep == 'sp.': return None, g2
    n2 = g2 + ' ' + ep
    if n2 in NAMES: return n2, g2
    if name in syn: return syn[name], syn[name].split()[0]
    if n2 in syn: return syn[n2], syn[n2].split()[0]
    return None, g2
def fam(name):
    a, g = cur(name)
    return FAM_OF.get(g)

# Familie je Spitze; größter reiner Ast je Familie
def famset(n): return {fam(x) for x in tips(n)}
best = {}
def scan(n):
    fs = famset(n)
    if len(fs) == 1 and None not in fs:
        f = next(iter(fs)); k = len(tips(n))
        if f not in best or k > best[f][0]: best[f] = (k, id(n))
        return
    if n[0] == 'N': [scan(c) for c in n[1]]
scan(mant)
reps = {v[1]: f for f, v in best.items()}
anzahl = collections.Counter(fam(x) for x in tips(mant))
# reine Äste je Familie zählen (für "keine geschlossene Gruppe")
pure = collections.Counter()
def scan2(n):
    fs = famset(n)
    if len(fs) == 1 and None not in fs: pure[next(iter(fs))] += 1; return
    if n[0] == 'N': [scan2(c) for c in n[1]]
scan2(mant)

# Großgruppen der Studie (Abb. 3/5): Eumantodea = alle heutigen, Artimantodea = ohne Chaeteessa/Mantoida, Cernomantodea = ab Knoten 48
def mrca_of(names):
    best = [None]
    def w(n):
        if n[0] != 'N': return
        if all(x in tips(n) for x in names): best[0] = n; [w(c) for c in n[1]]
    w(mant); return best[0]
CLADES = {id(mant): 'Eumantodea', id(mrca_of(['Pseudomiopteryx guyanensis', 'Vates sp.'])): 'Artimantodea',
          id(mrca_of(['Gonypetella sp.', 'Vates sp.'])): 'Cernomantodea'}

def famtree(n):
    if id(n) in reps:
        f = reps[id(n)]; node = copy.deepcopy(FAMNODE[f])
        if pure[f] > 1: node['note'] = 'in dieser Studie keine geschlossene Gruppe'
        return node
    if n[0] == 'S': return None
    kids = [k for k in (famtree(c) for c in n[1]) if k]
    nm = CLADES.get(id(n), '')
    if not kids: return None
    if len(kids) == 1 and not nm: return kids[0]
    return {'n': nm, 'r': 'clade', 'c': kids}
tree = famtree(mant)
used = set()
def u(n):
    if n['r'] == 'family': used.add(n['n'])
    for c in n.get('c', []): u(c)
u(tree)
rest = sorted(f for f in FAMNODE if f not in used)
if rest:
    tree['c'].append({'n': 'in der Studie nicht untersucht', 'r': 'clade', 'note': 'Familien ohne Probe in dieser Studie', 'c': [copy.deepcopy(FAMNODE[f]) for f in rest]})
tree = {'n': 'Mantodea', 'r': 'order', 'a': CAT.get('a', ''), 'c': tree['c'] if tree['n'] == 'Eumantodea' and False else [tree]}

# untersuchte Arten / Gattungen
arten, gattungen, hinweis = set(), set(), {}
for x in tips(mant):
    a, g = cur(x)
    if a:
        arten.add(a)
        if a != x and not x.startswith(a): hinweis[a] = 'in der Studie als ' + x
        elif a != x: pass
    elif g and g != 'Danuriini': gattungen.add(g)
for a in list(arten): gattungen.discard(a.split()[0])
studie = {'arten': sorted(arten), 'gattungen': sorted(gattungen), 'hinweis': hinweis}
nicht = sorted(f for f in used if pure[f] > 1)
print('Familien im Baum', len(used), '; nicht geschlossen:', nicht, '; ohne Probe:', rest)
print('untersuchte Arten', len(arten), 'Gattungen nur mit sp.', len(gattungen), 'Hinweise', hinweis)
json.dump({'tree': tree, 'studie': studie, 'nicht': nicht, 'rest': rest}, open('sw_site.json', 'w'), ensure_ascii=False)
