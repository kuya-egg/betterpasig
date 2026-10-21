import json, sys, os
D = sys.argv[1]; T = sys.argv[2]; OUT = sys.argv[3]
L = lambda f: json.load(open(os.path.join(D, f)))
svc, hot, brg, off, prog, tr, city = [L(f) for f in ['services.json','hotlines.json','barangays.json','officials.json','programs.json','transparency.json','city.json']]
catname = {c['id']: c['name_fil'] for c in svc['categories']}
services = [{'t': s['title_fil'], 'c': catname[s['category']], 'k': (s['title_fil']+' '+s.get('title_en','')+' '+catname[s['category']]+' '+s.get('summary_fil','')).lower()} for s in svc['services']]
cats = []
for c in svc['categories']:
    ss = [s for s in svc['services'] if s['category']==c['id']]
    cats.append({'name': c['name_fil'], 'n': len(ss), 'top': [s['title_fil'] for s in ss[:3]]})
hmap = {h['id']: h for h in hot['hotlines']}
def num(i): return hmap[i]['numbers'][0].replace('(02) ','')
hotlines = [
 {'label':'Pasig Hotline','num':num('pasig-emergency-hotline')},
 {'label':'Text','num':num('pasig-katxt')},
 {'label':'National','num':num('national-emergency-911')},
 {'label':'City Hall','num':num('pasig-city-hall-trunkline')},
]
for h in hotlines: h['tel']=h['num'].replace('-','')
featured = [  # display shortening of services.json entries; full text stays in the JSON
 {'id':'certified-copy-civil-document','title':'Kopya ng birth o marriage certificate','office':'City Civil Registry','time':'Mga 50 minuto','fee':'₱120 (birth)'},
 {'id':'pay-real-property-tax','title':'Magbayad ng amilyar','office':'City Treasurer','time':'Mga 7 minuto','fee':'2.5% ng assessed value'},
 {'id':'business-permit-renewal','title':'I-renew ang business permit','office':'BPLD','time':'Mga 90 minuto','fee':'Ayon sa assessment'},
 {'id':'senior-citizen-id','title':'Senior Citizen ID at booklet','office':'OSCA','time':'11 hanggang 14 minuto','fee':'Libre'},
 {'id':'aics','title':'Tulong pinansyal (AICS)','office':'Social Welfare Assistance Center','time':'Mga 45 minuto','fee':'Libre'},
 {'id':'scholarship-new','title':'Pasig City scholarship','office':'Education Dept., Scholarships','time':'15 hanggang 20 araw','fee':'Libre'},
]
smap = {s['id']: s for s in svc['services']}
for f in featured: f['online'] = bool(smap[f['id']]['online'].get('available'))
def cap(b):
    v = b.get('punong_barangay'); 
    return v if isinstance(v,str) else (v[0] if v else None)
def con(b):
    v = b.get('contact')
    return v if isinstance(v,str) else (v[0] if v else None)
barangays = [{'name':b['name'],'district':b.get('district'),'captain':cap(b),'contact':con(b),'verify':b.get('verify',True)} for b in brg['barangays']]
O = off['officials']
short = lambda n: n
top = [{'pos':'Mayor','name':'Vico Sotto'},{'pos':'Vice Mayor','name':'Dodot Jaworski Jr.'},{'pos':'Kinatawan, Lone District','name':'Roman Romulo'}]
council = [{'label':'Konsehal, unang distrito','names':['Simon Tantoco','Kiko Rustia','Pao Santiago','Volta Delos Santos','Eric Gonzales','Paul Senogat']},
           {'label':'Konsehal, ikalawang distrito','names':['Angelu De Leon','Maro Martires','Buboy Agustin','Warren Inocencio','Boyie Raymundo','Ryan Enriquez']}]
programs = [
 {'title':'Pensyon ng senior mula sa Lungsod','who':'Indigent na senior, 65 pataas, walang ibang pensyon','amount':'₱500 kada buwan','verify':False},
 {'title':'Ayuda para sa solo parent','who':'Rehistradong solo parent','amount':'₱1,000 kada buwan','verify':False},
 {'title':'PAG-ASA Scholarship','who':'Mag-aaral na taga-Pasig','amount':'Hanggang ₱35,000 kada sem','verify':False},
 {'title':'Insentibo sa edad 90 pataas','who':'Senior, 90 hanggang 100 taong gulang','amount':'₱10,000 hanggang ₱20,000','verify':True},
 {'title':'Tulong pampalibing para sa senior','who':'Pamilya ng yumaong senior','amount':'₱5,000','verify':True},
 {'title':'Libreng gamot sa mental health','who':'Taga-Pasig','amount':'Libre','verify':False},
]
notes = [
 {'k':'Lokasyon','t':'Nasa Bridgetowne ang Temporary City Hall','b':'E. Rodriguez Ave., Brgy. Rosario, habang itinatayo ang Bagong City Hall.'},
 {'k':'Amilyar','t':'15% discount kung buong taon ay bayad bago Disyembre 31','b':'Kung walang atraso. 10% sa Enero, 5% sa Pebrero at Marso.'},
 {'k':'Reklamo at FOI','t':'Ugnayan sa Pasig','b':'Para sa reklamo, feedback at paghingi ng dokumento ng Lungsod.'},
]
figures = [
 {'value':'₱53.12B','label':'Kabuuang ari-arian ng Lungsod','src':'COA, 2024'},
 {'value':'₱9.2B','label':'Kontrata ng Bagong City Hall','src':'Winning bid, Enero 2025'},
 {'value':'Late 2027','label':'Target na pagbubukas ng Bagong City Hall','src':'Philstar, Agosto 2026'},
 {'value':'29,189','label':'Reklamo at FOI na hinawakan ng Ugnayan','src':'Enero hanggang Mayo 2024'},
]
links = [{'title':l['title_fil'],'url':l['url']} for l in tr['links'] if l['id'] in {x['id'] for x in tr['links']}][:6]
data = {'updated':'Oktubre 19, 2026','hotlines':hotlines,'notes':notes,'featured':featured,'total':len(svc['services']),'offices':len(svc['offices']),
        'cats':cats,'programs':programs,'barangays':barangays,'top':top,'council':council,'figures':figures,'links':links,'services':services,
        'popular':['amilyar','business permit','birth certificate','senior','scholarship']}
mp = json.load(open(os.path.join(os.path.dirname(D.rstrip('/')), '..', 'geo', 'pasig-map.json'))) if False else json.load(open(sys.argv[4]))
mk = json.load(open(sys.argv[5]))
data['map'] = [{'name': b['name'], 'd': b['d'], 'x': b['x'], 'y': b['y']} for b in mp['barangays']]
data['mark'] = mk['smooth']
mapnames = {b['name'] for b in data['map']}
data['barangays'] = [dict(b, name=b['name'].replace(' (Pob.)','')) for b in data['barangays']]
missing = mapnames - {b['name'] for b in data['barangays']}
print('missing in barangays.json:', missing)
html = open(T).read().replace('/*DATA*/', json.dumps(data, ensure_ascii=False))
open(OUT,'w').write(html); print('ok', len(html))
