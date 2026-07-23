:root {
  --bg0: #05070d;
  --bg1: #0b1220;
  --card: rgba(16, 24, 40, 0.72);
  --card-solid: #101828;
  --line: rgba(148, 163, 184, 0.14);
  --text: #eef4ff;
  --muted: #8b9cb3;
  --mint: #3dffa8;
  --mint-dim: rgba(61, 255, 168, 0.14);
  --cyan: #49b6ff;
  --pink: #ff5cad;
  --warn: #ffc857;
  --danger: #ff6b81;
  --shadow: 0 20px 60px rgba(0, 0, 0, 0.45);
  --radius: 18px;
  --font: "Segoe UI", ui-sans-serif, system-ui, -apple-system, sans-serif;
  --mono: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
}

* { box-sizing: border-box; }
html, body { padding: 0; margin: 0; }
body {
  font-family: var(--font);
  color: var(--text);
  background:
    radial-gradient(1200px 700px at 0% -10%, rgba(61, 255, 168, 0.12), transparent 55%),
    radial-gradient(900px 600px at 100% 0%, rgba(73, 182, 255, 0.14), transparent 50%),
    radial-gradient(800px 500px at 50% 100%, rgba(255, 92, 173, 0.08), transparent 50%),
    linear-gradient(180deg, var(--bg0), var(--bg1));
  min-height: 100vh;
}
a { color: inherit; text-decoration: none; }
button, input { font: inherit; }
code, .mono { font-family: var(--mono); }

.shell {
  width: min(1180px, calc(100% - 32px));
  margin: 0 auto;
  padding: 20px 0 60px;
}

