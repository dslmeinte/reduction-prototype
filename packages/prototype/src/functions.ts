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

import { NumberLiteral, Reducible, TraceAnnotation, WrappedOriginalNode } from "./gen/ReductionDSL.g.js"


/**
 * @return the original node wrapped in a {@link WrappedOriginalNode}, or the reducible (which is then a transient node).
 */
export const unwrap = (reducible: Reducible) =>
    reducible instanceof WrappedOriginalNode ? reducible.originalNode : reducible

/**
 * @return `[true, <number value in NumberLiteral instance that may have been a wrapped original node>]` or `[false, <(not important)>]` otherwise.
 */
export const tryToUnwrapAsNumber = (reducible: Reducible): [true, number] | [false, undefined] => {
    const maybeNumber = unwrap(reducible)
    return maybeNumber instanceof NumberLiteral
        ? [true, maybeNumber.value]
        : [false, undefined]
}

/**
 * @return the {@link TraceAnnotation}s on the given reducible.
 */
export const traceAnnotationsOf = (reducible: Reducible): TraceAnnotation[] =>
    reducible.annotations.filter((annotation) => annotation instanceof TraceAnnotation)

