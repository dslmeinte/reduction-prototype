import {
    ArgumentDeclaration,
    ArgumentReference,
    BinaryOperation,
    BinaryOperators,
    FunctionDeclaration,
    Parentheses,
    Program,
    StringLiteral,
    Value
} from "./gen/ReductionDSL.g.js"
import { argumentBinding, functionInvocation, id, numberLiteral } from "./factory.js"


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


const invokeFooWith = (value: Value) =>
    functionInvocation(foo, argumentBinding(argX, value))

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

