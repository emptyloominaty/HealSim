<template>
    <div class="mainClassSettings">
        <div class="settingsSection">
            <h3>Class Settings</h3>
            <div class="inputDiv">
                <label> Extend Rem </label>
                <input type="number"  step="any" v-model="extendRem">
            </div>
            <div class="inputDiv">
                <label> use Tft on </label>
                <select v-model="useTftOn">
                    <option value="random">Random</option>
                    <option value="rsk">Rising Sun Kick</option>
                    <option value="rem">Renewing Mist</option>
                </select>
            </div>
            <div class="inputDiv">
                <label> use Mana Tea </label>
                <select v-model="useManaTea">
                    <option value="1">Yes</option>
                    <option value="0">No</option>
                </select>
            </div>
            <div class="inputDiv">
                <label> use Cds (Revival, Chi-Ji, Yu'lon) </label>
                <select v-model="useCds">
                    <option value="1">Yes</option>
                    <option value="0">No</option>
                </select>
            </div>
            <button v-on:click="saveData()">Save</button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "SettingsClass",
        data() {
            return {
                extendRem: this.$store.state.classSettings.extendRem,
                useTftOn: this.$store.state.classSettings.useTftOn,
                useManaTea: this.$store.state.classSettings.useManaTea,
                useCds: this.$store.state.classSettings.useCds
                // useTftOn:"random", useManaTea: 1, useCds: 1
            }
        },
        methods: {
            saveData() {
                let data = {extendRem:this.extendRem, useTftOn:this.useTftOn, useManaTea:this.useManaTea, useCds:this.useCds}
                this.$store.commit('setClassSettings',data)
            }
        }
    }
</script>

<style scoped>
    /*
    TODO:MAKE CSS FILE YOU RETARD
        */
    h3 {
        margin:0;
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
        color: #efcc00;
        padding-right:6px;
        padding-top:1px;
    }


    .inputDiv {
        padding:10px;
        display:flex;
        flex-wrap:wrap;
        justify-content: center;
    /* flex-direction:column;*/
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