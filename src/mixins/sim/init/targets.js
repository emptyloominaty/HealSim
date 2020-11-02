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
                    this.abilitiesOnThisTarget = 0
                    this.buffs = []
                    this.hots = []
                    this.dots = []
                    this.damageReduction = 0
                    this.infinitehp = infinitehp
                    this.stats = {primary:100, crit:5, haste:10, vers:Math.random()*15, mastery:25}
                }

                dealDamage(amount,name) {
                    //DR Buffs
                    for (let i = 0; i<this.buffs.length; i++) {
                        if (this.buffs[i].type==="damageReduction") {
                            amount = amount / (1 + (this.buffs[i].amount/100))
                        }
                    }
                    //DR Versa
                    amount = amount / (1 + ((this.stats.vers/100)/2))

                    this.abilitiesOnThisTarget.push({name:name,value:amount,hot:0,type:"damage"})
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
                        this.health = this.maxHealth/2
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
                        this.health = this.maxHealth/2
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
                resetEveryGcd() {
                    this.abilitiesOnThisTarget = []
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