<template>
    <div class="mainClassSettings">
        <div class="settingsSection">
            <h3>Class Settings</h3>
            <div class="inputDiv">
                <label> Extend Rem </label>
                <input type="number"  step="any" v-model="extendRem">
            </div>
        </div>
        <div class="settingsSection">
            <h3> Spell power / Attack power </h3>
            <div class="inputDiv">
                <label> Vivify Main </label>
                <input type="number"  step="any" v-model="vivifyMain">
            </div>
        </div>

    </div>
</template>

<script>
    export default {
        name: "SettingsClass",
        data() {
            return {
                extendRem: 1, // 1 = 100%
                vivifyMain: 1.41
            }
        }
    }
</script>

<style scoped>
    /*
    TODO:MAKE CSS FILE YOU RETARD
        */
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
        padding: 8px;
    }

    label {
        color: #efcc00;
        padding-right:4px;
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