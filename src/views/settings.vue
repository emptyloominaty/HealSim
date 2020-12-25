<template>
    <div class="mainSettings">
        <!-- Settings (save to LocalStorage)-->
        <div>
            <select>
                <option>Mistweaver Monk</option>
                <option disabled>----------NO----------</option>
                <option disabled>Restoration Druid</option>
                <option disabled>Restoration Shaman</option>
                <option disabled>Holy Paladin</option>
                <option disabled>Holy Priest</option>
                <option disabled>Discipline Priest</option>
            </select>
        </div>

        <!-- CRIT = VERS-->
        <div class="inputDiv">
            <label class="padding3"> Crit = Vers (for more precise sim) </label>
            <select v-model="critFix">
                <option value="1">Yes</option>
                <option value="0">No</option>
            </select>
        </div>

        <!-- Class Settings (save to LocalStorage)-->
        <settings-class/>

        <!-- Stats (save to LocalStorage)-->
        <div class="settingsSection">
            <h3>Stats</h3>
            <div class="column">
                <div class="inputDiv">
                    <label> Haste </label>
                    <input type="number"  step="any" v-model="haste">
                </div>
                <div class="inputDiv">
                    <label>Crit </label>
                    <input type="number"  step="any" v-model="crit">
                </div>
                <div class="inputDiv">
                    <label>Vers </label>
                    <input type="number"  step="any" v-model="vers">
                </div>
                <div class="inputDiv">
                    <label>Mastery </label>
                    <input type="number"  step="any" v-model="mastery">
                </div>
                <div class="inputDiv">
                    <label>Int </label>
                    <input type="number"  step="any" v-model="int"> &nbsp;&nbsp;
                </div>
            </div>
            <button v-on:click="saveData()">Save</button>
        </div>
    </div>
</template>

<script>
    import settingsClass from '../components/SettingsClass.vue'
    import loadStore from '../mixins/loadStore'
    export default {
        name: "settings",
        mixins: [loadStore],
        components: {
          settingsClass
        },
        data() {
            return {
                haste: this.$store.state.stats.haste,
                crit: this.$store.state.stats.crit,
                vers: this.$store.state.stats.vers,
                mastery: this.$store.state.stats.mastery,
                int: this.$store.state.stats.int,
                critFix: this.$store.state.settingsSim.critIsVers,
            }
        },
        methods: {
            saveData() {
                let data = {haste:this.haste,crit:this.crit,vers:this.vers,mastery:this.mastery,int:this.int}

                this.$store.state.settingsSim.critIsVers = this.critFix
                this.$store.state.stats = data

                this.storeData(data,"stats")
                this.storeData(this.$store.state.settingsSim,"settings")
            }
        }
    }
</script>

<style scoped>
    h3 {
        margin:0;
    }
    .mainSettings {
        margin-top:20px;
    }

    .column {
        display:flex;
        flex-wrap:wrap;
        flex-direction: column;
    }
    .settingsSection {
        background-color: #303030;
        color: #efcc00;
        text-shadow: 0 0 3px #987300;
        font-family: Calibri, Arial, sans-serif;
        font-size: 1.1rem;
        /*font-weight:600;*/
     /*   display: flex;
        flex-wrap: wrap;
        flex-direction: row;*/
        display: inline-block;
       /* width: 300px;*/
        margin: 10px;
        border: 2px solid #333333;
        border-radius: 3px;
        padding: 18px;
    }

    label {
        padding-top:1px;
        color: #efcc00;
        padding-right:6px;
    }


    .inputDiv {
        padding:10px;
        display:flex;
        flex-wrap:wrap;
        justify-content: center;
        /*flex-direction:column;*/
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

    button {
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

    button:hover {
        background-color: #575757;
        text-shadow: 0 0 8px #d7ac00;
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
    .padding3 {
        padding : 3px;
        align-self:center;
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


    /*form button {
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
    }*/

</style>