"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";
import {
  API_URL,
  APP_NAME,
  ApiConfig,
  ApiToken,
  CHAIN_ID,
  FACTORY_ABI,
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

type Filter = "all" | "live" | "graduated";

export default function HomePage() {
  const [cfg, setCfg] = useState<ApiConfig | null>(null);
  const [tokens, setTokens] = useState<ApiToken[]>([]);
  const [stats, setStats] = useState<{ tokens: number; graduated: number; launched24h: number } | null>(null);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [account, setAccount] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [initBuy, setInitBuy] = useState("0");
  const [apiDown, setApiDown] = useState(false);

  const load = useCallback(async () => {
    try {
      const [c, t, s] = await Promise.all([
        apiGet<ApiConfig>("/api/config"),
        apiGet<{ items: ApiToken[] }>("/api/tokens?limit=60"),
        apiGet<{ tokens: number; graduated: number; launched24h: number }>("/api/stats"),
      ]);
      setCfg(c);
      setTokens(t.items || []);
      setStats(s);
      setApiDown(false);
    } catch (e: any) {
      setApiDown(true);
      setErr(e.message || String(e));
    }
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(load, 12000);
    return () => clearInterval(id);
  }, [load]);

  const filtered = useMemo(() => {
    return tokens.filter((t) => {
      if (filter === "live" && t.graduated) return false;
      if (filter === "graduated" && !t.graduated) return false;
      if (!q.trim()) return true;
      const s = q.trim().toLowerCase();
      return (
        t.name.toLowerCase().includes(s) ||
        t.symbol.toLowerCase().includes(s) ||
        t.address.includes(s) ||
        t.curve.includes(s)
      );
    });
  }, [tokens, filter, q]);

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
      } else {
        throw e;
      }
    }
  }

  async function connect() {
    setErr(null);
    try {
      if (!window.ethereum) throw new Error("Wallet not found. Install MetaMask / Rabby.");
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      await ensureChain(provider);
      const signer = await provider.getSigner();
      setAccount(await signer.getAddress());
    } catch (e: any) {
      setErr(e.shortMessage || e.message || String(e));
    }
  }

  async function launch() {
    setErr(null);
    setMsg(null);
    if (!cfg?.factory) {
      setErr("Factory belum di-set di API (FACTORY_ADDRESS). Deploy contract dulu.");
      return;
    }
    if (!name.trim() || !symbol.trim()) {
      setErr("Name & symbol wajib diisi.");
      return;
    }
    setBusy(true);
    try {
      if (!window.ethereum) throw new Error("Wallet not found");
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      await ensureChain(provider);
      const signer = await provider.getSigner();
      const acc = await signer.getAddress();
      setAccount(acc);
      const factory = new ethers.Contract(cfg.factory, FACTORY_ABI, signer);
      const value = ethers.parseEther(String(initBuy || "0"));
      const tx = await factory.createToken(name.trim(), symbol.trim().toUpperCase(), 0, { value });
      setMsg(`Tx submitted: ${tx.hash}\nWaiting confirmation…`);
      const rc = await tx.wait();
      let token = "";
      let curve = "";
      for (const log of rc.logs) {
        try {
          const parsed = factory.interface.parseLog(log);
          if (parsed?.name === "TokenLaunched") {
            token = parsed.args.token;
            curve = parsed.args.curve;
          }
        } catch {
          /* skip */
        }
      }
      setMsg(`Launched!\nToken: ${token}\nCurve: ${curve}\nTx: ${tx.hash}`);
      setName("");
      setSymbol("");
      setInitBuy("0");
      // nudge API indexer
      try {
        await fetch(`${API_URL}/api/admin/sync`, { method: "POST" });
      } catch {
        /* optional */
      }
      await load();
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
            <p>
              <span className="pulse" />
              Stable · {cfg?.chainId || CHAIN_ID} · gUSDT
            </p>
          </div>
        </Link>
        <div className="nav-actions">
          <a className="btn ghost sm" href={API_URL + "/api/health"} target="_blank" rel="noreferrer">
            API
          </a>
          <button className="btn primary" onClick={connect}>
            {account ? shortAddr(account) : "Connect Wallet"}
          </button>
        </div>
      </nav>

      {apiDown && (
        <div className="notice">
          API belum reachable di <code>{API_URL}</code>. Set <code>NEXT_PUBLIC_API_URL</code> di Vercel ke
          URL server API kamu.
        </div>
      )}

      <section className="hero">
        <div className="panel hero-copy">
          <h2>
            Launch memecoins on <span>Stable</span>
          </h2>
          <p>
            Bonding curve → graduate ke DYOR V2. UI di Vercel, data & indexer di API server kamu.
            Buat token, snipe early, pantau progress ke graduation.
          </p>
          <div className="stats">
            <div className="stat">
              <div className="k">Tokens</div>
              <div className="v">{stats?.tokens ?? "—"}</div>
            </div>
            <div className="stat">
              <div className="k">Graduated</div>
              <div className="v">{stats?.graduated ?? "—"}</div>
            </div>
            <div className="stat">
              <div className="k">24h launches</div>
              <div className="v">{stats?.launched24h ?? "—"}</div>
            </div>
          </div>
          <div style={{ marginTop: 14, color: "var(--muted)", fontSize: ".82rem" }}>
            Factory: <code className="mono">{cfg?.factory ? shortAddr(cfg.factory, 6) : "not set"}</code>
            {" · "}
            Target: <b>{cfg?.factoryMeta?.graduationTargetFmt || "85"} gUSDT</b>
            {" · "}
            Fee: <b>{cfg?.factoryMeta?.feeBps != null ? cfg.factoryMeta.feeBps / 100 : 1}%</b>
          </div>
        </div>

        <div className="panel form">
          <h3 style={{ margin: "0 0 12px" }}>Create token</h3>
          <label>
            Name
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Fefer" />
          </label>
          <label>
            Symbol
            <input value={symbol} onChange={(e) => setSymbol(e.target.value)} placeholder="FEFER" />
          </label>
          <label>
            Initial buy (gUSDT)
            <input
              type="number"
              min="0"
              step="0.01"
              value={initBuy}
              onChange={(e) => setInitBuy(e.target.value)}
            />
          </label>
          <button className="btn primary" style={{ width: "100%" }} disabled={busy} onClick={launch}>
            {busy ? "Launching…" : "Launch on Stable"}
          </button>
          {msg && <div className="ok">{msg}</div>}
          {err && <div className="err">{err}</div>}
        </div>
      </section>

      <div className="toolbar">
        <input
          className="search"
          placeholder="Search name / symbol / CA"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <div className="chips">
          {(
            [
              ["all", "All"],
              ["live", "On curve"],
              ["graduated", "Graduated"],
            ] as const
          ).map(([k, label]) => (
            <button
              key={k}
              className={`chip ${filter === k ? "active" : ""}`}
              onClick={() => setFilter(k)}
            >
              {label}
            </button>
          ))}
          <button className="chip" onClick={load}>
            Refresh
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty">Belum ada token. Launch yang pertama, atau cek koneksi API.</div>
      ) : (
        <div className="grid">
          {filtered.map((t) => (
            <Link key={t.address} href={`/token/${t.address}`} className="token-card">
              <div className="token-top">
                <div className="avatar" style={{ background: avatarGradient(t.symbol) }}>
                  {t.symbol.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3>{t.name}</h3>
                  <div className="sym">${t.symbol}</div>
                </div>
                <span className={`badge ${t.graduated ? "grad" : "live"}`}>
                  {t.graduated ? "GRAD" : "LIVE"}
                </span>
              </div>
              <div className="meta-row">
                <span>
                  Raised <b>{Number(t.realQuoteFmt).toFixed(2)}</b> / {Number(t.graduationTargetFmt).toFixed(0)} gUSDT
                </span>
                <span>{timeAgo(t.createdAt)}</span>
              </div>
              <div className="bar" title={`${t.progressPct}%`}>
                <i style={{ width: `${Math.min(100, t.progressPct || 0)}%` }} />
              </div>
              <div className="meta-row" style={{ marginTop: 10, marginBottom: 0 }}>
                <span>
                  Price <b>{Number(t.lastPriceFmt || 0).toPrecision(4)}</b>
                </span>
                <span className="mono">{shortAddr(t.address)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      <footer className="footer">
        <span>API: {API_URL}</span>
        <span>Graduate → DYOR V2 · LP locked</span>
      </footer>
    </div>
  );
}
