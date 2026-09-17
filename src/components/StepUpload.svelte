<script>
  import { setAppStatusLoading, setAppStatusError, setAppStatusChatMode } from "../store.ts"
  import Dropzone from "svelte-file-dropzone"

  async function handleFilesSelect(e) {
    const { acceptedFiles } = e.detail

    if (acceptedFiles.length === 0) return

    const file = acceptedFiles[0]
    setAppStatusLoading({ name: file.name, size: file.size })

    const formData = new FormData()
    formData.append("file", file)

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    })

    if (!res.ok) {
      setAppStatusError()
      return
    }

    const { id, url, pages } = await res.json()
    setAppStatusChatMode({ id, url, pages, name: file.name, size: file.size })
  }
</script>

<div class="flex-1 flex">
  <div class="w-full lg:w-[640px] flex-none flex flex-col justify-center gap-6 px-6 py-10 lg:px-16 box-border">
    <div class="flex items-center gap-2 text-[13px] font-semibold tracking-[0.08em] uppercase text-primary-600">
      <span>PDF</span><span class="opacity-40">&middot;</span><span>Preguntas</span><span class="opacity-40">&middot;</span><span>Respuestas</span>
    </div>
    <h1 class="font-display text-[32px] lg:text-[44px] leading-[1.1] font-semibold max-w-[480px]">Sube tu PDF y empieza a preguntar</h1>
    <p class="text-[17px] leading-relaxed text-ink-soft max-w-[440px] m-0">Folia lee tu documento y responde tus preguntas citando el texto original, en segundos y sin salir del navegador.</p>

    <Dropzone
      accept="application/pdf"
      multiple={false}
      disableDefaultStyles
      containerClasses="w-full flex flex-col items-center gap-3 rounded-[20px] border-2 border-dashed border-line bg-paper-raised px-9 py-8 text-center cursor-pointer"
      aria-label="Subir PDF: arrastra un archivo aquí o pulsa para seleccionarlo"
      on:drop={handleFilesSelect}
    >
      <div class="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 16V4M12 4l-4 4M12 4l4 4"/><path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3"/></svg>
      </div>
      <p class="text-[17px] font-semibold m-0">Arrastra tu PDF aquí</p>
      <p class="text-sm text-ink-faint m-0">o</p>
      <span class="inline-block bg-primary-600 text-white rounded-full px-7 py-3 text-[15px] font-semibold">Seleccionar archivo</span>
      <p class="text-xs text-ink-mute m-0">Formato PDF &middot; máx. 20&nbsp;MB</p>
    </Dropzone>
  </div>

  <div class="flex-1 relative bg-primary-50 overflow-hidden hidden lg:flex lg:items-center lg:justify-center">
    <div class="relative" style="width: 420px; height: 420px;">
      <div class="absolute rounded-2xl bg-paper-raised shadow-[0_18px_40px_rgba(70,50,20,0.16)] -rotate-6 p-6 box-border" style="top: 10px; left: 40px; width: 220px; height: 290px;">
        <div class="h-1.5 rounded bg-primary-600/50 mb-4" style="width: 36%;"></div>
        <div class="flex flex-col gap-3">
          <div class="h-1.5 rounded bg-line" style="width: 88%;"></div>
          <div class="h-1.5 rounded bg-line" style="width: 72%;"></div>
          <div class="h-1.5 rounded bg-line" style="width: 92%;"></div>
          <div class="h-1.5 rounded bg-line" style="width: 60%;"></div>
        </div>
      </div>
      <div class="absolute rounded-2xl bg-paper-raised shadow-[0_22px_46px_rgba(70,50,20,0.18)] rotate-3 p-6 box-border" style="top: -20px; left: 120px; width: 220px; height: 290px;">
        <div class="h-1.5 rounded bg-ink-faint/30 mb-4" style="width: 50%;"></div>
        <div class="flex flex-col gap-3">
          <div class="h-1.5 rounded bg-line" style="width: 82%;"></div>
          <div class="h-1.5 rounded bg-line" style="width: 94%;"></div>
          <div class="h-1.5 rounded bg-line" style="width: 68%;"></div>
        </div>
      </div>
      <div class="absolute rounded-2xl bg-paper-raised shadow-[0_24px_50px_rgba(70,50,20,0.22)] -rotate-2 p-5 box-border flex flex-col gap-3" style="bottom: -40px; left: 60px; width: 280px;">
        <div class="flex items-center gap-2">
          <div class="w-5 h-5 rounded-full bg-primary-600 flex-none"></div>
          <span class="text-xs font-semibold text-ink-faint uppercase tracking-wide">Vista previa del chat</span>
        </div>
        <div class="self-end bg-primary-100 rounded-tl-[14px] rounded-tr-[14px] rounded-bl-[14px] rounded-br-[4px] px-3.5 py-2 text-[13.5px] max-w-[85%]">¿De qué trata este documento?</div>
        <div class="self-start bg-paper border border-line rounded-tl-[14px] rounded-tr-[14px] rounded-br-[14px] rounded-bl-[4px] px-3.5 py-2 text-[13.5px] text-ink-soft max-w-[90%]">Es un informe que resume los resultados del último trimestre&hellip;</div>
      </div>
    </div>
  </div>
</div>
