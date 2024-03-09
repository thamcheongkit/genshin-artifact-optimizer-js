const { Value } = require("./engine")

const Constant = require("./artifact")
const { TotalAtk, Damage } = require("./math")

class Parameter {

    ROLL_CR = new Value(0)
    ROLL_CD = new Value(0)
    ROLL_ATK_PERCENT = new Value(0)
    ROLL_ATK = new Value(0)
    ROLL_HP_PERCENT = new Value(0)
    ROLL_EM = new Value(0)
    ROLL_ER = new Value(0)
    ROLL_DEF_PERCENT = new Value(0)
    ROLL_DEF = new Value(0)

    SAND_HP_PERCENT = new Value(0)
    SAND_ATK_PERCENT = new Value(0.8)
    SAND_EM = new Value(0)
    SAND_ER = new Value(0)
    SAND_DEF_PERCENT = new Value(0)

    GOBLET_DMG_BONUS = new Value(0)
    GOBLET_ATK_PERCENT = new Value(0)
    GOBLET_DEF_PERCENT = new Value(0)
    GOBLET_HP_PERCENT = new Value(0)

    CIRCLET_CR = new Value(0)
    CIRCLET_CD = new Value(0)
    CIRCLET_ATK_PERCENT = new Value(0)
    CIRCLET_DEF_PERCENT = new Value(0)
    CIRCLET_HP_PERCENT = new Value(0)
    CIRCLET_HEALING_BONUS = new Value(0)

    parameters() {
        return [
            this.ROLL_CR,
            this.ROLL_CD,
            this.ROLL_ATK_PERCENT,
            this.ROLL_ATK,
            this.ROLL_HP_PERCENT,
            this.ROLL_EM,
            this.ROLL_ER,
            this.ROLL_DEF_PERCENT,
            this.ROLL_DEF,

            this.SAND_HP_PERCENT,
            this.SAND_ATK_PERCENT,
            this.SAND_EM,
            this.SAND_ER,
            this.SAND_DEF_PERCENT,

            this.GOBLET_DMG_BONUS,
            this.GOBLET_ATK_PERCENT,
            this.GOBLET_DEF_PERCENT,
            this.GOBLET_HP_PERCENT,

            this.CIRCLET_CR,
            this.CIRCLET_CD,
            this.CIRCLET_ATK_PERCENT,
            this.CIRCLET_DEF_PERCENT,
            this.CIRCLET_HP_PERCENT,
            this.CIRCLET_HEALING_BONUS,
        ]
    }
}

class Base {
    constructor() {
        this.base_atk = new Value(0)
        this.atk = new Value(0)
        this.atk_percent = new Value(0)
        this.base_multiplier = new Value(0)
        this.dmg_bonus = new Value(0)
        this.dmg_increase = new Value(0)
        this.er = new Value(0)
        this.cr = new Value(0)
        this.cd = new Value(0)
        this.base_defense = new Value(0)
        this.hp = new Value(0)
        this.hp_percent = new Value(0)
        this.enemy_dmg_res = new Value(0)
        this.reaction_aggrevate = new Value(0)
        this.reaction_vaporize = new Value(0)
    }

    parameters() {
        return [
            this.base_atk,
            this.atk,
            this.atk_percent,
            this.base_multiplier,
            this.dmg_bonus,
            this.dmg_increase,
            this.er,
            this.cr,
            this.cd,
            this.base_defense,
            this.hp,
            this.hp_percent,
            this.enemy_dmg_res,
            this.reaction_aggrevate,
            this.reaction_vaporize,
        ]
    }
}


/**
 *
 * @param {Parameter} x
 * @param {Base} c
 */
