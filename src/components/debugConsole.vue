<template>
    <div>
        <ul v-for="item in text" v-bind:key="item.id">
            <li>{{item}}</li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: "debugConsole",
        data() {
            return {
                text: ["test","test","test"]
            }
        },
        watch: {
            '$store.state.db': function () {
                this.text = this.$store.state.db
            }
        }
    }

</script>

<style scoped>
    div {
        margin-top: -30px;
    }
    ul {
        margin:10px;
    }
    li {
        color: #ddd;
        text-align:left;
        font-size:14px;
    }
</style>