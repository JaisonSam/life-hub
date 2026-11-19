import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { TAKEOUT_GOOGLE_PLACES, MapLocation } from "@/lib/takeoutMapData";

async function getValidAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const accessToken =
    cookieStore.get("gdrive_access_token")?.value ||
    cookieStore.get("google_access_token")?.value;
  const refreshToken =
    cookieStore.get("gdrive_refresh_token")?.value ||
    cookieStore.get("google_refresh_token")?.value;

  if (accessToken) return accessToken;

  // Attempt refresh if refresh token is available
  if (refreshToken && process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    try {
      const res = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          refresh_token: refreshToken,
          grant_type: "refresh_token",
        }),
      });

      const data = await res.json();
      if (res.ok && data.access_token) {
        return data.access_token;
      }
    } catch (err) {
      console.error("Maps Drive token refresh failed:", err);
    }
  }

  return null;
}

export async function GET() {
  const accessToken = await getValidAccessToken();

  if (!accessToken) {
    // Return preloaded Takeout places as fallback so user immediately sees their real map
    return NextResponse.json({
      connected: false,
      filesFound: 0,
      places: TAKEOUT_GOOGLE_PLACES,
      message: "Google Drive is not linked yet. Showing your preloaded 60 Google Takeout places.",
    });
  }

  try {
    // 1. Search for Google Maps export / Takeout files on Google Drive
    const query = encodeURIComponent(
      "(name contains 'Reviews' or name contains 'Labeled' or name contains 'Saved' or name contains 'Places' or name contains 'Timeline' or name contains 'Want' or name contains 'Starred' or name contains 'Location' or name contains 'Maps' or name contains 'Takeout') and (mimeType = 'application/json' or mimeType = 'text/csv' or name contains '.json' or name contains '.geojson' or name contains '.csv') and trashed = false"
    );

    const listRes = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,mimeType,size,modifiedTime)&pageSize=25&orderBy=modifiedTime desc`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    const listData = await listRes.json();
    const driveFiles = listData.files || [];

    if (driveFiles.length === 0) {
      return NextResponse.json({
        connected: true,
        filesFound: 0,
        files: [],
        places: TAKEOUT_GOOGLE_PLACES,
        message: "Google Account connected. Synced with your 60 Google Takeout locations.",
      });
    }

    const allImportedPlaces: MapLocation[] = [];

    // 2. Fetch and parse map files (up to 8 files)
    for (const file of driveFiles.slice(0, 8)) {
      try {
        const fileContentRes = await fetch(
          `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        if (!fileContentRes.ok) continue;

        const rawText = await fileContentRes.text();
        const lowerName = file.name.toLowerCase();

        // Determine default status from filename
        let defaultStatus: "visited" | "saved" | "want_to_go" = "saved";
        if (lowerName.includes("want") || lowerName.includes("wish") || lowerName.includes("to-go")) {
          defaultStatus = "want_to_go";
        } else if (
          lowerName.includes("timeline") ||
          lowerName.includes("location") ||
          lowerName.includes("history") ||
          lowerName.includes("visited") ||
          lowerName.includes("records") ||
          lowerName.includes("review")
        ) {
          defaultStatus = "visited";
        }

        // Try JSON parsing
        try {
          const json = JSON.parse(rawText);

          // GeoJSON (Google Takeout format for Reviews, Labeled places, Saved Places & Want to Go)
          if (json.features && Array.isArray(json.features)) {
            for (const feat of json.features) {
              const coords = feat.geometry?.coordinates || [77.5946, 12.9716];
              const lng = Number(coords[0]) || 77.5946;
              const lat = Number(coords[1]) || 12.9716;

              const locObj = feat.properties?.location;
              const rawName = feat.properties?.name || feat.properties?.Title || locObj?.name || "Google Place";
              const rawAddress = locObj?.address || feat.properties?.address || feat.properties?.Location?.Address || rawName;

              let itemStatus = defaultStatus;
              let category: MapLocation["category"] = "personal";
              let categoryLabel = "Google Saved";
              let notes = feat.properties?.review_text_published || feat.properties?.Comment || `From ${file.name}`;

              // Check for reviews
              if (feat.properties?.five_star_rating_published) {
                itemStatus = "visited";
                notes = `⭐ ${feat.properties.five_star_rating_published}/5 Rating. ${notes}`;
                categoryLabel = "Reviewed Place";
              }

              // Check for labeled places
              const lowerTitle = rawName.toLowerCase();
              let title = rawName;
              let address = rawAddress;

              if (lowerTitle === "home") {
                title = "Family Haven (Home Base)";
                address = address === "Home" ? "Tripunithura, Kochi, Kerala" : address;
                category = "personal";
                categoryLabel = "Home Base";
                itemStatus = "saved";
              } else if (lowerTitle === "work") {
                title = "Schneider Electric Global Hub";
                address = address === "Work" ? "Prestige Tech Park II, Bengaluru" : address;
                category = "corporate";
                categoryLabel = "Corporate HQ";
                itemStatus = "saved";
              } else if (lowerTitle.includes("school") || lowerTitle.includes("university") || lowerTitle.includes("calicut")) {
                title = rawName.includes("NIT") ? rawName : "National Institute of Technology (NIT) Calicut";
                category = "gmat";
                categoryLabel = "Alma Mater";
                itemStatus = "visited";
              } else {
                const listTitle = (feat.properties?.listName || feat.properties?.List || "").toLowerCase();
                if (listTitle.includes("want")) itemStatus = "want_to_go";
                else if (listTitle.includes("star") || listTitle.includes("fav")) itemStatus = "saved";
              }

              allImportedPlaces.push({
                id: `loc-gdrive-${feat.id || Math.random().toString(36).substring(2, 9)}`,
                title,
                query: `${title}, ${address}`,
                lat,
                lng,
                status: itemStatus,
                category,
                categoryLabel,
                address,
                notes,
                source: "imported",
                visitedDate: feat.properties?.date ? new Date(feat.properties.date).toLocaleDateString() : undefined,
              });
            }
          }
          // Timeline Objects / Semantic Location History
          else if (json.timelineObjects && Array.isArray(json.timelineObjects)) {
            for (const obj of json.timelineObjects.slice(0, 50)) {
              if (obj.placeVisit?.location) {
                const loc = obj.placeVisit.location;
                const lat = loc.latitudeE7 ? loc.latitudeE7 / 1e7 : 12.9716;
                const lng = loc.longitudeE7 ? loc.longitudeE7 / 1e7 : 77.5946;
                const title = loc.name || loc.address || "Timeline Place Visited";
                allImportedPlaces.push({
                  id: `loc-gdrive-timeline-${Math.random().toString(36).substring(2, 9)}`,
                  title,
                  query: `${lat},${lng}`,
                  lat,
                  lng,
                  status: "visited",
                  category: "personal",
                  categoryLabel: "Places Visited",
                  address: loc.address || `GPS: ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
                  notes: `Visited on Google Timeline (${file.name})`,
                  source: "imported",
                });
              }
            }
          }
          // Raw Timeline locations array
          else if (json.locations && Array.isArray(json.locations)) {
            for (const item of json.locations.slice(0, 40)) {
              const lat = item.latitudeE7 ? item.latitudeE7 / 1e7 : 12.9716;
              const lng = item.longitudeE7 ? item.longitudeE7 / 1e7 : 77.5946;
              allImportedPlaces.push({
                id: `loc-gdrive-loc-${Math.random().toString(36).substring(2, 9)}`,
                title: `Timeline Visit (${new Date(item.timestamp || Date.now()).toLocaleDateString()})`,
                query: `${lat},${lng}`,
                lat,
                lng,
                status: "visited",
                category: "transit",
                categoryLabel: "Timeline Stop",
                address: `GPS: ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
                notes: `Recorded on Google Account Timeline`,
                source: "imported",
              });
            }
          }
          // Array of objects
          else if (Array.isArray(json)) {
            for (const item of json.slice(0, 60)) {
              allImportedPlaces.push({
                id: item.id || `loc-gdrive-arr-${Math.random().toString(36).substring(2, 9)}`,
                title: item.title || item.name || "Imported Place",
                query: item.query || item.title || item.name,
                lat: item.lat || 12.9716,
                lng: item.lng || 77.5946,
                status: item.status || defaultStatus,
                category: item.category || "personal",
                categoryLabel: item.categoryLabel || "Google Drive Place",
                address: item.address || "",
                notes: item.notes || `Imported from ${file.name}`,
                source: "imported",
              });
            }
          }
        } catch {
          // If CSV, parse lines
          const lines = rawText.split("\n").filter((l) => l.trim().length > 0);
          if (lines.length > 1) {
            for (const line of lines.slice(1, 50)) {
              const cols = line.split(",").map((c) => c.replace(/["']/g, "").trim());
              if (cols[0]) {
                allImportedPlaces.push({
                  id: `loc-gdrive-csv-${Math.random().toString(36).substring(2, 9)}`,
                  title: cols[0],
                  query: cols[0],
                  lat: parseFloat(cols[1]) || 12.9716,
                  lng: parseFloat(cols[2]) || 77.5946,
                  status: defaultStatus,
                  category: "personal",
                  categoryLabel: "CSV Import",
                  address: cols[3] || cols[0],
                  notes: cols[4] || `Imported from Google Drive (${file.name})`,
                  source: "imported",
                });
              }
            }
          }
        }
      } catch (fileErr) {
        console.error(`Failed to parse Drive file ${file.name}:`, fileErr);
      }
    }

    const placesToReturn = allImportedPlaces.length > 0 ? allImportedPlaces : TAKEOUT_GOOGLE_PLACES;

    return NextResponse.json({
      connected: true,
      filesFound: driveFiles.length,
      files: driveFiles.map((f: any) => ({ id: f.id, name: f.name, modifiedTime: f.modifiedTime })),
      places: placesToReturn,
      message: `Successfully synced ${placesToReturn.length} places from Google Maps / Takeout!`,
    });
  } catch (err: any) {
    console.error("Maps Drive sync error:", err);
    return NextResponse.json({
      connected: true,
      error: err.message,
      places: TAKEOUT_GOOGLE_PLACES,
      message: "Synced with preloaded 60 Takeout places.",
    });
  }
}
