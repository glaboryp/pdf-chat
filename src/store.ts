import { writable } from 'svelte/store'

export const APP_STATUS = {
  INIT: 0,
  LOADING: 1,
  CHAT_MODE: 2,
  ERROR: -1
}

export const appStatus = writable(APP_STATUS.INIT)
export const appStatusInfo = writable({
  id: '',
  url: '',
  pages: 0,
  name: '',
  size: 0
})

export const setAppStatusInit = () => {
  appStatus.set(APP_STATUS.INIT)
}

export const setAppStatusLoading = ({ name, size }: { name: string, size: number }) => {
  appStatus.set(APP_STATUS.LOADING)
  appStatusInfo.update((info) => ({ ...info, name, size }))
}

export const setAppStatusError = () => {
  appStatus.set(APP_STATUS.ERROR)
}

export const setAppStatusChatMode = (
  { id, url, pages, name, size } :
  { id: string, url: string, pages: number, name: string, size: number }) => {
  appStatus.set(APP_STATUS.CHAT_MODE)
  appStatusInfo.set({ id, url, pages, name, size })
}
