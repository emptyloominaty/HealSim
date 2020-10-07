/* eslint-disable */

export default {
    methods: {
        createTargets() {
            class Target {
                constructor(name,health,type) {
                    this.name = name
                    this.health = health/2
                    this.maxHealth = health
                    this.type = type
                    //----
                    this.buffs = []
                    this.hots = []

                    this.dots = []
                }

                dealDamage(amount) {
                    this.health = Math.round(this.health - amount)
                    if (this.health<0) {
                        this.health = 0
                    }
                }

                heal(amount) {
                    this.health = Math.round(this.health + amount)
                    if (this.health>this.maxHealth) {
                        this.health = this.maxHealth
                    }
                }

                applyHot(hotData) {
                    //TODO: DISABLE APPLYING MULTIPLE HOTS
                    this.hots.push(hotData)
                }

                applyDot(dotData) {
                    this.dots.push(dotData)
                }

            }

           let targets = [
               new Target("T1",1000000,"friendly"),
               new Target("T2",1000000,"friendly"),
               new Target("T3",1000000,"friendly"),
               new Target("T4",1000000,"friendly"),
               new Target("T5",1000000,"friendly"),
               new Target("T6",1000000,"friendly"),
               new Target("T7",1000000,"friendly"),
               new Target("T8",1000000,"friendly"),
               new Target("T9",1000000,"friendly"),
               new Target("T10",1000000,"friendly"),
               new Target("T11",1000000,"friendly"),
               new Target("T12",1000000,"friendly"),
               new Target("T13",1000000,"friendly"),
               new Target("T14",1000000,"friendly"),
               new Target("T15",1000000,"friendly"),
               new Target("T16",1000000,"friendly"),
               new Target("T17",1000000,"friendly"),
               new Target("T18",1000000,"friendly"),
               new Target("T19",1000000,"friendly"),
               new Target("T20",1000000,"friendly"),
               new Target("Boss",100000000,"enemy")
           ]

            return targets
        },


    }
}