const assert = require("node:assert")
const { test } = require("node:test")

const { Value } = require("./engine")
const { Damage } = require("./math")

test("Damage", () => {
    const dmg = new Damage({
        baseMultiplier: new Value(2.806),
        totalAtk: new Value(849.24),
        dmgIncrease: new Value(1663.9),
        totalDmgBonus: new Value(0.48),
        totalCritDmg: new Value(1.051),
        enemyDefMult: new Value(0.5),
        totalEnemyDmgRes: new Value(0.1),
    })

    assert.equal(Math.ceil(dmg.out().data), 5528)
})