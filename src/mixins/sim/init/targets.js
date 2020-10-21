/* eslint-disable */

export default {
    methods: {
        createTargets: function (friendly, enemy, friendlyhp, enemyhp, infinitehp, healthRatio) {
            class Target {
                constructor(name, health, type, infinitehp, healthRatio) {
                    this.name = name
                    this.type = type
                    this.health = health / healthRatio
                    this.maxHealth = health
                    this.absorb = 0
                    this.healingBonus = 0
                    //----
                    this.buffs = []
                    this.hots = []
                    this.dots = []
                    this.infinitehp = infinitehp
                }

                dealDamage(amount) {
                    if (this.absorb === 0) {
                        this.health = Math.round(this.health - amount)
                    } else {

                        //check for absorb buffs
                        for (let i = 0; i<this.buffs.length; i++) {
                            if (this.buffs[i].type==="absorb") {
                                this.buffs[i].amount -= amount
                                if (this.buffs[i].amount<0) {this.buffs[i].amount = 0}
                            }
                        }

                        let damage = amount - this.absorb
                        this.absorb -= amount
                        if (this.absorb < 0) {
                            this.absorb = 0
                        }
                        if (damage > 0) {
                            this.health = Math.round(this.health - damage)
                        }
                    }

                    if (this.health < 0) {
                        this.health = 0
                    }
                    if (this.infinitehp === 1) {
                        this.health = 100
                    }
                }

                heal(amount) {
                    let overhealing = 0
                    this.health = Math.round(this.health + amount)
                    if (this.health > this.maxHealth) {
                        overhealing = this.health - this.maxHealth
                        this.health = this.maxHealth
                    }
                    if (this.infinitehp === 1) {
                        this.health = 100
                    }
                    return overhealing
                }

                checkBuffs(gcd) {
                    if (this.buffs.length !== 0) {
                        for (let i = 0; i<this.buffs.length; i++) {
                            this.buffs[i].duration-=gcd
                            if (this.buffs[i].duration<0) {
                                this[this.buffs[i].type]-=this.buffs[i].amount
                                this.buffs.splice(i,1)
                                //...
                            }
                        }
                    }
                }

                applyHot(hotData) {
                    //cant apply hot
                    for (let a = 0; a < this.hots.length; a++) {
                        if (hotData.name === this.hots[a].name) {
                            return hotData
                        }
                    }
                    //can apply hot
                    this.hots.push(hotData)
                    return 0
                }

                applyDot(dotData) {
                    this.dots.push(dotData)
                }

                applyBuff(buffData) {
                    this.buffs.push(buffData)
                    let i = (this.buffs.length)-1
                    this[this.buffs[i].type] += this.buffs[i].amount
                }
            }

            let targets = []
            for (let f = 0; f < friendly; f++) {
                targets.push(new Target("T" + f, friendlyhp, "friendly", infinitehp, healthRatio))
            }
            for (let e = 0; e < enemy; e++) {
                targets.push(new Target("Enemy" + e, enemyhp, "enemy", infinitehp, 1))
            }

            return targets
        },


    }
}