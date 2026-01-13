import { INodeBase } from "@lionweb/class-core"
import { LionWebId } from "@lionweb/json"


/**
 * Type def. for functions providing {@link LionWebId LionWeb IDs}.
 */
export type IdProvider = () => LionWebId

const idProvider = (prefix: string, sequenceStart: number): IdProvider => {
    let previousId = sequenceStart
    return () => `${prefix}${++previousId}`
}


const originalIdPrefix = "id-"
/**
 * @return an ID for an original node (which is a {@link INodeBase}).
 */
export const originalIdProvider = () => idProvider(originalIdPrefix, 0)

/**
 * @return whether the given {@link INodeBase} is an *original* node, based on inspection of its ID.
 */
export const isOriginal = ({id}: INodeBase) =>
    id.startsWith(originalIdPrefix)


const transientIdPrefix = "transient-id-"
/**
 * @return an ID for a transient node (which is a {@link INodeBase}).
 */
export const transientIdProvider = () => idProvider(transientIdPrefix, 1000)

/**
 * @return whether the given {@link INodeBase} is a *transient* node, based on inspection of its ID.
 */
export const isTransient = ({id}: INodeBase) =>
    id.startsWith(transientIdPrefix)


/**
 * @return an ID for a {@link TraceAnnotation}.
 */
export const traceId = idProvider("trace-id-", 1000000)

