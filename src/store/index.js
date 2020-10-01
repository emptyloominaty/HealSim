import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        remSetting: {extendRem:1, tftUse:0, fightLength:120,
            statHaste:0, statCrit:0, statVers:0,
            statMastery:0, statInt:0,simMode:"infiniteRSK" },
        chartData: {},
        chartDataMana: {},
        chartDataDamage: {},
        chartDataHeal: {},
        chartDataHaste: {},
        buffs: [{stat:"haste",increase:40,ppm:2,duration:7,lastproc:0,proc:60/2,procced:0},{stat:"haste",increase:20,ppm:3,duration:6,lastproc:0,proc:60/3,procced:0}],
    },
    mutations: {
        setData(state, newData) {
            state.remSetting = newData
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
        }
    },
    actions: {
    },
    modules: {
    }
})
