<template>
    <section class="mainSection">
        <form v-on:submit.prevent="">
            <div>
                <div class="inputDiv">
                    <label>Raid / Dungeon Type </label>
                    <select  type="text" v-model="simMode">
                        <option value="30-1" selected>Raid 30</option>
                        <option value="20-1" selected>Raid 20</option>
                        <option value="20-5" selected>Raid 20 AOE 5</option>
                        <option value="20-3" selected>Raid 20 AOE 3</option>
                        <option value="20-2" selected>Raid 20 AOE 2</option>
                        <option value="10-1" selected>Raid 10</option>
                        <option value="5-1" selected>Dungeon 5</option>
                    </select>
                </div>
                <div class="inputDiv">
                    <label>Boss Fight</label>
                    <select  type="text" v-model="bossFight">
                        <option v-for="(item,index) in bossDamages" :key="index"  v-bind:value="{value:item}">
                        {{item[0].name}}
                        </option>
                    </select>
                </div>
                <div class="inputDiv">
                    <label>Use TFT (0=ReM 1=RSK)</label>
                    <input type="number" max="1" min="0" value="1" v-model="tftUse" >
                </div>
                <div class="inputDiv">
                    <label>Fight Length </label>
                    <input type="number" max="600" min="30" v-model="fightLength">
                </div>
                <button  v-on:click="saveNewSettings()"  >Set</button>
            </div>

            <div>
                <div class="inputDiv">
                    <label> Haste </label>
                    <input type="number"  step="any" v-model="statHaste">
                </div>
                <div class="inputDiv">
                    <label>Crit </label>
                    <input type="number"  step="any" v-model="statCrit">
                </div>
                <div class="inputDiv">
                    <label>Vers </label>
                    <input type="number"  step="any" v-model="statVers">
                </div>
                <div class="inputDiv">
                    <label>Mastery </label>
                    <input type="number"  step="any" v-model="statMastery">
                </div>
                <div class="inputDiv">
                    <label>Int </label>
                    <input type="number"  step="any" v-model="statInt"> &nbsp;&nbsp;
                </div>
            </div>
        </form>
        <!-- BUFFS -->
        <form v-on:submit.prevent="">
            <section class="buffsSectionWH3">
                <h3>Add Buff</h3>
                 <section class="buffsSection">
                    <section class="buffsInputColumn">
                        <div class="inputDiv">
                            <label>Stat </label>
                            <select  type="text" v-model="stat">
                                <option value="haste" selected>Haste</option>
                                <option value="crit">Crit</option>
                                <option value="vers">Vers</option>
                                <option value="mastery">Mastery</option>
                                <option value="int">Int</option>
                            </select>
                        </div>
                        <div class="inputDiv">
                            <label> Duration </label>
                            <input type="number"  step="any" v-model="duration">
                        </div>
                    </section>

                    <section class="buffsInputColumn">
                        <div class="inputDiv">
                            <label> Amount </label>
                            <input type="number"  step="any" v-model="amount">
                        </div>

                        <div class="inputDiv">
                            <label> PPM </label>
                            <input type="number"  step="any" v-model="ppm">
                        </div>
                    </section>

                    <section class="buffsInputColumn listofBuffsSection" >
                        <button  v-on:click="saveNewBuff()" >Add</button>
                        <section class="listOfBuffs" :key="reloadTableKey">
                            <table>
                                <tr>
                                    <th>Stat</th>
                                    <th>Amount</th>
                                    <th>Duration</th>
                                    <th>PPM</th>
                                    <th></th>
                                </tr>
                                <tr v-for="(item,index) in $store.state.buffs" :key="index" >
                                    <td> {{ item.stat }} </td>
                                    <td> {{ item.increase }} </td>
                                    <td> {{ item.duration }}s </td>
                                    <td> {{ item.ppm }} </td>
                                    <td><button v-on:click="deleteBuff(index)" class="deletebutton">✕</button></td>
                                </tr>
                            </table>
                        </section>
                    </section>
                 </section>
            </section>
        </form>
        <!-- TALENTS -->
        <form class="talents" v-on:submit.prevent="">
            <h3>Talents</h3>
            <div>
                <div>
                    <div class="inputDiv">
                         <select class="selectTalent" v-for="(items,index) in talentsData" :key="index" v-model="talents[index]">
                               <option v-for="(item,index2) in items" :key="index2" v-bind:value="{value:item.value}" >
                                    {{ item.name }}
                               </option>
                         </select>
                    </div>
                </div>
                <div>
                    <button  v-on:click="setTalents()"  >Set Talents</button>
                </div>
                <div class="talentsIcons">
                    <div class="talentsIcon" v-for="(item,index) in talents" :key="index">
                        <img :src="'/img/talents/'+item.value+'.jpg'" >
                    </div>
                </div>
            </div>
        </form>


    </section>
