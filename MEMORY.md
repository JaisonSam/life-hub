# Project Memory: Jaison's Life OS (life-hub)

## 👤 User Profile
* **Owner**: Jaison Sam
* **Role**: Product Architect & Creative Director (non-developer, zero coding background).
* **Communication Rules**:
  * Speak in plain, layman English using intuitive real-world analogies.
  * Execute all terminal commands, builds, git pushes, and deployments proactively.

## 🎯 Project Vision
A personal life operating system and daily sanctuary combining:
1. **GMAT Focus Edition Sprint Center**: Target 715+ (December 2026 timeline), 60-minute compounding timer, mba.com Official Mock Score Tracker with SVG Trajectory Ladder & Percentile Engine, and error diagnosis log.
2. **Daily Scripture Inspiration**: Automated verse of the day, bookmarking, and reflections.
3. **Daily Habit Tracker**: Interactive check-ins and streaks with local persistence.
4. **Projects Tracker**: Goal progress bars, status badges, and project creation.
5. **Bible Study Organiser**: Book of Romans study guide, YouVersion Android deep-linking, chapter check-offs, and study notes.
6. **Music & Worship Sanctuary**: Curated YouTube Music playlists, OAuth 2.0 personal playlist sync, Android Live Playback Mirror (via Last.fm / Pano Scrobbler) with real-time sound equalizer & floating now-playing dock, and aesthetic categorized album deck (Worship Sanctuary, GMAT Sprint Flow, High-Energy Gym).
7. **Veerakeralapudur 0.25-Acre Agribusiness Modeler**: Financial projections, capital outlay tracker (CapEx expenditure vs ₹1.5L budget), multi-crop yield & revenue comparison (High-Density Guava, Perennial Moringa, Free-Range Country Chicken, Syntropic Agroforestry), and live interactive ROI simulator (Gross revenue, Net profit, monthly velocity, payback period, and CapEx ROI).
8. **Kobo E-Reader & Google Drive Dynamic Bookshelf**:
   - The entire bookshelf collection revolves around the user's actual EPUB files synced from the Google Drive `Kobo eReader` folder.
   - Dynamic book cards with file sizes, reading progress bars, status badges, and 1-click in-browser reading.
   - Built-in In-Browser EPUB Reader (`JSZip`) with high-contrast typography in all 3 themes (Paper Light `#111827`, Warm Sepia `#3D2E1E`, Obsidian Dark `#F3F4F6`), chapter navigation, and live text selection "💡 Save to Commonplace".
   - "Send to Kobo" 1-click EPUB dropzone directly pushing into Google Drive for automatic Wi-Fi sync down to the Kobo device.
   - Kobo Highlights & Annotations Importer parsing `.txt`, `.md`, `.csv`, `.json` notes into the Strategic Commonplace Notebook.
9. **Daily Intellectual Digest & Aeon Essay Spotlight**:
   - **Daily Strategic Read**: Rotates daily featuring high-signal essays from top intellectual publications (Farnam Street, Paul Graham, Stratechery, Morgan Housel/Collaborative Fund, Julian Shapiro, First Round Review, Ribbonfarm) with core mental models and quotes.
   - **Daily Aeon Essay Spotlight**: Rotates daily featuring deep philosophical essays from *Aeon* (`aeon.co`) exploring philosophy of mind, systems dynamics, cognitive cybernetics, and long-term thinking with core inquiries and 1-click reading.
   - Direct "Capture to Notes" integration appending insights into the Strategic Commonplace Notebook.
10. **Executive Career Branding & Bangalore Job Productivity Desk**:
    - Personal career branding hub tailored to Jaison Shanmugiah (Senior ERP Business Analyst • SAP S/4HANA & Digital Manufacturing Specialist).
    - Verified credentials: B.Tech in Production Engineering from NIT Calicut (CGPA 8.47), Schneider Electric (Bengaluru, 4.3+ yrs).
    - Quantified executive track record: 6 European plant deployments, 2,500+ operational personnel, 1 TB production order archival, 195+ governance tickets (145 SRs + 50 incidents), Ales go-live locked order resolution, Attibele warehouse 20% workload cut.
    - Direct profile integration: LinkedIn profile connector (`linkedin.com/in/jaison-shanmugiah-5b29901b5/`), Naukri candidate portal launcher, and 1-click 60-second elevator pitch copier for recruiter InMails.
    - **Live Bangalore Job Openings Desk (Direct Apply Links)**:
      - 10 Curated concrete job openings with direct application URLs (NOT generic search queries) from top recruiters (LinkedIn, Naukri, Company ATS, Foundit) at SAP Labs (Whitefield), McKinsey Digital (MG Road), Deloitte (Prestige Tech Park), Siemens Advanta (Electronic City), Bosch Global (Adugodi), Honeywell (Devarabisanahalli), Accenture (Bellandur), Schneider Electric Global Hub, LTIMindtree, and Capgemini Invent.
      - **1-Click Tailored Pitch Generator**: Per-opening customized recruiter message matching Jaison's specific skills (S/4HANA PP, AVEVA LDS, Kinaxis, NIT Calicut) with that exact job opening.
      - **Interactive Application Pipeline Tracker**: Real-time status toggles (Wishlist, Applied, Screening, Interview, Offer, Archived) with notes and `localStorage` persistence.
      - **"+ Add Custom Job Opening" Modal**: Instantly track new openings Jaison receives from recruiters on LinkedIn InMail, WhatsApp, or email.
      - Live search bar and sector filter pills (Tech & ERP Labs, Tier 1 Consulting, Industrial Giants).

