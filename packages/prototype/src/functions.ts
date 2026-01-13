import { NumberLiteral, Reducible, TraceAnnotation, WrappedOriginalNode } from "./gen/ReductionDSL.g.js"

/**
 * @return the original node wrapped in a {@link WrappedOriginalNode}, or the reducible (which is then a transient node).
 */
export const unwrap = (reducible: Reducible) =>
    reducible instanceof WrappedOriginalNode ? reducible.originalNode : reducible

/**
 * @return `[true, <number value in NumberLiteral instance that may have been a wrapped original node>]` or `[false, <(not important)>]` otherwise.
 */
export const tryToUnwrapAsNumber = (reducible: Reducible): [true, number] | [false, undefined] => {
    const maybeNumber = unwrap(reducible)
    return maybeNumber instanceof NumberLiteral
        ? [true, maybeNumber.value]
        : [false, undefined]
}

/**
 * @return the {@link TraceAnnotation}s on the given reducible.
 */
export const traceAnnotationsOf = (reducible: Reducible): TraceAnnotation[] =>
    reducible.annotations.filter((annotation) => annotation instanceof TraceAnnotation)