</template>

<script>
    export default {
        name: "Settings",
        data() {
            return {
                //v-models settings
                bossFight:1, //1=100%
                tftUse:0, //0 = rem 1 = rsk
                fightLength:this.$store.state.healSetting.fightLength, //sec
                statHaste:this.$store.state.stats.haste, //%
                statCrit:this.$store.state.stats.crit, //%
                statVers:this.$store.state.stats.vers, //%
                statMastery:this.$store.state.stats.mastery, //%
                statInt: this.$store.state.stats.int,
                simMode: "20-1",
                //v-models buffs
                stat: "haste",
                amount: 10,
                duration: 10,
                ppm: 1,
                //v-models talents
                talentsData: [
                    [{name:"Mist Wrap",value:"mistWrap"},{name:"Chi Burst",value:"chiBurst"}], //15
                    [{name:"Mana Tea",value:"manaTea"}], //30        // Life Cycles / Spirit of the Crane / Mana Tea
                    [{name:"Jade Serpent Statue",value:"jadeStatue"},{name:"Refreshing Jade Wind",value:"refreshingJadeWind"},{name:"Chi-Ji",value:"chiJi"}], //45
                    [{name:"Focused Thunder",value:"focusedThunder"},{name:"Upwelling",value:"upwelling"},{name:"Rising Mist",value:"risingMist"}] //50
                ],
                talents:[],
                //vars
                reloadTableKey:0,
                bossDamages:[
                    [ //test boss - Normal
                        {name:"Test Boss - Normal",bossHealth:500000,addsHealth:10000,adds:0,addAutoattack:100,bossAutoAttack:150}, //0-data
                        {time:0,everySec:2,damage:1000,targets:2,name:"bigdmg",dot:{isDot:0,dotData:{damage:0,duration:0,maxDuration:0,dispellable:0,dotType:"enemy"}}}, //1-dmg
                        {time:0,everySec:1,damage:100,targets:5,name:"dmg",dot:{isDot:0,dotData:{damage:0,duration:0,maxDuration:0,dispellable:0,dotType:"enemy"}}}, //2-dmg
                        {time:0,everySec:5,damage:100,targets:1,name:"dot",dot:{isDot:1,dotData:{damage:300,duration:15,maxDuration:15,dispellable:0,dotType:"enemy",name:"dotdot"}}} //3-dmg dot
                    ],
                    [ //test boss - Heroic
                        {name:"Test Boss - Heroic",bossHealth:1000000,addsHealth:10000,adds:0,addAutoattack:100,bossAutoAttack:150}, //0-data
                        {time:0,everySec:1,damage:1000,targets:3,name:"bigdmg",dot:{isDot:0,dotData:{damage:0,duration:0,maxDuration:0,dispellable:0,dotType:"enemy"}}}, //1-dmg
                        {time:0,everySec:1,damage:100,targets:10,name:"dmg",dot:{isDot:0,dotData:{damage:0,duration:0,maxDuration:0,dispellable:0,dotType:"enemy"}}} //2-dmg
                    ],
                    [ //test boss - Mythic
                        {name:"Test Boss - Mythic",bossHealth:1500000,addsHealth:10000,adds:0,addAutoattack:100,bossAutoAttack:150}, //0-data
                        {time:0,everySec:5,damage:1000,targets:20,name:"bigdmg",dot:{isDot:0,dotData:{damage:0,duration:0,maxDuration:0,dispellable:0,dotType:"enemy"}}}, //1-dmg
                        {time:0,everySec:1,damage:100,targets:15,name:"dmg",dot:{isDot:0,dotData:{damage:0,duration:0,maxDuration:0,dispellable:0,dotType:"enemy"}}}, //2-dmg
                    ],
                ]
            }
        },
        methods: {
            setTalents() {
                this.$store.commit('setTalentsData',this.talents)
            },
            saveNewSettings() {
                let data = {"bossFight":this.bossFight.value,"tftUse":this.tftUse,"fightLength":this.fightLength,
                    "haste":+this.statHaste,"crit":+this.statCrit,"vers":+this.statVers,
                    "mastery":+this.statMastery, "int":+this.statInt,"simMode":this.simMode }

                this.$store.commit('setHealData',data)
            },
            saveNewBuff() {
                let data = this.$store.state.buffs

                data[data.length] = {stat:this.stat, increase:this.amount, ppm:this.ppm, duration:this.duration, lastproc:0, proc:60/this.ppm, procced:0}

                this.reloadTableKey = this.reloadTableKey === 0 ? 1 : 0

                this.$store.commit('setBuffsData',data)
                data = 0
            },
            deleteBuff(id) {
                let data = this.$store.state.buffs

                data.splice(id, 1)

                this.$store.commit('setBuffsData',data)
                data = 0
            }
        }
    }
