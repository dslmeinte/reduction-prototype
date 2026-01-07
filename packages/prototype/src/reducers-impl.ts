import { BinaryOperation, NumberLiteral, Program, Reducible } from "./gen/ReductionDSL.g.js"
import { isReducible, Reducers } from "./gen/reducers-base.g.js"
import { Reducer, Reduction } from "./reduction.js"
import { numberLiteral, transientId, withTrace } from "./factory.js"


export const reducersImplementation = (reduce: Reducer<Reducible>): Reducers => ({
    reduceArgumentReference: (node, nonLocalValues): Reduction => {
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
    },
    reduceBinaryOperation: (node, nonLocalValues): Reduction => {
        // const findings: Finding[] = []
        const leftReduction = reduce(node.left, nonLocalValues)
        const rightReduction = reduce(node.right, nonLocalValues)
        if (leftReduction.value instanceof NumberLiteral && rightReduction.value instanceof NumberLiteral) {
            const result = leftReduction.value.value + rightReduction.value.value
            const intermediate = BinaryOperation.create(transientId())
            intermediate.operator = node.operator
            intermediate.left = leftReduction.value
            intermediate.right = rightReduction.value
            return {
                value: withTrace(numberLiteral(result), intermediate),
                findings: [...leftReduction.findings, ...rightReduction.findings]
            }
        }
        return {
            value: node,
            findings: [
                {
                    node,
                    findingMessage: `***can’t deal with this yet!***`
                }
            ]
        }
    },
    reduceFunctionInvocation: (node, nonLocalValues): Reduction => {
        const reduction = reduce(node.function!.value, [...nonLocalValues, ...node.bindings])
        // TODO  check whether bindings are present for all arguments declared on the function
        return {
            value: reduction.value,
            findings: reduction.findings
        }
    },
    reduceNumberLiteral: (node, _nonLocalValues): Reduction => ({
        value: node,
        findings: []
    }),
    reduceParentheses: (node, nonLocalValues) => reduce(withTrace(node.value, node), nonLocalValues),
    reduceProgram: (node, nonLocalValues): Reduction => {
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
    },
    reduceStringLiteral: (node, _nonLocalValues): Reduction => ({
        value: node,
        findings: []
    })
})

