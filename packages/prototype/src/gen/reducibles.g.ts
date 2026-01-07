import { INodeBase } from "@lionweb/class-core"
import { Concept } from "@lionweb/core"

import { Reducible, ReductionDSLBase } from "./ReductionDSL.g.js"


const base = ReductionDSLBase.INSTANCE
const reducibleMetaTypes = [
    base.ArgumentReference,
    base.BinaryOperation,
    base.FunctionInvocation,
    base.NumberLiteral,
    base.Parentheses,
    base.Program,
    base.StringLiteral,
    base.WrappedOriginalNode
]

/**
 * Type guard for the {@link Reducible} interface type.
 */
export const isReducible = (node: INodeBase): node is Reducible =>
    reducibleMetaTypes.indexOf(node.classifier as Concept) > -1

