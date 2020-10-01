<script>
    import { Line} from 'vue-chartjs'

    export default {
        name: "ChartMana",
        extends: Line,
        data() {
            return {
                chartdata: {
                    labels: [0],
                    datasets: [
                        {
                            label: '',
                            fontColor: '#ffffff',
                            borderColor: '#92f871',
                            data: [0]
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    legend: { labels: {fontColor:'#fff'}},
                    scales: {
                        xAxes: [{
                            display: true,
                            gridLines: {
                                color: '#555'
                            },
                            scaleLabel: {
                                display: true,
                                labelString: 'Time'
                            }
                        }],
                        yAxes: [{
                            display: true,
                            ticks: {
                                suggestedMin: 0,
                                suggestedMax: 100,
                               // beginAtZero: true,
                            },
                            gridLines: {
                                color: '#555'
                            },
                            scaleLabel: {
                                display: true,
                                labelString: 'Mana'
                            }
                        }]
                    }


                }
            }
        },
        watch: {
            '$store.state.chartDataMana': function() {
                this.chartData = this.$store.state.chartDataMana
                this.renderChart(this.chartData,this.options)
            }
        }
    }

</script>

<style scoped>

</style>