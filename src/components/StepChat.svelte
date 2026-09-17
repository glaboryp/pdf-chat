<script>
  import { appStatusInfo, setAppStatusError } from "../store.ts"
  const { url, pages, id } = $appStatusInfo

  let draft = ""
  let waiting = false
  let messages = [
    { role: "assistant", text: "He terminado de leer tu documento. Pregúntame lo que quieras sobre su contenido." },
  ]

  const numOfImagesToShow = Math.min(pages, 4)
  const images = Array.from({ length: numOfImagesToShow }, (_, i) => {
    const page = i + 1
    return url
      .replace("/upload/", `/upload/w_400,h_540,c_fill,pg_${page}/`)
      .replace(".pdf", ".jpg")
  })

  const handleSubmit = async (event) => {
    event.preventDefault()

    const question = draft.trim()
    if (!question) return

    messages = [...messages, { role: "user", text: question }]
    draft = ""
    waiting = true

    const searchParams = new URLSearchParams()
    searchParams.append("id", id)
    searchParams.append("question", question)

    try {
      const eventSource = new EventSource(`/api/ask?${searchParams.toString()}`)

      eventSource.onmessage = (event) => {
        const incomingData = JSON.parse(event.data)

        if (incomingData === "__END__") {
          eventSource.close()
          waiting = false
          return
        }

        if (waiting) {
          waiting = false
          messages = [...messages, { role: "assistant", text: incomingData }]
        } else {
          const last = messages[messages.length - 1]
          messages = [...messages.slice(0, -1), { ...last, text: last.text + incomingData }]
        }
      }

      eventSource.onerror = () => {
        eventSource.close()
        waiting = false
        setAppStatusError()
      }
    } catch (e) {
      waiting = false
      setAppStatusError()
    }
  }
</script>

<div class="flex-1 flex min-h-0">
  <aside class="w-80 flex-none bg-paper-raised border-r border-line p-6 overflow-y-auto hidden md:block">
    <div class="text-xs font-semibold tracking-wide uppercase text-ink-mute mb-3.5">Páginas</div>
    <div class="grid grid-cols-2 gap-3">
      {#each images as image, index}
        <div class="relative rounded-lg overflow-hidden border border-line" style="aspect-ratio: 400 / 540;">
          <img class="w-full h-full object-cover" src={image} alt={`Página ${index + 1} del PDF`} />
          <span class="absolute bottom-1.5 right-2 text-[10px] bg-paper-raised/90 rounded px-1 text-ink-mute">{index + 1}</span>
        </div>
      {/each}
    </div>
    {#if pages > numOfImagesToShow}
      <p class="text-center text-[13px] font-semibold text-primary-600 mt-3">Documento de {pages} páginas</p>
    {/if}
  </aside>

  <div class="flex-1 flex flex-col min-w-0 min-h-0">
    <div class="flex-1 overflow-y-auto min-h-0 px-6 py-8 md:px-10 flex flex-col gap-[18px]">
      {#each messages as message}
        <div
          class="flex flex-col gap-1.5 max-w-[85%] md:max-w-[62%]"
          class:self-end={message.role === "user"}
          class:self-start={message.role === "assistant"}
        >
          <div class="flex items-center gap-2" class:self-end={message.role === "user"}>
            {#if message.role === "assistant"}
              <div class="w-5 h-5 rounded-full bg-teal-600 text-white text-[11px] font-bold flex items-center justify-center">F</div>
              <span class="text-xs font-semibold text-ink-mute">Folia</span>
            {:else}
              <span class="text-xs font-semibold text-ink-mute">Tú</span>
            {/if}
          </div>
          <div
            class="rounded-2xl px-4 py-3 text-[14.5px] leading-relaxed"
            class:bg-primary-600={message.role === "user"}
            class:text-white={message.role === "user"}
            class:rounded-br-[4px]={message.role === "user"}
            class:bg-paper-raised={message.role === "assistant"}
            class:border={message.role === "assistant"}
            class:border-line={message.role === "assistant"}
            class:rounded-bl-[4px]={message.role === "assistant"}
          >
            {message.text}
          </div>
        </div>
      {/each}

      {#if waiting}
        <div class="self-start flex items-center gap-1 bg-paper-raised border border-line rounded-2xl rounded-bl-[4px] px-4 py-3.5">
          <span class="w-1.5 h-1.5 rounded-full bg-ink-faint animate-bounce" style="animation-delay: 0ms;"></span>
          <span class="w-1.5 h-1.5 rounded-full bg-ink-faint animate-bounce" style="animation-delay: 150ms;"></span>
          <span class="w-1.5 h-1.5 rounded-full bg-ink-faint animate-bounce" style="animation-delay: 300ms;"></span>
        </div>
      {/if}
    </div>

    <form class="flex-none border-t border-line bg-paper-raised px-6 py-5 md:px-10" on:submit={handleSubmit}>
      <div class="flex items-center gap-2 bg-paper border border-line rounded-full pl-5 pr-1.5 py-1.5">
        <label for="question" class="sr-only">Escribe tu pregunta</label>
        <input
          id="question"
          type="text"
          required
          bind:value={draft}
          placeholder="Escribe tu pregunta sobre el documento..."
          class="flex-1 bg-transparent border-none outline-none text-[14.5px] py-2"
        />
        <button
          type="submit"
          aria-label="Enviar pregunta"
          disabled={!draft.trim()}
          class="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center flex-none disabled:opacity-50"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4z"/></svg>
        </button>
      </div>
    </form>
  </div>
</div>