function cost(x, c, print = false) {
    let base_atk = c.base_atk

    let optim_atk = new Value(0)
    optim_atk = optim_atk.__add__(c.atk)
    optim_atk = optim_atk.__add__(311)
    optim_atk = optim_atk.__add__(x.ROLL_ATK.__mul__(Constant.ARTIFACT_ROLL_ATK).__mul__(30))

    let optim_atk_percent = new Value(0)
    optim_atk_percent = optim_atk_percent.__add__(c.atk_percent)
    optim_atk_percent = optim_atk_percent.__add__(x.ROLL_ATK_PERCENT.__mul__(Constant.ARTIFACT_ROLL_ATK_PERCENT).__mul__(30))
    optim_atk_percent = optim_atk_percent.__add__(x.SAND_ATK_PERCENT.__mul__(Constant.MAIN_STAT_ATK_PERCENT))
    optim_atk_percent = optim_atk_percent.__add__(x.GOBLET_ATK_PERCENT.__mul__(Constant.MAIN_STAT_ATK_PERCENT))
    optim_atk_percent = optim_atk_percent.__add__(x.CIRCLET_ATK_PERCENT.__mul__(Constant.MAIN_STAT_ATK_PERCENT))

    let optim_dmg_bonus = new Value(0)
    optim_dmg_bonus = optim_dmg_bonus.__add__(c.dmg_bonus)
    optim_dmg_bonus = optim_dmg_bonus.__add__(x.GOBLET_DMG_BONUS.__mul__(Constant.MAIN_STAT_DMG_BONUS))

    let optim_cr = new Value(0)
    optim_cr = optim_cr.__add__(c.cr)
    optim_cr = optim_cr.__add__(x.CIRCLET_CR.__mul__(Constant.MAIN_STAT_CR))
    optim_cr = optim_cr.__add__(x.ROLL_CR.__mul__(Constant.ARTIFACT_ROLL_CR).__mul__(30))

    let optim_cd = new Value(0)
    optim_cd = optim_cd.__add__(c.cd)
    optim_cd = optim_cd.__add__(x.CIRCLET_CD.__mul__(Constant.MAIN_STAT_CD))
    optim_cd = optim_cd.__add__(x.ROLL_CD.__mul__(Constant.ARTIFACT_ROLL_CD).__mul__(30))

    let optim_hp = new Value(0)
    // TODO

    let optim_hp_percent = new Value(0)
    // TODO

    let optim_em = new Value(0)
    optim_em = optim_em.__add__(x.SAND_EM.__mul__(Constant.MAIN_STAT_EM))
    optim_em = optim_em.__add__(x.ROLL_EM.__mul__(Constant.ARTIFACT_ROLL_EM).__mul__(30))

    let base_multiplier = c.base_multiplier
    let total_atk = new TotalAtk(base_atk, optim_atk_percent, optim_atk).out()
    let dmg_increase = new Value(0)
    let total_dmg_bonus = optim_dmg_bonus
    let total_crit_dmg = new Value(1).__add__(optim_cr.__add__(0.05).__mul__(optim_cd.__add__(0.5)))
    let enemy_def_mult = new Value(0.5)
    let total_enemy_dmg_res = new Value(0.1)

    let dmg = new Damage({
        baseMultiplier: base_multiplier,
        totalAtk: total_atk,
        dmgIncrease: dmg_increase,
        totalDmgBonus: total_dmg_bonus,
        totalCritDmg: total_crit_dmg,
        enemyDefMult: enemy_def_mult,
        totalEnemyDmgRes: total_enemy_dmg_res,
    }).out()

    if (print) {
        console.log([
            ['ROLL_CR', x.ROLL_CR.data * 30],
            ['ROLL_CD', x.ROLL_CD.data * 30],
            ['ROLL_ATK_PERCENT', x.ROLL_ATK_PERCENT.data * 30],
            ['ROLL_ATK', x.ROLL_ATK.data * 30],
            ['ROLL_HP_PERCENT', x.ROLL_HP_PERCENT.data * 30],
            ['ROLL_EM', x.ROLL_EM.data * 30],
            ['ROLL_ER', x.ROLL_ER.data * 30],
            ['ROLL_DEF_PERCENT', x.ROLL_DEF_PERCENT.data * 30],
            ['ROLL_DEF', x.ROLL_DEF.data * 30],
        ], [
            ['SAND_HP_PERCENT', x.SAND_HP_PERCENT.data],
            ['SAND_ATK_PERCENT', x.SAND_ATK_PERCENT.data],
            ['SAND_EM', x.SAND_EM.data],
            ['SAND_ER', x.SAND_ER.data],
            ['SAND_DEF_PERCENT', x.SAND_DEF_PERCENT.data],
        ], [
            ['GOBLET_DMG_BONUS', x.GOBLET_DMG_BONUS.data],
            ['GOBLET_ATK_PERCENT', x.GOBLET_ATK_PERCENT.data],
            ['GOBLET_DEF_PERCENT', x.GOBLET_DEF_PERCENT.data],
            ['GOBLET_HP_PERCENT', x.GOBLET_HP_PERCENT.data],
        ], [
            ['CIRCLET_CR', x.CIRCLET_CR.data],
            ['CIRCLET_CD', x.CIRCLET_CD.data],
            ['CIRCLET_ATK_PERCENT', x.CIRCLET_ATK_PERCENT.data],
            ['CIRCLET_DEF_PERCENT', x.CIRCLET_DEF_PERCENT.data],
            ['CIRCLET_HP_PERCENT', x.CIRCLET_HP_PERCENT.data],
            ['CIRCLET_HEALING_BONUS', x.CIRCLET_HEALING_BONUS.data],
        ], [
            ['optim_atk', optim_atk.data],
            ['optim_atk_percent', optim_atk_percent.data],
            ['optim_dmg_bonus', optim_dmg_bonus.data],
            ['optim_cr', optim_cr.data],
            ['optim_cd', optim_cd.data],

            ['base_multiplier', base_multiplier.data],
            ['total_atk', total_atk.data],
            ['dmg_increase', dmg_increase.data],
            ['total_dmg_bonus', total_dmg_bonus.data],
            ['total_crit_dmg', total_crit_dmg.data],
            ['enemy_def_mult', enemy_def_mult.data],
            ['total_enemy_dmg_res', total_enemy_dmg_res.data],

            ['dmg', dmg.data],
        ])
    }

    // 1 ÷ dmg
    let inv = dmg.__pow__(-1)
    return inv
}

