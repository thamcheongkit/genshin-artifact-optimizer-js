class Value {

    constructor(data, _children = [], _op = '') {
        this.data = data
        this.grad = 0
        this._backward = () => null
        this._prev = new Set(_children)
        this._op = _op
    }

    __add__(other) {
        other = other instanceof Value ? other : new Value(other)
        let out = new Value(this.data + other.data, [this, other], '+')

        out._backward = () => {
            this.grad += out.grad
            other.grad += out.grad
        }

        return out
    }

    __mul__(other) {
        other = other instanceof Value ? other : new Value(other)
        let out = new Value(this.data * other.data, [this, other], '*')

        out._backward = () => {
            this.grad += other.data * out.grad
            other.grad += this.data * out.grad
        }

        return out
    }

    __pow__(other) {
        // assert isinstance(other, (int, float)), "only supporting int/float powers for now"
        let out = new Value(this.data ** other, [this,], '**{other}')


        out._backward = () => this.grad += (other * this.data ** (other - 1)) * out.grad

        return out
    }

    relu() {
        let out = new Value(this.data < 0 ? 0 : this.data, [this,], 'ReLU')

        out._backward = () => this.grad += (out.data > 0 ? 1 : 0) * out.grad

        return out
    }

    backward() {
        let topo = []
        let visited = new Set()
        function build_topo(v) {
            if (!visited.has(v)) {
                visited.add(v)
                for (const child of v._prev) {
                    build_topo(child)
                }
                topo.push(v)
            }
        }
        build_topo(this)

        // # go one variable at a time and apply the chain rule to get its gradient
        this.grad = 1
        for (const v of [...topo].reverse()) {
            v._backward()
        }
    }

}

module.exports = { Value }
