import { Reducible, TraceAnnotation, WrappedOriginalNode } from "./gen/ReductionDSL.g.js"

/**
 * @return the original node wrapped in a {@link WrappedOriginalNode}, or the reducible (which is then a transient node).
 */
export const unwrap = (reducible: Reducible) =>
    reducible instanceof WrappedOriginalNode ? reducible.originalNode : reducible

/**
 * @return the *first* {@link TraceAnnotation} on the given reducible, or `undefined` if there’s none.
 */
export const traceAnnotationOf = (reducible: Reducible): TraceAnnotation | undefined =>
    reducible.annotations.find((annotation) => annotation instanceof TraceAnnotation)

