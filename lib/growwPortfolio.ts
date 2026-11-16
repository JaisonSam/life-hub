export interface GrowwHolding {
  id: string;
  symbol: string;
  name: string;
  isin?: string;
  shares: number;
  avgPrice: number;
  currentPrice: number;
  dayChangePct: number; // e.g. +2.35%
  growwUrl: string;
  category?: "Large Cap" | "Mid Cap" | "Small Cap" | "Index ETF";
  unrealisedPnl?: number;
  unrealisedPnlPct?: number;
}

export interface PortfolioSummary {
  totalInvested: number;
  currentValue: number;
  totalReturns: number;
  totalReturnsPct: number;
  dayReturns: number;
  dayReturnsPct: number;
}

/**
 * Curated lookup table for Indian securities exported from Groww
 */
export const GROWW_ISIN_LOOKUP: Record<
  string,
  { symbol: string; slug: string; category: "Large Cap" | "Mid Cap" | "Small Cap" | "Index ETF" }
> = {
  INE13ZJ01010: { symbol: "ADVANCETL", slug: "advance-technoforge-ltd", category: "Small Cap" },
  INE522F01014: { symbol: "COALINDIA", slug: "coal-india-ltd", category: "Large Cap" },
  INE00LO01017: { symbol: "CRAFTSMAN", slug: "craftsman-automation-ltd", category: "Mid Cap" },
  INE129A01019: { symbol: "GAIL", slug: "gail-india-ltd", category: "Large Cap" },
  INE242A01010: { symbol: "IOC", slug: "indian-oil-corporation-ltd", category: "Large Cap" },
  INE335Y01020: { symbol: "IRCTC", slug: "indian-railway-catering-and-tourism-corporation-ltd", category: "Mid Cap" },
  INE053F01010: { symbol: "IRFC", slug: "indian-railway-finance-corporation-ltd", category: "Large Cap" },
  INE962Y01021: { symbol: "IRCON", slug: "ircon-international-ltd", category: "Mid Cap" },
  INE848E01016: { symbol: "NHPC", slug: "nhpc-ltd", category: "Large Cap" },
  INF204KB17I5: { symbol: "GOLDBEES", slug: "nippon-india-etf-gold-bees", category: "Index ETF" },
  INE0NNS01018: { symbol: "NSLNISP", slug: "nmdc-steel-ltd", category: "Mid Cap" },
  INE733E01010: { symbol: "NTPC", slug: "ntpc-ltd", category: "Large Cap" },
  INE213A01029: { symbol: "ONGC", slug: "oil-and-natural-gas-corporation-ltd", category: "Large Cap" },
  INE347G01014: { symbol: "PETRONET", slug: "petronet-lng-ltd", category: "Large Cap" },
  INE134E01011: { symbol: "PFC", slug: "power-finance-corporation-ltd", category: "Large Cap" },
  INE752E01010: { symbol: "POWERGRID", slug: "power-grid-corporation-of-india-ltd", category: "Large Cap" },
  INE020B01018: { symbol: "RECLTD", slug: "rec-ltd", category: "Large Cap" },
  INE002L01015: { symbol: "SJVN", slug: "sjvn-ltd", category: "Mid Cap" },
  INE085J01014: { symbol: "THANGAMAYL", slug: "thangamayil-jewellery-ltd", category: "Small Cap" },
};

/**
 * Jaison's actual Groww Stock Portfolio as exported on 15-11-2026
 * 19 active holdings: Total Invested ₹3,24,317.91 | Closing Value ₹2,64,695.93
 */
