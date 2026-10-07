DATE NIGHT MUMBAI V3 — DEPLOY

Files in this folder:
- index.html
- logo.png
- api/airtable.js

WHY THERE IS NOW AN /api FOLDER
Your old index.html contained the Airtable Personal Access Token directly in public browser code. Anyone visiting the site could retrieve it. V3 moves Airtable fetching into a tiny Vercel serverless function so the token stays private.

DO THIS IN VERCEL
1. Replace your old index.html with this index.html.
2. Replace/add logo.png.
3. Add the api folder and airtable.js exactly as supplied.
4. In Vercel, open your Date Night Mumbai project.
5. Go to Settings > Environment Variables.
6. Add one environment variable:
   AIRTABLE_PAT = a NEW Airtable personal access token
7. Redeploy.

IMPORTANT SECURITY STEP
Because the old token lived in public frontend code, revoke/rotate that old token in Airtable and use the new token only as the AIRTABLE_PAT environment variable in Vercel.

WHAT CHANGED
- Full responsive mobile + desktop redesign
- New hero built around “what are we doing tonight?”
- Daily wildcard + Surprise Us
- Quick date-type shortcuts
- Sharper Airtable images by using original attachment URLs first
- Cleaner consistent spot cards
- Save/favourite spots locally in the browser
- Shareable spot deep links
- Better collections presentation
- Full-screen mobile detail sheet
- Mobile bottom navigation
- Mobile filter sheet
- Improved map presentation and automatic fit-to-results
- Search across name, neighbourhood, category, vibe and best-for tags
- Better loading, empty and error states
- Reduced-motion accessibility support
- Airtable token removed from frontend

No Airtable field names were renamed. The site still uses your existing schema.
