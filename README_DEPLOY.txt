DATE NIGHT MUMBAI V3.2 — DEPLOY

WHAT THIS VERSION DOES
- Keeps the V3 visual direction and V3.1 header fixes.
- Surprise Me now lets users pick a lane, avoids immediate repeats, and adds “Try another in this lane”.
- Save is always available in spot details, even when a venue has a website.
- Unknown reservation status now says “Not confirmed” instead of assuming walk-ins are fine.
- Adds site-level Open Graph/Twitter sharing metadata.
- Adds “Start from what you need today” using real Best For tags from Airtable.
- Adds editorial Explore Mumbai area cards with live counts and imagery.
- Adds Area as a proper browse filter and URL state.
- Adds Near me, opt-in only, which sorts live spots by distance without storing location.
- Adds “A few we’d actually pick” from Editor Verified + Editor’s Take records.
- Adds active context chips so area / intent / collection filters are obvious and removable.
- Adds Suggest a spot + Report an issue feedback loops.
- Preserves the curated-over-exhaustive product philosophy.

IMPORTANT: OPEN NOW
We did NOT add an “Open now” filter yet. The current Airtable schema supplied to the site does not include reliable structured opening-hours data. Showing it without that data would manufacture certainty. Add it only once opening hours are being stored and maintained.

DEPLOY
Upload the ENTIRE date-night-mumbai-v3-2 folder / zip to the existing Vercel project. It contains:
- index.html
- logo.png
- api/airtable.js

Keep your existing Vercel environment variable:
AIRTABLE_PAT = your current rotated Airtable token

No Airtable field names were changed and no new Airtable fields are required for this release.

After deploy, test:
1. Desktop header + homepage
2. Surprise Me > each lane > Try another
3. Save on a venue that also has a Website
4. Explore Mumbai area cards
5. Best For shortcut chips
6. Near me permission + sorting
7. Mobile filters, especially Area
8. Grid / Map switch
9. Share a normal site link in WhatsApp/iMessage to inspect the preview
