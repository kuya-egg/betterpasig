import json, math, sys
from shapely.geometry import shape, mapping
from shapely.ops import unary_union
from shapely import affinity
src = sys.argv[1]
g = json.load(open(src))
feats = g['features']
print('features', len(feats), list(feats[0]['properties'].keys()))
print(sorted(f['properties'].get('ADM4_EN') or str(f['properties']) for f in feats))
polys = [shape(f['geometry']).buffer(0) for f in feats]
city = unary_union(polys)
lat0 = city.centroid.y
k = math.cos(math.radians(lat0))
def proj(geom):
    g2 = affinity.scale(geom, xfact=k, yfact=-1, origin=(0, 0))
    return g2
c = proj(city); b = c.bounds
print('bounds', b, 'area parts', getattr(c, 'geoms', [c]).__len__() if hasattr(c,'geoms') else 1)
def to_path(geom, size, tol):
    gg = geom.simplify(tol, preserve_topology=True)
    minx, miny, maxx, maxy = b
    s = size / max(maxx - minx, maxy - miny)
    ox = (size - (maxx - minx) * s) / 2; oy = (size - (maxy - miny) * s) / 2
    parts = gg.geoms if hasattr(gg, 'geoms') else [gg]
    d = []
    for p in parts:
        if p.area < (maxx-minx)*(maxy-miny)*0.002: continue
        pts = list(p.exterior.coords)
        d.append('M' + 'L'.join(f'{(x-minx)*s+ox:.1f} {(y-miny)*s+oy:.1f}' for x, y in pts) + 'Z')
    return ' '.join(d), len(d)
w = b[2]-b[0]
out = {}
for name, size, tolf in [('logo', 48, 0.012), ('mark', 48, 0.006), ('map', 600, 0.0015)]:
    d, n = to_path(c, size, w*tolf)
    out[name] = d; print(name, n, len(d))
# barangay paths for map
bs = []
minx, miny, maxx, maxy = b; s = 600 / max(maxx-minx, maxy-miny); ox=(600-(maxx-minx)*s)/2; oy=(600-(maxy-miny)*s)/2
for f, p in zip(feats, polys):
    pp = proj(p).simplify(w*0.0015, preserve_topology=True)
    parts = pp.geoms if hasattr(pp,'geoms') else [pp]
    d = ' '.join('M'+'L'.join(f'{(x-minx)*s+ox:.1f} {(y-miny)*s+oy:.1f}' for x,y in q.exterior.coords)+'Z' for q in parts if q.area>0)
    cen = proj(p).representative_point()
    bs.append({'name': f['properties'].get('ADM4_EN'), 'd': d, 'cx': round((cen.x-minx)*s+ox,1), 'cy': round((cen.y-miny)*s+oy,1)})
out['barangays'] = bs
out['aspect'] = (maxx-minx)/(maxy-miny)
json.dump(out, open(sys.argv[2], 'w'))
print('aspect', out['aspect'])
