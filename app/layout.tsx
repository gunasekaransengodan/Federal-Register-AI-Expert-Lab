import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

const faviconUrl = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/favicon%20image-RCzWVA9hHZgXYwIsApKqDPC0t7NjE9.jpg'
const ogImageUrl = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/OG%20image-5O3cfbSeWfc7YIqk1Jc1i1qdo0jWVC.jpg'

export const metadata: Metadata = {
  title: 'Beyond RAG: 10-Brain AI Lab | Federal Register AI Expert Lab',
  description: 'Beyond RAG: 10-Brain AI Lab that reads Federal Register like a lawyer. Compute-first AI with DuckDB-WASM, Gemma 2B on WebGPU, Knowledge Graphs, Neuro-Symbolic, Agentic Workflows, Contradiction Detection, What-If Simulation — 100% open source, $0 infra, private, auditable. Built on GadgetSoftware/federal-register Parquet. No vector DB.',
  generator: 'Federal Register AI Expert Lab',
  metadataBase: new URL('https://federal-register-ai-analytics-lab.gunasekaran.vercel.app'),
  openGraph: {
    title: 'Beyond RAG: 10-Brain AI Lab That Turns Federal Regulations Into Executable Code',
    description: 'Compute-first regulatory intelligence in your browser. Private, auditable, and zero server cost.',
    type: 'website',
    images: [{ url: ogImageUrl, width: 1200, height: 630, alt: 'Beyond RAG: 10-Brain AI Lab' }],
  },
  twitter: { card: 'summary_large_image', title: 'Beyond RAG: 10-Brain AI Lab', description: 'Federal Register intelligence with 10 specialized AI brains and $0 infrastructure.', images: [ogImageUrl] },
  icons: { icon: faviconUrl, shortcut: faviconUrl, apple: faviconUrl },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
