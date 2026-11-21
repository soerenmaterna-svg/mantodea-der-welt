# Liest die "Synopsis"-Tabellen aus Giglio-Tos 1927 (Das Tierreich 50) aus dem pdftotext -layout Text.
# Aufruf: python3 -I gt1927_parse.py <443L.txt> <out.json>
import sys, re, json

L = open(sys.argv[1], encoding='utf8').read().replace('\f', '\n\f').split('\n')

def unspace(s):
    # "r e l i g i o s a" -> "religiosa"
    return re.sub(r'(?<=\b\w) (?=\w\b)', '', s)

def despace_name(s):
    s = s.strip()
    parts = s.split('  ')
    return re.sub(r'\s+', '', s)

TERM = re.compile(r'(?:\.\s*){0,}\s*(?P<num>\d{1,3}|[a-z]{1,2})\s?\.\s*(?P<kind>Gen\s?\.|sousfam\s?\.|Groupe|[A-Z]\s?\.)\s*(?P<name>(?:[A-Za-zäöüéèêëàâïîôûüçÿ]\s?){2,}?)\s*(?P<sex>\((?:[^)]{1,3})\))?\s*$')
TERM2 = re.compile(r'(?P<kind>Groupe)\s+(?P<name>(?:[A-Za-zäöüéèêëàâïîôûüçÿ]\s?){3,})\s*$')
PTR = re.compile(r'[—–-]\s*(\d{1,3})\s*$')

def is_header(l):
    s = l.strip()
    if not s: return True
    if s.startswith('\f'): return True
    if re.fullmatch(r'[\dIVXLC]+', s): return True
    # page headers like "Amorphoscelis    21" or "406   Mantis"
    if re.fullmatch(r'(\d{1,3}\s{3,})?[A-Z][a-zäöüé\-,. ]{2,40}(\s{3,}\d{1,3})?', s) and re.search(r'\s{3,}', s): return True
    return False

def clean_left(l):
    # remove couplet numbers / brace garbage at the start (columns before the text)
    m = re.match(r'^(\s*)((?:[\d]{1,3}|[|/\\{}<>()\[\]lIi!»«™•*tf]|M-|\W){0,6}?\s+)?(?=[A-ZÉÈ«(])', l)
    return l

NAMECH = r"[A-Za-zäöüéèêëàâïîôûüçÿ\-]"
TERMRE = re.compile(r'(?:^|(?<=\.)|(?<=\s\s)|(?<=\. ))\s*(?P<num>\d{1,3}|[a-z]{1,2}|[LlI])\s?[.,]?\s*(?P<kind>Gen\s?\.|sousfam\s?\.|[A-Z]\s?\.(?:\s?[a-z]\s?\.)?|[A-Z](?=\s[a-z]\s[a-z]))\s*(?P<name>(?:' + NAMECH + r'\s?){2,}?)\s*(?:var\s?\.\s*[a-zé]+\s*)?(?P<sex>\([^)]{1,4}\))?\s*(?:\*\s*\)|\*)?\s*[.,]?\s*$')
TERMRE2 = re.compile(r'(?:(?<=\.)|(?<=\s\s))\s*(?:(?P<num>\d{1,3})\s?[.,]\s*)?(?P<kind>[A-Z]\s?\.)\s*(?P<name>(?:' + NAMECH + r' ){2,}' + NAMECH + r')\s*(?P<sex>\([^)]{1,4}\))?\s*$')
TERMRE3 = re.compile(r'(?:(?<=\.)|(?<=\s\s))\s*(?P<num>[a-z]{1,2}|[IVX]{1,4})\s?\.\s*(?P<name>[A-Z](?:' + NAMECH + r'\s?){3,})\s*$')
GRPRE = re.compile(r'(?:^|(?<=\.)|(?<=\s\s))\s*(?:[IVXL]+\.\s*)?Groupe\s+(?P<name>(?:' + NAMECH + r'\s?){3,})\s*$')
GARB = re.compile(r'^(?:\s*(?:\d{1,3}(?!\s+(?:\d|[a-zéèà]{2,}))|[|/\\{}<>()\[\]!»«™•*■^~_‚„"\'`]+|[lIitfrJ](?=\s)|M-\S*))+\s+(?=\S)')

