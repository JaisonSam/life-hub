import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import JSZip from "jszip";

export interface MapLocation {
  id: string;
  title: string;
  query: string;
  lat: number;
  lng: number;
  status: "visited" | "saved" | "want_to_go";
  category: "corporate" | "agri" | "spiritual" | "gmat" | "transit" | "personal";
  categoryLabel: string;
  address: string;
  notes: string;
  elevation?: string;
  microclimate?: string;
  transitFromBlr?: string;
  source?: "curated" | "imported" | "custom" | "takeout";
  visitedDate?: string;
  targetDate?: string;
}

// Clean name normalization map for messy Google Takeout business listings
const CLEAN_NAME_MAP: Record<string, string> = {
  "HKGN CLASSIC ACCESSORIES AND TYERS PUNCHER REPAIR AT DOOR STEP, redium,PPF,NAME PLATES arts sticker cutting,bike seatcover,":
    "HKGN Auto Services (Kundalahalli)",
  "Tyre Torque - Kasturinagar - Banaswadi ( Michelin - Bridgestone - Continental - Yokohama - Pirelli - Apollo - Ceat. )":
    "Tyre Torque Auto Care (Kasturi Nagar)",
  "Titan Eye+ at MG Road, Trivandrum (Buy 1 Get 1 Free)":
    "Titan Eye+ Optical Studio (MG Road Trivandrum)",
  "Alibaba & 41 Dishes 'n Bab Arabia- Kuttanellur Thrissur":
    "Alibaba & 41 Dishes (Thrissur)",
  "Ruchi Kitchen - Traditional Kerala Cuisine":
    "Ruchi Traditional Kitchen (AECS Layout)",
  "Chez Mariannick Bakery Restaurant":
    "Chez Mariannick French Bakery (Whitefield)",
  "HOTEL SEEMA PLAZA":
    "Hotel Seema Plaza (Silapathar, Assam)",
  "Hindustan Petroleum Corporation Limited":
    "HP Auto Fuel & Service (Pasighat)",
  "Nizantha Grandeur Apartment":
    "Nizantha Grandeur (Gulmohar Enclave, Bengaluru)",
  "Colive Glory":
    "Colive Bellandur Hub (Bengaluru)",
  "Canon - Master Camera service Center":
    "Canon Master Camera Service (MG Road Kochi)",
  "Hill Palace Hotel & Spa (Managed by South Asia Hotel)":
    "Hill Palace Hotel & Spa (Tripunithura)",
  "Church of God (full gospel) in India, Nit kattangal , Mukkam":
    "Church of God Full Gospel (Kattangal / NIT Calicut)",
  "LuLu International Shopping Mall":
    "LuLu International Shopping Mall (Edappally)",
  "Cafe Al Bacio Pvt. Ltd":
    "Cafe Al Bacio (Karassery, Mukkam)",
  "THEERATH RESTAURANT":
    "Theerath Kerala Restaurant (Varthur Main Road)",
  "Motis Kitchen":
    "Moti's Kitchen (HAL 3rd Stage)",
  "Derma Solutions Skin and Hair Clinic - Marathahalli":
    "Derma Solutions Clinic (Marathahalli)",
  "Green Trends Unisex Hair & Style Salon - Thubarahalli":
    "Green Trends Studio (Thubarahalli)",
  "Olive Street Food Cafe - Marthahalli":
    "Olive Street Food Cafe (Spice Garden)",
  "Htrz Modz Kochi":
    "Htrz Modz Auto Styling (Kochi)",
  "HTRZ ARTISTRY":
    "HTRZ Artistry (Electronic City, Bengaluru)",
  "TP Cabs":
    "TP Cabs Transit (Chowannur, Kerala)",
  "IndusGo, Calicut":
    "IndusGo Self-Drive Hub (Calicut Beach)",
  "Paragon Restaurant":
    "Paragon Restaurant (Calicut Heritage)",
  "Hotel Rahmath":
    "Hotel Rahmath (Calicut Landmark)",
  "Alakapuri Restaurant":
    "Alakapuri Restaurant (Infopark Kakkanad)",
  "Club House Restaurant":
    "Club House Restaurant (Fort Kochi)",
  "The Shammah Tabernacle":
    "The Shammah Tabernacle (Foreshore Road Kochi)",
  "Tonico Cafe":
    "Tonico Cafe (CSEZ Kakkanad)",
  "Chitrapuzha Bridge":
    "Chitrapuzha Bridge Scenic View (Kakkanad)",
  "Taco Bell":
    "Taco Bell (LuLu Mall Kochi)",
  "Chiyang Restaurant":
    "Chiyang Chinese Restaurant (Residency Road Bengaluru)",
  "Baga Beach":
    "Baga Beach (North Goa Coast)",
  "Nirvana Beach":
    "Nirvana Beach (Kumta, Karnataka Coast)",
  "Komlighat Park":
    "Komlighat Riverfront Park (Pasighat, Arunachal)",
  "Emuly Grasslands":
    "Emuly Grasslands (Anini, Dibang Valley)",
  "Tribal Adventure":
    "Tribal Adventure Camp (Devanahalli)",
  "Yarphel Homestay":
    "Yarphel Homestay (Tawang, Arunachal Pradesh)",
  "Nature's Hub Homestay":
    "Nature's Hub Homestay (Pasighat, Arunachal)",
  "Mountain Homestay Mechuka":
    "Mountain Homestay (Mechuka Valley, Arunachal)",
  "ibis Bengaluru Outer Ring Road":
    "ibis Bengaluru (Outer Ring Road Ecospace)",
  "Paradise Biryani Kasavanhalli":
    "Paradise Biryani (Kasavanahalli, Bengaluru)",
  "Midas Bites":
    "Midas Bites (AECS Layout, Bengaluru)",
  "Pepper Leaf Restaurant":
    "Pepper Leaf Restaurant (Silver Springs Layout)",
  "Imperial Restaurant":
    "Imperial Restaurant (Marathahalli, Bengaluru)",
};