class Penalty {
    /**
     *
     * @param {Value} v
     * @param {Value} max
     */
    constructor(v, max) {
        this.v = v
        this.max = max
    }

    out() {
        if (this.v.data < 0) {
            return this.v
                .__pow__(2)
            // .__mul__(2) // NOTE: magnification
        } else {
            return this.v
                .__add__(this.max.__mul__(-1))
                .relu()
                .__pow__(2)
            // .__mul__(2) // NOTE: magnification
        }

    }
}

/**
 *
 * @param {Parameter} x
 * @param {Base} c
 */
function constraints(x, c) {

    let optim_cr = new Value(0)
    optim_cr = optim_cr.__add__(c.cr)
    optim_cr = optim_cr.__add__(x.CIRCLET_CR.__mul__(Constant.MAIN_STAT_CR))
    optim_cr = optim_cr.__add__(x.ROLL_CR.__mul__(Constant.ARTIFACT_ROLL_CR))

    let sorted = [
        x.ROLL_CR,
        x.ROLL_CD,
        x.ROLL_ATK_PERCENT,
        x.ROLL_ATK,
        x.ROLL_HP_PERCENT,
        x.ROLL_EM,
        x.ROLL_ER,
        x.ROLL_DEF_PERCENT,
        x.ROLL_DEF,
    ].sort((a, b) => b.data - a.data)

    return [
        new Penalty(x.SAND_HP_PERCENT, new Value(1)).out(),
        new Penalty(x.SAND_ATK_PERCENT, new Value(1)).out(),
        new Penalty(x.SAND_EM, new Value(1)).out(),
        new Penalty(x.SAND_ER, new Value(1)).out(),
        new Penalty(x.SAND_DEF_PERCENT, new Value(1)).out(),

        new Penalty(x.GOBLET_DMG_BONUS, new Value(1)).out(),
        new Penalty(x.GOBLET_ATK_PERCENT, new Value(1)).out(),
        new Penalty(x.GOBLET_DEF_PERCENT, new Value(1)).out(),
        new Penalty(x.GOBLET_HP_PERCENT, new Value(1)).out(),

        new Penalty(x.CIRCLET_CR, new Value(1)).out(),
        new Penalty(x.CIRCLET_CD, new Value(1)).out(),
        new Penalty(x.CIRCLET_ATK_PERCENT, new Value(1)).out(),
        new Penalty(x.CIRCLET_DEF_PERCENT, new Value(1)).out(),
        new Penalty(x.CIRCLET_HP_PERCENT, new Value(1)).out(),
        new Penalty(x.CIRCLET_HEALING_BONUS, new Value(1)).out(),

        new Penalty(
            new Value(0)
                .__add__(x.SAND_HP_PERCENT)
                .__add__(x.SAND_ATK_PERCENT)
                .__add__(x.SAND_EM)
                .__add__(x.SAND_ER)
                .__add__(x.SAND_DEF_PERCENT),
            new Value(1)
        ).out(),
        new Penalty(
            new Value(0)
                .__add__(x.GOBLET_DMG_BONUS)
                .__add__(x.GOBLET_ATK_PERCENT)
                .__add__(x.GOBLET_DEF_PERCENT)
                .__add__(x.GOBLET_HP_PERCENT),
            new Value(1)
        ).out(),
        new Penalty(
            new Value(0)
                .__add__(x.CIRCLET_CR)
                .__add__(x.CIRCLET_CD)
                .__add__(x.CIRCLET_ATK_PERCENT)
                .__add__(x.CIRCLET_DEF_PERCENT)
                .__add__(x.CIRCLET_HP_PERCENT)
                .__add__(x.CIRCLET_HEALING_BONUS),
            new Value(1)
        ).out(),
        new Penalty(
            new Value(0.05).__add__(optim_cr),
            new Value(1)
        ).out(),
        new Penalty(
            new Value(0)
                .__add__(x.ROLL_CR)
                .__add__(x.ROLL_CD)
                .__add__(x.ROLL_ATK_PERCENT)
                .__add__(x.ROLL_ATK)
                .__add__(x.ROLL_HP_PERCENT)
                .__add__(x.ROLL_EM)
                .__add__(x.ROLL_ER)
                .__add__(x.ROLL_DEF_PERCENT)
                .__add__(x.ROLL_DEF),
            new Value(1.5) // NOTE: max rolls at 45 (30⨉1.5)
        ).out(),
        new Penalty(x.ROLL_CR, new Value(1)).out(),
        new Penalty(x.ROLL_CD, new Value(1)).out(),
        new Penalty(x.ROLL_ATK_PERCENT, new Value(1)).out(),
        new Penalty(x.ROLL_ATK, new Value(1)).out(),
        new Penalty(x.ROLL_HP_PERCENT, new Value(1)).out(),
        new Penalty(x.ROLL_EM, new Value(1)).out(),
        new Penalty(x.ROLL_ER, new Value(1)).out(),
        new Penalty(x.ROLL_DEF_PERCENT, new Value(1)).out(),
        new Penalty(x.ROLL_DEF, new Value(1)).out(),

        new Penalty(sorted[0].__add__(sorted[1]), new Value(1)).out(), // NOTE: top 2 artifact cannot have more than 30 rolls
        new Penalty(sorted[0].__add__(sorted[1].__add__(sorted[2])), new Value(1.4)).out(), // NOTE: top 3 artifact cannot have more than 42 rolls
    ]
}





class Ayaka extends Base {
    base_atk = new Value(1016.4)
    cr = new Value(0.4)
    cd = new Value(1.325 - 0.5)
    dmg_bonus = new Value(0.18 + 0.3 + 0.15 + 0.28)
    base_multiplier = new Value(1.0897)
}


/**
 *
 *
 *
 *
 *
 * train
 */
let x = new Parameter()
let c = new Ayaka()
let lr = 0.5

let step = 250_000
for (let i = 0; i < step; i++) {

    let loss = cost(x, c)
    let cs = constraints(x, c)

    for (const c of cs) loss = loss.__add__(c)

    for (const p of x.parameters()) {
        if (!(p instanceof Value)) throw new Error()
        p.grad = 0
    }
    for (const p of c.parameters()) {
        p.grad = 0
    }

    if (isNaN(loss.data)) {
        console.log(i)
        break
    }

    loss.backward()

    for (const p of x.parameters()) {
        p.data += -lr * p.grad
    }

}








/**
 *
 *
 *
 *
 *
 * eval
 */

cost(x, c, true)
