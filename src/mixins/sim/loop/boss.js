/* eslint-disable */

export default {
    methods: {
        doBoss(bossDamageAbilities,tanks,bossFightData) {
            //boss abilities-------------------------------------------------------------------
            //{time:0,everySec:5,damage:1000,targets:1,name:"bigdmg",dot:{isDot:0,dotData:{damage:0,duration:0,maxDuration:0,dispellable:0,dotType:"enemy"}}}, //1-dmg
            for (let ba = 0; ba<bossDamageAbilities.length; ba++) {
                let bAbility = bossDamageAbilities[ba]
                if (bAbility.used===0 && bAbility.time<this.time && this.friendlyTargets.length>0) {

                    //(damage,name,target,who,dot = 0)
                    let dontInfiniteLoopPls = 0
                    for (let t = 0; t<bAbility.targets; t++) {
                        let rngTarget = Math.round(Math.random() * (this.friendlyTargets.length))
                        if (rngTarget===this.friendlyTargets.length) { rngTarget=0 }

                        let target = this.friendlyTargets[rngTarget]
                        if (this.targets[target].health>0) {
                            this.doDamage(bAbility.damage, bAbility.name, target, "enemy")
                            if (bAbility.dot.isDot===1) {
                                this.targets[target].applyDot(bAbility.dot.dotData)
                            }
                        } else {
                            if (dontInfiniteLoopPls<100) {
                                dontInfiniteLoopPls++
                                t--
                            }
                        }
                    }
                    bAbility.used=1
                }
                if (bAbility.used===1) {
                    bAbility.cd+=this.gcd
                    if(bAbility.cd>=bAbility.everySec) {
                        bAbility.used=0
                        bAbility.cd-=bAbility.everySec
                    }
                }
            }

            //Boss AutoAttack
            if (this.targets[tanks[0]].health>0) {
                //attack first tank
                this.doDamage(bossFightData[0].bossAutoAttack*this.gcd, "AutoAttack", tanks[0], "enemy")
                if (this.enemyTargets.length>1) {
                    for (let i = 0; i<this.enemyTargets.length-1; i++) {
                        if (this.targets[this.enemyTargets[i+1]].health>0) {
                            this.doDamage(bossFightData[0].addAutoattack*this.gcd, "AutoAttack", tanks[0], "enemy")
                        }
                    }
                }
            } else if (this.targets[tanks[1]] && this.targets[tanks[1]].health>0) {
                //attack second tank
                this.doDamage(bossFightData[0].bossAutoAttack*this.gcd, "AutoAttack", tanks[1], "enemy")
                if (this.enemyTargets.length>1) {
                    for (let i = 0; i<this.enemyTargets.length-1; i++) {
                        if (this.targets[this.enemyTargets[i+1]].health>0) {
                            this.doDamage(bossFightData[0].addAutoattack*this.gcd, "AutoAttack", tanks[1], "enemy")
                        }
                    }
                }
            }

        }
    }
}