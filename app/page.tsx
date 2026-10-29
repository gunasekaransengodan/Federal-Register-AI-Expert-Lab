'use client'

import { ArrowUpRight, BarChart3, BrainCircuit, Database, ExternalLink, FileCode2, GitBranch, Layers3, LockKeyhole, Network, ShieldCheck, Sparkles, Workflow } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart'

const ogImage = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/OG%20image-5O3cfbSeWfc7YIqk1Jc1i1qdo0jWVC.jpg'

const monthlyData = [
  { month: 'Jan', proposed: 24, final: 18 }, { month: 'Feb', proposed: 32, final: 25 },
  { month: 'Mar', proposed: 29, final: 31 }, { month: 'Apr', proposed: 38, final: 34 },
  { month: 'May', proposed: 44, final: 39 }, { month: 'Jun', proposed: 51, final: 46 },
  { month: 'Jul', proposed: 48, final: 53 }, { month: 'Aug', proposed: 58, final: 49 },
  { month: 'Sep', proposed: 63, final: 57 }, { month: 'Oct', proposed: 70, final: 64 },
  { month: 'Nov', proposed: 74, final: 69 }, { month: 'Dec', proposed: 82, final: 76 },
]

const agencyData = [
  { agency: 'EPA', count: 342 }, { agency: 'FDA', count: 298 }, { agency: 'SEC', count: 187 }, { agency: 'DOT', count: 156 },
]

const latest = [
  { date: 'OCT 24, 2026', type: 'Final Rule', title: 'National Primary Drinking Water Regulations: Lead and Copper Rule Improvements', agency: 'Environmental Protection Agency', tag: 'EPA', tone: 'teal' },
  { date: 'OCT 21, 2026', type: 'Proposed Rule', title: 'AI Model Transparency and Accountability Framework', agency: 'National Institute of Standards and Technology', tag: 'NIST', tone: 'gold' },
  { date: 'OCT 18, 2026', type: 'Notice', title: 'Small Business Innovation Research Program Policy Directive', agency: 'Small Business Administration', tag: 'SBA', tone: 'slate' },
  { date: 'OCT 16, 2026', type: 'Final Rule', title: 'Modernization of Securities Offering Disclosure Requirements', agency: 'Securities and Exchange Commission', tag: 'SEC', tone: 'teal' },
  { date: 'OCT 12, 2026', type: 'Proposed Rule', title: 'Electronic Prescribing of Controlled Substances', agency: 'Food and Drug Administration', tag: 'FDA', tone: 'gold' },
  { date: 'OCT 09, 2026', type: 'Notice', title: 'Climate Resilience and Infrastructure Investment Guidance', agency: 'Department of Transportation', tag: 'DOT', tone: 'slate' },
]

const chartConfig = {
  proposed: { label: 'Proposed', color: '#1d8a86' },
  final: { label: 'Final', color: '#d9a441' },
  count: { label: 'Documents', color: '#1d8a86' },
}

function StatCard({ label, value, detail, icon: Icon, accent }: { label: string; value: string; detail: string; icon: typeof Database; accent: string }) {
  return <Card className="stat-card">
    <CardContent className="flex items-start justify-between p-5">
      <div><p className="eyebrow">{label}</p><p className="stat-value">{value}</p><p className="stat-detail">{detail}</p></div>
      <span className="stat-icon" style={{ color: accent, backgroundColor: `${accent}16` }}><Icon /></span>
    </CardContent>
  </Card>
}

function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return <div className="section-heading"><div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2></div>{description && <p className="section-description">{description}</p>}</div>
}

