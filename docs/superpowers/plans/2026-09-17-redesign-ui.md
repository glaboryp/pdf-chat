# Redesign UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reskin the whole PDF-chat flow (upload → loading → conversation → error) to match the approved "Folia" design, and upgrade the single-answer chat into a real conversation thread with page citations.

**Architecture:** Pure frontend change on top of the existing Astro + Svelte 5 + Tailwind v4 stack. No backend/API route changes except wiring the existing `EventSource` stream into a message list instead of a single `answer` string, and passing the real uploaded file's `name`/`size` through the store so the UI can show it (previously discarded). `App.svelte` becomes a shell that renders a shared `TopBar` plus one of four step components based on `$appStatus`.

**Tech Stack:** Astro 7, Svelte 5 (legacy/non-runes reactivity, matching the existing files), Tailwind v4 (`@theme` tokens in `src/styles/global.css`), `svelte-file-dropzone` (kept, restyled via `disableDefaultStyles`/`containerClasses`), Google Fonts (Fraunces + IBM Plex Sans).

**Spec:** Approved design artifact "PDF Chat Redesign" (4 artboards: Upload, Loading, Conversación, Error) — https://claude.ai/artifact/HmDLjtTJg3EXMYVdkyof5s. This plan translates those exact colors/copy/layout into the real Svelte components; see each task for the concrete Tailwind values.

## Global Constraints

- Palette: paper `#FAF7F1`, paper-raised `#FFFFFF`, ink `#211C16`, ink-soft `#4B4238`, ink-faint `#6B6155`, ink-mute `#8A8072`, line `#E7DECF`, accent scale anchored on `#A83E1B` (primary-600), teal `#2F6F63`, danger `#B3261E` / `#F7E3DE`.
- Typography: display = Fraunces (headings, wordmark), body = IBM Plex Sans (everything else), loaded via a single Google Fonts `css2` link in `Layout.astro`.
- Copy is Spanish, matches the approved artboards' wording exactly (no invented stats beyond the illustrative sample doc name already used in the design: `informe-anual.pdf`, used only as an *example* filename in the loading/illustration bits — the real chat screen always shows the actual uploaded file's name).
- No comments in the code (project convention). No `flowbite-svelte` component imports in the rewritten files (Alert/Spinner/Input/Label are replaced by bespoke markup matching the design); `svelte-file-dropzone` stays for the drag-and-drop behavior only.
- Real semantic elements for interactive controls (`<button>`, `<input>` + `<label>`), no `role`/`onClick` on bare `div`s.

---

## Task 1: Store — carry file name/size, add an INIT reset

**Files:**
- Modify: `src/store.ts`

**Interfaces:**
- Produces: `setAppStatusInit()`, `setAppStatusLoading({ name, size })`, `setAppStatusChatMode({ id, url, pages, name, size })`, `appStatusInfo` now shaped `{ id, url, pages, name, size }`.

- [x] **Step 1:** Add `name`/`size` to the `appStatusInfo` initial value and to `setAppStatusChatMode`'s signature; add a `setAppStatusLoading({ name, size })` that also merges those fields into `appStatusInfo` (so the loading screen can show the real filename before the upload response comes back); add `setAppStatusInit()` that resets `appStatus` to `APP_STATUS.INIT` (used by "Nuevo documento" / "Reintentar" / back button).
- [x] **Step 2:** Verify: `pnpm run build` (runs `astro check`) — no type errors.

## Task 2: Design tokens & fonts

**Files:**
- Modify: `src/styles/global.css` — replace the placeholder `--color-primary-*` scale with the approved palette, add `--font-sans`/`--font-display`, add paper/ink/line/teal/danger tokens, set `body` background/color.
- Modify: `src/layouts/Layout.astro` — add the Google Fonts `css2` link (Fraunces + IBM Plex Sans) in `<head>`; drop the old `html { background:#c3c6cc; font-family: system-ui }` block (superseded by the new `body` rule in `global.css`).

- [x] **Step 1:** Edit both files with the exact values in Global Constraints.
- [x] **Step 2:** Verify: `pnpm run dev`, confirm the page background is the warm paper tone and text renders in IBM Plex Sans (no more gray `#c3c6cc` background).

## Task 3: `TopBar.svelte` (new) + `App.svelte` shell

**Files:**
- Create: `src/components/TopBar.svelte`
- Modify: `src/components/App.svelte`

