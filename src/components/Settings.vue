<template>
    <section class="mainSection">
        <form v-on:submit.prevent="">
            <div>
                <div class="inputDiv">
                    <label>Mode </label>
                    <select  type="text" v-model="simMode">
                        <option value="infiniteRSK" selected>Auto ReM Extend</option>
                        <option value="onlyRSK">only RSK </option>
                        <option value="realGameSim">RSK + tp + bk</option>
                    </select>
                </div>
                <div class="inputDiv">
                    <label>Extend Rem (1=100%) </label>
                    <input type="number"  step="any" v-model="extendRem" >
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
                            <label> Procs per Minute </label>
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


    </section>
</template>

<script>
    export default {
        name: "Settings",
        data() {
            return {
                //v-models settings
                extendRem:1, //1=100%
                tftUse:0, //0 = rem 1 = rsk
                fightLength:120, //sec
                statHaste:0, //%
                statCrit:0, //%
                statVers:0, //%
                statMastery:0, //%
                statInt: 1000,
                simMode: "infiniteRSK",
                //v-models buffs
                stat: "haste",
                amount: 0,
                duration: 0,
                ppm: 1,
                //vars
                reloadTableKey:0,
            }
        },
        methods: {
            saveNewSettings() {

                if (this.simMode=="") {
                    this.simMode="infiniteRSK"
                }

                let data = {"extendRem":this.extendRem,"tftUse":this.tftUse,"fightLength":this.fightLength,
                    "statHaste":this.statHaste,"statCrit":this.statCrit,"statVers":this.statVers,
                    "statMastery":this.statMastery, "statInt":this.statInt,"simMode":this.simMode }

                this.$store.commit('setData',data)
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
    .mainSection {
        display:flex;
        justify-content: center;
    }

    .buffsSectionWH3 {
        display:flex;
        flex-wrap:wrap;
        flex-direction:column;
    }

    .buffsSectionWH3 h3 {
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


    label {
    padding-right: 5px;
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
        margin:0px;
        width:24px;
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