<template>
    <div>
        <div class="stats">
            Int: {{ $store.state.stats.int }}
            Haste: {{ $store.state.stats.haste }}
            Crit:  {{ $store.state.stats.crit }}
            Vers:  {{ $store.state.stats.vers }}
            Mastery:  {{ $store.state.stats.mastery }}
        </div>
        <div class="tables">
        <table v-for="(item,index) in tableData" :key="index" >
            <tr>
                <th>Name</th>
                <th>Heal</th>
                <th>Mana Ef</th>
            </tr>
            <tr v-for="item2 in tableData[index]" :key="item2.index" v-bind:style="{ backgroundColor: item2.color}" >
                <td>{{item2.name}}</td>
                <td>{{formatHeal(item2.heal)}}</td>
                <td>{{Math.round(item2.heal/item2.manaCost)/200}}</td>
            </tr>
        </table>
        </div>

    </div>
</template>

<script>

    export default {
        mixins: [],
        name: "heals",
        data() {
            return {
                tableData: this.getTableData()
            }
        },
        methods: {
            getTableData() {       //This is stupid function but I dont care

                let stats = this.$store.state.stats
                let data = [[],[],[],[],[],[],[]]

                for (let i = 0; i<21; i++) {
                    data[0].push({name:"Vivify + "+i+" ReMs",heal:Math.round(((1.41 + (i * 1.04))*stats.int) * (1 + (stats.vers / 100))+(stats.int * (1 + (stats.mastery / 100)))),manaCost:4.1,color:"#abff9e"})
                }

                data[1].push({name: "Essence Font + "+0+" ",heal:Math.round((((0.472 * 18)+(0.168 * 13))*stats.int)*(1 + (stats.vers / 100))),manaCost:7.2,color:"#a0ffee"})

                for (let i = 1; i<19; i++) {
                    data[1].push({name: "Essence Font + "+i+" ",heal:Math.round((((0.472 * (18+i) + ((0.168*1.5) * (13+(i/6)))))*stats.int)*(1 + (stats.vers / 100))),manaCost:7.2,color:"#a0ffee"})
                }

                data[1].push({name: "Refreshing Jade Wind ",heal:Math.round((( (13.572) )*stats.int)*(1 + (stats.vers / 100))),manaCost:3.5,color:"#78ff79"})

                for (let i = 1; i<21; i++) {
                    data[2].push({name: "Rising Mist + "+i+" ",heal:Math.round(((i*0.28)*stats.int)*(1 + (stats.vers / 100))),manaCost:1.5,color:"#ffbb9a"})
                }

                data[3].push({name: "Renewing Mist 20s ",heal:Math.round((( ((2.25/20)*20)* (1 + (stats.haste / 100)) )*stats.int)*(1 + (stats.vers / 100))),manaCost:2.2,color:"#7cff99"})
                data[3].push({name: "Renewing Mist 30s (tft)",heal:Math.round((( ((2.25/20)*30)* (1 + (stats.haste / 100)) )*stats.int)*(1 + (stats.vers / 100))),manaCost:2.2,color:"#7cff99"})
                data[3].push({name: "Renewing Mist 40s (ext)",heal:Math.round((( ((2.25/20)*40)* (1 + (stats.haste / 100)) )*stats.int)*(1 + (stats.vers / 100))),manaCost:2.2,color:"#7cff99"})
                data[3].push({name: "Renewing Mist 60s (tft+ext)",heal:Math.round((( ((2.25/20)*60)* (1 + (stats.haste / 100)) )*stats.int)*(1 + (stats.vers / 100))),manaCost:2.2,color:"#7cff99"})

                data[3].push({name: "Enveloping Mist 6s ",heal:Math.round((( ((3.60/6)*6)* (1 + (stats.haste / 100)) )*stats.int)*(1 + (stats.vers / 100))),manaCost:6.0,color:"#e9ff8e"})
                data[3].push({name: "Enveloping Mist 7s (MistWrap)",heal:Math.round((( ((3.60/6)*7)* (1 + (stats.haste / 100)) )*stats.int)*(1 + (stats.vers / 100))),manaCost:6.0,color:"#e9ff8e"})
                data[3].push({name: "Enveloping Mist 12s (ext)",heal:Math.round((( ((3.60/6)*12)* (1 + (stats.haste / 100)) )*stats.int)*(1 + (stats.vers / 100))),manaCost:6.0,color:"#e9ff8e"})
                data[3].push({name: "Enveloping Mist 14s (MistWrap+ext)",heal:Math.round((( ((3.60/6)*14)* (1 + (stats.haste / 100)) )*stats.int)*(1 + (stats.vers / 100))),manaCost:6.0,color:"#e9ff8e"})

                for (let i = 1; i<7; i++) { // EM REM (Tear Of Morning)
                    data[4].push({name: "Enveloping Mist + ToM + "+i+" Rems 6s",heal:Math.round((( (((3.60+((3.60*0.2)*i))/6)*6)* (1 + (stats.haste / 100)) )*stats.int)*(1 + (stats.vers / 100))),manaCost:6.0,color:"#adffe4"})
                }

                for (let i = 1; i<7; i++) { // EM REM (Tear Of Morning)
                    data[4].push({name: "Enveloping Mist + ToM + "+i+" Rems 7s",heal:Math.round((( (((3.60+((3.60*0.2)*i))/6)*7)* (1 + (stats.haste / 100)) )*stats.int)*(1 + (stats.vers / 100))),manaCost:6.0,color:"#c5ffa6"})
                }

                for (let i = 1; i<7; i++) { // EM REM (Tear Of Morning)
                    data[4].push({name: "Enveloping Mist + ToM + "+i+" Rems 12s",heal:Math.round((( (((3.60+((3.60*0.2)*i))/6)*12)* (1 + (stats.haste / 100)) )*stats.int)*(1 + (stats.vers / 100))),manaCost:6.0,color:"#fff399"})
                }
                for (let i = 1; i<7; i++) { // EM REM (Tear Of Morning)
                    data[4].push({name: "Enveloping Mist + ToM + "+i+" Rems 14s",heal:Math.round((( (((3.60+((3.60*0.2)*i))/6)*14)* (1 + (stats.haste / 100)) )*stats.int)*(1 + (stats.vers / 100))),manaCost:6.0,color:"#ffb1a0"})
                }

                for (let i = 0; i<21; i++) {
                    data[5].push({name:"Vivify + ToM + "+i+" ReMs",heal:Math.round(((1.41 + (i * (1.04*1.2)))*stats.int) * (1 + (stats.vers / 100))+(stats.int * (1 + (stats.mastery / 100)))),manaCost:4.1,color:"#abff9e"})
                }

                data[6].push({name: "Soothing Mist ",heal:Math.round((( ((4.40/8)*8)* (1 + (stats.haste / 100)) )*stats.int)*(1 + (stats.vers / 100))),manaCost:0.4*8,color:"#7cff99"})

                data[6].push({name: "Revival 5",heal:Math.round((( (3.15*5)* (1 + (stats.haste / 100)) )*stats.int)*(1 + (stats.vers / 100))),manaCost:4.374,color:"#65ffca"})
                data[6].push({name: "Revival 10",heal:Math.round((( (3.15*10)* (1 + (stats.haste / 100)) )*stats.int)*(1 + (stats.vers / 100))),manaCost:4.374,color:"#65ffca"})
                data[6].push({name: "Revival 15",heal:Math.round((( (3.15*15)* (1 + (stats.haste / 100)) )*stats.int)*(1 + (stats.vers / 100))),manaCost:4.374,color:"#65ffca"})
                data[6].push({name: "Revival 20",heal:Math.round((( (3.15*20)* (1 + (stats.haste / 100)) )*stats.int)*(1 + (stats.vers / 100))),manaCost:4.374,color:"#65ffca"})

                data[6].push({name: "Expel Harm ",heal:Math.round((( (1.20+1.20) )*stats.int)*(1 + (stats.vers / 100))+(stats.int * (1 + (stats.mastery / 100)))),manaCost:3.5,color:"#c1ff97"})

                data[6].push({name: "Faeline Stomp ",heal:Math.round((( (0.91*5)+(5*(0.472+0.168)) )*stats.int)*(1 + (stats.vers / 100))+(stats.int * (1 + (stats.mastery / 100)))),manaCost:4.0,color:"#a8b3ff"})
                data[6].push({name: "Weapons of Order ",heal:Math.round((( (3*(0.40*2)*6) )*stats.int)*(1 + (stats.vers / 100))+(stats.int * (1 + (stats.mastery / 100)))),manaCost:5.0,color:"#a8fff3"})
                //data[6].push({name: "Bonedust Brew ",heal:Math.round((( (6*42) )*stats.int)*(1 + (stats.vers / 100))+(stats.int * (1 + (stats.mastery / 100)))),manaCost:0,color:"#a8fff3"})

                return data
            },
            formatHeal(num) {
                if (num>999.99) {
                    num=Math.round((num/1000)*10)/10 +"k"
                } else if (num>999999.99) {
                    num=Math.round((num/1000000)*10)/10 +"M"
                }
                return num
            }
        }
    }
</script>

<style scoped>
    .stats {
        color:#987300;
        margin-bottom:10px;
    }
    .tables {
        display:flex;
        flex-wrap:wrap;
        justify-content: center;
    }

    table {
        margin:0 2px 0 2px;
        max-width:650px;
        border-collapse: collapse;
        text-align: center;
    }

    table,th,td {
        border: 1px solid #987300;
        color: #222;
        padding: 5px 10px 5px 10px;
    }


    th {
        font-size:1.2rem;
        color: #987300;
        background-color: #303030;
    }

    p {
        color: #fff;
    }

</style>
