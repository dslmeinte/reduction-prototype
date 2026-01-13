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

import { expect } from "chai"
import { BinaryOperators, NumberLiteral, Reducible, WrappedOriginalNode } from "../gen/ReductionDSL.g.js"
import { reduceBinaryOperation } from "../binary-operation.js"
import { NodeFactory, originalNodeFactory, transientNodeFactory } from "../factory.js"
import { finding } from "../findings.js"
import { traceAnnotationsOf } from "../functions.js"
import { Reduction } from "../reduction.js"


describe(`reduction of binary operation`, () => {

    const originalReduction = (originalNode: Reducible, transientsFactory: NodeFactory): Reduction => ({
        value: transientsFactory.wrappedOriginalNode(originalNode),
        wasReductive: false,
        findings: []
    })

    it(`reduces 1 + 2`, () => {
        const {binaryOperation, numberLiteral} = originalNodeFactory()
        const expr = binaryOperation(BinaryOperators.plus, numberLiteral(1), numberLiteral(2))
        const transientsFactory = transientNodeFactory()

        const {value, wasReductive, findings} = reduceBinaryOperation(
            expr,
            originalReduction(expr.left, transientsFactory),
            originalReduction(expr.right, transientsFactory),
            transientsFactory
        )

        expect(value instanceof NumberLiteral).to.equal(true, "is a NumberLiteral")
        expect((value as NumberLiteral).value).to.equal(3, "NumberLiteral.value === 3")
        expect(wasReductive).to.equal(true, "was reductive")
        expect(findings.length).to.equal(0, "no findings")
        const [traceAnnotation, ...remainingTraceAnnotations] = traceAnnotationsOf(value)
        expect(remainingTraceAnnotations.length).to.equal(0, "1 annotation")
        expect(traceAnnotation.reducedNode).to.equal(expr)
        expect(traceAnnotation.relevantBindings.length).to.equal(0)
    })

    it(`reduces -1 ⊕ -2, but produces findings`, () => {
        const {binaryOperation, numberLiteral} = originalNodeFactory()
        const expr = binaryOperation(BinaryOperators.plusWithPositiveOperands, numberLiteral(-1), numberLiteral(-2))

        const transientsFactory = transientNodeFactory()
        const {value, wasReductive, findings} = reduceBinaryOperation(
            expr,
            originalReduction(expr.left, transientsFactory),
            originalReduction(expr.right, transientsFactory),
            transientsFactory
        )

        expect(value instanceof NumberLiteral).to.equal(true, "is a NumberLiteral")
        expect((value as NumberLiteral).value).to.equal(-3, "NumberLiteral.value === -3")
        expect(wasReductive).to.equal(true, "was reductive")
        expect(findings).to.deep.equal(
            [
                finding(expr, `The left hand side of -1 ⊕ -2 should be a positive number.`),
                finding(expr, `The right hand side of -1 ⊕ -2 should be a positive number.`)
            ],
            "findings"
        )
        const [traceAnnotation, ...remainingTraceAnnotations] = traceAnnotationsOf(value)
        expect(remainingTraceAnnotations.length).to.equal(0, "1 annotation")
        expect(traceAnnotation.reducedNode).to.equal(expr)
        expect(traceAnnotation.relevantBindings.length).to.equal(0)
    })

    it(`doesn’t reduce "foo"" + "bar", but does produce findings`, () => {
        const {binaryOperation, stringLiteral} = originalNodeFactory()
        const expr = binaryOperation(BinaryOperators.plus, stringLiteral("foo"), stringLiteral("bar"))

        const transientsFactory = transientNodeFactory()
        const {value, wasReductive, findings} = reduceBinaryOperation(
            expr,
            originalReduction(expr.left, transientsFactory),
            originalReduction(expr.right, transientsFactory),
            transientsFactory
        )

        expect(value instanceof WrappedOriginalNode).to.equal(true)
        expect((value as WrappedOriginalNode).originalNode).to.equal(expr)
        expect(wasReductive).to.equal(false)
        expect(findings).to.deep.equal([
            finding(expr, `The left hand side of "foo" + "bar" should be a number.`),
            finding(expr, `The right hand side of "foo" + "bar" should be a number.`)
        ])
        const [traceAnnotation, ...remainingTraceAnnotations] = traceAnnotationsOf(value)
        expect(remainingTraceAnnotations.length).to.equal(0, "1 annotation")
        expect(traceAnnotation.reducedNode).to.equal(expr)
        expect(traceAnnotation.relevantBindings.length).to.equal(0)
    })

})

