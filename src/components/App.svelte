<script>
  import { APP_STATUS, appStatus, setAppStatusInit } from "../store.ts"
  import TopBar from "./TopBar.svelte"
  import StepUpload from "./StepUpload.svelte"
  import StepLoading from "./StepLoading.svelte"
  import StepChat from "./StepChat.svelte"
  import StepError from "./StepError.svelte"
</script>

<div class="h-screen flex flex-col overflow-hidden bg-paper text-ink">
  <TopBar
    variant={$appStatus === APP_STATUS.CHAT_MODE ? "chat" : "brand"}
    onNewDocument={setAppStatusInit}
    onBack={setAppStatusInit}
  />

  <div class="flex-1 flex min-h-0">
    {#if $appStatus === APP_STATUS.INIT}
      <StepUpload />
    {:else if $appStatus === APP_STATUS.LOADING}
      <StepLoading />
    {:else if $appStatus === APP_STATUS.CHAT_MODE}
      <StepChat />
    {:else if $appStatus === APP_STATUS.ERROR}
      <StepError onRetry={setAppStatusInit} />
    {:else}
      <StepError
        heading="Acción no reconocida"
        message="Este estado de la aplicación no está reconocido."
        onRetry={setAppStatusInit}
      />
    {/if}
  </div>
</div>
