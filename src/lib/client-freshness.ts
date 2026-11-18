import {eventState,isSourceFresh,manilaDate,nextManilaMidnight} from './freshness';
export function refreshDatedContent(now = new Date()) {
 const en=document.documentElement.lang==='en';
 document.querySelectorAll<HTMLElement>('[data-published-date]').forEach(row=>{
  const stale=!isSourceFresh(row.dataset.publishedDate,now);
  const past=eventState(row.dataset.eventDate,now)==='past';
  if(row.closest('[data-current-feed]'))row.hidden=stale||past;
 });
 document.querySelectorAll<HTMLElement>('[data-archive-record]').forEach(row=>{
  row.hidden=isSourceFresh(row.dataset.publishedDate,now)&&eventState(row.dataset.eventDate,now)!=='past'&&row.dataset.historical!=='true';
 });
 document.querySelectorAll<HTMLElement>('[data-event-date]').forEach(row=>{
  const state=eventState(row.dataset.eventDate,now);
  const status=row.querySelector<HTMLElement>('[data-event-status]');
  if(status)status.textContent=state==='past'?(en?'The scheduled event date has passed.':'Lumipas na ang nakatakdang petsa ng aktibidad.'):state==='today'?(en?'Scheduled for today; confirm with the organizer.':'Nakatakda ngayong araw; kumpirmahin sa tagapag-ayos.'):(en?'Scheduled event; live availability is unknown.':'Nakatakdang aktibidad; hindi alam ang live na kapasidad.');
  if(state==='past')row.querySelectorAll('[data-registration]').forEach(link=>link.remove());
 });
 document.querySelectorAll<HTMLElement>('[data-source-date]').forEach(row=>{
  if(isSourceFresh(row.dataset.sourceDate,now)||row.querySelector('[data-stale]'))return;
  const note=document.createElement('span');note.dataset.stale='true';note.textContent=en?' · This announcement is over 30 days old. Check the official page for a newer notice.':' · Lampas 30 araw na ang anunsyo. Tingnan ang opisyal na pahina para sa mas bagong abiso.';row.append(note);
 });
 document.querySelectorAll<HTMLElement>('[data-alert-expires]').forEach(row=>{row.hidden=Boolean(row.dataset.alertExpires&&row.dataset.alertExpires<manilaDate(now));});
 document.querySelectorAll<HTMLElement>('[data-current-feed]').forEach(feed=>{
  const empty=feed.querySelector<HTMLElement>('[data-feed-empty]');
  if(empty)empty.hidden=Boolean(feed.querySelector('[data-published-date]:not([hidden])'));
 });
 document.querySelectorAll<HTMLElement>('[data-place-source-dates]').forEach(node=>{
  const dates=JSON.parse(node.dataset.placeSourceDates??'[]') as string[];
  node.textContent=String(dates.filter(date=>isSourceFresh(date,now)).length);
 });
}
let timer=0;
function schedule(){window.clearTimeout(timer);timer=window.setTimeout(()=>{refreshDatedContent();schedule();},Math.max(1,nextManilaMidnight(new Date())-Date.now()));}
refreshDatedContent();schedule();
document.addEventListener('visibilitychange',()=>{if(!document.hidden){refreshDatedContent();schedule();}});
