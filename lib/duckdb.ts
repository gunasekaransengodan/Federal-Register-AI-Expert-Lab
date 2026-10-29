import * as duckdb from '@duckdb/duckdb-wasm'

const cdn = 'https://cdn.jsdelivr.net/npm/@duckdb/duckdb-wasm@1.33.1-dev57.0/dist/'
const bundles = duckdb.getJsDelivrBundles()

export const DATASET_GLOB = 'hf://datasets/GadgetSoftware/federal-register/documents/*/*.parquet'
export const DATASET_HTTP_GLOB = 'https://huggingface.co/datasets/GadgetSoftware/federal-register/resolve/main/documents/*.parquet'

export async function resolveDatasetSource() {
  const response = await fetch('https://huggingface.co/api/datasets/GadgetSoftware/federal-register/tree/main?recursive=true')
  if (!response.ok) throw new Error(`Federal Register file index failed: ${response.status}`)
  const entries = await response.json() as Array<{ type: string; path: string }>
  const files = entries.filter((entry) => entry.type === 'file' && entry.path.startsWith('data/documents/') && entry.path.endsWith('.parquet')).map((entry) => `https://huggingface.co/datasets/GadgetSoftware/federal-register/resolve/main/${entry.path}`)
  if (!files.length) throw new Error('No Federal Register Parquet files were returned by Hugging Face.')
  return `read_parquet([${files.map((file) => `'${file}'`).join(',')}])`
}

let databasePromise: Promise<duckdb.AsyncDuckDB> | undefined

async function createDatabase() {
  const bundle = await duckdb.selectBundle(bundles)
  const workerScript = await fetch(bundle.mainWorker!).then((response) => {
    if (!response.ok) throw new Error(`DuckDB worker download failed: ${response.status}`)
    return response.text()
  })
  const workerUrl = URL.createObjectURL(new Blob([workerScript], { type: 'application/javascript' }))
  const worker = new Worker(workerUrl, { type: 'module' })
  const logger = new duckdb.ConsoleLogger()
  const db = new duckdb.AsyncDuckDB(logger, worker)
  await db.instantiate(bundle.mainModule, bundle.pthreadWorker)
  const connection = await db.connect()
  try {
    await connection.query("INSTALL httpfs; LOAD httpfs; SET allow_asterisks_in_http_paths = true;")
  } finally {
    await connection.close()
  }
  return db
}

export function getDatabase() {
  databasePromise ??= createDatabase()
  return databasePromise
}

export async function queryDataset<T extends Record<string, unknown>>(sql: string): Promise<T[]> {
  const db = await getDatabase()
  const connection = await db.connect()
  try {
    await connection.query('SET allow_asterisks_in_http_paths = true;')
    const result = await connection.query(sql)
    return result.toArray().map((row) => row.toJSON() as T)
  } finally {
    await connection.close()
  }
}
