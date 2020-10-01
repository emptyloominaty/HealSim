export default {
    data() {
        return {
        }
    },
    methods: {
        simulate(settings) {
            let buffs = this.$store.state.buffs

            let mode = settings.simMode
            let tftUseOn = settings.tftUse
            let timeline=[]
            let rems = 0
            let time = 0
            let gcd = 1.5 / (1 + (settings.statHaste / 100))
            let currentHaste = 0
            let currentVers = 0
            let currentCrit = 0
            let currentInt = 0
            let currentMastery = 0
            let spellpower = 0
            let masteryHeal = 0
            let rmHeal = 0
            let remHeal = 0
            let rem = [[]]
            let usedAbility = ""
            let mana = 100

            let gcdUsed = 0

            let manaUsed = 0
            let damageDone = 0
            let healingDone = 0


            //---------CONFIG--------
            //rsk
            let rskManaCost = 1.5
            let rskCdDefault = 12
            let rskCd = rskCdDefault / (1 + (settings.statHaste / 100))
            let rskOnCd = rskCdDefault  / (1 + (settings.statHaste / 100))
            let rskExtend = 4
            let rskDamage = 0
            //rem
            let remManaCost = 2.2
            let remCd = 9
            let remOnCd = 9
            let remDuration = 20
            let remChargesMax = 2
            let remCharges = 2
            let remMaxDuration = remDuration * settings.extendRem
            //tft
            let tftCd = 30
            let tftOnCd = 30
            let tftRsk = 9 / (1 + (settings.statHaste / 100))
            let tftRem = 0.5
            let tftUsed = 0
            //blackout kick
            let bkOnCd = 3 / (1 + (settings.statHaste / 100))
            let bkCd = 3 / (1 + (settings.statHaste / 100))
            let totm = 0
            let maxTotm = 3
            let bkDamage = 0
            //tiger palm
            let tpDamage = 0
            //-----------------------

            //---------Loop--------------------------------------------------------
            for (let i=0; i<(settings.fightLength*2); i++) {
                if (time>settings.fightLength) {
                    break;
                }
                currentHaste = settings.statHaste
                currentVers = settings.statVers
                currentCrit = settings.statCrit
                currentMastery = settings.statMastery
                currentInt = settings.statInt

                //--------BUFFS---------- {stat:"haste",increase:20,ppm:2,duration:6,lastproc:0,proc:60/2,procced:0}
                if (buffs.length > 0) {
                    for (let b=0; b<buffs.length; b++) {
                        buffs[b].lastproc+=1*gcd
                        //---------------------------
                        if (buffs[b].lastproc>buffs[b].proc) {
                            buffs[b].lastproc = 0
                            buffs[b].procced = buffs[b].duration
                        }
                        //---------------------------
                        if (buffs[b].procced>0) {
                            switch(buffs[b].stat) {
                                case "haste":
                                    currentHaste=+currentHaste + +buffs[b].increase
                                    break;
                                case "vers":
                                    currentVers=+currentVers + +buffs[b].increase
                                    break;
                                case "mastery":
                                    currentMastery=+currentMastery + +buffs[b].increase
                                    break;
                                case "crit":
                                    currentCrit=+currentCrit + +buffs[b].increase
                                    break;
                                case "int":
                                    currentInt=+currentInt + +buffs[b].increase
                                    break;
                            }
                            buffs[b].procced--
                        }
                        //---------------------------
                    }
                }
                //-----------------------
                spellpower = ((currentInt*1.443)*(1+(currentVers/100)))
                masteryHeal = ((spellpower)*(currentMastery/100))

                    /*----Crit----- */
                if (currentCrit>100) {
                    currentCrit = 100
                }
                let critChance = (Math.random()*100)
                if (critChance < currentCrit) {
                    spellpower = spellpower * 2
                    masteryHeal = masteryHeal * 2
                }




                rmHeal = (spellpower * 0.2)
                remHeal = ((spellpower * 1.61) * (1 + (currentHaste / 100)) / 20)

                rskDamage = spellpower * 1.433
                bkDamage = spellpower * 0.56
                tpDamage = spellpower * 0.19


                usedAbility = "none"
                tftUsed = 0
                gcdUsed = 0
                healingDone = 0
                damageDone = 0
                // ---------- CDs
                    rskCd = rskCdDefault / (1 + (currentHaste / 100))
                    gcd = 1.5 / (1 + (currentHaste / 100))
                    tftRsk = 9 / (1 + (currentHaste / 100))
                    bkCd = 3 / (1 + (currentHaste / 100))

                if (gcd<0.75) {
                    gcd = 0.75
                }
                //-----CDs-----
                if (rskOnCd<rskCd) {
                    rskOnCd+=gcd
                }
                if (bkOnCd<bkCd) {
                    bkOnCd+=gcd
                }
                if (tftOnCd<tftCd) {
                    tftOnCd+=gcd
                }

                if (remOnCd<remCd) {
                    remOnCd+=gcd

                    if (remCharges<remChargesMax && remOnCd>=remCd) {
                        remCharges++
                        remOnCd=remCd
                    }
                }
                if (mana<100) {
                    mana += 0.8
                }
                if (mana>100) {
                    mana=100
                }
                if (rems>0) {
                    //Healing
                    healingDone+=remHeal * rems
                    //-------
                    for (let a = 0; a < rem.length; a++) {
                        rem[a][0] -= gcd
                        if (rem[a][0]<0) {
                            rems--
                            rem.splice(a, 1);
                            rem = rem.filter(function(val){return val});
                        }
                    }
                }
                time += gcd
                //------Use Ability-------
                if (gcdUsed===0) {
                    gcdUsed=1
                    abilityLoop: if (remCharges>0 && rems<20) {                 //REM----------------------------
                        remOnCd=0
                        remCharges--
                        manaUsed += remManaCost
                        mana -= remManaCost
                        rems+=1
                        let remDuration2 = remDuration
                        let remMaxDuration2 = remMaxDuration
                        usedAbility = "rem"
                        healingDone += masteryHeal
                        //Thunder Focus Tea
                        if (tftOnCd>=tftCd && tftUseOn==0) {
                            remDuration2 = remDuration2 + tftRem
                            remMaxDuration2 = (remDuration2 * (1+tftRem)) * (settings.extendRem)
                            tftOnCd = 0
                            tftUsed = 1
                        }
                        if (mode!=="infiniteRSK") {
                            rem.push([remDuration2, remMaxDuration2])
                        } else {
                            rem.push([remMaxDuration2*2, 0])
                        }
                    }else if (rskOnCd>=rskCd) {                 //RSK-------------------------------
                        if (mode==="infiniteRSK") {
                            break abilityLoop;
                        }
                        rskOnCd=0
                        usedAbility = "rsk"
                        damageDone += rskDamage
                        //Thunder Focus Tea
                        if (tftOnCd >= tftCd && tftUseOn==1) {
                            rskOnCd = tftRsk
                            tftOnCd = 0
                            tftUsed = 1
                        }
                        manaUsed += rskManaCost
                        mana -= rskManaCost
                        healingDone += rmHeal * rems
                        if (rems>0) {
                            for (let a = 0; a < rem.length; a++) {
                                if (rem[a][1]>0) {
                                    if(rem[a][1]>4) {
                                        rem[a][0] += rskExtend
                                        rem[a][1] -= rskExtend
                                    } else {
                                        rem[a][0] += rem[a][1]
                                        rem[a][1] = 0
                                    }
                                }
                            }
                        }
                    } else if (mode==="realGameSim") {
                        if (bkOnCd>=bkCd && (rskCd/rskOnCd) > 1.33) {   //BLACKOUT KICK --------
                            usedAbility = "bk"
                            bkOnCd=0
                            let resetChance = (Math.random()*100)
                            if (resetChance < 15 * (1 + totm)) {
                                rskOnCd = rskCd
                            }
                            damageDone += bkDamage * (1+totm)
                            totm = 0

                        } else {                                        //TIGER PALM------------
                            usedAbility = "tp"
                            damageDone += tpDamage
                            if (totm<maxTotm) {
                                totm++
                            }
                        }
                    }

                }
                //------------------------

                timeline[i] = {id:i,time:time.toFixed(1),rems:rems,mana:mana,manaUsed:manaUsed,usedAbility:usedAbility,tftUsed:tftUsed,damageDone:damageDone.toFixed(0),healingDone:healingDone.toFixed(0),haste:currentHaste}
            }
            //--------End of Loop-------------------------------------------------
            this.generateChartData(timeline,"rems","ReMs","setChartData","#78f871",0)
            this.generateChartData(timeline,"mana","Mana","setChartDataMana","#6edcf8",0.4)
            this.generateChartData(timeline,"damageDone","Damage","setChartDataDamage","#ce383e",0.4)
            this.generateChartData(timeline,"healingDone","Heal","setChartDataHeal","#05c300",0.5)
            this.generateChartData(timeline,"haste","Haste","setChartDataHaste","#a800c3",0.5)
            return timeline
        },
        generateChartData(timeline,name,nameLabel,store,lineColor,lineTension) {
            let labels = []
            let data = []
            for (let i=0; i<timeline.length ; i++) {
                labels.push(timeline[i].time)
                data.push(timeline[i][name])
            }

            let chartdata = {
                labels: labels,
                    datasets: [
                    {
                        label: nameLabel,
                        fontColor: '#ffffff',
                        borderColor: lineColor,
                        data: data,
                        pointRadius: 4,
                        lineTension:lineTension,
                        pointHoverRadius: 7,
                    }
                ]
            }
            this.$store.commit(store,chartdata)
        }
    }
}