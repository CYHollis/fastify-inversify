import { storage } from '../metadata/metadata-storage'

export function Controller(prefix: string = '') {
  return function (constructor: Function) {
    storage.setController(constructor, prefix)
  }
}
