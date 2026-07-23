export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Stable Launchpad";
export const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8787").replace(/\/$/, "");
export const CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID || 988);

export const FACTORY_ABI = [
  "function createToken(string name, string symbol, uint256 initialBuyMinTokens) payable returns (address token, address curve)",
  "function allTokensLength() view returns (uint256)",
  "function tokenToCurve(address) view returns (address)",
  "function graduationTarget() view returns (uint256)",
  "function feeBps() view returns (uint256)",
  "function creationFee() view returns (uint256)",
  "event TokenLaunched(address indexed token, address indexed curve, address indexed creator, string name, string symbol, uint256 timestamp)",
] as const;

export const CURVE_ABI = [
  "function token() view returns (address)",
  "function creator() view returns (address)",
  "function realTokenReserves() view returns (uint256)",
  "function realQuoteReserves() view returns (uint256)",
  "function graduationTarget() view returns (uint256)",
  "function graduated() view returns (bool)",
  "function pair() view returns (address)",
  "function progressBps() view returns (uint256)",
  "function getBuyPrice(uint256 quoteIn) view returns (uint256 tokensOut, uint256 fee)",
  "function getSellPrice(uint256 tokensIn) view returns (uint256 quoteOut, uint256 fee)",
  "function buy(uint256 minTokensOut, address to) payable",
  "function sell(uint256 tokensIn, uint256 minQuoteOut, address to)",
] as const;

export const ERC20_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function balanceOf(address) view returns (uint256)",
] as const;

export type ApiToken = {
  address: string;
  curve: string;
  creator: string;
  name: string;
  symbol: string;
  createdAt: number;
  graduated: boolean;
  pair: string | null;
  realQuoteFmt: string;
  progressBps: number;
  progressPct: number;
  graduationTargetFmt: string;
  lastPriceFmt: string;
  links?: {
    explorerToken?: string;
    explorerCurve?: string;
    explorerPair?: string | null;
  };
};

export type ApiConfig = {
  chainId: number;
  rpcUrl: string;
  explorer: string;
  factory: string | null;
  dyorRouter: string;
  weth: string;
  nativeSymbol: string;
  factoryMeta?: {
    graduationTargetFmt?: string;
    feeBps?: number;
    creationFeeFmt?: string;
  };
};

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, { next: { revalidate: 0 }, cache: "no-store" });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `API ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export function shortAddr(a?: string | null, n = 4) {
  if (!a) return "—";
  return `${a.slice(0, 2 + n)}…${a.slice(-n)}`;
}

export function timeAgo(ts: number) {
  const s = Math.max(0, Math.floor(Date.now() / 1000) - ts);
  if (s < 60) return `${s}s`;
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  return `${Math.floor(s / 86400)}d`;
}

export function avatarGradient(symbol: string) {
  let h = 0;
  for (let i = 0; i < symbol.length; i++) h = (h * 31 + symbol.charCodeAt(i)) >>> 0;
  const a = h % 360;
  const b = (h * 7) % 360;
  return `linear-gradient(135deg, hsl(${a} 90% 55%), hsl(${b} 85% 45%))`;
}
