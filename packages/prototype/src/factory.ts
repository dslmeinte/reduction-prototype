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

import { INodeBase } from "@lionweb/class-core"
import {
    ArgumentBinding,
    ArgumentDeclaration,
    ArgumentReference,
    BinaryOperation,
    BinaryOperators,
    FunctionDeclaration,
    FunctionInvocation,
    NumberLiteral,
    Parentheses,
    Program,
    Reducible,
    Statement,
    StringLiteral,
    TraceAnnotation,
    Value,
    WrappedOriginalNode
} from "./gen/ReductionDSL.g.js"
import { IdProvider, isTransient, originalIdProvider, traceId, transientIdProvider } from "./ids.js"


/**
 * A factory to instantiate nodes with classifiers in the Reduction DSL,
 * that is parametrized by a {@link IdProvider}, and keeps track of the nodes it instantiated.
 *
 */
export class NodeFactory {

    constructor(private readonly idProvider: IdProvider) {
    }


    private readonly _instantiations: INodeBase[] = []
    private register(node: INodeBase) {
        this._instantiations.push(node)
    }
    /**
     * @return all the nodes **this** factory instantiated.
     */
    get instantiations() {
        return this._instantiations.slice()
    }


    argumentBinding = (argument: ArgumentDeclaration, value: Value) => {
        const node = ArgumentBinding.create(this.idProvider())
        node.argument = argument
        node.value = value
        this.register(node)
        return node
    }

    argumentDeclaration = (name: string) => {
        const node = ArgumentDeclaration.create(this.idProvider())
        node.name = name
        this.register(node)
        return node
    }

    argumentReference = (argument: ArgumentDeclaration) => {
        const node = ArgumentReference.create(this.idProvider())
        node.argument = argument
        this.register(node)
        return node
    }

    binaryOperation = (operator: BinaryOperators, left: Value, right: Value) => {
        const node = BinaryOperation.create(this.idProvider())
        node.operator = operator
        node.left = left
        node.right = right
        this.register(node)
        return node
    }

    functionDeclaration = (name: string, value: Value, ...arguments_: ArgumentDeclaration[]) => {
        const node  = FunctionDeclaration.create(this.idProvider())
        node.name = name
        node.value = value
        arguments_.forEach((argument) => {
            node.addArguments(argument)
        })
        this.register(node)
        return node
    }

    functionInvocation = (functionDeclaration: FunctionDeclaration, argumentBindings: ArgumentBinding[]) => {
        const node = FunctionInvocation.create(this.idProvider())
        node.function = functionDeclaration
        argumentBindings.forEach((binding) => {
            node.addBindings(binding)
        })
        this.register(node)
        return node
    }

    numberLiteral = (value: number) => {
        const node = NumberLiteral.create(this.idProvider())
        node.value = value
        this.register(node)
        return node
    }

    parentheses = (inner: Value) => {
        const node = Parentheses.create(this.idProvider())
        node.inner = inner
        this.register(node)
        return node
    }

    program = (...statements: Statement[]) => {
        const node = Program.create(this.idProvider())
        statements.forEach((statement) => {
            node.addStatements(statement)
        })
        this.register(node)
        return node
    }

    stringLiteral = (value: string) => {
        const node = StringLiteral.create(this.idProvider())
        node.value = value
        this.register(node)
        return node
    }

    /**
     * @return a {@link WrappedOriginalNode wrapped version} of the given original {@link Reducible reducible} {@link INodeBase node}.
     * Note that it’s checked that `originalNode` really is an original node.
     */
    wrappedOriginalNode = (originalNode: Reducible) => {
        if (isTransient(originalNode)) {
            throw new Error(`trying to wrap a transient node as original`)
        }
        const node = WrappedOriginalNode.create(this.idProvider())   // (force returning a transient node)
        node.originalNode = originalNode
        this.register(node)
        return node
    }

}


/**
 * @return a new node factory for original nodes.
 */
export const originalNodeFactory = () => new NodeFactory(originalIdProvider())
/**
 * @return a new node factory for transient nodes.
 */
export const transientNodeFactory = () => new NodeFactory(transientIdProvider())


/**
 * @return the given `resultNode` with an annotation referencing the given `reducedNode`.
 */
export const withTrace = (resultNode: Reducible, reducedNode: Reducible, ...relevantBindings: ArgumentBinding[]) => {
    if (!isTransient(resultNode)) {
        throw new Error(`can only add trace annotations to transient nodes, not to a node with ID "${resultNode.id}" `)
    }
    const traceAnnotation = TraceAnnotation.create(traceId())
    traceAnnotation.reducedNode = reducedNode
    relevantBindings.forEach((binding) => {
        traceAnnotation.addRelevantBindings(binding)
    })
    resultNode.addAnnotation(traceAnnotation)
    return resultNode
}