**Interfaces:**
- `TopBar` props: `variant: "brand" | "chat"`, `onBack`, `onNewDocument`. Reads `appStatusInfo` from the store directly for the chat variant (name/pages/size).
- `App.svelte` renders `<TopBar variant={...} onNewDocument={setAppStatusInit} onBack={setAppStatusInit} />` then one of `StepUpload` / `StepLoading` / `StepChat` / `StepError` based on `$appStatus`, inside a `h-screen flex flex-col overflow-hidden` shell (fixed viewport height so only the chat message list scrolls internally, not the whole page — matches the artboards, which are single fixed-size screens).

- [x] **Step 1:** Create `TopBar.svelte`: 72px header, brand variant = logo dot + "folia" wordmark (`font-display`) left, "Chatea con tus documentos" tagline right; chat variant = back button + real file name/pages/size left, "Nuevo documento" button right.
- [x] **Step 2:** Rewrite `App.svelte` to the shell described above (see Global Constraints for the `h-screen` reasoning).
- [x] **Step 3:** Verify: `pnpm run dev`, confirm the top bar renders and switches variant when `$appStatus` changes (temporarily force each branch while testing, then revert).

## Task 4: `StepError.svelte` (new)

**Files:**
- Create: `src/components/StepError.svelte`

**Interfaces:**
- Props: `heading = "Algo ha salido mal"`, `message = "No hemos podido procesar el documento. Comprueba que el archivo sea un PDF válido e inténtalo de nuevo."`, `onRetry`.
- Used by `App.svelte` for both `APP_STATUS.ERROR` and the unrecognized-status fallback (passing a different `heading`/`message` for the latter), replacing the two `flowbite-svelte` `Alert`s.

- [x] **Step 1:** Build the centered card: danger-tinted icon circle, heading (`font-display`), body copy, "Reintentar" button (`bg-primary-600`, calls `onRetry`), "Subir otro archivo" text link.
- [x] **Step 2:** Wire both branches in `App.svelte` to use it with `setAppStatusInit` as `onRetry`.
- [x] **Step 3:** Verify: temporarily call `setAppStatusError()` from the browser console while `pnpm run dev` is running, confirm the screen and that "Reintentar" returns to the upload screen.

## Task 5: `StepUpload.svelte` redesign

**Files:**
- Modify: `src/components/StepUpload.svelte`

**Interfaces:**
- Consumes: `setAppStatusLoading({ name, size })` (Task 1), `setAppStatusChatMode({ id, url, pages, name, size })` (Task 1).
- Keeps the same `/api/upload` POST call and response shape (`{ id, url, pages }`); adds the real `File`'s `name`/`size` to what's passed into the store (not returned by the API — read client-side from the dropped file).

- [x] **Step 1:** Two-column layout: left column = eyebrow label, `font-display` H1 "Sube tu PDF y empieza a preguntar", subtext, and the `Dropzone` (from `svelte-file-dropzone`) restyled via `disableDefaultStyles` + `containerClasses` to the dashed warm card from the design — icon circle, "Arrastra tu PDF aquí", a styled `<span>` (not a nested `<button>`, since the Dropzone root is already `role="button"`) reading "Seleccionar archivo", and the "Formato PDF · máx. 20 MB" helper line. Pass `aria-label` describing the control (lands on the root via `$$restProps`).
- [x] **Step 2:** Right column (`hidden lg:flex`, decorative): three overlapping cards (two "page" placeholders with gray line bars, one small chat-preview card reusing the exact copy `¿De qué trata este documento?` / a one-line illustrative answer) centered in the panel.
- [x] **Step 3:** On `drop`, call `setAppStatusLoading({ name: file.name, size: file.size })` before the fetch, then on success call `setAppStatusChatMode({ id, url, pages, name: file.name, size: file.size })`.
- [x] **Step 4:** Verify: `pnpm run dev`, drag a real PDF onto the dropzone, confirm it proceeds to the loading screen with the correct filename shown (Task 6) and then to the chat screen with the same filename in the top bar.

## Task 6: `StepLoading.svelte` redesign

**Files:**
- Modify: `src/components/StepLoading.svelte`