</script>

<style scoped>
    img {
        width:48px;
    }

    .talentsIcons {
        width: 100%;
    }
    .mainSection {
        display:flex;
        justify-content: center;
    }

    .buffsSectionWH3 {
        display:flex;
        flex-wrap:wrap;
        flex-direction:column;
    }

    .buffsSectionWH3 h3, .talents h3 {
        color: #d9b100;
        margin:3px;
        padding:0;
    }

    .buffsSection {
        display:flex;
        flex-wrap:wrap;
        flex-direction:row;
        justify-content: center;
    }

    .listofBuffsSection {
        width:100%;
    }

    .buffsInputColumn {
        display:flex;
        flex-direction:column;
        justify-content: center;
        align-items:center;
    }

    .listOfBuffs {
        margin-top:10px;
        background-color: #404040;
        border: 1px solid #000;
        height: 120px;
        width: 100%;
        overflow:auto;
    }

    .talents {
        display:flex;
        flex-wrap:nowrap;
        flex-direction:column;
    }

    .selectTalent {
        margin:7px;
    }

    table {
        border-collapse: collapse;
        width:100%;
    }

    td,th {
        border:1px solid #666600;
    }

    form {
        background-color: #303030;
        color: #efcc00;
        text-shadow: 0 0 3px #987300;
        font-family: Calibri, Arial, sans-serif;
        font-size:1.1rem;
        /*font-weight:600;*/
        display:flex;
        flex-wrap: nowrap;
        flex-direction:row;
        width:300px;
        margin: 10px;
        border: 2px solid #333333;
        border-radius: 3px;
        padding:8px;
    }
    form div {
        padding:2px;
        display:flex;
        flex-wrap:wrap;
        justify-content: center;
        align-items:center;
    }

    .inputDiv {
        padding:10px;
        display:flex;
        flex-wrap:wrap;
        flex-direction:column;
    }

    form button {
        margin:5px;
        padding: 3px;
        width:100px;
        background-color: #404040;
        color: #ffde00;
        text-shadow: 0 0 3px #987300;
        border:1px solid #ffde00;
        border-radius:3px;
        cursor:pointer;
        transition:all 0.2s;
        font-size:1.2rem;
    }
    form button:hover {
        background-color: #575757;
        text-shadow: 0 0 8px #d7ac00;
    }

    .deletebutton {
        border:none;
        margin:0;
        padding:0;
        width:100%;
    }
    .deletebutton:focus {
        outline-color: #d7ac00;
    }

    input {
        background-color: #404040;
        color:#fff;
        font-family: Calibri, Arial, sans-serif;
        font-size:1rem;
        text-align:center;
        border:1px solid #000;
        border-radius: 3px;
        width: 50px;
        padding:3px;
    }

    input:focus {
        outline:none;
        border-color: #fff;
    }

    select,option {
        font-family: Calibri, Arial, sans-serif;
        font-size:1rem;
        text-align:center;
        text-align-last:center;
        border-color:#000;
        border-radius:3px;
        padding:3px;
        background-color: #404040;
        color: #fff;
    }

    select:focus {
        outline:none;
        border-color:#fff;
    }

    /* -----Disable Arrows from input type number------- */
    /* Chrome, Safari, Edge, Opera */
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    /* Firefox */
    input[type=number] {
        -moz-appearance: textfield;
    }

    /* width */
    ::-webkit-scrollbar {
        width: 10px;
    }

    /* Track */
    ::-webkit-scrollbar-track {
        background: #444;
    }

    /* Handle */
    ::-webkit-scrollbar-thumb {
        background: #777;
    }

    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
        background: #666;
    }



</style>