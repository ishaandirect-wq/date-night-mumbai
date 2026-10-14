// DNM V4 · Vercel serverless Airtable proxy. Only allowlisted fields are public.
const BASE_ID = 'appymgOj0fBs13ykQ';
const TABLES = Object.freeze({
  locations: {
    name: 'List of Locations',
    fields: [
      'Auto - Google Place ID','Auto - Name','Auto - Address','Auto - Neighbourhood',
      'Auto - Google Rating','Auto - Phone','Auto - Website','Auto - Latitude','Auto - Longitude',
      'Auto - Photo URL 1','Auto - Photo URL 2','Auto - Photo URL 3',
      'SELECT - Category','SELECT - Price for Two','SELECT - Vibe','SELECT - Best For',
      'SELECT - Best Time','SELECT - Area Cluster','SELECT - Date Mood','SELECT - Trend Signal',
      'SELECT - Curation Status','TEXT - Short Tagline',"TEXT - Editor's Take",
      'CHECK - Live','CHECK - Flag: Do Not Publish (closed/bad fit)',
      'CHECK - Editor Verified','CHECK - Reservation Required','CHECK - Reservation Recommended',
      'CHECK - Indoor Seating','CHECK - Outdoor Seating','CHECK - Dress Code Required',
      'CHECK - Alcohol Served','CHECK - Parking Available'
    ]
  },
  collections: { name:'Collections', fields:['Name','Description','Cover Photo','Locations','CHECK - Live'] },
  events: {
    name:'Events',
    fields:['Event Name','Start','End','Category','Area Cluster','Neighbourhood','Venue',
      'Price','Booking URL','Source URL','Image','DNM Take','Why it works for a date',
      'Trend Signal','CHECK - Live','CHECK - DNM Pick']
  },
  plans: {
    name:'Date Plans',
    fields:['Plan Name','One-line Hook','Area Cluster','Date Mood','Best Time','Approx Budget for Two',
      'Stop 1','Stop 1 Note','Stop 2','Stop 2 Note','Stop 3','Stop 3 Note',
      'Why This Works','CHECK - Live','CHECK - DNM Pick']
  }
});
module.exports = async function handler(req,res){
  if(req.method!=='GET') return res.status(405).json({error:'Method not allowed'});
  const key=typeof req.query.table==='string'?req.query.table:'';
  const spec=Object.prototype.hasOwnProperty.call(TABLES,key)?TABLES[key]:null;
  if(!spec) return res.status(400).json({error:'Unknown table'});
  const token=process.env.AIRTABLE_PAT;
  if(!token) return res.status(503).json({error:'Directory is temporarily unavailable'});
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),16000);
  const records=[];
  let offset=null,pages=0;
  try {
    do {
      const url=new URL('https://api.airtable.com/v0/'+BASE_ID+'/'+encodeURIComponent(spec.name));
      url.searchParams.set('pageSize','100');
      for(const field of spec.fields) url.searchParams.append('fields[]',field);
      if(offset) url.searchParams.set('offset',offset);
      const upstream=await fetch(url,{headers:{Authorization:'Bearer '+token},signal:controller.signal});
      if(!upstream.ok){console.error('Airtable request failed',upstream.status,key);return res.status(502).json({error:'Could not load directory data'});}
      const data=await upstream.json();
      records.push(...(Array.isArray(data.records)?data.records:[]));
      offset=data.offset||null;
      pages++;
    }while(offset&&pages<12);
    // Defensive public-only projection. Rejected locations cannot be leaked to clients.
    const publicRecords=records.filter(r=>r.fields?.['CHECK - Live']&&(key!=='locations'||!r.fields?.['CHECK - Flag: Do Not Publish (closed/bad fit)']));
    res.setHeader('Cache-Control','public, s-maxage=120, stale-while-revalidate=600');
    res.setHeader('X-Content-Type-Options','nosniff');
    return res.status(200).json({records:publicRecords});
  } catch(err){console.error('DNM proxy error',err?.name||'error');return res.status(502).json({error:'Directory is temporarily unavailable'});}
  finally {clearTimeout(timer);}
};
