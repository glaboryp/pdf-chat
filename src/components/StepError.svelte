<script>
  export let heading = "Algo ha salido mal"
  export let message = "No hemos podido procesar el documento. Comprueba que el archivo sea un PDF válido e inténtalo de nuevo."
  export let onRetry = () => {}
</script>

<div class="flex-1 flex items-center justify-center px-6">
  <div class="flex flex-col items-center gap-5 max-w-md text-center">
    <div class="w-[72px] h-[72px] rounded-full bg-danger-bg flex items-center justify-center text-danger">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v4"/><path d="M12 17h.01"/><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>
    </div>

    <h2 class="font-display text-[28px] font-semibold">{heading}</h2>
    <p class="text-[15.5px] leading-relaxed text-ink-soft m-0">{message}</p>

    <button
      type="button"
      on:click={onRetry}
      class="mt-1 inline-flex items-center gap-2 bg-primary-600 text-white rounded-full px-6 py-3 text-[15px] font-semibold"
    >
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 3v6h-6"/></svg>
      Reintentar
    </button>

    <button type="button" on:click={onRetry} class="text-[13.5px] font-semibold text-primary-600">
      Subir otro archivo
    </button>
  </div>
</div>
