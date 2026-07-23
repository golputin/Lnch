"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ethers } from "ethers";
import {
  API_URL,
  APP_NAME,
  ApiConfig,
  ApiToken,
  CHAIN_ID,
  CURVE_ABI,
  ERC20_ABI,
  apiGet,
  avatarGradient,
  shortAddr,
  timeAgo,
} from "@/lib/api";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function TokenPage() {
  const params = useParams();
  const addr = String(params.addr || "").toLowerCase();

  const [cfg, setCfg] = useState<ApiConfig | null>(null);
  const [token, setToken] = useState<ApiToken | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState("1");
  const [quote, setQuote] = useState<string | null>(null);
  const [bal, setBal] = useState<string>("0");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    setErr(null);
    try {
      const [c, t] = await Promise.all([
        apiGet<ApiConfig>("/api/config"),
        apiGet<{ token: ApiToken }>(`/api/token/${addr}`),
      ]);
      setCfg(c);
      setToken(t.token);
    } catch (e: any) {
      setErr(e.message || String(e));
    }
  }, [addr]);

  useEffect(() => {
    load();
    const id = setInterval(load, 10000);
    return () => clearInterval(id);
  }, [load]);

  async function ensureChain(provider: ethers.BrowserProvider) {
    const net = await provider.getNetwork();
    const want = cfg?.chainId || CHAIN_ID;
    if (Number(net.chainId) === Number(want)) return;
    const hex = "0x" + Number(want).toString(16);
    try {
      await window.ethereum.request({ method: "wallet_switchEthereumChain", params: [{ chainId: hex }] });
    } catch (e: any) {
      if (e.code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: hex,
              chainName: "Stable Mainnet",
              nativeCurrency: { name: "gUSDT", symbol: "gUSDT", decimals: 18 },
              rpcUrls: [cfg?.rpcUrl || "https://rpc.stable.xyz"],
              blockExplorerUrls: [cfg?.explorer || "https://stablescan.xyz"],
            },
          ],
        });
      } else throw e;
    }
  }

  async function connect() {
    setErr(null);
    try {
      if (!window.ethereum) throw new Error("Wallet not found");
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      await ensureChain(provider);
      const signer = await provider.getSigner();
      const acc = await signer.getAddress();
      setAccount(acc);
      if (token) {
        const t = new ethers.Contract(token.address, ERC20_ABI, provider);
        const b = await t.balanceOf(acc);
        setBal(ethers.formatEther(b));
      }
    } catch (e: any) {
      setErr(e.shortMessage || e.message || String(e));
    }
  }

  async function refreshQuote() {
    if (!token || !amount || Number(amount) <= 0) {
      setQuote(null);
      return;
    }
    try {
      if (side === "buy") {
        const r = await apiGet<{ tokensOutFmt: string; feeFmt: string }>(
          `/api/quote/buy?curve=${token.curve}&amount=${amount}`
        );
        setQuote(`≈ ${Number(r.tokensOutFmt).toLocaleString(undefined, { maximumFractionDigits: 4 })} ${token.symbol} (fee ${r.feeFmt} gUSDT)`);
      } else {
        const r = await apiGet<{ quoteOutFmt: string; feeFmt: string }>(
          `/api/quote/sell?curve=${token.curve}&amount=${amount}`
        );
        setQuote(`≈ ${Number(r.quoteOutFmt).toLocaleString(undefined, { maximumFractionDigits: 6 })} gUSDT (fee ${r.feeFmt})`);
      }
    } catch {
      setQuote(null);
    }
  }

  useEffect(() => {
    const t = setTimeout(refreshQuote, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount, side, token?.curve]);

  async function trade() {
    if (!token) return;
    setBusy(true);
    setErr(null);
    setMsg(null);
    try {
      if (!window.ethereum) throw new Error("Wallet not found");
      if (token.graduated) throw new Error("Token already graduated — trade on DYOR pool");
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      await ensureChain(provider);
      const signer = await provider.getSigner();
      const acc = await signer.getAddress();
      setAccount(acc);
      const curve = new ethers.Contract(token.curve, CURVE_ABI, signer);

      if (side === "buy") {
        const value = ethers.parseEther(String(amount));
        const [tokensOut] = await curve.getBuyPrice(value);
        const minOut = (tokensOut * BigInt(97)) / BigInt(100);
        const tx = await curve.buy(minOut, acc, { value });
        setMsg(`Buy tx: ${tx.hash}`);
        await tx.wait();
        setMsg(`Buy confirmed\n${tx.hash}`);
      } else {
        const tokensIn = ethers.parseEther(String(amount));
        const [quoteOut] = await curve.getSellPrice(tokensIn);
        const minOut = (quoteOut * BigInt(97)) / BigInt(100);
        const tx = await curve.sell(tokensIn, minOut, acc);
        setMsg(`Sell tx: ${tx.hash}`);
        await tx.wait();
        setMsg(`Sell confirmed\n${tx.hash}`);
      }
      await load();
      await connect();
    } catch (e: any) {
      setErr(e.shortMessage || e.message || String(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="shell">
      <nav className="nav">
        <Link href="/" className="brand">
          <div className="brand-mark">◎</div>
          <div>
            <h1>{APP_NAME}</h1>
            <p>Token detail</p>
          </div>
        </Link>
        <div className="nav-actions">
          <Link className="btn ghost sm" href="/">
            ← Trenches
          </Link>
          <button className="btn primary" onClick={connect}>
            {account ? shortAddr(account) : "Connect"}
          </button>
        </div>
      </nav>

      {!token ? (
        <div className="panel">{err ? <div className="err">{err}</div> : "Loading…"}</div>
      ) : (
        <div className="detail-grid">
          <div className="panel">
            <div className="token-top">
              <div className="avatar" style={{ background: avatarGradient(token.symbol) }}>
                {token.symbol.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h2 style={{ margin: 0 }}>
                  {token.name} <span style={{ color: "var(--muted)", fontWeight: 500 }}>${token.symbol}</span>
                </h2>
                <div style={{ color: "var(--muted)", fontSize: ".85rem", marginTop: 4 }}>
                  created {timeAgo(token.createdAt)} ago ·{" "}
                  <span className={`badge ${token.graduated ? "grad" : "live"}`}>
                    {token.graduated ? "GRADUATED" : "ON CURVE"}
                  </span>
                </div>
              </div>
            </div>

            <div className="kv">
              <div className="box">
                <div className="k">Raised</div>
                <div className="v">
                  {Number(token.realQuoteFmt).toFixed(4)} / {Number(token.graduationTargetFmt).toFixed(0)} gUSDT
                </div>
              </div>
              <div className="box">
                <div className="k">Progress</div>
                <div className="v">{token.progressPct?.toFixed(2)}%</div>
              </div>
              <div className="box">
                <div className="k">Price</div>
                <div className="v">{Number(token.lastPriceFmt || 0).toPrecision(6)} gUSDT</div>
              </div>
              <div className="box">
                <div className="k">Your balance</div>
                <div className="v">
                  {Number(bal).toLocaleString()} {token.symbol}
                </div>
              </div>
            </div>

            <div className="bar" style={{ marginBottom: 14 }}>
              <i style={{ width: `${Math.min(100, token.progressPct || 0)}%` }} />
            </div>

            <div className="kv">
              <div className="box">
                <div className="k">Token</div>
                <div className="v mono" style={{ fontSize: ".8rem" }}>
                  {token.address}
                </div>
              </div>
              <div className="box">
                <div className="k">Curve</div>
                <div className="v mono" style={{ fontSize: ".8rem" }}>
                  {token.curve}
                </div>
              </div>
              <div className="box">
                <div className="k">Creator</div>
                <div className="v mono" style={{ fontSize: ".8rem" }}>
                  {token.creator}
                </div>
              </div>
              <div className="box">
                <div className="k">Pair</div>
                <div className="v mono" style={{ fontSize: ".8rem" }}>
                  {token.pair || "—"}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
              {token.links?.explorerToken && (
                <a className="btn sm" href={token.links.explorerToken} target="_blank" rel="noreferrer">
                  Explorer token
                </a>
              )}
              {token.links?.explorerCurve && (
                <a className="btn sm" href={token.links.explorerCurve} target="_blank" rel="noreferrer">
                  Explorer curve
                </a>
              )}
              {token.graduated && (
                <a
                  className="btn sm primary"
                  href={`https://dyorswap.finance/swap/?chainId=988&outputCurrency=${token.address}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Trade on DYOR
                </a>
              )}
            </div>
          </div>

          <div className="panel form">
            <div className="tabs">
              <button
                className={`tab ${side === "buy" ? "active-buy" : ""}`}
                onClick={() => setSide("buy")}
              >
                Buy
              </button>
              <button
                className={`tab ${side === "sell" ? "active-sell" : ""}`}
                onClick={() => setSide("sell")}
              >
                Sell
              </button>
            </div>

            {token.graduated && (
              <div className="notice">Sudah graduate. Trading curve ditutup — pakai DYOR pool.</div>
            )}

            <label>
              {side === "buy" ? "Pay (gUSDT)" : `Sell (${token.symbol})`}
              <input
                type="number"
                min="0"
                step="0.0001"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </label>

            {quote && (
              <div style={{ color: "var(--muted)", fontSize: ".85rem", marginBottom: 12 }}>{quote}</div>
            )}

            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              {(side === "buy" ? ["0.5", "1", "5", "10"] : ["25", "50", "100"]).map((x) => (
                <button
                  key={x}
                  className="btn sm"
                  type="button"
                  onClick={() => {
                    if (side === "buy") setAmount(x);
                    else {
                      const pct = Number(x) / 100;
                      setAmount(String(Number(bal) * pct));
                    }
                  }}
                >
                  {side === "buy" ? `${x}` : `${x}%`}
                </button>
              ))}
            </div>

            <button
              className={`btn ${side === "buy" ? "primary" : "danger"}`}
              style={{ width: "100%" }}
              disabled={busy || token.graduated}
              onClick={trade}
            >
              {busy ? "Confirm in wallet…" : side === "buy" ? "Buy on curve" : "Sell to curve"}
            </button>

            {msg && <div className="ok">{msg}</div>}
            {err && <div className="err">{err}</div>}

            <p style={{ color: "var(--muted)", fontSize: ".78rem", marginTop: 14, lineHeight: 1.5 }}>
              Slippage default ~3%. API quote: <code>{API_URL}</code>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
