"""Build the officials directory page.
Usage: python3 prototype/tools/build_officials.py data prototype/officials.template.html prototype/officials.html design/map/marks.json [design/map/pasig-map.json]
Reads data/officials.json (city officials) and data/officials-directory.json (barangays, ex officio, departments)."""
import json, sys, os, datetime
D, T, OUT, MARKS = sys.argv[1:5]
MAPF = sys.argv[5] if len(sys.argv) > 5 else os.path.join(os.path.dirname(MARKS), 'pasig-map.json')
off = json.load(open(os.path.join(D, 'officials.json')))
dirx = json.load(open(os.path.join(D, 'officials-directory.json')))
mark = json.load(open(MARKS))['smooth']
pmap = json.load(open(MAPF))
pmap = pmap['barangays'] if isinstance(pmap, dict) else pmap

TRUNK_SRC = 'https://assets.pasigcity.gov.ph/storage/attachments/city_treasurer\'s_office/686b08431a5401751844931Citizen_s%20Charter%20English.pdf'
def fmt(n):
    n = str(n).strip(); d = n.replace('-', '').replace(' ', '')
    if d.isdigit() and len(d) == 8: return f'(02) {d[:4]}-{d[4:]}'
    if d.isdigit() and len(d) == 7: return f'(02) {d[:3]}-{d[3:]}'
    if n.startswith('(02) ') and n[5:].replace('-', '').isdigit() and len(n[5:].replace('-', '')) == 7:
        x = n[5:].replace('-', ''); return f'(02) {x[:3]}-{x[3:]}'
    return n
def is7(n):
    d = ''.join(c for c in n if c.isdigit())
    return len(d) == 9 and d.startswith('02')
ROLE = {'Mayor': 'Punong Lungsod (Mayor)', 'Vice Mayor': 'Pangalawang Punong Lungsod (Vice Mayor)', 'Representative': 'Kinatawan, Lone District (Kongreso)'}
def nums(arr):
    out = []
    for p in arr or []:
        n = p['number'] if isinstance(p, dict) else p
        if n and not str(n).lower().startswith('local'):
            out.append(n)
    return out
def anyv(*xs): return any(bool(x) for x in xs)

execu = []
for o in off['officials']:
    if o['position'] in ROLE:
        execu.append({'name': o['name'], 'role': ROLE[o['position']], 'phones': o.get('phones') or (['(02) 8643-1111'] if o['position'] != 'Representative' else []),
                      'email': o.get('email'), 'office': o.get('office') or ('Sa City Hall trunkline; hilingin ang opisina' if o['position'] != 'Representative' else 'District office: hindi pa tukoy'),
                      'sources': o['sources'][:1] + ([TRUNK_SRC] if o['position'] != 'Representative' else []), 'verify': o.get('verify', False)})
dist = {1: [], 2: []}
for o in off['officials']:
    if o['position'] == 'Councilor':
        dist[o['district']].append({'name': o['name'], 'role': 'Konsehal', 'verify': o.get('verify', False)})
exo = [{'name': x['name'], 'role': ('Pangulo, Liga ng mga Barangay' if 'Liga' in x['position'] else 'Pangulo, SK Federation') + f" ({x['barangay']})", 'verify': x.get('verify', True)} for x in dirx['ex_officio']]

depts = []
for x in dirx['departments']:
    short = None
    if '(' in x['office'] and x['office'].endswith(')'):
        name, short = x['office'][:-1].split(' (', 1)
    else:
        name = x['office']
    depts.append({'name': name, 'short': short, 'head': x.get('head'), 'phones': nums(x.get('phones')), 'email': x.get('email'), 'location': x.get('location'),
                  'sources': x.get('sources', [])[:2], 'verify': anyv(x.get('verify'), *[p.get('verify') for p in x.get('phones', []) if isinstance(p, dict)])})

brgys = []
for b in dirx['barangays']:
    pb, sk, ha = b.get('punong_barangay') or {}, b.get('sk_chair') or {}, b.get('hall_address') or {}
    srcs = []
    for part in [pb, sk, ha] + list(b.get('phones') or []):
        for s in (part.get('sources') or []) if isinstance(part, dict) else []:
            if s not in srcs: srcs.append(s)
    brgys.append({'name': b['name'], 'district': b['district'], 'punong_barangay': pb.get('name'), 'sk_chair': sk.get('name'),
                  'kagawad': [k['name'] for k in b.get('kagawad') or []], 'address': ha.get('value'),
                  'phones': list(dict.fromkeys(fmt(n) for n in nums(b.get('phones')))),
                  'email': b.get('email'), 'facebook': b.get('facebook'), 'sources': srcs,
                  'verify': anyv(pb.get('verify'), sk.get('verify'), *[p.get('verify') for p in b.get('phones') or []])})
    brgys[-1]['old7'] = any(is7(n) for n in brgys[-1]['phones'])

asof = datetime.date.fromisoformat(dirx['retrieved'])
MONTHS = ['Enero','Pebrero','Marso','Abril','Mayo','Hunyo','Hulyo','Agosto','Setyembre','Oktubre','Nobyembre','Disyembre']
nver = sum(1 for b in brgys if b['verify']) + sum(1 for d in depts if d['verify'])
data = {
    'mark': mark,
    'as_of_label': f"{asof.day} {MONTHS[asof.month-1]} {asof.year}",
    'counts': f"{len(execu) + len(dist[1]) + len(dist[2]) + len(exo)} opisyal ng lungsod · {len(depts)} opisina · {len(brgys)} barangay · {nver} ang sinusuri pa",
    'term_note': 'Tungkol sa termino: ang mga barangay at SK official na nahalal noong Oktubre 2023 ay nanunungkulan pa. Ipinagpaliban ng RA 12326 (Setyembre 24, 2026) ang halalan sa Nobyembre 2026 at itinakda ang susunod na BSKE sa Nobyembre 13, 2028. May mga petisyon pa sa Korte Suprema. Ang mga pangalan at numero ng barangay ay galing sa mga direktoryo at hindi pa nakukumpirma sa opisyal na listahan ng Lungsod, kaya "Sinusuri pa" ang lahat hanggang matawagan o makumpirma.',
    'city': {'executive': execu, 'council': {'district1': dist[1], 'district2': dist[2], 'ex_officio': exo, 'contact': {'phones': ['(02) 8643-1111'], 'email': None, 'sources': [TRUNK_SRC]}}},
    'departments': depts,
    'barangays': brgys,
}
html = open(T).read().replace('/*DATA*/', json.dumps(data, ensure_ascii=False)).replace('/*MAP*/', json.dumps([{'name': m['name'], 'd': m['d']} for m in pmap], ensure_ascii=False))
open(OUT, 'w').write(html)
print('wrote', OUT, len(html), 'bytes;', len(brgys), 'barangays,', len(depts), 'offices,', nver, 'to verify')