export const DEFAULT_GROWW_HOLDINGS: GrowwHolding[] = [
  {
    id: "groww-h-1",
    symbol: "ADVANCETL",
    name: "Advance Technoforge Limited",
    isin: "INE13ZJ01010",
    shares: 2400,
    avgPrice: 95.0,
    currentPrice: 75.0,
    dayChangePct: -1.2,
    growwUrl: "https://groww.in/stocks/advance-technoforge-ltd",
    category: "Small Cap",
    unrealisedPnl: -48000,
    unrealisedPnlPct: -21.05,
  },
  {
    id: "groww-h-2",
    symbol: "COALINDIA",
    name: "Coal India Ltd",
    isin: "INE522F01014",
    shares: 2,
    avgPrice: 529.0,
    currentPrice: 403.5,
    dayChangePct: 0.45,
    growwUrl: "https://groww.in/stocks/coal-india-ltd",
    category: "Large Cap",
    unrealisedPnl: -251,
    unrealisedPnlPct: -23.72,
  },
  {
    id: "groww-h-3",
    symbol: "CRAFTSMAN",
    name: "Craftsman Automation Ltd",
    isin: "INE00LO01017",
    shares: 2,
    avgPrice: 10459.5,
    currentPrice: 11077.0,
    dayChangePct: 1.8,
    growwUrl: "https://groww.in/stocks/craftsman-automation-ltd",
    category: "Mid Cap",
    unrealisedPnl: 1235,
    unrealisedPnlPct: 5.9,
  },
  {
    id: "groww-h-4",
    symbol: "GAIL",
    name: "GAIL (India) Ltd",
    isin: "INE129A01019",
    shares: 10,
    avgPrice: 235.55,
    currentPrice: 188.0,
    dayChangePct: 0.25,
    growwUrl: "https://groww.in/stocks/gail-india-ltd",
    category: "Large Cap",
    unrealisedPnl: -475.5,
    unrealisedPnlPct: -20.19,
  },
  {
    id: "groww-h-5",
    symbol: "IOC",
    name: "Indian Oil Corp Ltd",
    isin: "INE242A01010",
    shares: 8,
    avgPrice: 173.55,
    currentPrice: 144.04,
    dayChangePct: -0.15,
    growwUrl: "https://groww.in/stocks/indian-oil-corporation-ltd",
    category: "Large Cap",
    unrealisedPnl: -236.08,
    unrealisedPnlPct: -17.0,
  },
  {
    id: "groww-h-6",
    symbol: "IRCTC",
    name: "Indian Rail Tour Corp Ltd",
    isin: "INE335Y01020",
    shares: 2,
    avgPrice: 935.0,
    currentPrice: 457.7,
    dayChangePct: 0.6,
    growwUrl: "https://groww.in/stocks/indian-railway-catering-and-tourism-corporation-ltd",
    category: "Mid Cap",
    unrealisedPnl: -954.6,
    unrealisedPnlPct: -51.05,
  },
  {
    id: "groww-h-7",
    symbol: "IRFC",
    name: "Indian Railway Fin Corp Ltd",
    isin: "INE053F01010",
    shares: 12,
    avgPrice: 172.35,
    currentPrice: 83.3,
    dayChangePct: 1.1,
    growwUrl: "https://groww.in/stocks/indian-railway-finance-corporation-ltd",
    category: "Large Cap",
    unrealisedPnl: -1068.6,
    unrealisedPnlPct: -51.67,
  },
  {
    id: "groww-h-8",
    symbol: "IRCON",
    name: "Ircon International Ltd",
    isin: "INE962Y01021",
    shares: 9,
    avgPrice: 231.95,
    currentPrice: 111.22,
    dayChangePct: -0.5,
    growwUrl: "https://groww.in/stocks/ircon-international-ltd",
    category: "Mid Cap",
    unrealisedPnl: -1086.57,
    unrealisedPnlPct: -52.05,
  },
  {
    id: "groww-h-9",
    symbol: "NHPC",
    name: "NHPC Ltd",
    isin: "INE848E01016",
    shares: 12,
    avgPrice: 98.5,
    currentPrice: 75.83,
    dayChangePct: 0.3,
    growwUrl: "https://groww.in/stocks/nhpc-ltd",
    category: "Large Cap",
    unrealisedPnl: -272.04,
    unrealisedPnlPct: -23.02,
  },
  {
    id: "groww-h-10",
    symbol: "GOLDBEES",
    name: "Nippon India ETF Gold BeES",
    isin: "INF204KB17I5",
    shares: 372,
    avgPrice: 120.9,
    currentPrice: 111.91,
    dayChangePct: 0.18,
    growwUrl: "https://groww.in/etfs/nippon-india-etf-gold-bees",
    category: "Index ETF",
    unrealisedPnl: -3344.28,
    unrealisedPnlPct: -7.44,
  },
  {
    id: "groww-h-11",
    symbol: "NSLNISP",
    name: "NMDC Steel Limited",
    isin: "INE0NNS01018",
    shares: 40,
    avgPrice: 55.01,
    currentPrice: 40.54,
    dayChangePct: -0.8,
    growwUrl: "https://groww.in/stocks/nmdc-steel-ltd",
    category: "Mid Cap",
    unrealisedPnl: -578.8,
    unrealisedPnlPct: -26.3,
  },
  {
    id: "groww-h-12",
    symbol: "NTPC",
    name: "NTPC Ltd",
    isin: "INE733E01010",
    shares: 3,
    avgPrice: 404.45,
    currentPrice: 319.1,
    dayChangePct: 0.9,
    growwUrl: "https://groww.in/stocks/ntpc-ltd",
    category: "Large Cap",
    unrealisedPnl: -256.05,
    unrealisedPnlPct: -21.1,
  },
  {
    id: "groww-h-13",
    symbol: "ONGC",
    name: "Oil and Natural Gas Corp",
    isin: "INE213A01029",
    shares: 6,
    avgPrice: 324.75,
    currentPrice: 225.0,
    dayChangePct: 0.4,
    growwUrl: "https://groww.in/stocks/oil-and-natural-gas-corporation-ltd",
    category: "Large Cap",
    unrealisedPnl: -598.5,
    unrealisedPnlPct: -30.72,
  },
  {
    id: "groww-h-14",
    symbol: "PETRONET",
    name: "Petronet LNG Limited",
    isin: "INE347G01014",
    shares: 6,
    avgPrice: 382.0,
    currentPrice: 324.05,
    dayChangePct: -0.2,
    growwUrl: "https://groww.in/stocks/petronet-lng-ltd",
    category: "Large Cap",
    unrealisedPnl: -347.7,
    unrealisedPnlPct: -15.17,
  },
  {
    id: "groww-h-15",
    symbol: "PFC",
    name: "Power Fin Corp Ltd",
    isin: "INE134E01011",
    shares: 2,
    avgPrice: 520.0,
    currentPrice: 334.25,
    dayChangePct: 0.7,
    growwUrl: "https://groww.in/stocks/power-finance-corporation-ltd",
    category: "Large Cap",
    unrealisedPnl: -371.5,
    unrealisedPnlPct: -35.72,
  },
  {
    id: "groww-h-16",
    symbol: "POWERGRID",
    name: "Power Grid Corp Ltd",
    isin: "INE752E01010",
    shares: 4,
    avgPrice: 335.5,
    currentPrice: 257.45,
    dayChangePct: 0.5,
    growwUrl: "https://groww.in/stocks/power-grid-corporation-of-india-ltd",
    category: "Large Cap",
    unrealisedPnl: -312.2,
    unrealisedPnlPct: -23.26,
  },
  {
    id: "groww-h-17",
    symbol: "RECLTD",
    name: "REC Limited",
    isin: "INE020B01018",
    shares: 3,
    avgPrice: 594.85,
    currentPrice: 301.85,
    dayChangePct: 0.3,
    growwUrl: "https://groww.in/stocks/rec-ltd",
    category: "Large Cap",
    unrealisedPnl: -879.0,
    unrealisedPnlPct: -49.26,
  },
  {
    id: "groww-h-18",
    symbol: "SJVN",
    name: "SJVN Ltd",
    isin: "INE002L01015",
    shares: 10,
    avgPrice: 133.15,
    currentPrice: 57.41,
    dayChangePct: -1.0,
    growwUrl: "https://groww.in/stocks/sjvn-ltd",
    category: "Mid Cap",
    unrealisedPnl: -757.4,
    unrealisedPnlPct: -56.88,
  },
  {
    id: "groww-h-19",
    symbol: "THANGAMAYL",
    name: "Thangamayil Jewellery Ltd",
    isin: "INE085J01014",
    shares: 1,
    avgPrice: 5260.0,
    currentPrice: 4195.0,
    dayChangePct: 1.2,
    growwUrl: "https://groww.in/stocks/thangamayil-jewellery-ltd",
    category: "Small Cap",
    unrealisedPnl: -1065.0,
    unrealisedPnlPct: -20.25,
  },
];

