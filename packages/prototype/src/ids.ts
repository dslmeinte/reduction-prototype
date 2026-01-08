import { LionWebId } from "@lionweb/json"
import { INodeBase } from "@lionweb/class-core"


export type IdProvider = () => LionWebId

let previousOriginalId = 0
export const originalId: IdProvider = () => `id-${++previousOriginalId}`

export const isOriginal = ({id}: INodeBase) =>
    id.startsWith("id-")


let previousTransientId = 1000
export const transientId: IdProvider = () => `transient-id-${++previousTransientId}`


let previousTraceId = 1000000
export const traceId: IdProvider = () => `trace-id-${++previousTraceId}`