**Interfaces:**
- Consumes: `appStatusInfo` store (reads `.name` set by Task 5's `setAppStatusLoading`).

- [x] **Step 1:** Centered column: spinning ring (CSS `animate-spin` on an SVG circle with `stroke-dasharray`) around a document icon, "Leyendo tu documento…" (`font-display`), subtext, a pill chip showing the real `$appStatusInfo.name` (only rendered `{#if $appStatusInfo.name}`), and the 3-step progress indicator (Subiendo ✓ → Extrayendo texto • → Listo) with connecting lines.
- [x] **Step 2:** Verify: same manual upload flow as Task 5, confirm the ring animates and the filename chip matches the uploaded file.

## Task 7: `StepChat.svelte` — conversation thread + sidebar

**Files:**
- Modify: `src/components/StepChat.svelte`

**Interfaces:**
- Consumes: `appStatusInfo` (`id`, `url`, `pages`, `name`), `setAppStatusError` (Task 1).
- Internal state: `let messages = [{ role: "assistant", text: "…greeting…" }]`, `let draft = ""`, `let waiting = false`. `role` is `"user" | "assistant"`.

- [x] **Step 1:** Left `aside` (`hidden md:block`, `w-80`): "Páginas" label + 2-column grid of the existing page-thumbnail `<img>`s (same `numOfImagesToShow`/`images` logic as before, unchanged), each with a page-number badge; a "Documento de N páginas" line when there are more pages than shown.
- [x] **Step 2:** Right column: scrollable message thread (`sc-for`-equivalent `{#each messages as message}`) rendering user bubbles right-aligned (`bg-primary-600`, white text) and assistant bubbles left-aligned (white card, border, teal "F" avatar), a typing indicator (three bouncing dots) shown `{#if waiting}`, and a pinned input bar at the bottom (rounded pill, `<input>` + `<label for="question" class="sr-only">`, circular send `<button type="submit">`, disabled when `draft` is empty).
- [x] **Step 3:** Rework `handleSubmit`: push the user's question into `messages`, clear `draft`, set `waiting = true`, open the existing `/api/ask` `EventSource`. On the first streamed chunk, push a new assistant message and set `waiting = false`; on subsequent chunks, append to that same last message's `text` (immutable array update to keep Svelte reactivity: `messages = [...messages.slice(0, -1), { ...last, text: last.text + chunk }]`). On `"__END__"`, close the stream. Add an `eventSource.onerror` handler (didn't exist before) that closes the stream and calls `setAppStatusError()`, so a broken stream reaches the new error screen instead of hanging on the typing indicator forever.
- [x] **Step 4:** Layout plumbing: give the `StepChat` root and its right column `min-h-0` so the message list's `overflow-y-auto` actually scrolls internally instead of growing the whole (now `h-screen`-locked, see Task 3) page.
- [x] **Step 5:** Verify: `pnpm run dev`, upload a real PDF, ask a question, confirm the answer streams token-by-token into a single assistant bubble, ask a second question and confirm both exchanges stay in the thread, and confirm the message list scrolls once it overflows while the header/input stay pinned.

## Task 8: `index.astro` cleanup

**Files:**
- Modify: `src/pages/index.astro`

- [x] **Step 1:** Remove the now-redundant `<h1>Chatea con tu PDF</h1>` and the fixed-width `<section class="container w-[1000px] max-w-xl h-64">` wrapper (the upload screen's own `font-display` H1 replaces the heading; `App.svelte`'s `h-screen` shell replaces the fixed-size section). Reduce `<main>` to just host `<App client:idle />`. Update the page `<title>` prop to `"Folia · Chatea con tu PDF"`.
- [x] **Step 2:** Verify: `pnpm run build` passes end to end (type-check + build), then `pnpm run dev` and click through all four states once more (upload → loading → chat → force an error) to confirm nothing regressed.

---

## Self-Review Notes

- Spec coverage: all 4 artboards (Upload, Loading, Chat, Error) map to Tasks 5/6/7/4; shared chrome (Task 3) matches the artboards' shared top bar; palette/fonts (Task 2) match the artboards' tokens exactly.
- The artboards' chat mock only showed a single canned exchange; Task 7 generalizes that into a real multi-turn thread driven by the actual `/api/ask` stream, which is the natural real-code equivalent of the prototype's `setTimeout`-based demo reply.
- No unit/component test framework exists in this project (no test runner in `package.json`); verification is `pnpm run build` (type-check) plus manual browser walkthroughs per task, as noted in each task's last step.
