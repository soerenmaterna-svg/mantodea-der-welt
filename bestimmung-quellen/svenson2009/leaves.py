import sys, json; sys.setrecursionlimit(10000)
exec(open('tree2.py').read().split("if __name__")[0])
def leaves(p):
    tr, tips, used, _ = topo(p)
    L = []; typ = []; MK = []
    def conv(n):
        if n[0] == 'T': L.append(tips[n[1]]['y']); typ.append('T'); return ('L', len(L) - 1)
        if n[0] == '?': L.append(n[2]); typ.append('?'); return ('L', len(L) - 1)
        if n[0] == 'M': MK.append((n[1], n[2])); return ('M', len(MK) - 1)
        kids = [conv(c) for c in n[1]]
        return ('N', kids)
    t = conv(tr)
    # fast gleiche Höhe = dieselbe Spitze (doppelt gezeichnet)
    drop = set(); srt = sorted(range(len(L)), key=lambda i: L[i])
    for a, b in zip(srt, srt[1:]):
        if L[b] - L[a] < 1.2: drop.add(b)
    for i in range(len(L)):
        if typ[i] == '?' and any(typ[j] == 'T' and abs(L[j] - L[i]) < 4.2 for j in range(len(L)) if j != i): drop.add(i)
    def prune(n):
        if n[0] == 'M': return n
        if n[0] == 'L': return None if n[1] in drop else n
        k = [x for x in (prune(c) for c in n[1]) if x]
        return None if not k else (k[0] if len(k) == 1 else ('N', k))
    t = prune(t)
    keep = [i for i in range(len(L)) if i not in drop]; remap = {i: j for j, i in enumerate(keep)}
    def rn(n): return ('L', remap[n[1]]) if n[0] == 'L' else n if n[0] == 'M' else ('N', [rn(c) for c in n[1]])
    t = rn(t); L = [L[i] for i in keep]
    # Reihenfolge nach Höhe
    order = sorted(range(len(L)), key=lambda i: L[i])
    rank = {i: r for r, i in enumerate(order)}
    def ren(n): return ('L', rank[n[1]]) if n[0] == 'L' else ('M', MK[n[1]]) if n[0] == 'M' else ('N', [ren(c) for c in n[1]])
    return ren(t), [L[i] for i in order]
if __name__ == '__main__':
    tot = 0
    for p in range(13, 18):
        t, ys = leaves(p); tot += len(ys)
        close = [round(ys[i+1]-ys[i],1) for i in range(len(ys)-1) if ys[i+1]-ys[i] < 5]
        print(p, len(ys), 'zu dicht:', close)
    print(tot)
