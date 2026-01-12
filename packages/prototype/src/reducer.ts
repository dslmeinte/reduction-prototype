import {
    ArgumentBinding,
    ArgumentReference,
    BinaryOperation,
    BinaryOperators,
    FunctionInvocation,
    NumberLiteral,
    Parentheses,
    Program,
    Reducible,
    StringLiteral
} from "./gen/ReductionDSL.g.js"
import { isReducible } from "./gen/reducibles.g.js"
import { NodeFactory, withTrace } from "./factory.js"
import { unwrap } from "./functions.js"
import { isOriginal } from "./ids.js"
import { Reduction } from "./reduction.js"
import { textRenderOf } from "./renderer.js"


/**
 * Type def. for functions that reduce a given reducible *original* node,
 * also given *non-local values* in the form of {@link ArgumentBinding argument bindings}.
 */
export type Reducer<NT extends Reducible> = (node: NT, nonLocalValues: ArgumentBinding[]) => Reduction

/**
 * @return a {@link Reducer} given a {@link NodeFactory} for transient nodes.
 */
export const reduceUsing = (transientNodeFactory: NodeFactory): Reducer<Reducible> => {

    // (define a recursively-called function:)
    const reduce = (node: Reducible, nonLocalValues: ArgumentBinding[]): Reduction => {

        if (!isOriginal(node)) {
            throw new Error(`trying to reduce a non-original node with ID "${node.id}"`)
        }

        if (node instanceof ArgumentReference) {
            const lookups = nonLocalValues.filter((binding) => binding.argument === node.argument)
            return lookups.length === 1
                ? {
                    value: withTrace(transientNodeFactory.wrappedOriginalNode(lookups[0].value), node, lookups[0]),
                    findings: []
                }
                : {
                    value: node,
                    findings: [
                        {
                            node,
                            findingMessage: `The argument ${node.argument!.name} is not bound locally.`
                        }
                    ]
                }
        }

        if (node instanceof BinaryOperation) {
            const leftReduction = reduce(node.left, nonLocalValues)
            const rightReduction = reduce(node.right, nonLocalValues)
            const intermediate = withTrace(transientNodeFactory.binaryOperation(node.operator, leftReduction.value, rightReduction.value), node)
            const leftIsNumber = unwrap(leftReduction.value) instanceof NumberLiteral
            const rightIsNumber = unwrap(rightReduction.value) instanceof NumberLiteral
            if (leftIsNumber && rightIsNumber) {
                const leftNumber = (unwrap(leftReduction.value) as NumberLiteral).value
                const rightNumber = (unwrap(rightReduction.value) as NumberLiteral).value
                const sum = transientNodeFactory.numberLiteral(leftNumber + rightNumber)
                return {
                    value: withTrace(sum, intermediate),
                    findings: [
                        ...leftReduction.findings,
                        ...rightReduction.findings,
                        ...(
                            node.operator === BinaryOperators.plusWithPositiveOperands
                                ? [
                                    ...(leftNumber <= 0 ? [{ node: leftReduction.value, findingMessage: `The left hand side of ${textRenderOf(intermediate)} should be a positive number.` }] : []),
                                    ...(rightNumber <= 0 ? [{ node: rightReduction.value, findingMessage: `The right hand side of ${textRenderOf(intermediate)} should be a positive number.` }] : [])
                                ]
                                : []
                        )
                    ]
                }
            }
            return {
                value: intermediate,
                findings: [
                    ...(leftIsNumber ? [] : [{ node: leftReduction.value, findingMessage: `The left hand side of ${textRenderOf(node)} should be a number.`}]),
                    ...(rightIsNumber ? [] : [{ node: rightReduction.value, findingMessage: `The right hand side of ${textRenderOf(node)} should be a number.`}])
                ]
            }
        }

        if (node instanceof FunctionInvocation) {
            // TODO  check whether bindings match exactly with the arguments declared on the function — can’t reduce if not all are bound / need findings on doubly-bound ones
            const reduction = reduce(node.function!.value, [...nonLocalValues, ...node.bindings])
            return {
                value: withTrace(reduction.value, node, ...nonLocalValues),
                findings: reduction.findings   // (see TODO above)
            }
        }

        if (node instanceof NumberLiteral || node instanceof StringLiteral) {
            return {
                value: transientNodeFactory.wrappedOriginalNode(node),
                findings: []
            }
        }

        if (node instanceof Parentheses) {
            const innerReduction = reduce(node.inner, nonLocalValues)
            return {
                value: withTrace(innerReduction.value, node),
                findings: innerReduction.findings
            }
        }

        if (node instanceof Program) {
            const reductionsOfReducibleStatements = node.statements.filter(isReducible).map((statement) => reduce(statement, nonLocalValues))
            // (We don’t have to keep function declarations in case function invocation don’t reduce completely, because the partial reductions would reference the original function declarations.)
            return {
                value: withTrace(transientNodeFactory.program(...reductionsOfReducibleStatements.map(({value}) => value)), node),
                findings: reductionsOfReducibleStatements.flatMap(({findings}) => findings)
            }
        }

        throw new Error(`couldn’t reduce instance of ${node.classifier.name}: not implemented`)
    }

    return reduce
}

