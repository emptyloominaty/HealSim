/* eslint-disable */

export default {
    methods: {
        storeData(data,saveThis) {
            localStorage.setItem(saveThis, JSON.stringify(data))
        },
        loadData(loadThis) {
            let data = localStorage.getItem(loadThis)
            data = JSON.parse(data)
            return data

        },
    }
}