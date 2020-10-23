/* eslint-disable */

export default {
    methods: {
        loopInit() {
            //gcd
            if (this.usedAbility===0) {
                this.gcd = 1.5 / (1 + (this.character.stats.haste / 100))
            } else {
                this.gcd = this.usedAbility.gcd
            }
            if (this.gcd<0.75 && this.gcd!==0) {
                this.gcd=0.75
            }
            this.time += this.gcd

            //mana regen
            this.character.mana+= 0.8 * this.gcd
            if (this.character.mana>100) {
                this.character.mana=100
            }

            //get injured targets and friendly targets
            this.injuredTargets = []
            this.friendlyTargets = []
            this.enemyTargets = []
            for (let a = 0; a<this.targets.length; a++) {
                if (this.targets[a].health<this.targets[a].maxHealth && this.targets[a].type==="friendly" ) {
                    this.injuredTargets.push(a)
                }
                if (this.targets[a].type==="friendly") {
                    this.friendlyTargets.push(a)
                }
                if (this.targets[a].type==="enemy") {
                    this.enemyTargets.push(a)
                }
            }


            //--------BUFFS---------- {stat:"haste",increase:20,ppm:2,duration:6,lastproc:0,proc:60/2,procced:0}
            if (this.character.buffs.length > 0) {
                for (let b=0; b<this.character.buffs.length; b++) {
                    this.character.buffs[b].lastproc+=1*this.gcd
                    //---------------------------
                    if (this.character.buffs[b].lastproc>this.character.buffs[b].proc) {
                        this.character.buffs[b].lastproc = 0
                        this.character.buffs[b].procced = this.character.buffs[b].duration
                    }
                    //---------------------------
                    if (this.character.buffs[b].procced === this.character.buffs[b].duration) {
                        switch(this.character.buffs[b].stat) {
                            case "haste":
                                this.character.stats.haste=+this.character.stats.haste + +this.character.buffs[b].increase
                                break;
                            case "vers":
                                this.character.stats.vers=+this.character.stats.vers + +this.character.buffs[b].increase
                                break;
                            case "mastery":
                                this.character.stats.mastery=+this.character.stats.mastery + +this.character.buffs[b].increase
                                break;
                            case "crit":
                                this.character.stats.crit=+this.character.stats.crit + +this.character.buffs[b].increase
                                break;
                            case "int":
                                this.character.stats.int=+this.character.stats.int + +this.character.buffs[b].increase
                                break;
                        }
                    }

                    if (this.character.buffs[b].procced<0) {
                        switch(this.character.buffs[b].stat) {
                            case "haste":
                                this.character.stats.haste=Math.round((+this.character.stats.haste - +this.character.buffs[b].increase)*1000)/1000
                                break;
                            case "vers":
                                this.character.stats.vers=Math.round((+this.character.stats.vers - +this.character.buffs[b].increase)*1000)/1000
                                break;
                            case "mastery":
                                this.character.stats.mastery=Math.round((+this.character.stats.mastery - +this.character.buffs[b].increase)*1000)/1000
                                break;
                            case "crit":
                                this.character.stats.crit=Math.round((+this.character.stats.crit - +this.character.buffs[b].increase)*1000)/1000
                                break;
                            case "int":
                                this.character.stats.int=Math.round((+this.character.stats.int - +this.character.buffs[b].increase)*1000)/1000
                                break;
                        }
                        this.character.buffs[b].procced=0
                    }
                    if (this.character.buffs[b].procced>0) {
                        this.character.buffs[b].procced-=this.gcd
                        if (this.character.buffs[b].procced===0) {this.character.buffs[b].procced= -.1}
                    }
                    //---------------------------
                }
            }

            //get hots
            let runGetHotsAgain = 0
            let loops = 0

            this.getHots()
            this.capHots("Enveloping Breath",6)
            this.capHots("Refreshing Jade Wind",6)
            this.capHots("Soothing Mist - Statue",1)
            do {
                runGetHotsAgain = this.getHots()
                loops++
            } while (runGetHotsAgain===1 && loops < 25)


            //buffs on targets
            for (let i = 0; i < this.targets.length ; i++) {
                this.targets[i].checkBuffs(this.gcd)
                this.targets[i].resetEveryGcd()
            }

            //heal with hots
            this.healHots(this.gcd)

            //cd
            for (let i = 0; i < this.heals.length ; i++) {
                this.heals[i].doEveryGcd(this.gcd)
                this.heals[i].incCd(this.gcd,this.character.stats)
            }

            for (let i = 0; i < this.damages.length ; i++) {
                this.damages[i].doEveryGcd(this.gcd)
                this.damages[i].incCd(this.gcd, this.character.stats)
            }


            //buffs2
            for (let i = 0; i<this.character.buffs2.everyGcd.length; i++) {
                if (this.character.buffs2[this.character.buffs2.everyGcd[i]]) {
                    this.character.buffs2[this.character.buffs2.everyGcd[i]]--
                }
            }


        }
    }
}