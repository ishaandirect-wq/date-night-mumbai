DATE NIGHT MUMBAI — V4 (GITHUB DEPLOYMENT)

WHAT'S NEW
- What's On: live Mumbai theatre, comedy, concerts, exhibitions and other date-worthy events from Airtable.
- Each event has a Learn More link, and a Buy Tickets link only where a direct booking URL exists.
- Past events are hidden automatically by their end date (or end of local Mumbai day for single-day events with no end date).
- Date Plans: live two/three-stop itineraries with notes, linked spots and shareable plan URLs.
- Date Mood discovery: First date, Actually talk, Dress up, Do something, Cheap date and Day date.
- Surprise Me: choose a lane AND an area, with a no-immediate-repeat option.
- Hot Right Now / New Opening signals, DNM Picks, neighbourhood-led discovery, collections, Saved, browse and map.
- Unpinned venues are still listed underneath the map instead of silently disappearing.
- Clean editorial fallback for venues without licensed photos. No generic stock photos masquerading as actual interiors.
- All new data comes from the existing Airtable base through the server-side proxy.

FILES TO UPDATE IN YOUR EXISTING GITHUB REPOSITORY
  index.html          (replace existing)
  v4.css              (new)
  v4.js               (new)
  api/airtable.js     (replace existing file inside the api folder)
  README_DEPLOY.txt   (optional documentation update)

KEEP your existing logo.png in the repository root. It is not included in this update and must not be deleted.

HOW TO DEPLOY
1. Download this ZIP and extract it on your computer.
2. Open your existing GitHub repository: ishaandirect-wq/date-night-mumbai.
3. In the repository root, upload index.html, v4.css and v4.js (replace index.html when prompted).
4. Open the existing 'api' folder on GitHub and upload airtable.js there (replace the old one).
5. Optionally upload README_DEPLOY.txt to the repository root.
6. Commit the changes to the main branch. Your existing Vercel GitHub integration should deploy automatically.
7. Keep the existing Vercel environment variable AIRTABLE_PAT unchanged. Do not paste it into any site file.

AFTER DEPLOY — CHECK
- Homepage: What's On, Date Mood, Date Plans, Hot Now, curated picks.
- What's On: dates in IST, category/area/time filters, Learn More and Tickets links.
- Expired events do not appear even if Airtable's Live checkbox was not updated yet.
- Date Plans: click a plan, view its stops, click through to a venue, share the plan.
- Surprise Me: choose a category and an area; Try another should stay within both.
- Browse: click a mood, clear the mood chip, use category/area filters.
- Map: verify pins and the 'spots without precise pins' list.
- Saved: save and unsave venues, reload, confirm persistence.
- Test at iPhone width and desktop width.

NOTES
- The site does not claim to know opening hours. No fake Open Now filter.
- Event ticket prices and availability can change; direct links take visitors to the source.
- A few newly approved venues are currently text-led while original venue photos are sourced and cleared.
- No new Airtable fields or environment variables are needed.
- If a deployment has a 404 on v4.css or v4.js, check those two files were uploaded to the repository root.
