<script>
  import { appStatusInfo } from "../store.ts"

  export let variant = "brand"
  export let onBack = () => {}
  export let onNewDocument = () => {}

  const formatSize = (bytes) => {
    if (!bytes) return ""
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }
</script>

<header class="h-[72px] flex-none flex items-center justify-between px-8 border-b border-line bg-paper-raised">
  {#if variant === "chat"}
    <div class="flex items-center gap-4 min-w-0">
      <button
        type="button"
        aria-label="Volver"
        on:click={onBack}
        class="w-9 h-9 flex-none rounded-[10px] border border-line bg-paper-raised flex items-center justify-center text-ink-soft"
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
      </button>
      <div class="min-w-0">
        <div class="text-[15px] font-semibold truncate">{$appStatusInfo.name || "documento.pdf"}</div>
        <div class="text-xs text-ink-mute">
          {$appStatusInfo.pages} páginas{formatSize($appStatusInfo.size) ? ` · ${formatSize($appStatusInfo.size)}` : ""}
        </div>
      </div>
    </div>
    <button
      type="button"
      on:click={onNewDocument}
      class="rounded-full border border-line bg-paper-raised px-[18px] py-2 text-[13.5px] font-semibold text-ink-soft"
    >
      Nuevo documento
    </button>
  {:else}
    <div class="flex items-center gap-2.5">
      <span class="w-2.5 h-2.5 rounded-[3px] bg-primary-600"></span>
      <span class="font-display font-semibold text-xl tracking-tight">folia</span>
    </div>
    <div class="text-[13px] text-ink-faint uppercase tracking-wide">Chatea con tus documentos</div>
  {/if}
</header>
