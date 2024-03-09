const { Value } = require("./engine")

/**
 * @typedef DamageOpt
 * @prop {Value} baseMultiplier
 * @prop {Value} totalAtk
 * @prop {Value} dmgIncrease
 * @prop {Value} totalDmgBonus
 * @prop {Value} totalCritDmg
 * @prop {Value} enemyDefMult
 * @prop {Value} totalEnemyDmgRes
 */

class Damage {
    /**
     *
     * @param {DamageOpt} opt
     */
    constructor(opt) {
        this.baseMultiplier = opt.baseMultiplier
        this.totalAtk = opt.totalAtk
        this.dmgIncrease = opt.dmgIncrease
        this.totalDmgBonus = opt.totalDmgBonus
        this.totalCritDmg = opt.totalCritDmg
        this.enemyDefMult = opt.enemyDefMult
        this.totalEnemyDmgRes = opt.totalEnemyDmgRes
    }

    /**
     * (baseMultiplier * totalAtk + dmgIncrease)
     *   * (1 + totalDmgBonus)
     *   * (1 + totalCritDmg)
     *   * enemyDefMult
     *   * (1 - totalEnemyDmgRes)
     */

    /**
     *
     * @returns {Value}
     */
    out() {
        return this.baseMultiplier
            .__mul__(this.totalAtk)
            .__add__(this.dmgIncrease)
            .__mul__(this.totalDmgBonus.__add__(1))
            .__mul__(this.totalCritDmg.__add__(1))
            .__mul__(this.enemyDefMult)
            .__mul__(new Value(1).__add__(this.totalEnemyDmgRes.__mul__(-1)))
    }
}

module.exports = { Damage }
