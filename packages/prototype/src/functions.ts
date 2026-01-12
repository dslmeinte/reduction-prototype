import { Reducible, TraceAnnotation, WrappedOriginalNode } from "./gen/ReductionDSL.g.js"

/**
 * @return the original node wrapped in a {@link WrappedOriginalNode}, or the reducible (which is then a transient node).
 */
export const unwrap = (reducible: Reducible) =>
    reducible instanceof WrappedOriginalNode ? reducible.originalNode : reducible

/**
 * @return the {@link TraceAnnotation}s on the given reducible.
 */
export const traceAnnotationsOf = (reducible: Reducible): TraceAnnotation[] =>
    reducible.annotations.filter((annotation) => annotation instanceof TraceAnnotation)

