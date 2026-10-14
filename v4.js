/* Date Night Mumbai V4 — editorial discovery on top of the existing V3 directory. */
const V4_MOODS = [
  ['First date','Something easy, with room to see where it goes.'],
  ['Actually talk','A room where you can hear each other.'],
  ['Dress up','Make an evening of it.'],
  ['Do something','The activity is half the fun.'],
  ['Cheap date','Thoughtful without a big bill.'],
  ['Day date','Sunlight, coffee, art and wandering.']
];
const V4_TZ='Asia/Kolkata';
function v4String(v){return String(v||'').trim();}
function v4SafeUrl(v){try{const u=new URL(String(v||''));return u.protocol==='https:'?u.href:'';}catch{return '';}}
function v4Date(d,opts={}){if(!d)return '';const dt=new Date(d);return Number.isNaN(+dt)?'':new Intl.DateTimeFormat('en-IN',{timeZone:V4_TZ,day:'numeric',month:'short',...opts}).format(dt);}
function v4Time(d){if(!d)return '';const dt=new Date(d);return Number.isNaN(+dt)?'':new Intl.DateTimeFormat('en-IN',{timeZone:V4_TZ,hour:'numeric',minute:'2-digit',hour12:true}).format(dt);}
function v4LocalDateISO(d){
  const parts=new Intl.DateTimeFormat('en-GB',{timeZone:V4_TZ,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date(d));
  const val=t=>parts.find(p=>p.type===t)?.value||'';
  return `${val('year')}-${val('month')}-${val('day')}`;
}
function v4EventExpiry(f){
  if(f.End && Number.isFinite(Date.parse(f.End)))return Date.parse(f.End);
  if(!f.Start||!Number.isFinite(Date.parse(f.Start)))return 0;
  return Date.parse(v4LocalDateISO(f.Start)+'T18:29:59Z'); // 23:59:59 Mumbai time
}
function v4LiveEvents(){return state.events.filter(r=>r.fields?.['CHECK - Live']&&r.fields?.Start&&v4EventExpiry(r.fields)>Date.now()).sort((a,b)=>Date.parse(a.fields.Start)-Date.parse(b.fields.Start));}
function v4LivePlans(){return state.plans.filter(p=>p.fields?.['CHECK - Live']&&v4PlanStops(p).length>=2);}
function v4PlanStops(p){return [1,2,3].map(i=>({i,ref:p.fields?.[`Stop ${i}`]?.[0],note:p.fields?.[`Stop ${i} Note`]||''})).filter(s=>s.ref&&liveRecords().some(r=>r.id===s.ref));}
function v4PlanSpot(s){return state.records.find(r=>r.id===s.ref);}
function v4EventImage(f){return f.Image?.[0]?.url||'';}
function v4EventCard(e){
 const f=e.fields,source=v4SafeUrl(f['Source URL']),book=v4SafeUrl(f['Booking URL']),img=v4SafeUrl(v4EventImage(f));
 const when=v4Date(f.Start,{weekday:'short'})+(f.End&&v4LocalDateISO(f.Start)!==v4LocalDateISO(f.End)?' – '+v4Date(f.End):'');
 const time=v4Time(f.Start);
 const area=[f.Venue,f.Neighbourhood].filter(Boolean).join(' · ');
 const take=f['DNM Take']||f['Why it works for a date']||'';
 return `<article class="v4-event-card"><div class="v4-event-image">${img?`<img src="${escapeHtml(img)}" alt="" loading="lazy" onerror="this.remove()">`:''}<div class="v4-event-date">${escapeHtml(when)}${time?' · '+escapeHtml(time):''}</div></div><div class="v4-event-content"><div class="v4-event-category">${escapeHtml(f.Category||'Something good')}</div><h3 class="v4-event-title">${escapeHtml(f['Event Name']||'Untitled event')}</h3><div class="v4-event-meta">${escapeHtml(area)}${f.Price?' · '+escapeHtml(f.Price):''}</div>${take?`<p class="v4-event-take">${escapeHtml(shortTake(take,180))}</p>`:'<div class="v4-event-take"></div>'}<div class="v4-event-actions">${source?`<a href="${escapeHtml(source)}" target="_blank" rel="noopener noreferrer">Learn more ↗</a>`:''}${book?`<a class="v4-ticket" href="${escapeHtml(book)}" target="_blank" rel="noopener noreferrer">Tickets ↗</a>`:''}${!source&&!book?'<span class="v4-event-meta">Details being verified</span>':''}</div></div></article>`;
}
function v4HomeEventSelection(){
 const all=v4LiveEvents(),soon=all.filter(e=>Date.parse(e.fields.Start)<=Date.now()+21*86400000);
 const upcoming=soon.length>=3?soon:all;const chosen=[],used=new Set();
 for(const e of upcoming){if(!used.has(e.fields.Category)){chosen.push(e);used.add(e.fields.Category);}if(chosen.length>=4)break;}
 for(const e of upcoming){if(chosen.length>=4)break;if(!chosen.includes(e))chosen.push(e);}
 return chosen;
}
function renderV4HomeEvents(){const el=$('v4HomeEvents'),section=$('v4HomeEventsSection');if(!el)return;const list=v4HomeEventSelection();section.hidden=!list.length;el.innerHTML=list.map(v4EventCard).join('');}
function renderV4Moods(){
 const el=$('v4MoodGrid');if(!el)return;
 const list=V4_MOODS.filter(([m])=>liveRecords().some(r=>selectToArray(r.fields['SELECT - Date Mood']).includes(m)));
 $('v4MoodSection').hidden=!list.length;
 el.innerHTML=list.map(([m,sub])=>`<button class="v4-mood-card" data-v4-mood="${escapeHtml(m)}"><strong>${escapeHtml(m)}</strong><span>${escapeHtml(sub)}</span></button>`).join('');
 el.querySelectorAll('[data-v4-mood]').forEach(b=>b.addEventListener('click',()=>v4OpenMood(b.dataset.v4Mood)));
}
function v4OpenMood(m){openBrowse({title:m});state.dateMood=m;renderBrowse();}
function v4PlanCard(p){
 const f=p.fields,stops=v4PlanStops(p),moods=selectToArray(f['Date Mood']);
 return `<button class="v4-plan-card" data-v4-plan="${p.id}"><div class="v4-plan-eyebrow">${escapeHtml(f['Area Cluster']||'Mumbai')} · ${stops.length} stops</div><h3>${escapeHtml(f['Plan Name']||'A good date')}</h3><p>${escapeHtml(f['One-line Hook']||f['Why This Works']||'')}</p><div class="v4-plan-stops">${stops.map((s,i)=>`${i?'<span>→</span>':''}<b>${escapeHtml(v4PlanSpot(s)?.fields?.['Auto - Name']||'Stop')}</b>`).join('')}</div><div class="v4-plan-bottom"><span>${escapeHtml(moods.slice(0,2).join(' · ')||f['Best Time']||'Date plan')}</span><span>See the plan ↗</span></div></button>`;
}
function v4BindPlans(el){el.querySelectorAll('[data-v4-plan]').forEach(b=>b.addEventListener('click',()=>v4OpenPlan(b.dataset.v4Plan)));}
function renderV4HomePlans(){const el=$('v4HomePlans');if(!el)return;const list=v4LivePlans();$('v4HomePlansSection').hidden=!list.length;const featured=[...list.filter(x=>x.fields['CHECK - DNM Pick']),...list.filter(x=>!x.fields['CHECK - DNM Pick'])].slice(0,3);el.innerHTML=featured.map(v4PlanCard).join('');v4BindPlans(el);}
function renderV4Hot(){
 const el=$('v4HotGrid');if(!el)return;
 const hot=liveRecords().filter(r=>['Hot Now','New Opening'].includes(r.fields['SELECT - Trend Signal'])).slice(0,3);
 $('v4HotSection').hidden=!hot.length;el.innerHTML=hot.map(spotCardHtml).join('');bindSpotCards(el);
}
function renderV4Events(){
 const el=$('v4EventsGrid');if(!el)return;
 let list=v4LiveEvents(),category=$('v4EventCategory').value,area=$('v4EventArea').value,when=$('v4EventWhen').value;
 if(category)list=list.filter(x=>x.fields.Category===category);
 if(area)list=list.filter(x=>x.fields['Area Cluster']===area);
 if(when){const until=Date.now()+(when==='week'?7:30)*86400000;list=list.filter(x=>Date.parse(x.fields.Start)<=until);}
 $('v4EventsCount').textContent=`${list.length} upcoming event${list.length===1?'':'s'}`;
 el.innerHTML=list.length?list.map(v4EventCard).join(''):'<div class="v4-empty">Nothing we would recommend in this filter right now. Try another category or date range.</div>';
}
function renderV4Plans(){
 const el=$('v4PlansGrid');if(!el)return;
 let list=v4LivePlans(),mood=$('v4PlanMood').value,area=$('v4PlanArea').value;
 if(mood)list=list.filter(p=>selectToArray(p.fields['Date Mood']).includes(mood));
 if(area)list=list.filter(p=>p.fields['Area Cluster']===area);
 el.innerHTML=list.length?list.map(v4PlanCard).join(''):'<div class="v4-empty">No ready-made plans in this combination yet. Try another mood or area.</div>';
 v4BindPlans(el);
}
function v4OpenPlan(id){
 const p=state.plans.find(x=>x.id===id);if(!p)return;
 const f=p.fields,stops=v4PlanStops(p),moods=selectToArray(f['Date Mood']);
 $('v4PlanDialog').innerHTML=`<button class="v4-plan-close" id="v4ClosePlan" aria-label="Close plan">×</button><div class="eyebrow">${escapeHtml(f['Area Cluster']||'Mumbai')} · ${escapeHtml(moods.join(' / '))}</div><h2>${escapeHtml(f['Plan Name']||'Your date')}</h2><p>${escapeHtml(f['One-line Hook']||'')}</p><div>${stops.map(s=>{const spot=v4PlanSpot(s),name=spot?.fields?.['Auto - Name']||'Stop';return `<div class="v4-plan-stop"><div class="v4-stop-index">${s.i}</div><div><h3>${escapeHtml(name)}</h3><p>${escapeHtml(s.note)}</p><button class="v4-stop-link" data-v4-spot="${escapeHtml(spot.id)}">View spot ↗</button></div></div>`;}).join('')}</div><div class="v4-plan-footer"><span>${escapeHtml(f['Approx Budget for Two']||'Budget depends on your picks')} · ${escapeHtml(f['Best Time']||'Flexible')}</span><button class="v4-plan-share" id="v4SharePlan">Share plan ↗</button></div>${f['Why This Works']?`<p style="margin-top:16px">${escapeHtml(f['Why This Works'])}</p>`:''}`;
 $('v4PlanBackdrop').classList.add('open');document.body.classList.add('modal-open');
 $('v4ClosePlan').addEventListener('click',v4ClosePlan);
 $('v4PlanDialog').querySelectorAll('[data-v4-spot]').forEach(b=>b.addEventListener('click',()=>{v4ClosePlan();openDetail(b.dataset.v4Spot);}));
 $('v4SharePlan').addEventListener('click',async()=>{const url=new URL(location.href);url.searchParams.set('view','plans');url.searchParams.set('plan',id);try{if(navigator.share)await navigator.share({title:f['Plan Name'],url:url.href});else{await navigator.clipboard.writeText(url.href);showToast('Plan link copied');}}catch(e){if(e.name!=='AbortError')showToast('Could not share');}});
 const u=new URL(location.href);u.searchParams.set('view','plans');u.searchParams.set('plan',id);history.replaceState(null,'',u);
}
function v4ClosePlan(){ $('v4PlanBackdrop').classList.remove('open');document.body.classList.remove('modal-open');const u=new URL(location.href);u.searchParams.delete('plan');history.replaceState(null,'',u);}
function initV4(){
 // No event or plan is invented: these arrays are direct Airtable records.
 const events=v4LiveEvents(),plans=v4LivePlans();
 const options=(values,blank)=>`<option value="">${blank}</option>`+[...new Set(values.filter(Boolean))].sort().map(v=>`<option value="${escapeHtml(v)}">${escapeHtml(v)}</option>`).join('');
 $('v4EventCategory').innerHTML=options(events.map(x=>x.fields.Category),'Everything');
 $('v4EventArea').innerHTML=options(events.map(x=>x.fields['Area Cluster']),'All Mumbai');
 $('v4PlanMood').innerHTML=options(plans.flatMap(x=>selectToArray(x.fields['Date Mood'])),'Any mood');
 $('v4PlanArea').innerHTML=options(plans.map(x=>x.fields['Area Cluster']),'All Mumbai');
 $('surpriseArea').innerHTML='<option value="">Anywhere in Mumbai</option>'+AREA_GROUPS.filter(g=>recordsInArea(g.slug).length).map(g=>`<option value="${g.slug}">${escapeHtml(g.name)}</option>`).join('');
 $('surpriseArea').addEventListener('change',e=>{state.surpriseArea=e.target.value;});
 ['v4EventCategory','v4EventArea','v4EventWhen'].forEach(id=>$(id).addEventListener('change',renderV4Events));
 ['v4PlanMood','v4PlanArea'].forEach(id=>$(id).addEventListener('change',renderV4Plans));
 document.querySelectorAll('[data-v4-nav]').forEach(b=>b.addEventListener('click',()=>setView(b.dataset.v4Nav)));
 $('v4PlanBackdrop').addEventListener('click',e=>{if(e.target.id==='v4PlanBackdrop')v4ClosePlan();});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('v4PlanBackdrop').classList.contains('open'))v4ClosePlan();});
 renderV4HomeEvents();renderV4Moods();renderV4HomePlans();renderV4Hot();renderV4Events();renderV4Plans();
 const deep=new URL(location.href).searchParams.get('plan');if(deep&&plans.some(p=>p.id===deep)){setView('plans',{scroll:false});v4OpenPlan(deep);}
}
