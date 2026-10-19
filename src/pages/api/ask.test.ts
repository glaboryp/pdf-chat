import { beforeEach, describe, expect, it, vi } from 'vitest'

const { readFile, create } = vi.hoisted(() => ({
  readFile: vi.fn(),
  create: vi.fn()
}))

vi.mock('node:fs/promises', () => ({ readFile }))
vi.mock('openai', () => ({
  default: class {
    chat = { completions: { create } }
  }
}))

const { GET } = await import('./ask')

const get = async (query: string) => {
  const context = { request: new Request(`http://test/api/ask?${query}`) }
  return await GET(context as never)
}

beforeEach(() => {
  readFile.mockReset()
  create.mockReset()
})

describe('GET /api/ask', () => {
  it.each([
    ['missing id', 'question=q', 'Missing id'],
    ['empty id', 'id=&question=q', 'Missing id'],
    ['path traversal id', 'id=../x&question=q', 'Invalid id'],
    ['non-ASCII id', 'id=%C3%B1&question=q', 'Invalid id'],
    ['missing question', 'id=doc', 'Missing question']
  ])('returns 400 for %s', async (_, query, message) => {
    const response = await get(query)

    expect(response.status).toBe(400)
    expect(await response.text()).toBe(message)
    expect(readFile).not.toHaveBeenCalled()
  })

  it('returns 404 when the document text is unavailable', async () => {
    readFile.mockRejectedValue(new Error('ENOENT'))

    const response = await get('id=doc&question=q')

    expect(response.status).toBe(404)
    expect(await response.text()).toBe('Document not found')
    expect(create).not.toHaveBeenCalled()
  })

  it('streams the completion followed by the end marker', async () => {
    readFile.mockResolvedValue('contenido')
    create.mockResolvedValue([{ choices: [{ delta: { content: 'Hola' } }] }])

    const response = await get('id=doc&question=q')

    expect(readFile).toHaveBeenCalledWith('public/text/doc.txt', 'utf-8')
    expect(response.headers.get('Content-Type')).toBe('text/event-stream')
    expect(await response.text()).toBe('data: "Hola"\n\ndata: "__END__"\n\n')
  })
})
