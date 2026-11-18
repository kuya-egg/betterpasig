import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {assertRecentData} from '../src/lib/validate-recent.ts';
const read=p=>JSON.parse(readFileSync(`data/${p}.json`,'utf8').replace(/^\uFEFF/,''));
const base={registry:read('sources'),places:read('places').places,updates:read('service-updates').updates,opportunities:read('opportunities').opportunities,history:read('opportunities').historical_updates};
const barangays=read('barangays').barangays.map(x=>x.id),services=read('services').services.map(x=>x.id);
const validate=d=>assertRecentData(d.registry,d.places,d.updates,d.opportunities,d.history,barangays,services);
validate(base);
const cases={duplicate:d=>d.places.push(d.places[0]),missingCitation:d=>d.places[0].facts.splice(0,1),unknownSource:d=>d.places[0].facts[0].evidence[0].source_id='S99',brokenParent:d=>d.places[0].parent_id='missing',unknownBarangay:d=>d.places[0].barangay_id='missing',futurePublication:d=>d.registry.sources[0].published_at='2026-10-29',invalidDate:d=>d.registry.sources[0].published_at='2026-02-30',impossibleHours:d=>d.places.find(x=>x.business_tax_schedule).business_tax_schedule[0].closes='07:00',coordinates:d=>d.places[0].coordinates={lat:14,lng:121},unverifiedCall:d=>d.places.find(x=>x.phone).phone.call_verified=true,missingTitle:d=>delete d.updates[0].title_en,unknownService:d=>d.updates[0].service_id='missing',invalidUrl:d=>d.registry.sources[0].url='javascript:alert(1)',valueMismatch:d=>d.places[0].facts[0].value='invented'};
for(const[name,mutate]of Object.entries(cases)){const data=structuredClone(base);mutate(data);assert.throws(()=>validate(data),undefined,name);}
assert.equal(base.updates.find(x=>x.id==='rpt-2027-advance-payment').ordinary_payment_before_date,'2026-12-28');
assert.equal(base.updates.find(x=>x.id==='rpt-2027-advance-payment').bulk_payment_before_date,'2026-12-10');
assert.equal(base.opportunities[0].fee_php,0);
assert.equal(base.opportunities[0].eligibility.pet_sex,'male');
console.log(`PASS: valid data + ${Object.keys(cases).length} rejected mutations + 4 semantic assertions`);
