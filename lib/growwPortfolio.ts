export interface GrowwHolding {
  id: string;
  symbol: string;
  name: string;
  shares: number;
  avgPrice: number;
  currentPrice: number;
  dayChangePct: number; // e.g. +2.35%
  growwUrl: string;
  category?: "Large Cap" | "Mid Cap" | "Small Cap" | "Index ETF";
}

export interface PortfolioSummary {
  totalInvested: number;
  currentValue: number;
  totalReturns: number;
  totalReturnsPct: number;
  dayReturns: number;
  dayReturnsPct: number;
}

// Initial sample portfolio curated for Jaison (Schneider Electric, Tata Motors, HDFC Bank, Reliance)
export const DEFAULT_GROWW_HOLDINGS: GrowwHolding[] = [
  {
    id: "h-schneider",
    symbol: "SCHNEIDER",
    name: "Schneider Electric Infra Ltd",
    shares: 120,
    avgPrice: 710.0,
    currentPrice: 842.5,
    dayChangePct: 2.35,
    growwUrl: "https://groww.in/stocks/schneider-electric-infrastructure-ltd",
    category: "Mid Cap",
  },
  {
    id: "h-tatamotors",
    symbol: "TATAMOTORS",
    name: "Tata Motors Ltd",
    shares: 75,
    avgPrice: 715.0,
    currentPrice: 784.9,
    dayChangePct: 1.15,
    growwUrl: "https://groww.in/stocks/tata-motors-ltd",
    category: "Large Cap",
  },
  {
    id: "h-hdfcbank",
    symbol: "HDFCBANK",
    name: "HDFC Bank Ltd",
    shares: 40,
    avgPrice: 1610.0,
    currentPrice: 1742.0,
    dayChangePct: 0.82,
    growwUrl: "https://groww.in/stocks/hdfc-bank-ltd",
    category: "Large Cap",
  },
  {
    id: "h-reliance",
    symbol: "RELIANCE",
    name: "Reliance Industries Ltd",
    shares: 30,
    avgPrice: 1285.0,
    currentPrice: 1268.4,
    dayChangePct: -0.28,
    growwUrl: "https://groww.in/stocks/reliance-industries-ltd",
    category: "Large Cap",
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
 * Parses a downloaded Groww Holdings CSV report
 */
export function parseGrowwHoldingsCSV(csvText: string): GrowwHolding[] {
  const result: GrowwHolding[] = [];
  if (!csvText || typeof csvText !== "string") return result;

  const lines = csvText.split(/\r\n|\n|\r/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) return result;

  // Header detection
  const headerLine = lines[0].toLowerCase();
  const headers = headerLine.split(",").map((h) => h.trim().replace(/^["']|["']$/g, ""));

  const nameIdx = headers.findIndex((h) => h.includes("company") || h.includes("stock") || h.includes("name") || h.includes("symbol"));
  const symbolIdx = headers.findIndex((h) => h === "symbol" || h.includes("ticker"));
  const qtyIdx = headers.findIndex((h) => h.includes("qty") || h.includes("quantity") || h.includes("shares"));
  const avgPriceIdx = headers.findIndex((h) => h.includes("avg") || h.includes("buy price") || h.includes("cost price"));
  const currPriceIdx = headers.findIndex((h) => h.includes("current") || h.includes("ltp") || h.includes("market price"));

  for (let i = 1; i < lines.length; i++) {
    const rawTokens = lines[i].split(",");
    if (rawTokens.length < 3) continue;

    const tokens = rawTokens.map((t) => t.trim().replace(/^["']|["']$/g, ""));
    const rawName = tokens[nameIdx !== -1 ? nameIdx : 0] || "Stock";
    let rawSymbol = symbolIdx !== -1 ? tokens[symbolIdx] : rawName.split(" ")[0].toUpperCase();
    if (!rawSymbol) rawSymbol = rawName.toUpperCase();

    const shares = parseFloat(tokens[qtyIdx !== -1 ? qtyIdx : 1]) || 0;
    const avgPrice = parseFloat(tokens[avgPriceIdx !== -1 ? avgPriceIdx : 2]) || 0;
    const currentPrice = currPriceIdx !== -1 ? parseFloat(tokens[currPriceIdx]) || avgPrice : avgPrice;

    if (shares > 0) {
      const slug = rawName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      result.push({
        id: `groww-h-${Date.now()}-${i}`,
        symbol: rawSymbol,
        name: rawName,
        shares,
        avgPrice,
        currentPrice,
        dayChangePct: 0.5, // fallback if not in CSV
        growwUrl: `https://groww.in/stocks/${slug}`,
        category: "Large Cap",
      });
    }
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
