export default {
    data() {
        return {
            chartOptionsRems:  {
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
            },
            chartOptionsHaste :{
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
                        },
                        gridLines: {
                            color: '#555'
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Haste'
                        }
                    }]
                }
            },
            chartOptionsDamage: {
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
                        },
                        gridLines: {
                            color: '#555'
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Damage'
                        }
                    }]
                }
            },
            chartOptionsHeal:  {
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
                        },
                        gridLines: {
                            color: '#555'
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Heal'
                        }
                    }]
                }
            },
            chartOptionsMana: {
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
            },
            chartOptionsRaidHp: {
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
                        id:"A",
                        position: "left",
                        display: true,
                        gridLines: {
                            color: '#555'
                        },
                        ticks: {
                            suggestedMin: 0,
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Raid Health'
                        }
                    },{
                        id:"B",
                        position: "right",
                        display: true,
                        ticks: {
                            suggestedMin: 0,
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Boss Health'
                        }

                    }]
                }
            }, chartOptionsStacked: {
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
                        scaleLabel: {
                            display: true,
                            labelString: 'Heal'
                        },
                        stacked: true,
                        gridLines: {
                            color: '#555'
                        },
                    }]
                }
            }




        }
    }
}
