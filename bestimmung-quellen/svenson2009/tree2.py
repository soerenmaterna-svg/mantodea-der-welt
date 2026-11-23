"""Stammbaum aus den Vektorzeichnungen (Abb. 3a-e) rekonstruieren: Äste zusammenfassen, Spitzen über die Beschriftungen."""
import pymupdf, json, sys, collections
d = pymupdf.open('sw.pdf')

def segs(pn):
    H, V, G = [], [], []
    for x in d[pn - 1].get_drawings():
        w = x.get('width') or 0
        if x.get('type') in ('s', 'fs') and w > 1.5:
            for it in x['items']:
                if it[0] == 'l':
                    p, q = it[1], it[2]
                    if abs(p.y - q.y) < .05: H.append([min(p.x, q.x), max(p.x, q.x), p.y])
                    elif abs(p.x - q.x) < .05: V.append([p.x, min(p.y, q.y), max(p.y, q.y)])
                elif it[0] == 're':
                    r = it[1]
                    if r.width >= r.height: H.append([r.x0, r.x1, (r.y0 + r.y1) / 2])
                    else: V.append([(r.x0 + r.x1) / 2, r.y0, r.y1])
        # Glyphen (gefüllte Kurven) für Beschriftungen
        if x.get('fill') and any(it[0] == 'c' for it in x['items']):
            r = x['rect']
            if r.height < 9 and r.width < 12: G.append([r.x0, r.x1, r.y0, r.y1])
    return H, V, G

def merge(L, key, tol=2.6):
    # gleiche Linie (doppelt gezeichnet / gestückelt) zusammenfassen
    L = sorted(L, key=key)
    out = []
    for s in L:
        for o in out:
            if key == 'H':
                pass
        out.append(s)
    return out

def mergeH(H, tol=2.4):
    H = sorted(H, key=lambda h: (round(h[2]), h[0]))
    out = []
    for h in sorted(H, key=lambda h: h[2]):
        for o in out:
            if abs(o[2] - h[2]) < tol and h[0] <= o[1] + tol and h[1] >= o[0] - tol:
                o[0] = min(o[0], h[0]); o[1] = max(o[1], h[1]); o[2] = (o[2] + h[2]) / 2 if abs(o[2]-h[2])<tol else o[2]; break
        else: out.append(list(h))
    return out

def mergeV(V, tol=2.4):
    out = []
    for v in sorted(V, key=lambda v: v[0]):
        for o in out:
            if abs(o[0] - v[0]) < tol and v[1] <= o[2] + tol and v[2] >= o[1] - tol:
                o[1] = min(o[1], v[1]); o[2] = max(o[2], v[2]); break
        else: out.append(list(v))
    return out

def lines(G):
    # Glyphen zu Zeilen gruppieren (gleiche Mitte)
    G = sorted(G, key=lambda g: (g[2] + g[3]) / 2)
    L = []
    for g in G:
        y = (g[2] + g[3]) / 2
        if L and abs(L[-1]['y'] - y) < 2.2: L[-1]['g'].append(g); L[-1]['y'] = (L[-1]['y'] * (len(L[-1]['g']) - 1) + y) / len(L[-1]['g'])
        else: L.append({'y': y, 'g': [g]})
    out = []
    for l in L:
        # in Wörter/Blöcke trennen (große Lücken)
        gs = sorted(l['g'], key=lambda g: g[0]); blk = [[gs[0]]]
        for g in gs[1:]:
            if g[0] - blk[-1][-1][1] > 9: blk.append([g])
            else: blk[-1].append(g)
        for b in blk: out.append({'y': l['y'], 'x0': b[0][0], 'x1': b[-1][1], 'n': len(b)})
    return out

