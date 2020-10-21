<template>
    <section>
        <button v-on:click="addTime()">{{ data[selectT].time }} sec</button>
        <button v-on:click="backwards()">◀</button>
        <button v-on:click="stop()">⏹</button>
        <button v-on:click="pause()">⏸</button>
        <button v-on:click="play()">▶</button>
        <input type="number"  v-model="speed">
        <div class="flex">
            <div class="mainDiv" v-for="item in data[selectT].targets" :key="item.id" >
                <p>{{ item.name }} {{ " - ("+item.type+") " }}</p>
                <div> {{ Math.round(item.health/10)/100 +"k / "+ item.maxHealth/1000+" k " }} </div>

                <!-- HEALTH BAR -->
                <div class="healthBar">
                    <div class="health" v-bind:class="{redHealth: item.health/item.maxHealth<0.25, orangeHealth: item.health/item.maxHealth<0.4,
                     yellowHealth: item.health/item.maxHealth<0.6,lightGreenHealth: item.health/item.maxHealth<0.8, greenHealth: item.health/item.maxHealth>=0.8}"
                         :style="{ width: 150/(item.maxHealth/item.health) + 'px' }" > </div>
                </div>

                <!-- HOTS -->
                <div class="hots">
                    <div class="hot" v-for="hot in item.hots" :key="hot.id">
                        <img width="32" height="auto"  :src="'/img/'+hot.name.replace(/\s+/g,'')+'.jpg'">
                        <span class="hotDuration">{{hot.duration.toFixed(0)}}</span>
                        <div class="tooltip">
                            {{ hot.name }}
                            ({{ Math.round(hot.heal) + " over " + Math.round(hot.maxDuration)+"s"}})
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
    export default {
        name: "healSimTargets",
        props: ["data"],
        data() {
            return {
                selectT: 0,
                speed: 125,
                interval: 0,
                interval2: 0
            }
        },
        methods: {
            addTime() {
                clearInterval(this.interval)
                clearInterval(this.interval2)
                if (this.selectT<this.data.length-1) {
                    this.selectT++
                }
            },
            play() {
                clearInterval(this.interval)
                clearInterval(this.interval2)
               this.interval = setInterval(() => {
                   if (this.selectT<this.data.length-1) {
                       this.selectT++
                   }
               }, this.speed);
            },
            pause() {
                clearInterval(this.interval)
                clearInterval(this.interval2)
            },
            backwards() {
                clearInterval(this.interval)
                clearInterval(this.interval2)
                this.interval2 = setInterval(() => {
                    if (this.selectT>0) {
                        this.selectT--
                    }
                }, this.speed);
            },
            stop() {
                clearInterval(this.interval)
                clearInterval(this.interval2)
                this.selectT=0
            }
        }
    }
</script>

<style scoped>
    * {
     color: #fff
    }
    input {
        margin:10px 2px 10px 2px;
        color: #000;
        height: 24px;
    }
    button {
        margin:10px 2px 10px 2px;
        padding:5px;
        color: #000;
    }
    .flex {
        display:flex;
        flex-wrap: wrap;
    }

    .mainDiv {
        min-width: 150px;
        border: 1px solid #000;
        padding:5px;
        margin-right:-1px;
    }
    .hot {
        width:32px;
    }

    .hots {
        display:flex;
        flex-wrap: wrap;
        justify-content: center;
        text-align:center;
    }
    .hotDuration {
        position:relative;
        top:-30px;
        font-size:18px;
        font-weight:600;
        text-shadow:
        -1px -1px 0 #000,
        1px -1px 0 #000,
        -1px 1px 0 #000,
        1px 1px 0 #000;
    }

    /*------Tooltip-------*/
    .tooltip {
        visibility: hidden;
        position:absolute;
        margin-left:-100px;
        margin-top:-25px;
        border: 1px solid rgba(0,0,0,0.3);
        border-radius:5px;
        background-color:#fcfcfc;
        color: #000;
        z-index:1;
        padding:7px;
    }
    .hot:hover .tooltip {
        visibility: visible;
    }
    /*--------------------*/

    .healthBar {
        margin-top:5px;
        width:150px;
        height:16px;
        border:1px solid#fff;
    }
    .health {
        height:16px;
        background-color: #00c5d5;
    }
    /*---- HEALTH ----*/
    .greenHealth {
        background-color: #00e200;
    }
    .lightGreenHealth {
        background-color: #8aff31;
    }
    .yellowHealth {
        background-color: #ffff00;
    }
    .orangeHealth {
        background-color: #ff9900;
    }
    .redHealth {
        background-color: #ff0000;
    }


</style>