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

// Zero prefixed locations. All map locations must originate from Google Drive sync or user Takeout file upload.
export const TAKEOUT_GOOGLE_PLACES: MapLocation[] = [];