def build(pn):
    H, V, G = segs(pn)
    H = [h for h in H if h[1] - h[0] > 0.3]; V = [v for v in V if v[2] - v[1] > 0.3]
    for _ in range(6):
        n0 = (len(H), len(V)); H = mergeH(H); V = mergeV(V)
        if (len(H), len(V)) == n0: break
    J = 3.6
    def glyph_right(x, y): return [g for g in G if x - 2 <= g[0] <= x + 14 and abs((g[2] + g[3]) / 2 - y) < 3.6]
    cand = []
    for h in H:
        if not any(abs(v[0] - h[1]) < J and v[1] - 2.6 <= h[2] <= v[2] + 2.6 for v in V): cand.append((h[1], h[2]))
    for v in V:
        for y in (v[1], v[2]):
            if not any(abs(h[0] - v[0]) < J and abs(h[2] - y) < 2.6 for h in H): cand.append((v[0], y))
    tips = []
    for x, y in cand:
        g = glyph_right(x, y)
        if len(g) >= 2: tips.append({'x': x, 'y': y, 'lx': min(q[0] for q in g), 'ly': y})
    tips.sort(key=lambda t: t['y']); uniq = []
    for t in tips:
        if uniq and abs(uniq[-1]['y'] - t['y']) < 3:
            if t['x'] > uniq[-1]['x']: uniq[-1] = t
        else: uniq.append(t)
    return H, V, uniq

def topo(pn):
    """Baum als verschachtelte Listen von Spitzen-Indizes (Reihenfolge = von oben nach unten)."""
    H, V, tips = build(pn)
    tol = 2.6
    used = set()
    def tip_at(x, y):
        c = [(abs(t['y'] - y) + abs(t['x'] - x) * .3, i) for i, t in enumerate(tips) if i not in used and abs(t['y'] - y) < 3.2 and abs(t['x'] - x) < 9]
        return min(c)[1] if c else None
    seenV = set()
    def node(v):
        seenV.add(id(v))
        kids = []
        # waagerechte Äste, die an dieser Senkrechten beginnen
        hs = sorted([h for h in H if abs(h[0] - v[0]) < 3.6 and v[1] - tol <= h[2] <= v[2] + tol], key=lambda h: h[2])
        # doppelt gezeichnete Äste: nur einen je Höhe nehmen (den längsten)
        hs2 = []
        for h in sorted(hs, key=lambda h: -(h[1] - h[0])):
            if not any(abs(o[2] - h[2]) < tol for o in hs2): hs2.append(h)
        hs = sorted(hs2, key=lambda h: h[2])
        covered = []
        for h in hs:
            nv = [w for w in V if abs(w[0] - h[1]) < 3.6 and w[1] - tol <= h[2] <= w[2] + tol and w is not v and w[0] > v[0] + 1 and id(w) not in seenV]
            if nv: kids.append(node(min(nv, key=lambda w: abs(w[0] - h[1]))))
            elif any(abs(w[0] - h[1]) < 3.6 and w[1] - tol <= h[2] <= w[2] + tol and w is not v and w[0] > v[0] + 1 for w in V): continue
            else:
                i = tip_at(h[1], h[2])
                kids.append(('T', i) if i is not None else ('?', round(h[1]), round(h[2])))
                if i is not None: used.add(i)
            covered.append(h[2])
        for y in (v[1], v[2]):
            if not any(abs(c - y) < tol for c in covered):
                i = tip_at(v[0], y)
                if i is not None: used.add(i); kids.append(('T', i))
                else: kids.append(('M', round(v[0], 1), round(y, 1)))
        kids.sort(key=lambda k: ymin(k))
        return ('N', kids)
    def ymin(k):
        if k[0] == 'T': return tips[k[1]]['y']
        if k[0] in ('?', 'M'): return k[2]
        return min(ymin(c) for c in k[1]) if k[1] else 0
    root = min(V, key=lambda v: (v[0], -(v[2] - v[1])))
    return node(root), tips, used, (H, V)

if __name__ == '__main__':
    tot = 0
    for p in range(13, 18):
        H, V, tips = build(p)
        tr, tips, used, _ = topo(p)
        tot += len(tips)
        def cnt(k): return 1 if k[0] != 'N' else sum(cnt(c) for c in k[1])
        unk = json.dumps(tr).count('"?"')
        print(p, 'H', len(H), 'V', len(V), 'Spitzen', len(tips), 'im Baum', len(used), 'unbekannte Enden', unk)
    print('gesamt', tot)
