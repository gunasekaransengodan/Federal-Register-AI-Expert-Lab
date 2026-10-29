'use client'

import { useEffect, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts'
import { Database, FileCode2, Layers3, ShieldCheck, Workflow } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart'
import { DATASET_GLOB, queryDataset, resolveDatasetSource } from '@/lib/duckdb'

type DashboardRow = { total: number; proposed: number; final: number; open: number }
type AgencyRow = { agency: string; count: number }
type MonthRow = { month: string; proposed: number; final: number }
type LatestRow = { publication_date: string; type: string; title: string; agency: string; document_number: string }

const chartConfig = { proposed: { label: 'Proposed', color: '#1d8a86' }, final: { label: 'Final', color: '#d9a441' }, count: { label: 'Documents', color: '#1d8a86' } }

function StatCard({ label, value, detail, icon: Icon, accent }: { label: string; value: string; detail: string; icon: typeof Database; accent: string }) { return <Card className="stat-card"><CardContent className="flex items-start justify-between p-5"><div><p className="eyebrow">{label}</p><p className="stat-value">{value}</p><p className="stat-detail">{detail}</p></div><span className="stat-icon" style={{ color: accent, backgroundColor: `${accent}16` }}><Icon /></span></CardContent></Card> }
function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) { return <div className="section-heading"><div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2></div>{description && <p className="section-description">{description}</p>}</div> }

