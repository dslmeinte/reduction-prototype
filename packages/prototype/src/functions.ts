import { Reducible, TraceAnnotation, WrappedOriginalNode } from "./gen/ReductionDSL.g.js"

export const unwrap = (reducible: Reducible) =>
    reducible instanceof WrappedOriginalNode ? reducible.originalNode : reducible

export const traceAnnotationOf = (reducible: Reducible): TraceAnnotation | undefined =>
    reducible.annotations.find((annotation) => annotation instanceof TraceAnnotation)