11. **Indian Stock Markets & Groww Portfolio Integration**:
    - Replaced US trends with live Indian Market indices and watchlist:
      - **Indices**: NIFTY 50 (`^NSEI`), SENSEX (`^BSESN`), BANK NIFTY (`^NSEBANK`), and USD/INR Forex (`INR=X`).
      - **Core Watchlist**: Schneider Electric Infrastructure (`SCHNEIDER.NS`), Tata Motors Passenger (`TMPV.NS`), Reliance Industries (`RELIANCE.NS`), HDFC Bank (`HDFCBANK.NS`).
    - **Dynamic Real-Time Live Feed Engine** (`/api/markets/live`):
      - High-speed concurrent market quote fetcher using Yahoo Finance v8 chart feeds with 30s cache.
      - IST Market Hours engine detecting active trading sessions (9:15 AM – 3:30 PM IST, Mon–Fri).
      - 30-second background polling cycle + instant manual refresh button on the dashboard.
    - **Groww CSV Portfolio Import & Live Valuation** (`lib/growwPortfolio.ts`):
      - Official Groww CSV parser supporting `Stocks_Holdings_Statement_...csv`, `Stocks_Order_History_...csv`, and `Groww_Balance_Statement_...csv`.
      - Auto-extracts and tracks Jaison's 19 holdings: Advance Technoforge (`ADVANCETL.BO`), Coal India (`COALINDIA.NS`), Craftsman Automation (`CRAFTSMAN.NS`), GAIL (`GAIL.NS`), IOC (`IOC.NS`), IRCTC (`IRCTC.NS`), IRFC (`IRFC.NS`), IRCON (`IRCON.NS`), NHPC (`NHPC.NS`), Nippon India Gold BeES ETF (`GOLDBEES.NS`), NMDC Steel (`NSLNISP.NS`), NTPC (`NTPC.NS`), ONGC (`ONGC.NS`), Petronet LNG (`PETRONET.NS`), PFC (`PFC.NS`), Power Grid (`POWERGRID.NS`), REC Ltd (`RECLTD.NS`), SJVN (`SJVN.NS`), Thangamayil Jewellery (`THANGAMAYL.NS`).
      - Dynamic live portfolio valuation: recalculates Total Invested, Total Current Value, Day P&L, and All-Time Unrealised Gain/Loss (%) in real time as market quotes arrive.
      - Direct 1-click Groww link integration (`groww.in/stocks/...` and `groww.in/indices/...`) on each stock card.

12. **Google Calendar Sync & Upcoming Agenda Integration**:
    - Integrated Google Calendar upcoming events directly into the Calendar tab and Dashboard agenda.
    - Supports ICS feed synchronization (`/api/calendar/ics`) showing upcoming events on their respective dates.

13. **Dynamic Device GPS Weather & Location Sync**:
    - Automatically requests and syncs with the browser device's GPS geolocation (`navigator.geolocation.getCurrentPosition`) on initial site open.
    - Dynamically fetches local temperature, weather condition, and city name via `/api/weather/live`, defaulting to Bengaluru if permissions are denied.

14. **Clean 3-Column Architecture & Top Bar Simplification**:
    - Top Bar: Removed leftmost "G" monogram; removed horizontal tab scrollbar to occupy the bar naturally with all 9 tabs (`Home`, `Career`, `GMAT`, `Farm`, `Books`, `Bible`, `Habits`, `Projects`, `Music`).
    - Home Deck Switcher: Removed Coverflow/Bento switcher row; the 3-column layout is the dedicated design shown directly, with all internal references to the name "Glance" removed.
    - Center Column Spotlight:
      - **Daily Scripture & Devotional** is promoted to the top of Column 2 as the primary centerpiece of the homescreen (with golden glow, Day navigation, Scripture quote, theme, reading plan, reflection, prayer drawer, and Romans study shortcut).
      - **Career Radar & Executive Intel** (BLR ERP openings, GMAT quant traps, Tech intel, Farm ops).
      - **YouTube Music Catalog**: Replaced generic Videos & Sanctuary with 6 curated albums/playlists with direct links to `music.youtube.com`.
    - Clutter Cleanings:
      - Removed middle duplicate bookmarks pill bar (`Google Calendar`, `Schneider Portal`, etc.).
      - Removed Twitch channels card.
      - Removed Community / Reddit pages feeds (`/r/erp_consulting`, `/r/agritech_india`, `/r/gmat_focus`).
      - Removed Repository card.
      - Removed Executive scratchpad and background pomodoro timer.
    - Clean 3-Column Balance:
      - Column 1: Calendar, Planned Activities (GCal Synced), Daily Habits.
      - Column 2: Daily Scripture (Primary Centerpiece), Career Radar, YouTube Music Catalog.
      - Column 3: GPS Weather, Indian Markets & Groww Portfolio (19 Stocks).

15. **Cinematic "Hi, Jaison" Welcome Intro Animation** (`components/WelcomeIntro.tsx`):
    - Full-screen pitch-black canvas on site launch with scroll-locking.
    - "Hi, Jaison" pops up smoothly from the bottom to the middle with easing (`cubic-bezier(0.16, 1, 0.3, 1)`), accompanied by a warm amber pulse indicator.
    - After 2.0 seconds, the black veil smoothly fades out (`opacity-0 duration-700 ease-out`), seamlessly fading in the homescreen.

## 🛠️ Tech Stack & Locations
* **Location**: `/Users/jaisappi/Developer/life-hub`
* **Framework**: Next.js 16 (App Router), React 19, Tailwind CSS v4, Lucide React, Bun.
* **GitHub Repository**: `JaisonSam/life-hub`
* **Vercel Production**: `https://life-hub-lemon-five.vercel.app`
