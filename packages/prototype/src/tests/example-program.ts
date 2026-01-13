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

import { BinaryOperators, Value } from "../gen/ReductionDSL.g.js"
import { originalNodeFactory } from "../factory.js"

const {
    argumentBinding,
    argumentDeclaration,
    argumentReference,
    binaryOperation,
    functionDeclaration,
    functionInvocation,
    numberLiteral,
    parentheses,
    program,
    stringLiteral
} = originalNodeFactory()


// function foo(X) ⇒ (1 ⊕ ref<X>) + 3

const argX = argumentDeclaration("X")

const refX = argumentReference(argX)
const innerPlus = binaryOperation(BinaryOperators.plusWithPositiveOperands, numberLiteral(1), refX)
const parens = parentheses(innerPlus)
const outerPlus = binaryOperation(BinaryOperators.plus, parens, numberLiteral(3))

const foo = functionDeclaration("foo", outerPlus, argX)


// foo(...)

const invokeFooWith = (value: Value) =>
    functionInvocation(foo, [argumentBinding(argX, value)])

const fooAt2 = invokeFooWith(numberLiteral(2))
const fooAt_1 = invokeFooWith(numberLiteral(-1))
const fooAtBar = invokeFooWith(stringLiteral("bar"))


/*
program:
    function foo(X) ⇒ (1 ⊕ ref<X>) + 3
    foo(X = 2)
    foo(X = -1)
    foo(X = "bar")
 */

export const exampleProgram = program(
    foo,
    fooAt2,
    fooAt_1,
    fooAtBar
)

