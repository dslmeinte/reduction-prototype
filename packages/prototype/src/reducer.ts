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
    StringLiteral,
    WrappedOriginalNode
} from "./gen/ReductionDSL.g.js"
import { isReducible } from "./gen/reducibles.g.js"
import { binaryOperation, numberLiteral, withTrace, wrappedOriginalNode } from "./factory.js"
import { unwrap } from "./functions.js"
import { transientId } from "./ids.js"
import { Reducer, Reduction } from "./reduction.js"
import { textRenderOf } from "./renderer.js"


export const reduce: Reducer<Reducible> = (node: Reducible, nonLocalValues: ArgumentBinding[]): Reduction => {

    if (node instanceof ArgumentReference) {
        const lookups = nonLocalValues.filter((binding) => binding.argument === node.argument)
        return lookups.length === 1
            ? {
                value: withTrace(lookups[0].value, node),
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
        const leftIsNumber = unwrap(leftReduction.value) instanceof NumberLiteral
        const rightIsNumber = unwrap(rightReduction.value) instanceof NumberLiteral
        if (leftIsNumber && rightIsNumber) {
            const leftNumber = (unwrap(leftReduction.value) as NumberLiteral).value
            const rightNumber = (unwrap(rightReduction.value) as NumberLiteral).value
            const result = leftNumber + rightNumber
            const intermediate = binaryOperation(node.operator, leftReduction.value, rightReduction.value, transientId)
            return {
                value: withTrace(numberLiteral(result, transientId), intermediate),
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
            value: wrappedOriginalNode(node),
            findings: [
                ...(leftIsNumber ? [] : [{ node: leftReduction.value, findingMessage: `The left hand side of ${textRenderOf(node)} should be a number.`}]),
                ...(rightIsNumber ? [] : [{ node: rightReduction.value, findingMessage: `The right hand side of ${textRenderOf(node)} should be a number.`}])
            ]
        }
    }

    if (node instanceof FunctionInvocation) {
        const reduction = reduce(node.function!.value, [...nonLocalValues, ...node.bindings])
        // TODO  check whether bindings match exactly with the arguments declared on the function
        return {
            value: reduction.value,
            findings: reduction.findings
        }
    }

     if (node instanceof NumberLiteral) {
        return {
            value: wrappedOriginalNode(node),
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
        const reducedProgram = Program.create(transientId())
        reductionsOfReducibleStatements.forEach(({value}) => {
            reducedProgram.addStatements(value)
        })
        return {
            value: reducedProgram,
            findings: reductionsOfReducibleStatements.flatMap(({findings}) => findings)
        }
    }

    if (node instanceof StringLiteral) {
        return {
            value: wrappedOriginalNode(node),
            findings: []
        }
    }

    if (node instanceof WrappedOriginalNode) {
        return {
            value: node,
            findings: []
        }
    }

    throw new Error(`couldn’t reduce instance of ${node.classifier.name}: not implemented`)
}

