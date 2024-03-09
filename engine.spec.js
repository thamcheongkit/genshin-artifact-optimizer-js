const assert = require('node:assert')
const { describe, it } = require('node:test')

const { Value } = require("./engine")

it("__add__", () => {
    assert.equal(new Value(123).__add__(321).data, 444)
})

it("__mul__", () => {
    assert.equal(new Value(123).__mul__(321).data, 39483)
})

describe("backward", () => {
    it("__add__", () => {
        const a = new Value(123)
        const b = new Value(321)
        const c = a.__add__(b)
        c.backward()
        assert.equal(a.grad, 1)
        assert.equal(b.grad, 1)
    })

    it("__mul__", () => {
        const a = new Value(123)
        const b = new Value(321)
        const c = a.__mul__(b)
        c.backward()
        assert.equal(a.grad, 321)
        assert.equal(b.grad, 123)
    })

    it("__pow__", () => {
        const a = new Value(2)
        const b = a.__pow__(5)
        b.backward()
        assert.equal(a.grad, 5 * (2 ** 4))
    })
})
