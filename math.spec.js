const { Value } = require("./engine")
const { Damage } = require("./math")

describe("Damage", () => {
    it("correct output", () => {
        const dmg = new Damage({
            baseMultiplier: new Value(2.806),
            totalAtk: new Value(849.24),
            dmgIncrease: new Value(1663.9),
            totalDmgBonus: new Value(0.48),
            totalCritDmg: new Value(1.051),
            enemyDefMult: new Value(0.5),
            totalEnemyDmgRes: new Value(0.1),
        })

        expect(dmg.out().data).toBeCloseTo(5528.2, 0)
    })
})
