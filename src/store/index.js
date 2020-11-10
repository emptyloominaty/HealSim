import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        remSetting: {extendRem:1, tftUse:0, fightLength:120,
            statHaste:0, statCrit:0, statVers:0,
            statMastery:0, statInt:0,simMode:"infiniteRSK"},
        healSetting: {bossFight: [ //test boss - Normal
                {name:"Test Boss - Normal",bossHealth:1000000,addsHealth:10000,adds:0,addAutoattack:100,bossAutoAttack:150}, //0-data
                {time:0,everySec:1,damage:1000,targets:1,name:"bigdmg",dot:{isDot:0,dotData:{damage:0,duration:0,maxDuration:0,dispellable:0,dotType:"enemy"}}}, //1-dmg
                {time:0,everySec:2,damage:100,targets:10,name:"dmg",dot:{isDot:0,dotData:{damage:0,duration:0,maxDuration:0,dispellable:0,dotType:"enemy"}}} //2-dmg
            ], simModeInfinite:"time", fightLength:240,
            haste:38.8, crit:24, vers:2,
            mastery:104, int:700,simMode:"20-1"},
        stats: {haste:38.8, crit:24, vers:2,
            mastery:104, int:700},
        classSettings: {extendRem:1},
        chartData: {},
        chartDataMana: {},
        chartDataDamage: {},
        chartDataHeal: {},
        chartDataHaste: {},
        chartDataStacked: {},
        chartDataRaidHp: {},
        talents: [],
        buffs: [{stat:"haste",increase:40,ppm:2,duration:7,lastproc:0,proc:60/2,procced:0}],
        db : [],
        debug: 0,
        //TODO: //////////////////////
        bfaData:{essences:[], azeriteTraits:[],corruption:[]}, //no dont
        shadowlandsData: {legendaries:[],conduits:[],covenant:""},
        trinkets: [],
    },
    mutations: {
        setData(state, newData) {
            state.remSetting = newData
        },
        setStats(state, newData) {
            state.stats = newData
        },
        setClassSettings(state, newData) {
            state.classSettings = newData
        },
        setHealData(state, newData) {
            state.healSetting = newData
        },
        setBuffsData(state, newData) {
            state.buffs = newData
        },
        setChartData(state, newData) {
            state.chartData = newData
        },
        setChartDataMana(state, newData) {
            state.chartDataMana = newData
        },
        setChartDataDamage(state, newData) {
            state.chartDataDamage = newData
        },
        setChartDataHeal(state, newData) {
            state.chartDataHeal = newData
        },
        setChartDataHaste(state, newData) {
            state.chartDataHaste = newData
        },
        setChartStacked(state, newData) {
            state.chartDataStacked = newData
        },
        setChartDataRaidHp(state, newData) {
            state.chartDataRaidHp = newData
        },
        setTalentsData(state, newData) {
            state.talents = newData
        },
        debug(state, newData) {
            state.db = newData
        }
    },
    actions: {
    },
    modules: {
    }
})
