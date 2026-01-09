import { BinaryOperators, Value } from "./gen/ReductionDSL.g.js"
import { originalNodeFactory } from "./factory.js"

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

