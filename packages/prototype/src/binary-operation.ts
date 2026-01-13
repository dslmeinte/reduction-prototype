import { BinaryOperation, BinaryOperators } from "./gen/ReductionDSL.g.js"
import { NodeFactory, withTrace } from "./factory.js"
import { findingsOnTopOf } from "./findings.js"
import { tryToUnwrapAsNumber } from "./functions.js"
import { Reduction } from "./reduction.js"


/**
 * Reduces a {@link BinaryOperation} node, also already given the {@link Reduction reductions} of its left and right operands.
 * A {@link NodeFactory} for transient nodes is also given.
 *
 * The reduction of the binary operation is factored out of the `reducer` function, so it can be tested easier in isolation,
 * given its complexity.
 */
export const reduceBinaryOperation = (node: BinaryOperation, leftReduction: Reduction, rightReduction: Reduction, transientNodeFactory: NodeFactory): Reduction => {
    const [leftIsNumber, leftNumber] = tryToUnwrapAsNumber(leftReduction.value)
    const [rightIsNumber, rightNumber] = tryToUnwrapAsNumber(rightReduction.value)

    const wasReductive = leftReduction.wasReductive || rightReduction.wasReductive
    const partiallyReduced = withTrace(wasReductive ? transientNodeFactory.binaryOperation(node.operator, leftReduction.value, rightReduction.value) : transientNodeFactory.wrappedOriginalNode(node), node)

    const findingNode = wasReductive ? partiallyReduced : node
    const [findings, produceFindingIf] = findingsOnTopOf(findingNode, leftReduction, rightReduction)
    produceFindingIf(!leftIsNumber, ($) => `The left hand side of ${$} should be a number.`)
    produceFindingIf(!rightIsNumber, ($) => `The right hand side of ${$} should be a number.`)
    if (node.operator === BinaryOperators.plusWithPositiveOperands) {
        produceFindingIf(leftIsNumber && leftNumber <= 0, ($) => `The left hand side of ${$} should be a positive number.`)
        produceFindingIf(rightIsNumber && rightNumber <= 0, ($) => `The right hand side of ${$} should be a positive number.`)
    }

    if (leftIsNumber && rightIsNumber) {
        const sum = withTrace(transientNodeFactory.numberLiteral(leftNumber + rightNumber), wasReductive ? partiallyReduced : node)
        return {
            value: sum,
            wasReductive: true,
            findings
        }
    }
    return {
        value: partiallyReduced,
        wasReductive,
        findings
    }
}