function cleanTitle(rawName: string): string {
  if (!rawName) return "Google Place";
  const trimmed = rawName.trim();
  if (CLEAN_NAME_MAP[trimmed]) return CLEAN_NAME_MAP[trimmed];

  // Clean common promo / spam patterns
  return trimmed
    .replace(/\s*\(Buy \d+ Get \d+ Free\)/i, "")
    .replace(/\s*\([^)]*(?:Michelin|Bridgestone|Pirelli)[^)]*\)/i, "")
    .replace(/\s*,\s*redium.*$/i, "")
    .replace(/\s*-\s*Managed by.*$/i, "");
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 30);
}

function getFingerprint(title: string, lat: number, lng: number): string {
  const tLow = title.toLowerCase();

  // Canonical deduplication key for core institutional & personal hubs
  if (
    tLow.includes("nit calicut") ||
    tLow.includes("national institute of technology calicut") ||
    tLow.includes("national institute of technology (nit) calicut") ||
    tLow === "nitc"
  ) {
    return "canonical-nit-calicut";
  }

  if (tLow.includes("family haven") || tLow.includes("home base - tripunithura") || tLow === "home") {
    return "canonical-home-haven";
  }

  if (
    tLow.includes("schneider electric") ||
    tLow.includes("prestige tech park") ||
    tLow === "work"
  ) {
    return "canonical-schneider-work";
  }

  if (tLow.includes("veerakeralapudur") || tLow.includes("guava orchard")) {
    return "canonical-tenkasi-farm";
  }

  const normTitle = title
    .toLowerCase()
    .replace(/\(.*?\)/g, "")
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 24);

  // Group coordinates within ~5.5 km grid
  const latGrid = (Math.round(lat * 20) / 20).toFixed(2);
  const lngGrid = (Math.round(lng * 20) / 20).toFixed(2);
  return `${normTitle}-${latGrid}-${lngGrid}`;
}

