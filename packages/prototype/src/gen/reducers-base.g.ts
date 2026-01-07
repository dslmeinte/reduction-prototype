import { INodeBase } from "@lionweb/class-core"
import { Concept } from "@lionweb/core"

import {
    ArgumentReference,
    BinaryOperation,
    FunctionInvocation,
    NumberLiteral,
    Parentheses,
    Program,
    Reducible,
    ReductionDSLBase,
    StringLiteral
} from "./ReductionDSL.g.js"
import { Reducer } from "../reduction.js"


/**
 * Type definition for objects with reducers for all reducible concepts.
 */
export type Reducers = {
    reduceArgumentReference: Reducer<ArgumentReference>
    reduceBinaryOperation: Reducer<BinaryOperation>
    reduceFunctionInvocation: Reducer<FunctionInvocation>
    reduceNumberLiteral: Reducer<NumberLiteral>
    reduceParentheses: Reducer<Parentheses>
    reduceProgram: Reducer<Program>
    reduceStringLiteral: Reducer<StringLiteral>
}

export const reducerWith = (reducers: Reducers): Reducer<Reducible> =>
    (node, nonLocalValues) => {
        if (node instanceof StringLiteral) {
            return reducers.reduceStringLiteral(node, nonLocalValues)
        }
        if (node instanceof Program) {
            return reducers.reduceProgram(node, nonLocalValues)
        }
        if (node instanceof Parentheses) {
            return reducers.reduceParentheses(node, nonLocalValues)
        }
        if (node instanceof NumberLiteral) {
            return reducers.reduceNumberLiteral(node, nonLocalValues)
        }
        if (node instanceof FunctionInvocation) {
            return reducers.reduceFunctionInvocation(node, nonLocalValues)
        }
        if (node instanceof BinaryOperation) {
            return reducers.reduceBinaryOperation(node, nonLocalValues)
        }
        if (node instanceof ArgumentReference) {
            return reducers.reduceArgumentReference(node, nonLocalValues)
        }
        throw new Error(`couldn’t reduce instance of ${node.classifier.name}: not implemented`)
    }

const base = ReductionDSLBase.INSTANCE
const reducibleMetaTypes = [
    base.ArgumentReference,
    base.BinaryOperation,
    base.FunctionInvocation,
    base.NumberLiteral,
    base.Parentheses,
    base.Program,
    base.StringLiteral
]
export const isReducible = (node: INodeBase): node is Reducible =>
    reducibleMetaTypes.indexOf(node.classifier as Concept) > -1

