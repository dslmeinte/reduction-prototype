import { LionWebId } from "@lionweb/json"
import { INodeBase } from "@lionweb/class-core"


/**
 * Type def. for functions providing {@link LionWebId LionWeb IDs}.
 */
export type IdProvider = () => LionWebId


const originalIdPrefix = "id-"
let previousOriginalId = 0
/**
 * @return an ID for an original node (which is a {@link INodeBase}).
 */
export const originalId: IdProvider = () => `${originalIdPrefix}${++previousOriginalId}`

/**
 * @return whether the given {@link INodeBase} is an *original* node, based on inspection of its ID.
 */
export const isOriginal = ({id}: INodeBase) =>
    id.startsWith(originalIdPrefix)


const transientIdPrefix = "transient-id-"
let previousTransientId = 1000
/**
 * @return an ID for a transient node (which is a {@link INodeBase}).
 */
export const transientId: IdProvider = () => `${transientIdPrefix}${++previousTransientId}`

/**
 * @return whether the given {@link INodeBase} is a *transient* node, based on inspection of its ID.
 */
export const isTransient = ({id}: INodeBase) =>
    id.startsWith(transientIdPrefix)


let previousTraceId = 1000000
/**
 * @return an ID for a {@link TraceAnnotation}.
 */
export const traceId: IdProvider = () => `trace-id-${++previousTraceId}`

