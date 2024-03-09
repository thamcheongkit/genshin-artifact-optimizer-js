const { Value } = require("./engine")

it("__add__", () => {
    expect(new Value(123).__add__(321).data).toEqual(444)
})

it("__mul__", () => {
    expect(new Value(123).__mul__(321).data).toEqual(39483)
})

describe("backward", () => {
    it("__add__", () => {
        const a = new Value(123)
        const b = new Value(321)
        const c = a.__add__(b)
        c.backward()
        expect(a.grad).toEqual(1)
        expect(b.grad).toEqual(1)
    })

    it("__mul__", () => {
        const a = new Value(123)
        const b = new Value(321)
        const c = a.__mul__(b)
        c.backward()
        expect(a.grad).toEqual(321)
        expect(b.grad).toEqual(123)
    })

    it("__pow__", () => {
        const a = new Value(2)
        const b = a.__pow__(5)
        b.backward()
        expect(a.grad).toEqual(5 * (2 ** 4))
    })
})
