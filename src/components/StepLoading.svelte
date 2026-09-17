<script>
  import { appStatusInfo } from "../store.ts"
</script>

<div class="flex-1 flex flex-col items-center justify-center gap-7 px-6">
  <div class="relative w-28 h-28 flex items-center justify-center">
    <svg class="absolute inset-0 animate-spin" style="animation-duration: 1.6s;" width="112" height="112" viewBox="0 0 112 112">
      <circle cx="56" cy="56" r="48" fill="none" stroke="#EAE0CE" stroke-width="6" />
      <circle cx="56" cy="56" r="48" fill="none" class="stroke-primary-600" stroke-width="6" stroke-linecap="round" stroke-dasharray="70 232" />
    </svg>
    <div class="w-[60px] h-[60px] rounded-full bg-paper-raised flex items-center justify-center text-primary-600 shadow-[0_6px_18px_rgba(70,50,20,0.12)]">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h6"/></svg>
    </div>
  </div>

  <div class="flex flex-col items-center gap-2 text-center">
    <h2 class="font-display text-[26px] font-semibold">Leyendo tu documento&hellip;</h2>
    <p class="m-0 text-[15.5px] text-ink-faint max-w-[380px] leading-relaxed">Estamos extrayendo el texto para que puedas empezar a preguntar en unos segundos.</p>
  </div>

  {#if $appStatusInfo.name}
    <div class="inline-flex items-center gap-2 bg-paper-raised border border-line rounded-full pl-2.5 pr-4 py-2 text-[13px] text-ink-soft">
      <div class="w-[22px] h-[22px] rounded-md bg-primary-100 flex items-center justify-center text-primary-600">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/></svg>
      </div>
      {$appStatusInfo.name}
    </div>
  {/if}

  <div class="flex items-center mt-3">
    <div class="flex flex-col items-center gap-2.5 w-32">
      <div class="w-7 h-7 rounded-full bg-primary-600 text-white flex items-center justify-center">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
      </div>
      <span class="text-xs font-semibold text-ink-soft">Subiendo</span>
    </div>
    <div class="w-16 h-0.5 bg-primary-600 mb-6"></div>
    <div class="flex flex-col items-center gap-2.5 w-32">
      <div class="w-7 h-7 rounded-full border-2 border-primary-600 bg-paper-raised flex items-center justify-center">
        <div class="w-2 h-2 rounded-full bg-primary-600 animate-pulse"></div>
      </div>
      <span class="text-xs font-semibold text-ink">Extrayendo texto</span>
    </div>
    <div class="w-16 h-0.5 bg-line mb-6"></div>
    <div class="flex flex-col items-center gap-2.5 w-32">
      <div class="w-7 h-7 rounded-full border-2 border-line bg-paper-raised"></div>
      <span class="text-xs font-semibold text-ink-mute">Listo</span>
    </div>
  </div>
</div>
