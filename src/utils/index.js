import { nanoid } from 'nanoid'
export { get as kyGet, set as kySet } from 'idb-keyval'

export const uid = () => nanoid()
