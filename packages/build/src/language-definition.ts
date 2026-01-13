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

import { builtinClassifiers, builtinPrimitives, LanguageFactory } from "@lionweb/core"
import { concatenator } from "@lionweb/ts-utils"


export const languageName = "ReductionDSL"
const factory = new LanguageFactory(languageName, "1", concatenator("-"), concatenator("-"))
export const reductionDSLLanguage = factory.language

const { inamed } = builtinClassifiers
const { integerDataType, stringDataType } = builtinPrimitives


export const Reducible = factory.interface("Reducible")
const Statement = factory.interface("Statement")
const Value = factory.interface("Value").extending(Reducible, Statement)


const ArgumentDeclaration = factory.concept("ArgumentDeclaration", false).implementing(inamed)

const FunctionDeclaration = factory.concept("FunctionDeclaration", false).implementing(Statement, inamed)
factory.containment(FunctionDeclaration, "arguments").ofType(ArgumentDeclaration).isOptional().isMultiple()
factory.containment(FunctionDeclaration, "value").ofType(Value)


const Literal = factory.interface("Literal").extending(Value)

const NumberLiteral = factory.concept("NumberLiteral", false).implementing(Literal)
factory.property(NumberLiteral, "value").ofType(integerDataType)

const StringLiteral = factory.concept("StringLiteral", false).implementing(Literal)
factory.property(StringLiteral, "value").ofType(stringDataType)

const Parentheses = factory.concept("Parentheses", false).implementing(Value)
factory.containment(Parentheses, "inner").ofType(Value)

const BinaryOperators = factory.enumeration("BinaryOperators")
factory.enumerationLiteral(BinaryOperators, "plus")
factory.enumerationLiteral(BinaryOperators, "plusWithPositiveOperands")

const BinaryOperation = factory.concept("BinaryOperation", false).implementing(Value)
factory.property(BinaryOperation, "operator").ofType(BinaryOperators)
factory.containment(BinaryOperation, "left").ofType(Value)
factory.containment(BinaryOperation, "right").ofType(Value)

const ArgumentBinding = factory.concept("ArgumentBinding", false)
factory.reference(ArgumentBinding, "argument").ofType(ArgumentDeclaration)
factory.containment(ArgumentBinding, "value").ofType(Value)

const FunctionInvocation = factory.concept("FunctionInvocation", false).implementing(Value)
factory.reference(FunctionInvocation, "function").ofType(FunctionDeclaration)
factory.containment(FunctionInvocation, "bindings").ofType(ArgumentBinding).isOptional().isMultiple()

const ArgumentReference = factory.concept("ArgumentReference", false).implementing(Value)
factory.reference(ArgumentReference, "argument").ofType(ArgumentDeclaration)


const Program = factory.concept("Program", false).isPartition().implementing(Reducible)
factory.containment(Program, "statements").ofType(Statement).isOptional().isMultiple()

// wraps an original node, so we can re-use that node as a child of a transient node, without moving the original node:
const WrappedOriginalNode = factory.concept("WrappedOriginalNode", false).implementing(Reducible)
factory.reference(WrappedOriginalNode, "originalNode").ofType(Reducible)


const TraceAnnotation = factory.annotation("TraceAnnotation").annotating(Reducible)
factory.reference(TraceAnnotation, "reducedNode").ofType(Reducible)
// Note: needs to be a reference and not a containment.
// Otherwise, if the result of reduction ends up being a child of another transient node, this containment will get emptied.
factory.reference(TraceAnnotation, "relevantBindings").ofType(ArgumentBinding).isOptional().isMultiple()