def parse_block(lines):
    leads = []
    for raw in lines:
        if is_header(raw):
            continue
        l = raw.rstrip()
        term = None
        mt = TERMRE.search(l)
        if mt:
            term = {'num': mt.group('num'), 'kind': re.sub(r'\s', '', mt.group('kind')), 'name': despace_name(mt.group('name')), 'sex': (mt.group('sex') or '').strip('()')}
            l = l[:mt.start()]
        else:
            mt = TERMRE2.search(l) or TERMRE3.search(l)
            if mt:
                term = {'num': mt.group('num') or '', 'kind': re.sub(r'\s', '', mt.groupdict().get('kind') or 'Grp'), 'name': despace_name(mt.group('name')), 'sex': ((mt.groupdict().get('sex')) or '').strip('()')}
                l = l[:mt.start()]
        if not term:
            mg = GRPRE.search(l)
            if mg:
                term = {'num': '', 'kind': 'Groupe', 'name': despace_name(mg.group('name')), 'sex': ''}
                l = l[:mg.start()]
        # führende Paarnummern/Klammern entfernen
        l2 = GARB.sub('', l.strip()) if l.strip() else ''
        indent_raw = (l.find(l2[:8]) if l2 else 0)
        txt = re.sub(r'(\s*\.){2,}\s*$', '', l2).strip(' .')
        ptr = None
        mp = PTR.search(txt)
        if mp:
            ptr = int(mp.group(1)); txt = txt[:mp.start()].strip()
        elif re.fullmatch(r'[—–-]\s*\d{1,3}', l2.strip()):
            ptr = int(re.sub(r'\D', '', l2)); txt = ''
        if txt:
            starts_new = bool(re.match(r'[A-ZÉÈÀÇ«]|\d{1,2}(?:-\d{1,2})? [a-zéèà]', txt)) and not (leads and leads[-1]['end'] is None and re.match(r'[a-zé]', leads[-1]['t'][-1:] or 'x') and leads[-1]['t'].endswith('-'))
            if leads and leads[-1]['end'] is None and not starts_new:
                leads[-1]['t'] += ' ' + txt
            elif leads and leads[-1]['end'] is None and starts_new:
                # Großbuchstabe am Zeilenanfang: neuer Abschnitt, außer die Zeile ist eingerückt (Fortsetzung)
                if indent_raw > leads[-1]['ind'] + 2 and not re.match(r'[A-Z][a-zé]+s? (ant|post|int|ext)', txt):
                    leads[-1]['t'] += ' ' + txt
                else:
                    leads.append({'t': txt, 'end': None, 'ind': indent_raw})
            else:
                leads.append({'t': txt, 'end': None, 'ind': indent_raw})
        if ptr is not None:
            tgt = next((ld for ld in reversed(leads) if ld['end'] is None), None)
            if tgt is None: return leads, 'pointer without lead'
            tgt['end'] = ('p', ptr)
        if term:
            tgt = next((ld for ld in leads if ld['end'] is None), None)
            if tgt is None: return leads, 'terminal without lead: %s' % term['name']
            tgt['end'] = ('t', term)
    return leads, None

def validate(leads):
    if any(l['end'] is None for l in leads): return 'lead without end'
    if len(leads) % 2: return 'odd number of leads (%d)' % len(leads)
    n = len(leads) // 2
    refs = {}
    for i, l in enumerate(leads):
        if l['end'][0] == 'p':
            p = l['end'][1]; c = i // 2 + 1
            if p <= c or p > n: return 'bad pointer %d in couplet %d (n=%d)' % (p, c, n)
            refs[p] = refs.get(p, 0) + 1
    for c in range(2, n + 1):
        if refs.get(c, 0) != 1: return 'couplet %d referenced %d times' % (c, refs.get(c, 0))
    return None

GEN = re.compile(r'^\s*(\d{1,3})\.\s*Gen\s?\.\s*((?:[A-Z]\s?)(?:[a-zäöüéèêëàâïîôûüç]\s?)+)')
SF = re.compile(r'^\s*([a-z]{1,2})\.\s*(?:Sub\w{1,4}|sousfam|Sousfam)\s?\.\s*((?:[A-Z]\s?)(?:[a-z]\s?){4,}?inae)')
GRP = re.compile(r'^\s*([IVXL]+|[a-zßòT]{1,2})\.\s*Groupe\s+((?:[A-Z]\s?)(?:[a-z]\s?)+)\s*$')

def nextyear(k):
    for t in range(k + 1, min(k + 4, len(L))):
        if L[t].strip():
            return bool(re.match(r'\s*1[789]\d\d\s', L[t]))
    return False

