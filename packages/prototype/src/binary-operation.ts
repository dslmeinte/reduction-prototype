// Copyright 2026 TRUMPF Laser SE and other contributors
//
// Licensed under the Apache License, Version 2.0 (the "License")
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// SPDX-FileCopyrightText: 2026 TRUMPF Laser SE and other contributors
// SPDX-License-Identifier: Apache-2.0

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