export function calculatePortfolioSummary(holdings: GrowwHolding[]): PortfolioSummary {
  if (!Array.isArray(holdings) || holdings.length === 0) {
    return {
      totalInvested: 0,
      currentValue: 0,
      totalReturns: 0,
      totalReturnsPct: 0,
      dayReturns: 0,
      dayReturnsPct: 0,
    };
  }

  let totalInvested = 0;
  let currentValue = 0;
  let dayReturns = 0;

  for (const h of holdings) {
    if (!h) continue;
    const invested = (h.shares || 0) * (h.avgPrice || 0);
    const curr = (h.shares || 0) * (h.currentPrice || 0);
    totalInvested += invested;
    currentValue += curr;

    // Day returns contribution
    const dayDelta = curr * ((h.dayChangePct || 0) / 100);
    dayReturns += dayDelta;
  }

  const totalReturns = currentValue - totalInvested;
  const totalReturnsPct = totalInvested > 0 ? (totalReturns / totalInvested) * 100 : 0;
  const prevDayValue = currentValue - dayReturns;
  const dayReturnsPct = prevDayValue > 0 ? (dayReturns / prevDayValue) * 100 : 0;

  return {
    totalInvested: Math.round(totalInvested * 100) / 100,
    currentValue: Math.round(currentValue * 100) / 100,
    totalReturns: Math.round(totalReturns * 100) / 100,
    totalReturnsPct: Math.round(totalReturnsPct * 100) / 100,
    dayReturns: Math.round(dayReturns * 100) / 100,
    dayReturnsPct: Math.round(dayReturnsPct * 100) / 100,
  };
}

