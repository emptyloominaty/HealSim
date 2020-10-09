/* eslint-disable */

export default {
    methods: {
        createTargets(friendly,enemy,friendlyhp,enemyhp,infinitehp) {
            class Target {
                constructor(name,health,type,infinitehp) {
                    this.name = name
                    this.health = health/1.2
                    this.maxHealth = health
                    this.type = type
                    //----
                    this.buffs = []
                    this.hots = []
                    this.dots = []
                    this.infinitehp = infinitehp
                }

                dealDamage(amount) {
                    this.health = Math.round(this.health - amount)
                    if (this.health<0) {
                        this.health = 0
                    }
                    if (this.infinitehp===1) {
                        this.health = 100
                    }
                }

                heal(amount) {
                    let overhealing = 0
                    this.health = Math.round(this.health + amount)
                    if (this.health>this.maxHealth) {
                        overhealing = this.health-this.maxHealth
                        this.health = this.maxHealth
                    }
                    if (this.infinitehp===1) {
                        this.health = 100
                    }
                    return overhealing
                }

                applyHot(hotData) {
                    let refreshHot = 0
                    for (let a = 0; a<this.hots.length; a++) {
                        if (hotData.name===this.hots[a].name) {
                            refreshHot=1
                            this.hots[a].duration=this.hots[a].maxDuration
                            return hotData
                        }
                    }
                    //
                    if (refreshHot===0) {
                        this.hots.push(hotData)
                    }
                    return 0
                }

                applyDot(dotData) {
                    this.dots.push(dotData)
                }

            }

           let targets = []
            for(let f = 0; f<friendly; f++) {
                targets.push(new Target("T"+f, friendlyhp,"friendly",infinitehp))
            }
            for(let e = 0; e<enemy; e++) {
                targets.push(new Target("Enemy"+e, enemyhp,"enemy",infinitehp))
            }

            return targets
        },


    }
}