export default function Page() {
  return <main className="min-h-screen bg-[#f9f6f0] text-[#0f1f3c]">
    <header className="site-header">
      <div className="header-inner">
        <a href="#top" className="brand" aria-label="Federal Register AI Expert Lab home">
          <span className="brand-mark"><img src={ogImage} alt="Federal Register AI Expert Lab" /></span>
          <span><strong>Federal Register</strong><small>AI Expert Lab</small></span>
        </a>
        <nav className="header-nav" aria-label="Research links">
          <a href="https://duckdb.org/docs/stable/clients/wasm/overview.html" target="_blank" rel="noreferrer">DuckDB-WASM <ExternalLink /></a>
          <a href="https://ai.google.dev/gemma" target="_blank" rel="noreferrer">Gemma <ExternalLink /></a>
          <a href="https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API" target="_blank" rel="noreferrer">WebGPU <ExternalLink /></a>
          <a href="https://huggingface.co/datasets/GadgetSoftware/federal-register" target="_blank" rel="noreferrer">Dataset <ExternalLink /></a>
        </nav>
        <Badge className="zero-badge"><span className="live-dot" />Zero server cost</Badge>
      </div>
    </header>

    <div id="top" className="hero-shell"><div className="hero-inner">
      <div className="hero-copy"><Badge variant="outline" className="kicker">COMPUTE-FIRST AI · 100% OPEN SOURCE</Badge><h1>Beyond RAG: <span>10-Brain AI Lab</span> That Turns Federal Regulations Into Executable Code.</h1><p>Read Federal Register like a lawyer. Analyze, reason, simulate, and audit regulations privately in your browser — powered by DuckDB-WASM, WebGPU, and a knowledge graph. No vector database. No servers.</p><div className="hero-actions"><a href="#dashboard" className="primary-action">Explore the lab <ArrowUpRight /></a><a href="#architecture" className="text-action">How it works <ArrowUpRight /></a></div></div>
      <div className="hero-visual"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="brain-node"><BrainCircuit /></div><div className="visual-label label-top"><Database /> Parquet → DuckDB</div><div className="visual-label label-bottom"><LockKeyhole /> Private by design</div></div>
    </div></div>

    <section id="dashboard" className="dashboard-section"><div className="container"><SectionHeading eyebrow="Live dataset snapshot" title="Federal Register intelligence, at a glance" description="A browser-native view over the GadgetSoftware/federal-register Parquet dataset." /><div className="stats-grid"><StatCard label="Total documents" value="1,247" detail="Across all agencies" icon={Layers3} accent="#1d8a86" /><StatCard label="Proposed rules" value="312" detail="25.0% of corpus" icon={FileCode2} accent="#d9a441" /><StatCard label="Final rules" value="428" detail="34.3% of corpus" icon={ShieldCheck} accent="#49658a" /><StatCard label="Open notices" value="94" detail="Needs expert review" icon={Workflow} accent="#b96558" /></div>
      <div className="charts-grid"><Card><CardHeader><div className="chart-title-row"><div><CardTitle>Regulatory activity</CardTitle><CardDescription>Monthly documents published</CardDescription></div><div className="legend"><span><i className="dot teal" />Proposed</span><span><i className="dot gold" />Final</span></div></div></CardHeader><CardContent><ChartContainer config={chartConfig} className="h-[250px] w-full"><LineChart data={monthlyData} margin={{ left: -14, right: 8, top: 12, bottom: 0 }}><CartesianGrid vertical={false} stroke="#e7e1d8" /><XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={10} tick={{ fill: '#728094', fontSize: 11 }} /><YAxis tickLine={false} axisLine={false} tick={{ fill: '#728094', fontSize: 11 }} /><Tooltip content={<ChartTooltipContent />} /><Line type="monotone" dataKey="proposed" stroke="var(--color-proposed)" strokeWidth={2.5} dot={false} /><Line type="monotone" dataKey="final" stroke="var(--color-final)" strokeWidth={2.5} dot={false} /></LineChart></ChartContainer></CardContent></Card>
      <Card><CardHeader><CardTitle>Documents by agency</CardTitle><CardDescription>Top agencies in the current corpus</CardDescription></CardHeader><CardContent><ChartContainer config={chartConfig} className="h-[250px] w-full"><BarChart data={agencyData} layout="vertical" margin={{ left: 0, right: 12, top: 4, bottom: 0 }}><CartesianGrid horizontal={false} stroke="#e7e1d8" /><XAxis type="number" hide /><YAxis dataKey="agency" type="category" tickLine={false} axisLine={false} width={44} tick={{ fill: '#0f1f3c', fontSize: 12, fontWeight: 700 }} /><Tooltip cursor={{ fill: '#f3efe8' }} content={<ChartTooltipContent />} /><Bar dataKey="count" fill="var(--color-count)" radius={[0, 4, 4, 0]} barSize={24} /></BarChart></ChartContainer></CardContent></Card></div>
      <div className="latest-header"><SectionHeading eyebrow="Recently published" title="Latest intelligence" description="The six most recent documents in the working set." /><a className="view-all" href="https://www.federalregister.gov/" target="_blank" rel="noreferrer">View Federal Register <ArrowUpRight /></a></div><div className="latest-grid">{latest.map((item) => <a href="https://www.federalregister.gov/" target="_blank" rel="noreferrer" className="latest-card" key={item.title}><div className="latest-meta"><span>{item.date}</span><Badge className={`type-badge ${item.tone}`}>{item.type}</Badge></div><h3>{item.title}</h3><div className="latest-footer"><span>{item.agency}</span><span className="agency-tag">{item.tag}</span></div></a>)}</div></div></section>

    <section id="architecture" className="architecture-section"><div className="container"><SectionHeading eyebrow="Beyond retrieval augmented generation" title="Ten specialized brains. One auditable pipeline." description="Each brain is a composable capability, running locally in the browser and leaving a verifiable trail." /><div className="brains-grid">{[['01','Exact SQL','DuckDB-WASM',Database],['02','Semantic Intent','Gemma 2B',Sparkles],['03','Knowledge Graph','Relations',Network],['04','Prediction','Signals',BarChart3],['05','Private LLM','WebGPU',LockKeyhole],['06','Fusion','10-brain synthesis',GitBranch],['07','What-If Simulation','Scenario engine',Workflow],['08','Agentic','Multi-step plans',BrainCircuit],['09','Neuro-Symbolic','Rules + reason',FileCode2],['10','Contradiction','Conflict detection',ShieldCheck]].map(([number, name, detail, Icon]) => <div className="brain-card" key={name as string}><span className="brain-number">{number as string}</span><span className="brain-icon"><Icon /></span><strong>{name as string}</strong><small>{detail as string}</small></div>)}</div></div></section>
    <footer><div className="container footer-inner"><span>Federal Register AI Expert Lab</span><span>Built on open data · Runs in your browser · $0 infrastructure</span><a href="https://github.com/GadgetSoftware/federal-register" target="_blank" rel="noreferrer">View source <ArrowUpRight /></a></div></footer>
  </main>
}
