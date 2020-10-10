<template>
    <div>
        <ul>
            <li v-for="item in text" v-bind:key="item.id" v-html="item" ></li>
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
    li {
        margin:10px;
        color: #ddd;
        text-align:left;
        font-size:15px;
        border-bottom: 1px solid #333;
    }

  </style>