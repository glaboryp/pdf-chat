import { afterEach, describe, expect, it, vi } from 'vitest'
import { responseSSE } from './sse'

const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined)

afterEach(() => {
  consoleError.mockClear()
})

describe('responseSSE', () => {
  it('streams each event as SSE data', async () => {
    const response = responseSSE({ request: new Request('http://test') }, async (sendEvent) => {
      sendEvent('hola')
      await Promise.resolve()
    })

    expect(response.headers.get('Content-Type')).toBe('text/event-stream')
    expect(await response.text()).toBe('data: "hola"\n\n')
  })

  it('ends the stream once when the request aborts mid-callback', async () => {
    const abort = new AbortController()
    const { promise: paused, resolve: resume } = Promise.withResolvers<undefined>()

    const response = responseSSE({ request: new Request('http://test', { signal: abort.signal }) }, async (sendEvent) => {
      sendEvent('a')
      await paused
      sendEvent('b')
    })

    const text = response.text()
    await new Promise((resolve) => { setTimeout(resolve, 0) })
    abort.abort()
    resume(undefined)

    expect(await text).toBe('data: "a"\n\n')
    expect(consoleError).not.toHaveBeenCalled()
  })

  it('errors the stream when the callback fails without logging', async () => {
    const response = responseSSE({ request: new Request('http://test') }, async () => {
      await Promise.reject(new Error('boom'))
    })

    await expect(response.text()).rejects.toThrow('boom')
    expect(consoleError).not.toHaveBeenCalled()
  })
})
