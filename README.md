# Federal Register AI Expert Lab

**Why RAG fails on the Federal Register—and how compute-first, $0 infrastructure makes regulatory research auditable.**

**Author:** Gunasekaran Sengodan — Builder, compute-first AI, and federal data systems  
**Live lab:** https://federal-register-ai-gunasekaran.vercel.app  
**GitHub:** https://github.com/gunasekaransengodan/federal-register-ai

## Overview

Federal Register AI Expert Lab is a browser-first regulatory intelligence lab. It uses the GadgetSoftware Federal Register dataset from Hugging Face, Parquet, DuckDB-WASM, Transformers.js, a knowledge graph, and a private Gemma 2B WebGPU model to turn regulatory documents into inspectable evidence and executable research workflows.

No sign-up or application API key is required. Queries run in the browser; Parquet data is cached locally in OPFS, DuckDB runs in a worker, and private LLM synthesis runs locally through WebGPU when supported.

> **Proof bar:** $0 infrastructure • <100ms SQL target on device • 650k-document corpus • 100% auditable traces

## Why retrieval-only systems fail on federal law

RAG treats legal language as fuzzy text, while regulatory work often depends on exact fields, dates, arrays, citations, and definitions. A single wording change can affect a compliance decision.

Common problems include:

- Citation hallucinations and unverifiable sources
- High query latency from hosted vector retrieval and model calls
- Recurring infrastructure cost as the corpus grows
- Privacy concerns when source text is sent to external model providers

The lab starts with structured retrieval and explicit evidence before using language models for interpretation.

## Compute-first thesis

If you can `UNNEST` it, you may not need to embed it. Federal Register records contain structured fields such as `agency_names[]`, `cfr_references[]`, `effective_on`, `publication_date`, and document metadata. Columnar Parquet plus DuckDB-WASM makes those fields directly queryable in the browser.

## The 10 brains

| # | Brain | Role | How it works |
|---:|---|---|---|
| 01 | Exact SQL | Precise retrieval | DuckDB-WASM queries with inspectable SQL |
| 02 | Vague-to-Exact | Topic to proof | Transformers.js maps natural language to query terms |
| 03 | Knowledge Graph | Relationship discovery | Connects agencies, rules, amendments, entities, and CFR references |
| 04 | Prediction | Time-to-final estimate | Uses transparent historical timing signals |
| 05 | Contradiction | Conflict detection | Compares obligations, definitions, dates, and agency language |
| 06 | Private LLM | Local synthesis | Gemma 2B through MLC WebLLM and WebGPU |
| 07 | Agentic Action | Cited workflows | Turns evidence into reviewable checklists and drafts |
| 08 | Neuro-Symbolic | Rules plus reasoning | Translates text into explicit, inspectable conditions |
| 09 | What-If | Scenario analysis | Tests changes to dates and assumptions without changing source data |
| 10 | Fusion | Cross-source context | Relates Federal Register evidence to company and filing context |

Every brain has an explanatory panel, sample input, post-action feedback, and an auditable trace so users can understand what happened instead of receiving an opaque answer.

## Data and execution flow

```text
Federal Register Parquet
  -> DuckDB-WASM worker
  -> SQL and Transformers.js retrieval
  -> Knowledge graph relationships
  -> 10 specialized brains
  -> Local WebGPU Gemma synthesis
  -> Auditable trace
```

## Technology stack

| Technology | Role |
|---|---|
| Next.js 16 | Application framework |
| DuckDB-WASM | In-browser SQL over Parquet |
| Apache Arrow | Columnar, zero-copy data handling |
| Parquet | Compact structured storage |
| Transformers.js | Vague-to-exact retrieval assistance |
| MLC WebLLM / Gemma 2B | Private local synthesis |
| WebGPU | Local model acceleration |
| Recharts | Evidence visualization |
| Vercel | Hosting and deployment |

## Example SQL

The agency analysis uses the Federal Register array field directly:

```sql
SELECT
  UNNEST(agency_names) AS agency,
  COUNT(*) AS rules
FROM read_parquet('hf://datasets/GadgetSoftware/federal-register/documents/*/*.parquet')
WHERE agency_names IS NOT NULL
GROUP BY agency
ORDER BY rules DESC;
```

Other document queries use the `publication_date` column for date filtering and ordering.

## Private LLM

The Private LLM panel provides a sample regulatory input, local model-loading status, local inference status, and the final summary. Prompt text is not sent to an application server. WebGPU support and browser hardware determine whether local inference is available; the interface reports loading, running, success, and error states.

## How to use the lab

1. Open the live lab.
2. Start with **Exact SQL** when you need a precise, repeatable query.
3. Use **Vague-to-Exact** when you have a topic but not the regulatory vocabulary.
4. Open the explainer for any brain to understand its purpose and expected output.
5. Enter or copy a sample input and run it.
6. Inspect the result, source fields, and trace before drawing a conclusion.
7. Use What-If, Contradiction, or Fusion for deeper analysis.
8. Treat predictions and generated drafts as research assistance requiring human review.

## Cost and auditability goals

| Metric | Conventional hosted RAG | This lab |
|---|---|---|
| Infrastructure | Hosted vector database and model APIs | Browser-first, $0 application infrastructure target |
| Retrieval | Approximate semantic retrieval | Structured SQL and explicit evidence |
| Privacy | Prompt may leave the browser | Local Private LLM path with zero prompt egress |
| Auditability | Citation quality varies | SQL, source fields, and trace remain inspectable |
| Latency goal | Multi-service round trips | Sub-100ms SQL target on capable devices |

Performance figures are targets or observed reference values and can vary by browser, device, network, and dataset cache state.

## Development

```bash
git clone https://github.com/gunasekaransengodan/federal-register-ai.git
cd federal-register-ai
pnpm install
pnpm dev
```

Open the local development URL shown by Next.js.

## Deployment

The project is designed for deployment on Vercel:

```bash
vercel --prod
```

Set the canonical public URL to:

```text
https://federal-register-ai-gunasekaran.vercel.app
```

## References

- Live lab: https://federal-register-ai-gunasekaran.vercel.app
- Dataset: https://huggingface.co/datasets/GadgetSoftware/federal-register
- DuckDB-WASM: https://duckdb.org/docs/api/wasm/overview
- Gemma: https://ai.google.dev/gemma
- Repository: https://github.com/gunasekaransengodan/federal-register-ai

## License

MIT License.

Built by Gunasekaran Sengodan — compute-first AI engineer. If a system cannot provide an inspectable SQL or evidence trace, treat its answer as unverified.