out = []
ctx = {'gen': None, 'sf': None, 'grp': None}
i = 0
syn_idx = [k for k, l in enumerate(L) if re.search(r'Synopsis d[eè]s? ', l) and not 'nicht unter' in l]
# context scan
ctxs = {}
def dsp(s):
    # Sperrschrift zusammenziehen: "P e r l a m a n t i n a e" -> "Perlamantinae"
    return re.sub(r'(?<=\b[A-Za-zäöüéèêëàâïîôûüç]) (?=[A-Za-zäöüéèêëàâïîôûüç]\b)', '', s)
SF2 = re.compile(r'^\s*([a-z]{1,2}|[A-Z0]{1,2})\.\s*(?:Sub\w{0,4}|Unterfam|Sousfam)\s?\.?\s*([A-Z][a-z]+inae)\b')
GRP2 = re.compile(r'^\s*(?:[IVXL]+|[a-zßòTÔ]{1,2}|[αβγδεζ])\s?\.\s*Groupe\s+([A-Z][a-z]+)\s*$')
for k, l in enumerate(L):
    d = dsp(l)
    m = GEN.match(l)
    if m and nextyear(k): ctx['gen'] = despace_name(m.group(2)); ctxs[k] = dict(ctx)
    m = SF2.match(d)
    if m and not re.search(r'\.\s*\.\s*\.', d) and len(d.strip()) < 60: ctx['sf'] = m.group(2); ctx['gen'] = None; ctx['grp'] = None; ctxs[k] = dict(ctx)
    m = GRP2.match(d)
    if m and k > 2400: ctx['grp'] = m.group(1); ctx['gen'] = None; ctxs[k] = dict(ctx)
    if k in syn_idx: ctxs[k] = dict(ctx)

for si, k in enumerate(syn_idx):
    head = L[k].strip()
    kind = 'espèces' if re.search('esp', head) else 'genres' if 'genres' in head else 'groupes' if 'groupes' in head else 'sous-familles' if 'sous-familles' in head else head
    # block end: next account header line (species or genus account) or next Synopsis
    end = syn_idx[si + 1] if si + 1 < len(syn_idx) else len(L)
    j = k + 1
    while j < end:
        l = L[j]
        mm = re.match(r'^(\s*)([\dlI]{1,3})\s?[.,]\s*([A-Z]\s?[.\-]|Gen\s?\.)', l)
        if mm and (nextyear(j) or (len(mm.group(1)) < 24 and re.search(r'\s1[789]\d\d\s', l))):
            break
        if re.match(r'^\s{0,10}1[789]\d\d\s+[A-Z][a-z]*\s?[.,a-z]', l) and j > k + 2:
            j -= 1
            break
        if SF.match(l) or GRP.match(l): break
        j += 1
    block = L[k + 1:j]
    leads, err = parse_block(block)
    if not err: err = validate(leads)
    out.append({'line': k + 1, 'kind': kind, 'ctx': ctxs.get(k), 'err': err,
                'leads': [{'t': unspace(x['t']), 'end': x['end']} for x in leads], 'raw': '\n'.join(block)})

# Kapitelgliederung in Dokumentreihenfolge
heads = []
SPH = re.compile(r'^(\s{0,30})[\dlI]{1,3}\s?[.,]\s*[A-Z]\s?[.\-]\s*((?:[a-zäöüéèêëàâïîôûüç]\s?){3,})')
for k, l in enumerate(L):
    d = dsp(l)
    m = SF2.match(d)
    if m and not re.search(r'\.\s*\.\s*\.', d) and len(d.strip()) < 60 and k > 2500: heads.append(['sf', m.group(2), k + 1]); continue
    m = GRP2.match(d)
    if m and k > 2500: heads.append(['grp', m.group(1), k + 1]); continue
    m = GEN.match(l)
    if m and nextyear(k) and k > 2500: heads.append(['gen', despace_name(m.group(2)), k + 1]); continue
    m = SPH.match(l)
    if m and k > 2500 and (nextyear(k) or (len(m.group(1)) < 24 and re.search(r'\s1[789]\d\d\s', l))): heads.append(['sp', despace_name(m.group(2)), k + 1])
json.dump({'syn': out, 'heads': heads}, open(sys.argv[2], 'w', encoding='utf8'), ensure_ascii=False, indent=0)
from collections import Counter as C2
print('heads', C2(h[0] for h in heads))
ok = sum(1 for o in out if not o['err'])
print('synopses', len(out), 'ok', ok)
from collections import Counter
print(Counter((o['err'] or 'ok').split(' ')[0] + ' ' + ((o['err'] or '').split(' ')[1] if o['err'] and len(o['err'].split(' '))>1 else '') for o in out).most_common(12))
