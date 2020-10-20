<template>
    <div>
        <button v-on:click="reloadLmao()">Reload (TEST)</button>
    </div>
</template>

<script>
    import main from "../mixins/sim/main";

    export default {
        name: "healSimTimeline",
        mixins:[main],
        data() {
            return {
                testData: this.mainSim()
            }
        },
        methods: {
            reloadLmao() {
                this.mainSim()
            }
        }
    }
</script>

<style scoped>
    button {
        font-size:26px;
        margin-bottom:8px;
    }
</style>