function parseGeoJsonFeatures(
  json: any,
  fileName: string,
  deduplicatedMap: Map<string, MapLocation>
) {
  if (!json || !json.features || !Array.isArray(json.features)) return;

  const lowerFile = fileName.toLowerCase();
  let defaultStatus: "visited" | "saved" | "want_to_go" = "saved";
  if (lowerFile.includes("want") || lowerFile.includes("wish") || lowerFile.includes("to-go")) {
    defaultStatus = "want_to_go";
  } else if (
    lowerFile.includes("timeline") ||
    lowerFile.includes("location") ||
    lowerFile.includes("history") ||
    lowerFile.includes("visited") ||
    lowerFile.includes("review")
  ) {
    defaultStatus = "visited";
  }

  for (const feat of json.features) {
    const coords = feat.geometry?.coordinates || [0, 0];
    const lng = Number(coords[0]) || 0;
    const lat = Number(coords[1]) || 0;

    // Filter out invalid/zero coordinates
    if (lat === 0 && lng === 0) continue;

    const locObj = feat.properties?.location;
    const rawName = feat.properties?.name || feat.properties?.Title || locObj?.name || "";

    // Skip empty or unknown entries
    if (!rawName || rawName === "UNKNOWN") continue;

    const rawAddress =
      locObj?.address || feat.properties?.address || feat.properties?.Location?.Address || rawName;

    let itemStatus = defaultStatus;
    let category: MapLocation["category"] = "personal";
    let categoryLabel = "Google Saved";
    let notes = feat.properties?.review_text_published || feat.properties?.Comment || `From ${fileName}`;

    // Reviews
    if (feat.properties?.five_star_rating_published) {
      itemStatus = "visited";
      notes = `⭐ ${feat.properties.five_star_rating_published}/5 Rating. ${notes}`;
      categoryLabel = "Reviewed Place";
    }

    // Clean Title & Labeled Places Mapping
    let title = cleanTitle(rawName);
    let address = rawAddress;
    const lowerTitle = rawName.toLowerCase();

    const isNitCalicut =
      lowerTitle === "school" ||
      lowerTitle === "college" ||
      lowerTitle === "alma mater" ||
      lowerTitle === "nitc" ||
      lowerTitle.includes("nit calicut") ||
      lowerTitle.includes("national institute of technology calicut") ||
      lowerTitle.includes("national institute of technology, calicut");

    if (lowerTitle === "home") {
      title = "Family Haven (Home Base - Tripunithura, Kochi)";
      address = address === "Home" ? "Tripunithura, Kochi, Kerala 682301" : address;
      category = "personal";
      categoryLabel = "Home Base";
      itemStatus = "saved";
    } else if (lowerTitle === "work") {
      title = "Schneider Electric Global Hub (Prestige Tech Park)";
      address = address === "Work" ? "Prestige Tech Park II, Bengaluru" : address;
      category = "corporate";
      categoryLabel = "Corporate HQ";
      itemStatus = "saved";
    } else if (isNitCalicut) {
      title = "National Institute of Technology (NIT) Calicut (Alma Mater)";
      category = "gmat";
      categoryLabel = "Alma Mater";
      itemStatus = "saved";
    } else {
      const listTitle = (feat.properties?.listName || feat.properties?.List || "").toLowerCase();
      if (listTitle.includes("want")) itemStatus = "want_to_go";
      else if (listTitle.includes("star") || listTitle.includes("fav")) itemStatus = "saved";
    }

    // Categorization
    const tLow = title.toLowerCase();
    if (
      tLow.includes("homestay") ||
      tLow.includes("hotel") ||
      tLow.includes("park") ||
      tLow.includes("beach") ||
      tLow.includes("adventure") ||
      tLow.includes("grassland")
    ) {
      category = "transit";
      categoryLabel = "Travel & Stay";
    } else if (tLow.includes("church") || tLow.includes("cathedral") || tLow.includes("tabernacle")) {
      category = "spiritual";
      categoryLabel = "Spiritual Sanctuary";
    } else if (
      tLow.includes("restaurant") ||
      tLow.includes("biryani") ||
      tLow.includes("kitchen") ||
      tLow.includes("cafe") ||
      tLow.includes("bakery") ||
      tLow.includes("bites")
    ) {
      category = "personal";
      categoryLabel = "Dining & Cuisine";
    }

    const fp = getFingerprint(title, lat, lng);
    if (!deduplicatedMap.has(fp)) {
      deduplicatedMap.set(fp, {
        id: `loc-gdrive-${slugify(title)}`,
        title,
        query: `${title}, ${address}`,
        lat: Number(lat.toFixed(6)),
        lng: Number(lng.toFixed(6)),
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
}

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
    // NO PREFIXED LOCATIONS: return completely empty if not connected
    return NextResponse.json({
      connected: false,
      filesFound: 0,
      places: [],
      message: "Google Drive is not linked yet. Tap 'Connect Google Account' to link your Drive.",
    });
  }

  try {
    // 1. Search for Google Maps export / Takeout files on Google Drive (both zip and json)
    const query = encodeURIComponent(
      "(name contains 'Takeout' or name contains 'Reviews' or name contains 'Labeled' or name contains 'Saved' or name contains 'Places' or name contains 'Timeline' or name contains 'Want' or name contains 'Starred' or name contains 'Location' or name contains 'Maps' or name contains '.zip' or name contains '.json' or name contains '.geojson') and trashed = false"
    );

    const listRes = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,mimeType,size,modifiedTime)&pageSize=30&orderBy=modifiedTime desc`,
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
        places: [],
        message: "Connected to Google Drive, but no Google Maps Takeout files were found in your Drive.",
      });
    }

    const deduplicatedMap = new Map<string, MapLocation>();

    // 2. Fetch and parse found files (supporting both raw JSON and ZIP archives)
    for (const file of driveFiles.slice(0, 10)) {
      try {
        const fileContentRes = await fetch(
          `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        if (!fileContentRes.ok) continue;

        const isZip =
          file.name.toLowerCase().endsWith(".zip") ||
          (file.mimeType && file.mimeType.includes("zip"));

        if (isZip) {
          // Handle ZIP archive (Takeout.zip)
          try {
            const arrayBuffer = await fileContentRes.arrayBuffer();
            const zip = await JSZip.loadAsync(arrayBuffer);

            for (const [relativePath, entry] of Object.entries(zip.files)) {
              if (
                !entry.dir &&
                (relativePath.endsWith(".json") || relativePath.endsWith(".geojson"))
              ) {
                const lowerPath = relativePath.toLowerCase();
                // Check if it's a map or location file
                if (
                  lowerPath.includes("place") ||
                  lowerPath.includes("review") ||
                  lowerPath.includes("label") ||
                  lowerPath.includes("saved") ||
                  lowerPath.includes("map") ||
                  lowerPath.includes("timeline")
                ) {
                  try {
                    const text = await entry.async("text");
                    const json = JSON.parse(text);
                    parseGeoJsonFeatures(json, relativePath, deduplicatedMap);
                  } catch (entryErr) {
                    console.warn(`Could not parse JSON inside zip (${relativePath}):`, entryErr);
                  }
                }
              }
            }
          } catch (zipErr) {
            console.error(`Failed to process zip file ${file.name}:`, zipErr);
          }
        } else {
          // Handle direct JSON / GeoJSON file
          try {
            const rawText = await fileContentRes.text();
            const json = JSON.parse(rawText);
            parseGeoJsonFeatures(json, file.name, deduplicatedMap);
          } catch (jsonErr) {
            console.warn(`File ${file.name} is not standard GeoJSON:`, jsonErr);
          }
        }
      } catch (fileErr) {
        console.error(`Failed to read Drive file ${file.name}:`, fileErr);
      }
    }

    const placesToReturn = Array.from(deduplicatedMap.values());

    return NextResponse.json({
      connected: true,
      filesFound: driveFiles.length,
      files: driveFiles.map((f: any) => ({ id: f.id, name: f.name, modifiedTime: f.modifiedTime })),
      places: placesToReturn,
      message:
        placesToReturn.length > 0
          ? `Successfully synced ${placesToReturn.length} unique places from your Google Drive Takeout files!`
          : `Scanned ${driveFiles.length} file(s), but found 0 valid map location coordinates.`,
    });
  } catch (err: any) {
    console.error("Maps Drive sync error:", err);
    return NextResponse.json({
      connected: true,
      error: err.message,
      places: [],
      message: "An error occurred while scanning Google Drive.",
    });
  }
}
