<script>
     import { Line} from 'vue-chartjs'

    export default {
        name: "Chart",
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
                                beginAtZero: true,
                                callback: function (value) {
                                    if (value % 1 === 0) {
                                        return value;
                                    }
                                },
                            },
                            gridLines: {
                                color: '#555'
                            },
                            scaleLabel: {
                                display: true,
                                labelString: 'Rems'
                            }
                        }]
                    }


                }
            }
        },
        watch: {
            '$store.state.chartData': function() {
                this.chartData = this.$store.state.chartData
                this.renderChart(this.chartData,this.options)
            }
        }
    }

</script>

<style scoped>

</style>