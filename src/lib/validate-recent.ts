import { z } from 'zod';
export const calendarDate = z.string().refine(value => /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0,10) === value, 'Invalid calendar date');
const http = z.string().refine(value => { try {return ['http:','https:'].includes(new URL(value).protocol);} catch{return false;} }, 'Invalid HTTP(S) URL');
const evidence = z.object({source_id:z.string().min(1),locator:z.string().min(1),method:z.enum(['article_text','visual_attachment'])}).strict();
const claim = z.object({id:z.string().min(1),value:z.json(),evidence:z.array(evidence).min(1),effective_from:calendarDate.nullable(),effective_until:calendarDate.nullable()}).strict();
const source = z.object({id:z.string().min(1),url:http,publisher:z.string().min(1),title:z.string().min(1),published_at:calendarDate,published_date:calendarDate,retrieved_at:z.iso.datetime({offset:true}),checked_at:z.iso.datetime({offset:true}),reviewed_at:z.iso.datetime({offset:true}).nullable(),review_status:z.enum(['pending','reviewed']),verification_method:z.literal('official_document'),evidence_path:z.string().startsWith('research/'),locators:z.array(z.string().min(1)).min(1),verify:z.boolean()});
const record = z.looseObject({id:z.string().min(1),kind:z.string().min(1),facts:z.array(claim).min(1),verify:z.boolean()});
const clock=z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/);
const schedule=z.looseObject({days:z.array(z.enum(['MO','TU','WE','TH','FR','SA','SU'])).min(1),opens:clock,closes:clock}).refine(row=>row.opens<row.closes,'Impossible schedule interval');
const placeSchema=record.extend({name:z.string().min(1),parent_id:z.string().nullable(),barangay_id:z.string().nullable(),address:z.string().nullable(),coordinates:z.null(),regular_hours:schedule.nullable().optional(),business_tax_schedule:z.array(schedule).optional(),rpt_schedule:z.array(schedule).optional(),phone:z.object({number:z.string().regex(/^\d{10,11}$/),extension:z.string(),scope:z.string(),call_verified:z.literal(false)}).nullable().optional(),email:z.email().optional()});
const updateSchema=record.extend({service_id:z.string().nullable(),title_fil:z.string().min(1),title_en:z.string().min(1),summary_fil:z.string(),summary_en:z.string(),place_ids:z.array(z.string()),published_date:calendarDate,online_url:http.optional(),online_cutoff_at:z.iso.datetime({offset:true}).optional(),discount_percent:z.number().min(0).max(100).optional(),rpt_schedules:z.array(schedule).optional()});
const opportunitySchema=record.extend({published_date:calendarDate,kind:z.enum(['opportunity','event_notice','closure','outcome']),place_ids:z.array(z.string()),event_date:calendarDate.optional(),starts_at:z.iso.datetime({offset:true}).nullable().optional(),ends_at:z.iso.datetime({offset:true}).nullable().optional(),application_deadline_at:z.iso.datetime({offset:true}).nullable(),registration_url:http.nullable().optional(),fee_php:z.number().nonnegative().optional(),registration_open_now:z.boolean().nullable().optional(),slots_available_now:z.number().int().nonnegative().nullable().optional()});
export const recentSchemas = {
 'pasig-sources':z.object({edition_date:calendarDate,sources:z.array(source).min(1)}),
 'pasig-places':z.object({edition_date:calendarDate,places:z.array(placeSchema)}),
 'pasig-service-updates':z.object({edition_date:calendarDate,updates:z.array(updateSchema)}),
 'pasig-opportunities':z.object({edition_date:calendarDate,opportunities:z.array(opportunitySchema),historical_updates:z.array(opportunitySchema)}),
};
export function assertRecentData(registry: unknown, places: unknown[], updates: unknown[], opportunities: unknown[], history: unknown[], barangayIds: string[], serviceIds: string[]) {
 const parsed=z.object({edition_date:calendarDate,sources:z.array(source).min(1)}).parse(registry);
 places.forEach(value=>placeSchema.parse(value));updates.forEach(value=>updateSchema.parse(value));[...opportunities,...history].forEach(value=>opportunitySchema.parse(value));
 const ids=new Set<string>();
 const sources=new Map(parsed.sources.map(s=>[s.id,s]));
 if(sources.size!==parsed.sources.length)throw Error('Duplicate source ID');
 for(const s of parsed.sources)if(s.published_at>parsed.edition_date||s.published_at!==s.published_date)throw Error(`Invalid source publication date: ${s.id}`);
 const placeIds=new Set(places.map(p=>(p as {id:string}).id));
 const walk=(value:unknown,key:string,path:string):void=>{
  if(value===null||value===undefined)return;
  if(key==='evidence'||key==='facts')return;
  if(key==='coordinates')throw Error(`Unsupported coordinates: ${path}`);
  if(Array.isArray(value)){value.forEach((v,i)=>walk(v,key,`${path}[${i}]`));return;}
  if(typeof value==='object'){
   const obj=value as Record<string,unknown>;
   if('opens' in obj){if(!clock.safeParse(obj.opens).success||!clock.safeParse(obj.closes).success||String(obj.opens)>=String(obj.closes))throw Error(`Invalid schedule: ${path}`);if(!Array.isArray(obj.days)||!obj.days.length||obj.days.some(d=>!['MO','TU','WE','TH','FR','SA','SU'].includes(String(d))))throw Error(`Invalid weekdays: ${path}`);}
   for(const [k,v]of Object.entries(obj))walk(v,k,`${path}.${k}`);return;
  }
  if(key==='coordinates')throw Error(`Unsupported coordinates: ${path}`);
  if(key==='call_verified'&&value===true)throw Error(`No call evidence: ${path}`);
  if(['barangay_id','parent_id','place_id','place_ids','service_id'].includes(key)&&typeof value==='string'){
   const allowed=key==='barangay_id'?barangayIds:key==='service_id'?serviceIds:[...placeIds];if(!allowed.includes(value))throw Error(`Broken reference: ${path}`);
  }
  if(typeof value==='string'){
   if(/_date$/.test(key)||['published_date','reported_inauguration'].includes(key))calendarDate.parse(value);
   if(/_at$/.test(key)&&key!=='status_at')z.iso.datetime({offset:true}).parse(value);
   if(/_url$/.test(key))http.parse(value);
  }
 };
 for(const raw of [...places,...updates,...opportunities,...history]){
  const r=record.parse(raw);if(ids.has(r.id))throw Error(`Duplicate record ID: ${r.id}`);ids.add(r.id);
  const claimIds=new Set(r.facts.map(f=>f.id));if(claimIds.size!==r.facts.length)throw Error(`Duplicate claim: ${r.id}`);
  for(const fact of r.facts){if(fact.effective_from&&fact.effective_until&&fact.effective_from>fact.effective_until)throw Error(`Invalid effective interval: ${r.id}.${fact.id}`);for(const ref of fact.evidence){const source=sources.get(ref.source_id);if(!source||!source.locators.includes(ref.locator.split(';')[0]))throw Error(`Unknown evidence: ${r.id}.${fact.id}`);}if(!(fact.id in r)||JSON.stringify(r[fact.id])!==JSON.stringify(fact.value))throw Error(`Claim value differs from displayed field: ${r.id}.${fact.id}`);}
  const editorial=new Set(['id','kind','parent_id','service_id','title_fil','title_en','summary_fil','summary_en','evidence','verify','facts','sources','action_status','online_status_at_capture','status','schedule_scope','phone_scope','bulk_definition','conditional_deadline_condition','place_ids','eligibility_fil','eligibility_en']);
  for(const [key,value]of Object.entries(r))if(value!==null&&!editorial.has(key)&&!claimIds.has(key))throw Error(`Missing field citation: ${r.id}.${key}`);
  walk(r,'',r.id);
 }
 return parsed;
}
