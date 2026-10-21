import json, math, sys
from shapely.geometry import shape
from shapely.ops import unary_union
from shapely import affinity
g = json.load(open(sys.argv[1])); feats = g['features']
polys = [shape(f['geometry']).buffer(0) for f in feats]
city = unary_union(polys); k = math.cos(math.radians(city.centroid.y))
P = lambda geom: affinity.scale(geom, xfact=k, yfact=-1, origin=(0, 0))
C = P(city); minx, miny, maxx, maxy = C.bounds; W = maxx - minx; H = maxy - miny
def fit(size, pad):
    s = (size - 2*pad) / max(W, H); return s, (size - W*s)/2, (size - H*s)/2
def path(geom, size, pad, dec=1):
    s, ox, oy = fit(size, pad)
    parts = geom.geoms if hasattr(geom, 'geoms') else [geom]
    out = []
    for p in parts:
        if p.is_empty or p.area <= 0: continue
        ring = list(p.exterior.coords)
        out.append('M' + 'L'.join(f'{(x-minx)*s+ox:.{dec}f} {(y-miny)*s+oy:.{dec}f}' for x, y in ring) + 'Z')
    return ''.join(out)
e = W * 0.02
smooth = C.buffer(e, join_style=1).buffer(-2*e, join_style=1).buffer(e, join_style=1).simplify(W*0.006)
res = {'smooth': path(smooth, 48, 3), 'detail': path(C.simplify(W*0.004), 48, 3)}
gap = W * 0.006
pieces = []
for p in polys:
    q = P(p).buffer(-gap/2, join_style=1).simplify(W*0.004)
    if not q.is_empty: pieces.append(path(q, 48, 3))
res['pieces'] = ''.join(pieces)
# map at 560 box, integer coords
s, ox, oy = fit(560, 8)
br = []
for f, p in zip(feats, polys):
    q = P(p).simplify(W*0.0012)
    nm = f['properties']['ADM4_EN'].replace(' (Pob.)', '')
    rp = P(p).representative_point()
    br.append({'name': nm, 'd': path(q, 560, 8, 0), 'x': round((rp.x-minx)*s+ox), 'y': round((rp.y-miny)*s+oy)})
res['map'] = br; res['mapW'] = round(W*s+2*ox); res['mapH'] = 560
for k2 in ('smooth', 'detail', 'pieces'): print(k2, len(res[k2]))
print('map chars', sum(len(b['d']) for b in br))
json.dump({'barangays': br, 'w': 560, 'h': 560, 'source': 'PSA PSGC boundaries via faeldon/philippines-json-maps (MIT), 2019 hires'}, open(sys.argv[2], 'w'), separators=(',', ':'))
json.dump({k2: res[k2] for k2 in ('smooth', 'detail', 'pieces')}, open(sys.argv[3], 'w'))
