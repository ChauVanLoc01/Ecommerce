import { KeyLocalStorage } from 'src/constants/KeyLocalStorage'
import { CartType } from 'src/pages/Cart/Cart'

type ItemLSType = {
  key: keyof typeof KeyLocalStorage
  value: string
}

export const eventTarget = new EventTarget()

export const WorkingWithLS = {
  saveToLS: (input: ItemLSType[]) => {
    input.forEach((item) => localStorage.setItem(item.key, item.value))
  },
  clearFromLS: (input: (keyof typeof KeyLocalStorage)[]) => {
    input.forEach((key) => localStorage.removeItem(key))
    eventTarget.dispatchEvent(new Event('resetUser'))
  },
  getFromLS: (key: keyof typeof KeyLocalStorage) => {
    return localStorage.getItem(key) as string
  }
}
