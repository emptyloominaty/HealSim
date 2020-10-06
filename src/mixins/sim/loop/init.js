/* eslint-disable */

export default {
    data() {
        return {
        }
    },
    methods: {
        loopInit() {
            this.gcd = 1.5 / (1 + (this.stats.haste / 100))
            //get hots
            this.getHots()
            //heal with hots
            this.healHots(this.gcd)
            //cd
            for (let i = 0; i < this.heals.length ; i++) {
                this.heals[i].incCd(this.gcd,this.stats)
            }


        }
    }
}