export function DuckDBDashboard() {
  const [stats, setStats] = useState<DashboardRow | null>(null)
  const [agencies, setAgencies] = useState<AgencyRow[]>([])
  const [months, setMonths] = useState<MonthRow[]>([])
  const [latest, setLatest] = useState<LatestRow[]>([])
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    async function load() {
      async function runQueries(source: string) {
        return Promise.all([
          queryDataset<DashboardRow>(`SELECT COUNT(*)::INTEGER AS total, COUNT(*) FILTER (WHERE type = 'Proposed Rule')::INTEGER AS proposed, COUNT(*) FILTER (WHERE type = 'Final Rule')::INTEGER AS final, COUNT(*) FILTER (WHERE TRY_CAST(comments_close_on AS DATE) > CURRENT_DATE)::INTEGER AS open FROM ${source}`),
          queryDataset<AgencyRow>(`SELECT agency, COUNT(*)::INTEGER AS count FROM ${source}, UNNEST(agency_names) AS t(agency) WHERE agency IS NOT NULL GROUP BY agency ORDER BY count DESC LIMIT 4`),
          queryDataset<MonthRow>(`SELECT strftime(TRY_CAST(publication_date AS DATE), '%b') AS month, EXTRACT(MONTH FROM TRY_CAST(publication_date AS DATE))::INTEGER AS month_number, COUNT(*) FILTER (WHERE type = 'Proposed Rule')::INTEGER AS proposed, COUNT(*) FILTER (WHERE type = 'Final Rule')::INTEGER AS final FROM ${source} WHERE publication_date IS NOT NULL GROUP BY month, month_number ORDER BY month_number`),
          queryDataset<LatestRow>(`SELECT publication_date, type, title, array_to_string(agency_names, ', ') AS agency, document_number FROM ${source} ORDER BY publication_date DESC LIMIT 6`),
        ])
      }
      try {
        let results
        try { results = await runQueries(`read_parquet('${DATASET_GLOB}')`) } catch { results = await runQueries(await resolveDatasetSource()) }
        const [summary, agencyRows, monthRows, latestRows] = results
        if (cancelled) return
        setStats(summary[0] ?? { total: 0, proposed: 0, final: 0, open: 0 })
        setAgencies(agencyRows)
        setMonths(monthRows)
        setLatest(latestRows)
        setStatus('ready')
      } catch (cause) {
        if (cancelled) return
        setError(cause instanceof Error ? cause.message : 'DuckDB-WASM could not read the Parquet dataset.')
        setStatus('error')
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  if (status === 'loading') return <section className="dashboard-section"><div className="container"><div className="db-status"><Database /> <strong>Starting DuckDB-WASM</strong><span>Loading Federal Register Parquet in a browser worker…</span></div></div></section>
  if (status === 'error') return <section className="dashboard-section"><div className="container"><div className="db-status error"><Database /> <strong>DuckDB-WASM query failed</strong><span>{error}</span><small>Queries run client-side against hf://datasets/GadgetSoftware/federal-register/documents/*.parquet.</small></div></div></section>

  return <section className="dashboard-section"><div className="container"><SectionHeading eyebrow="Live DuckDB-WASM snapshot" title="Federal Register intelligence, at a glance" description="Every number below comes from SQL running in an embedded browser worker over the public Parquet dataset." /><div className="stats-grid"><StatCard label="Total documents" value={stats!.total.toLocaleString()} detail="Across all agencies" icon={Layers3} accent="#1d8a86" /><StatCard label="Proposed rules" value={stats!.proposed.toLocaleString()} detail="Filtered by type" icon={FileCode2} accent="#d9a441" /><StatCard label="Final rules" value={stats!.final.toLocaleString()} detail="Filtered by type" icon={ShieldCheck} accent="#49658a" /><StatCard label="Open notices" value={stats!.open.toLocaleString()} detail="TRY_CAST(comments_close_on AS DATE) > CURRENT_DATE" icon={Workflow} accent="#b96558" /></div><div className="charts-grid"><Card><CardHeader><div className="chart-title-row"><div><CardTitle>Regulatory activity</CardTitle><CardDescription>Grouped by publication month</CardDescription></div><div className="legend"><span><i className="dot teal" />Proposed</span><span><i className="dot gold" />Final</span></div></div></CardHeader><CardContent><ChartContainer config={chartConfig} className="h-[250px] w-full"><LineChart data={months} margin={{ left: -14, right: 8, top: 12, bottom: 0 }}><CartesianGrid vertical={false} stroke="#e7e1d8" /><XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={10} tick={{ fill: '#728094', fontSize: 11 }} /><YAxis tickLine={false} axisLine={false} tick={{ fill: '#728094', fontSize: 11 }} /><Tooltip content={<ChartTooltipContent />} /><Line type="monotone" dataKey="proposed" stroke="var(--color-proposed)" strokeWidth={2.5} dot={false} /><Line type="monotone" dataKey="final" stroke="var(--color-final)" strokeWidth={2.5} dot={false} /></LineChart></ChartContainer></CardContent></Card><Card><CardHeader><CardTitle>Documents by agency</CardTitle><CardDescription>Top agencies from GROUP BY agency</CardDescription></CardHeader><CardContent><ChartContainer config={chartConfig} className="h-[250px] w-full"><BarChart data={agencies} layout="vertical" margin={{ left: 0, right: 12, top: 4, bottom: 0 }}><CartesianGrid horizontal={false} stroke="#e7e1d8" /><XAxis type="number" hide /><YAxis dataKey="agency" type="category" tickLine={false} axisLine={false} width={80} tick={{ fill: '#0f1f3c', fontSize: 11, fontWeight: 700 }} /><Tooltip cursor={{ fill: '#f3efe8' }} content={<ChartTooltipContent />} /><Bar dataKey="count" fill="var(--color-count)" radius={[0, 4, 4, 0]} barSize={24} /></BarChart></ChartContainer></CardContent></Card></div><div className="latest-header"><SectionHeading eyebrow="Recently published" title="Latest intelligence" description="The six most recent rows returned by DuckDB." /></div><div className="latest-grid">{latest.map((item) => <a href={`https://www.federalregister.gov/documents/${item.publication_date}/${item.document_number}`} target="_blank" rel="noreferrer" className="latest-card" key={item.document_number}><div className="latest-meta"><span>{item.publication_date}</span><Badge className="type-badge teal">{item.type}</Badge></div><h3>{item.title}</h3><div className="latest-footer"><span>{item.agency}</span><span className="agency-tag">{item.document_number}</span></div></a>)}</div></div></section>
}