.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 10px 0 22px;
  position: sticky;
  top: 0;
  z-index: 20;
  backdrop-filter: blur(14px);
  background: linear-gradient(180deg, rgba(5,7,13,.92), rgba(5,7,13,.55) 70%, transparent);
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}
.brand-mark {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, var(--mint), var(--cyan));
  color: #04140d;
  font-weight: 900;
  box-shadow: 0 0 30px rgba(61,255,168,.25);
}
.brand h1 {
  margin: 0;
  font-size: 1.05rem;
  letter-spacing: -0.02em;
}
.brand p {
  margin: 2px 0 0;
  color: var(--muted);
  font-size: 0.78rem;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.btn {
  border: 1px solid var(--line);
  background: rgba(255,255,255,0.03);
  color: var(--text);
  border-radius: 12px;
  padding: 10px 14px;
  cursor: pointer;
  font-weight: 650;
  transition: .15s ease;
}
.btn:hover { border-color: rgba(61,255,168,.35); transform: translateY(-1px); }
.btn:disabled { opacity: .45; cursor: not-allowed; transform: none; }
.btn.primary {
  background: linear-gradient(135deg, var(--mint), #7dffc4);
  color: #04140d;
  border: none;
  box-shadow: 0 8px 24px rgba(61,255,168,.2);
}
.btn.ghost { background: transparent; }
.btn.danger {
  background: rgba(255,107,129,.12);
  border-color: rgba(255,107,129,.35);
  color: #ffd0d7;
}
.btn.sm { padding: 8px 10px; font-size: .85rem; border-radius: 10px; }

.hero {
  display: grid;
  grid-template-columns: 1.3fr .9fr;
  gap: 18px;
  margin-bottom: 22px;
}
@media (max-width: 900px) {
  .hero { grid-template-columns: 1fr; }
}

.panel {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  backdrop-filter: blur(10px);
  padding: 20px;
}

.hero-copy h2 {
  margin: 0 0 10px;
  font-size: clamp(1.6rem, 3vw, 2.3rem);
  line-height: 1.1;
  letter-spacing: -0.03em;
}
.hero-copy h2 span {
  background: linear-gradient(90deg, var(--mint), var(--cyan), #c084fc);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.hero-copy p {
  margin: 0 0 16px;
  color: var(--muted);
  line-height: 1.55;
  max-width: 52ch;
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}
.stat {
  background: rgba(255,255,255,0.03);
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 12px;
}
.stat .k { color: var(--muted); font-size: .75rem; }
.stat .v { font-size: 1.15rem; font-weight: 750; margin-top: 4px; }

.toolbar {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
  margin: 8px 0 16px;
}
.search {
  flex: 1;
  min-width: 200px;
  background: rgba(0,0,0,.28);
  border: 1px solid var(--line);
  color: var(--text);
  border-radius: 12px;
  padding: 12px 14px;
}
.search:focus { outline: 1px solid rgba(61,255,168,.5); border-color: rgba(61,255,168,.4); }

.chips { display: flex; gap: 8px; flex-wrap: wrap; }
.chip {
  border: 1px solid var(--line);
  background: rgba(255,255,255,.03);
  color: var(--muted);
  border-radius: 999px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: .85rem;
}
.chip.active {
  color: #04140d;
  background: var(--mint);
  border-color: transparent;
  font-weight: 700;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 14px;
}

.token-card {
  display: block;
  background: linear-gradient(180deg, rgba(255,255,255,0.03), transparent 40%), var(--card);
  border: 1px solid var(--line);
  border-radius: 16px;
  padding: 14px;
  transition: .16s ease;
  min-height: 168px;
}
.token-card:hover {
  border-color: rgba(61,255,168,.35);
  transform: translateY(-2px);
  box-shadow: 0 16px 40px rgba(0,0,0,.35);
}
.token-top {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 12px;
}
.avatar {
  width: 46px;
  height: 46px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  font-weight: 800;
  color: #061018;
  flex-shrink: 0;
}
.token-top h3 {
  margin: 0;
  font-size: 1rem;
}
.token-top .sym {
  color: var(--muted);
  font-size: .8rem;
}
.badge {
  margin-left: auto;
  font-size: .72rem;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 999px;
  border: 1px solid var(--line);
  color: var(--muted);
  white-space: nowrap;
}
.badge.live {
  color: #04140d;
  background: var(--mint);
  border-color: transparent;
}
.badge.grad {
  color: #1a1030;
  background: linear-gradient(135deg, #c084fc, #49b6ff);
  border-color: transparent;
}

.meta-row {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  color: var(--muted);
  font-size: .8rem;
  margin-bottom: 8px;
}
.meta-row b { color: var(--text); font-weight: 650; }

.bar {
  height: 8px;
  border-radius: 999px;
  background: rgba(255,255,255,.06);
  overflow: hidden;
  border: 1px solid var(--line);
}
.bar > i {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, var(--mint), var(--cyan));
  border-radius: inherit;
}

.form label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: var(--muted);
  font-size: .82rem;
  margin-bottom: 12px;
}
.form input {
  background: rgba(0,0,0,.28);
  border: 1px solid var(--line);
  color: var(--text);
  border-radius: 12px;
  padding: 11px 12px;
}
.form input:focus {
  outline: 1px solid rgba(61,255,168,.45);
  border-color: rgba(61,255,168,.35);
}

.tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}
.tab {
  flex: 1;
  text-align: center;
  padding: 10px;
  border-radius: 12px;
  border: 1px solid var(--line);
  background: transparent;
  color: var(--muted);
  cursor: pointer;
  font-weight: 700;
}
.tab.active-buy {
  background: var(--mint-dim);
  color: var(--mint);
  border-color: rgba(61,255,168,.35);
}
.tab.active-sell {
  background: rgba(255,107,129,.12);
  color: #ffb3bf;
  border-color: rgba(255,107,129,.35);
}

.kv {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin: 12px 0;
}
.kv .box {
  background: rgba(0,0,0,.22);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 10px;
}
.kv .box .k { color: var(--muted); font-size: .75rem; }
.kv .box .v { margin-top: 4px; font-weight: 700; word-break: break-all; }

.notice {
  border: 1px solid var(--line);
  background: rgba(255,200,87,.08);
  color: #ffe6a8;
  border-radius: 12px;
  padding: 10px 12px;
  font-size: .85rem;
  margin-bottom: 12px;
}
.err {
  border: 1px solid rgba(255,107,129,.35);
  background: rgba(255,107,129,.08);
  color: #ffd0d7;
  border-radius: 12px;
  padding: 10px 12px;
  font-size: .85rem;
  margin-top: 10px;
  white-space: pre-wrap;
  word-break: break-word;
}
.ok {
  border: 1px solid rgba(61,255,168,.3);
  background: rgba(61,255,168,.08);
  color: #c9ffe6;
  border-radius: 12px;
  padding: 10px 12px;
  font-size: .85rem;
  margin-top: 10px;
  white-space: pre-wrap;
  word-break: break-word;
}

.footer {
  margin-top: 28px;
  color: var(--muted);
  font-size: .8rem;
  display: flex;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.empty {
  padding: 40px 16px;
  text-align: center;
  color: var(--muted);
  border: 1px dashed var(--line);
  border-radius: 16px;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1.2fr .8fr;
  gap: 16px;
}
@media (max-width: 900px) {
  .detail-grid { grid-template-columns: 1fr; }
}

.pulse {
  display: inline-block;
  width: 8px; height: 8px; border-radius: 50%;
  background: var(--mint);
  box-shadow: 0 0 0 0 rgba(61,255,168,.6);
  animation: pulse 1.6s infinite;
  margin-right: 6px;
}
@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(61,255,168,.55); }
  70% { box-shadow: 0 0 0 10px rgba(61,255,168,0); }
  100% { box-shadow: 0 0 0 0 rgba(61,255,168,0); }
}
