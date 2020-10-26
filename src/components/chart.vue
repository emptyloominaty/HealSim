<script>
    import { Line} from 'vue-chartjs'

    export default {
        name: "Chart",
        extends: Line,
        props: ["chartData","options"],
        data() {
            return {
            }
        },
        watch: {
            chartData: function() {
                this.renderChart(this.chartData,this.options)
            }
        }
    }

</script>

<style scoped>
</style>