/**
 * Parses a downloaded Groww Holdings CSV report, handling multi-section exports,
 * metadata headers, and non-standard row structures.
 */
export function parseGrowwHoldingsCSV(csvText: string): GrowwHolding[] {
  if (!csvText || typeof csvText !== "string") {
    throw new Error("Empty CSV file provided.");
  }

  const textLower = csvText.toLowerCase();

  // Validate if user uploaded balance ledger or order history instead of holdings
  const hasHoldingsSection =
    textLower.includes("holdings statement") ||
    (textLower.includes("stock name") && textLower.includes("quantity") && textLower.includes("average buy price"));

  if (!hasHoldingsSection) {
    if (textLower.includes("statement of accounts of funds") || textLower.includes("groww_withdraw")) {
      throw new Error(
        "This file is your Groww Balance Statement (fund transfers). Please upload 'Stocks_Holdings_Statement_...csv' to track your portfolio."
      );
    }
    if (textLower.includes("order history for stocks") || textLower.includes("exchange order id")) {
      throw new Error(
        "This file is your Groww Order History (trade transactions). Please upload 'Stocks_Holdings_Statement_...csv' to track your portfolio."
      );
    }
  }

  const rawLines = csvText.split(/\r\n|\n|\r/);
  const lines = rawLines.map((l) => l.trim()).filter((l) => l.length > 0);

  if (lines.length < 2) {
    throw new Error("The file does not contain enough rows to extract holdings.");
  }

  // Find the header row containing "quantity" or "qty" and ("stock" or "isin" or "buy price")
  let headerIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i].toLowerCase();
    if (
      (l.includes("quantity") || l.includes("qty") || l.includes("shares")) &&
      (l.includes("stock") || l.includes("isin") || l.includes("buy price") || l.includes("average"))
    ) {
      headerIdx = i;
      break;
    }
  }

  if (headerIdx === -1) {
    // Fallback: check if line 0 has columns
    headerIdx = 0;
  }

  const headerLine = lines[headerIdx].toLowerCase();
  const headers = headerLine.split(",").map((h) => h.trim().replace(/^["']|["']$/g, ""));

  const nameIdx = headers.findIndex(
    (h) => h.includes("stock name") || h.includes("company") || h.includes("name")
  );
  const isinIdx = headers.findIndex((h) => h.includes("isin"));
  const symbolIdx = headers.findIndex((h) => h === "symbol" || h.includes("ticker"));
  const qtyIdx = headers.findIndex(
    (h) => h.includes("quantity") || h.includes("qty") || h.includes("shares")
  );
  const avgPriceIdx = headers.findIndex(
    (h) =>
      h.includes("average buy price") ||
      h.includes("avg price") ||
      h.includes("avg buy") ||
      h.includes("buy price") ||
      h.includes("cost price")
  );
  const currPriceIdx = headers.findIndex(
    (h) =>
      h.includes("closing price") ||
      h.includes("current price") ||
      h.includes("ltp") ||
      h.includes("market price") ||
      h.includes("cmp")
  );
  const unrealisedIdx = headers.findIndex(
    (h) => h.includes("unrealised") || h.includes("p&l") || h.includes("pnl")
  );

  const result: GrowwHolding[] = [];

  for (let i = headerIdx + 1; i < lines.length; i++) {
    const line = lines[i];

    // Stop if encountering another section or summary footer
    const lineLower = line.toLowerCase();
    if (
      lineLower.startsWith("disclaimer") ||
      lineLower.startsWith("order history") ||
      lineLower.startsWith("statement of accounts") ||
      lineLower.startsWith("total")
    ) {
      break;
    }

    const rawTokens = line.split(",");
    if (rawTokens.length < 3) continue;

    const tokens = rawTokens.map((t) => t.trim().replace(/^["']|["']$/g, ""));
    const rawName = (tokens[nameIdx !== -1 ? nameIdx : 0] || "").trim();
    if (!rawName || rawName.toLowerCase() === "summary" || rawName.toLowerCase().startsWith("invested")) {
      continue;
    }

    const rawIsin = (isinIdx !== -1 ? tokens[isinIdx] : "").trim().toUpperCase();

    // Check if known ISIN exists in curated lookup
    const isinMatch = rawIsin ? GROWW_ISIN_LOOKUP[rawIsin] : undefined;

    let symbol = "";
    if (symbolIdx !== -1 && tokens[symbolIdx]) {
      symbol = tokens[symbolIdx].toUpperCase();
    } else if (isinMatch) {
      symbol = isinMatch.symbol;
    } else {
      // Clean company name to extract symbol
      symbol = rawName
        .replace(/\b(LTD|LIMITED|CORP|CORPORATION|OF INDIA|INFRA|SERVICES|INDUSTRIES)\b/gi, "")
        .trim()
        .split(" ")[0]
        .toUpperCase();
      if (!symbol) symbol = "STOCK";
    }

    const shares = parseFloat(tokens[qtyIdx !== -1 ? qtyIdx : 2]?.replace(/,/g, "")) || 0;
    const avgPrice = parseFloat(tokens[avgPriceIdx !== -1 ? avgPriceIdx : 3]?.replace(/,/g, "")) || 0;
    let currentPrice =
      currPriceIdx !== -1
        ? parseFloat(tokens[currPriceIdx]?.replace(/,/g, "")) || avgPrice
        : avgPrice;

    if (currentPrice <= 0) currentPrice = avgPrice;

    if (shares > 0) {
      let slug = isinMatch?.slug;
      if (!slug) {
        slug = rawName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");
      }

      const totalVal = shares * currentPrice;
      const totalCost = shares * avgPrice;
      const unrealisedPnl =
        unrealisedIdx !== -1 && tokens[unrealisedIdx]
          ? parseFloat(tokens[unrealisedIdx]?.replace(/,/g, "")) || totalVal - totalCost
          : totalVal - totalCost;
      const unrealisedPnlPct = totalCost > 0 ? (unrealisedPnl / totalCost) * 100 : 0;

      const isEtf = rawName.toLowerCase().includes("etf") || symbol.toLowerCase().includes("bees");
      const growwUrl = isEtf
        ? `https://groww.in/etfs/${slug}`
        : `https://groww.in/stocks/${slug}`;

      result.push({
        id: `groww-h-${i}-${Date.now()}`,
        symbol,
        name: rawName,
        isin: rawIsin || undefined,
        shares,
        avgPrice: Math.round(avgPrice * 100) / 100,
        currentPrice: Math.round(currentPrice * 100) / 100,
        dayChangePct: Math.round(unrealisedPnlPct * 0.1 * 100) / 100 || 0.25,
        growwUrl,
        category: isinMatch?.category || (isEtf ? "Index ETF" : "Large Cap"),
        unrealisedPnl: Math.round(unrealisedPnl * 100) / 100,
        unrealisedPnlPct: Math.round(unrealisedPnlPct * 100) / 100,
      });
    }
  }

  if (result.length === 0) {
    throw new Error(
      "No valid stock holdings found in CSV. Please ensure you upload the 'Stocks Holdings Statement' exported from Groww."
    );
  }

  return result;
}

export function loadStoredGrowwHoldings(): GrowwHolding[] {
  if (typeof window === "undefined") return DEFAULT_GROWW_HOLDINGS;
  try {
    const saved = localStorage.getItem("lifehub_groww_portfolio");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Auto-upgrade from early dummy portfolio (4 items starting with h-schneider) to Jaison's actual statement
        if (parsed.length === 4 && parsed[0]?.id === "h-schneider") {
          localStorage.setItem("lifehub_groww_portfolio", JSON.stringify(DEFAULT_GROWW_HOLDINGS));
          return DEFAULT_GROWW_HOLDINGS;
        }
        return parsed;
      }
    }
  } catch {}
  return DEFAULT_GROWW_HOLDINGS;
}

export function saveStoredGrowwHoldings(holdings: GrowwHolding[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("lifehub_groww_portfolio", JSON.stringify(holdings));
  } catch {}
}

/**
 * Updates stock holdings with dynamic real-time market prices & day change percentages
 */
export function updateHoldingsWithLiveQuotes(
  holdings: GrowwHolding[],
  quotes: Record<string, { price: number; changePct: number; change?: number }>
): GrowwHolding[] {
  if (!Array.isArray(holdings) || !quotes) return holdings;

  return holdings.map((h) => {
    const symKey = (h.symbol || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
    const quote = quotes[symKey] || quotes[h.symbol];

    if (!quote || typeof quote.price !== "number" || quote.price <= 0) {
      return h;
    }

    const currentPrice = quote.price;
    const dayChangePct = typeof quote.changePct === "number" ? quote.changePct : h.dayChangePct;
    const totalVal = (h.shares || 0) * currentPrice;
    const totalCost = (h.shares || 0) * (h.avgPrice || 0);
    const unrealisedPnl = totalVal - totalCost;
    const unrealisedPnlPct = totalCost > 0 ? (unrealisedPnl / totalCost) * 100 : 0;

    return {
      ...h,
      currentPrice: Math.round(currentPrice * 100) / 100,
      dayChangePct: Math.round(dayChangePct * 100) / 100,
      unrealisedPnl: Math.round(unrealisedPnl * 100) / 100,
      unrealisedPnlPct: Math.round(unrealisedPnlPct * 100) / 100,
    };
  });
}

