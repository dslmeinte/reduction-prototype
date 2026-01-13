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

// Warning: this file is generated!
// Modifying it by hand is useless at best, and sabotage at worst.

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

