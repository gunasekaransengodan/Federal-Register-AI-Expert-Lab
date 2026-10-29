'use client'

import { useRef, useState } from 'react'
import { BrainCircuit, CheckCircle2, Download, LockKeyhole, ShieldCheck, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { CreateMLCEngine, type MLCEngine } from '@mlc-ai/web-llm'
import { usePersistentState } from '@/lib/use-persistent-state'

const F16_MODEL = 'gemma-2-2b-it-q4f16_1-MLC'
const F32_MODEL = 'gemma-2-2b-it-q4f32_1-MLC'

export function PrivateLLMPanel() {
  const engineRef = useRef<MLCEngine | null>(null)
  const [prompt, setPrompt] = usePersistentState('fr-ai-lab:private-llm:prompt', 'Paste CFR or Federal Register text to summarize...')
  const [output, setOutput] = usePersistentState('fr-ai-lab:private-llm:output', '')
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'running' | 'error'>('idle')
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const [modelId, setModelId] = useState(F32_MODEL)
  const [copied, setCopied] = useState(false)
  const sampleInput = 'The agency proposes requiring covered operators to submit an annual report describing cybersecurity controls, known incidents, and corrective actions. Reports must be submitted within 90 days after the end of each calendar year. The proposal requests public comments before the stated deadline.'

  async function getEngine() {
    if (engineRef.current) return engineRef.current
    if (!('gpu' in navigator)) throw new Error('WebGPU is not available in this browser.')
    setStatus('loading')
    setError('')
    const adapter = await navigator.gpu.requestAdapter()
    if (!adapter) throw new Error('WebGPU is available, but no compatible GPU adapter was found.')
    const supportsShaderF16 = adapter.features.has('shader-f16')
    const selectedModel = supportsShaderF16 ? F16_MODEL : F32_MODEL
    setModelId(selectedModel)
    const engine = await CreateMLCEngine(selectedModel, {
      initProgressCallback: (event) => setProgress(Math.round(event.progress * 100)),
    })
    engineRef.current = engine
    setStatus('ready')
    return engine
  }

  async function summarize() {
    try {
      const engine = await getEngine()
      setStatus('running')
      const response = await engine.chat.completions.create({
        messages: [
          { role: 'system', content: 'You are a precise Federal Register analyst. Summarize the provided regulation in three concise bullets: obligation, affected party, and timing. Do not invent facts.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.2,
        max_tokens: 256,
      })
      setOutput(response.choices[0]?.message.content ?? 'No summary returned.')
      setStatus('ready')
    } catch (cause) {
      setStatus('error')
      setError(cause instanceof Error ? cause.message : 'The local Gemma model could not start.')
    }
  }

  return <div className="private-llm-shell"><div className="private-llm-header"><div><Badge className="private-badge"><LockKeyhole /> Private LLM in browser</Badge><p className="private-model"><Download /> Gemma 2B · WebGPU · {modelId}{modelId === F32_MODEL && ' · compatibility mode'}</p></div><div className="privacy-proof"><ShieldCheck /><span><strong>0 bytes</strong> prompt egress</span></div></div><div className="brain-input-layout private-input-layout"><div><label className="mini-label" htmlFor="private-llm-input">Your private input</label><textarea id="private-llm-input" className="lab-textarea" aria-label="Federal Register text to summarize" placeholder="Paste CFR or Federal Register text to summarize..." value={prompt} onChange={(event) => setPrompt(event.target.value)} /></div><aside className="sample-input-card"><p className="mini-label">Try this sample</p><p>{sampleInput}</p><button className="sample-copy" onClick={async () => { await navigator.clipboard?.writeText(sampleInput); setPrompt(sampleInput); setCopied(true); setTimeout(() => setCopied(false), 1400) }}>{copied ? 'Copied' : 'Use sample'} <Download /></button><small>Loads a safe example into the private prompt. Nothing is sent to a server.</small></aside></div><button className="primary-action" onClick={summarize} disabled={status === 'loading' || status === 'running'}><BrainCircuit />{status === 'loading' ? `Loading model ${progress}%` : status === 'running' ? 'Summarizing locally…' : 'Summarize with Gemma'}</button>{status === 'loading' && <div className="model-progress" aria-live="polite"><span style={{ width: `${progress}%` }} /></div>}{status === 'error' && <div className="model-error">{error}</div>}{output && <div className="local-output"><div className="output-label"><Sparkles /> Local model response</div><p>{output}</p><div className="output-proof"><CheckCircle2 /> Inference completed on this device · no backend · $0 inference</div></div>}</div>
}
