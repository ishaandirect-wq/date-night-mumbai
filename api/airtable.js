// Vercel Serverless Function
// Keeps your Airtable token off the public website.

const TABLES = {
  locations: 'List of Locations',
  collections: 'Collections'
};

const LOCATION_FIELDS = [
  'Auto - Google Place ID',
  'Auto - Name',
  'Auto - Address',
  'Auto - Neighbourhood',
  'Auto - Google Rating',
  'Auto - Phone',
  'Auto - Website',
  'Auto - Latitude',
  'Auto - Longitude',
  'Auto - Photo URL 1',
  'Auto - Photo URL 2',
  'Auto - Photo URL 3',
  'SELECT - Category',
  'SELECT - Price for Two',
  'SELECT - Vibe',
  'SELECT - Best For',
  'SELECT - Best Time',
  'CHECK - Live',
  'CHECK - Flag: Do Not Publish (closed/bad fit)',
  'CHECK - Editor Verified',
  "TEXT - Editor's Take",
  'CHECK - Reservation Required',
  'CHECK - Reservation Recommended',
  'CHECK - Indoor Seating',
  'CHECK - Outdoor Seating',
  'CHECK - Dress Code Required',
  'CHECK - Alcohol Served',
  'CHECK - Parking Available'
];

const COLLECTION_FIELDS = ['Name','Description','Cover Photo','Locations','CHECK - Live'];

module.exports = async function handler(req, res) {
  const key = String(req.query.table || '');
  const tableName = TABLES[key];
  if (!tableName) return res.status(400).json({ error: 'Unknown table' });

  const token = process.env.AIRTABLE_PAT;
  const baseId = 'appymgOj0fBs13ykQ';
  if (!token) {
    return res.status(500).json({ error: 'Airtable environment variable is not configured.' });
  }

  const fields = key === 'locations' ? LOCATION_FIELDS : COLLECTION_FIELDS;
  let records = [];
  let offset = null;

  try {
    do {
      const url = new URL(`https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`);
      url.searchParams.set('pageSize', '100');
      fields.forEach(field => url.searchParams.append('fields[]', field));
      if (offset) url.searchParams.set('offset', offset);

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) {
        const detail = await response.text();
        console.error('Airtable error', response.status, detail);
        return res.status(502).json({ error: 'Could not load directory data.' });
      }

      const data = await response.json();
      records = records.concat(data.records || []);
      offset = data.offset || null;
    } while (offset);

    res.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate=600');
    return res.status(200).json({ records });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error.' });
  }
};
