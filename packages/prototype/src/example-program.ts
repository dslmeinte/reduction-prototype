import { asTreeTextWith } from "@lionweb/class-core"
import { idOf } from "@lionweb/core"
import { writeFileSync } from "fs"

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
    StringLiteral,
    Value
} from "./gen/ReductionDSL.g.js"


let previousId = 0
const id = () => `id-${++previousId}`


const numberLiteral = (value: number) => {
    const node = NumberLiteral.create(id())
    node.value = value
    return node
}


const foo = FunctionDeclaration.create(id())
foo.name = "foo"
const argX = ArgumentDeclaration.create(id())
argX.name = "X"
foo.addArguments(argX)

const refX = ArgumentReference.create(id())
refX.argument = argX

const innerPlus = BinaryOperation.create(id())
innerPlus.operator = BinaryOperators.plusWithPositiveOperands
innerPlus.left = numberLiteral(1)
innerPlus.right = refX

const parentheses = Parentheses.create(id())
parentheses.value = innerPlus

const outerPlus = BinaryOperation.create(id())
outerPlus.operator = BinaryOperators.plus
outerPlus.left = parentheses
outerPlus.right = numberLiteral(3)

foo.value = outerPlus


const invokeFooWith = (value: Value) => {
    const invocation = FunctionInvocation.create(id())
    invocation.function = foo
    const binding = ArgumentBinding.create(id())
    binding.argument = argX
    binding.value = value
    invocation.addBindings(binding)
    return invocation
}


const fooAt1 = invokeFooWith(numberLiteral(1))
const fooAt_1 = invokeFooWith(numberLiteral(-1))
const bar = StringLiteral.create(id())
bar.value = "bar"
const fooAtBar = invokeFooWith(bar)


export const exampleProgram = Program.create(id())
exampleProgram.addStatements(foo)
exampleProgram.addStatements(fooAt1)
exampleProgram.addStatements(fooAt_1)
exampleProgram.addStatements(fooAtBar)


writeFileSync("artifacts/example-program.txt", asTreeTextWith(idOf)([exampleProgram]))

