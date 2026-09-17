export const responseSSE = (
  { request }: { request: Request },
  callback: (sendEvent: (data: unknown) => void) => Promise<void>
) => {
  const body = new ReadableStream({
    async start(controller) {
      // Text encoder for converting strings to Uint8Array
      const encoder = new TextEncoder();
      let closed = false;

      const close = () => {
        if (closed) return;
        closed = true;
        controller.close();
      };

      // Send event to client
      const sendEvent = (data: unknown) => {
        const message = `data: ${JSON.stringify(data)}\n\n`;
        controller.enqueue(encoder.encode(message));
      };

      // Handle the connection closing, even while callback is still streaming
      request.signal.addEventListener('abort', close);

      try {
        await callback(sendEvent)
        close();
      } catch (error) {
        console.error('SSE stream failed:', error);
        if (!closed) {
          closed = true;
          controller.error(error);
        }
      }
    }
  });

  return new Response(body, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive'
    }
  });
}

