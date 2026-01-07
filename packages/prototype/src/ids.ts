import { LionWebId } from "@lionweb/json"
import { INodeBase } from "@lionweb/class-core";


export type IdProvider = () => LionWebId
let previousId = 0  // (use one integer sequence to avoid confusion with duplicate numbers)
const idProviderWith = (prefix: string) =>
    () => `${prefix}${++previousId}`

export const originalId = idProviderWith("id-")
export const transientId = idProviderWith("transient-id-")

export const isOriginal = ({id}: INodeBase) =>
    id.startsWith("id-")

