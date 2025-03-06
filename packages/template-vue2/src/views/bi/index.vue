<template>
  <div class="v2">
    <el-row class="content">
      <!--左侧部分-->
      <el-col :span="16" class="content-left">
        <!--左上-->
        <div class="content-left-data border-light">
          <div class="left-item-show" v-for="(item, index) in adsDshYesterdayOrderInfos" :key="index">
            <div :class="'item ' + item.code" v-if="item.code != 'OVL' && item.code != 'FBA'">
              <div class="title">
                <span :class="'title-icon ' + item.code"></span>
                <span>{{item.businessType}}</span>
              </div>
              <div class="number"><span class="num">{{item.teuYesterday}}</span><span class="unit">{{item.unit}}</span></div>
              <div :class="'persent ' + getArrow(item.d2dRate)">
                <span>周环比：</span><span>{{item.persentRate}}</span>
                <img class="icon-arrow" src="@/assets/bi/icon_down.png" v-if="item.d2dRate < 0"/>
                <img class="icon-arrow" src="@/assets/bi/icon_up.png" v-if="item.d2dRate > 0"/>
                <div class="icon-arrow" v-if="item.d2dRate === 0">-</div>
              </div>
            </div>
            <div :class="'item ' + item.code" v-else>
              <div class="title">
                <span :class="'title-icon ' + item.code"></span>
                <span>{{item.businessType}}</span>
              </div>
              <el-row>
                <el-col :span="12" class="business-col" v-for="(target, index) in item.children" :key="index">
                  <div class="business-part">
                    <div class="number"><span class="num">{{target.teuYesterday}}</span><span class="unit">{{target.unit}}</span></div>
                    <div :class="'persent ' + getArrow(target.d2dRate)">
                      <span>周环比：</span><span>{{target.persentRate}}</span>
                      <img class="icon-arrow" src="@/assets/bi/icon_down.png" v-if="target.d2dRate < 0"/>
                      <img class="icon-arrow" src="@/assets/bi/icon_up.png" v-if="target.d2dRate > 0"/>
                      <div class="icon-arrow" v-if="target.d2dRate === 0">-</div>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
        <!--左下-->
        <div class="content-left-map">
          <div class="map">
            <img src="@/assets/bi/BG_Map.png" style="width: 100%"/>
            <div v-for="(item, index) in adsOvlWarehouseDetails" :key="index">
              <div :class="'circle-point ' + (index === activeDetailAddressSeq ? 'active' : '')" :style="{ 'left': item.left , 'top': item.top }">
                <div class="circle-point-by-line" ></div>
                <div class="circle-dia">
                  <div class="dia-p">
                    <el-row class="dia-p-row dia-p-row-full">
                      <!-- <span class="warehouse-icon"></span> -->
                      {{item.warehouseName}}
                    </el-row>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-buttom">
              <div class="bg-buttom-container">
                <div class="bg-buttom-item" v-for="(item, index) in adsDshYesterdaySecondOrderInfos" :key="index">
                  <span class="channel">{{item.proTypeRank}}</span>
                  <span class="num">{{item.teuYesterday}}{{item.unit}}</span>
                  <span :class="'persent ' + getArrow(item.d2dRate)">
                    <span>{{item.persentRate}}</span>
                    <img class="icon-arrow" src="@/assets/bi/icon_down.png" v-if="item.d2dRate < 0"/>
                    <img class="icon-arrow" src="@/assets/bi/icon_up.png" v-if="item.d2dRate > 0"/>
                    <div class="icon-arrow" v-if="item.d2dRate === 0">-</div>
                  </span>
                </div>
              </div>
            </div>
        </div>
      </el-col>
      <!--右侧部分-->
      <el-col :span="8" class="content-right">
        <div class="content-right-data-p1 border-light">
          <img src="@/assets/bi/Title_top.png"  class="right-img" style="margin-top: 0px;margin-bottom: 9px;"/>
          <div class="item" v-for="(item, index) in adsDshMonthOrderInfos" :key="index">
            <div class="title">
              <span :class="'title-icon ' + item.code"></span>
              <span>{{item.businessType}}</span>
            </div>
            <div class="number">
              <span class="num">{{item.teuYesterday | numberToThousands(false)}}</span>
              <span class="unit">{{item.unit}}</span>
            </div>
          </div>
        </div>
        <div class="content-right-data-p2 border-light">
          <el-row class='colee-scroll-container sp-row-sp' style="height: 276px; overflow: hidden;">
            <el-col class='sp-row-col' :span="12">
              <img src="@/assets/bi/Title_right_01.png"  class="right-img"/>
              <div id="TJLJQ-1" class="news-right-cont colee-container customerList1">
                <ul id="TJLJQ-1-target">
                  <li v-for="(item, index) in customerList1" :key="index">
                      <span class='city-name'> {{item.qname}}</span>
                      <div class="city-p">
                        <el-progress :percentage="Number((item.pr1 * 100).toFixed(1))"></el-progress>
                      </div>
                  </li>
                </ul>
                <ul id="TJLJQ-1-copy"></ul>
              </div>
            </el-col>
            <el-col class='sp-row-col' :span="12">
              <img src="@/assets/bi/Title_right_02.png"  class="right-img"/>
              <div id="TJLJQ-2" class="news-right-cont colee-container customerList2">
                <ul id="TJLJQ-2-target">
                  <li v-for="(item, index) in customerList2" :key="index">
                      <span class='city-name'> {{item.finalSellerArea}}</span>
                      <div class="city-p">
                        <el-progress :percentage="Number((item.pr0 * 100).toFixed(1))"></el-progress>
                      </div>
                  </li>
                </ul>
                <ul id="TJLJQ-2-copy"></ul>
              </div>
            </el-col>
          </el-row>


          <el-row class="colee-scroll-container sp-row-sp">
            <el-col class='sp-row-col' :span="12">
              <img src="@/assets/bi/Title_right_03.png"  class="right-img"/>
              <div id="TJLJQ-3" class="news-right-cont colee-container customerList3">
                <ul id="TJLJQ-3-target">
                  <li v-for="(item, index) in customerList3" :key="index">
                      <span class='city-name'> {{item.finalSellerArea}}</span>
                      <div class="city-p">
                        <el-progress :percentage="Number((item.pr1 * 100).toFixed(1))"></el-progress>
                      </div>
                  </li>
                </ul>
                <ul id="TJLJQ-3-copy"></ul>
              </div>
            </el-col>
            <el-col class='sp-row-col' :span="12">
              <img src="@/assets/bi/Title_right_04.png"  class="right-img"/>
              <div id="TJLJQ-4" class="news-right-cont colee-container customerList4">
                <ul id="TJLJQ-4-target">
                  <li v-for="(item, index) in customerList4" :key="index">
                      <span class='city-name'> {{item.finalSellerArea}}</span>
                      <div class="city-p">
                       <el-progress :percentage="Number((item.pr0 * 100).toFixed(1))"></el-progress>
                      </div>
                  </li>
                </ul>
                <ul id="TJLJQ-4-copy"></ul>
              </div>
            </el-col>
          </el-row>

        </div>

      </el-col>
    </el-row>
  </div>
</template>
<script>
  import { getScreenV2Api } from '@/api/bi/bi'
  import * as echarts from 'echarts';
  import xy from './xy'
  import moment from 'moment'

  export default {
    name: 'BIV2',
    data() {
      return {
        eightTimer: null,
        adsDshYesterdayOrderInfos: [],
        adsDshMonthOrderInfos: [],
        customerAdsDshKpiInfos: [],
        adsOvlWarehouseDetails: [], // 海外仓+ 分公司
        activeDetailAddressSeq: 0,

        supplierAdsDshKpiInfos: [],
        adsDshYesterdaySecondOrderInfos: [],

        customerList1: [],
        customerList2: [],
        customerList3: [],
        customerList4: []
      }
    },
    created() {
      this.getData()
      this.intervalFixedPointTaskFn({
        timeFixedArr: ['08:00:00', '15:45:00'],
        delayTime: 60000
      })
    },
    methods: {
      format2(item) {
        return () => item.pr1.toFixed(0)
      },
      intervalFixedPointTaskFn({timeFixedArr = [], delayTime = 1000}, tickerFn) {
        let executed = true // true代表需要定时刷新的方法是否执行了,后面纵使在设定时间范围内也不执行自动刷新
        let timerFn = () => {
          console.log('timer...')
          let currentTime = new Date().getTime() // 当前时间
          let currentYMD = moment(currentTime).format('YYYY-MM-DD') // 当前年月日
          let refresh = false // 判断是否需要刷新
          // 判断是否在设定的时间范围内
          let count = 0 // 记录不在设定范围内的数量
          for (let i = 0; i < timeFixedArr.length; i++) {
            let item = timeFixedArr[i] // 固定的时分秒
            let setTime = new Date(`${currentYMD} ${item}`).getTime() // 完整时间
            if (currentTime >= setTime && currentTime <= setTime + delayTime) { // 没有刷新过且在设定时间范围内 - 刷新
              if (!executed) { // 只执行一次
                refresh = true
              }
              break
            } else {
              count++
            }
          }

          if (count === timeFixedArr.length) {
            executed = false
          }

          if (refresh) {
            executed = true
            console.log(`${moment(currentTime).format('YYYY-MM-DD HH:mm:ss')} 执行定时任务....`)
            this.getData()
          }

          this.eightTimer && clearTimeout(this.eightTimer) // 清除定时器
          this.eightTimer = setTimeout(() => {
            timerFn()
          }, delayTime)
        }
        this.eightTimer && clearTimeout(this.eightTimer) // 清除定时器
        this.eightTimer = setTimeout(() => {
          timerFn()
        }, delayTime)
      },
      getArrow(rate) {
        if (rate === 0) {
          return 'zero'
        }
        return rate > 0 ? 'up' : 'down'
      },
      getData() {
        let map = {
          '海运': 'SEA',
          '空运': 'AIR',
          '小包': 'PACKAGE',
          'FBA(整柜)': 'FBA',
          'FBA(拼箱)': 'FBA',
          'FBA': 'FBA',
          '海外仓': 'OVL',
          '海外仓(一件)': 'OVL',
          '海外仓(整柜)': 'OVL',
          '铁路&租箱': 'RAILWAY'
        }
        getScreenV2Api().then(res => {
          if (res.ok) {
            let arrOrder = [];
            res.content.adsDshYesterdayOrderInfos.forEach(v => {
               v.code = map[v.businessType]
               v.persentRate = (v.d2dRate * 100).toFixed(1) + '%'

               if (v.unit.indexOf('件') >= 0 || v.unit.indexOf('单') >= 0) {
                  v.teuYesterday = Number(v.teuYesterday).toFixed(0)
               } else {
                v.teuYesterday = Number(v.teuYesterday).toFixed(1)
               }

              if (v.code === 'OVL' || v.code === 'FBA') {
                let index = arrOrder.findIndex(item => item.code === v.code)
                if (index >= 0) {
                  arrOrder[index].children.push(v)
                } else {
                  let obj = {
                    ...v
                  }
                  v.children = [obj]
                  arrOrder.push(v)
                }
              } else {
                arrOrder.push(v)
              }
            })

            res.content.adsDshYesterdaySecondOrderInfos.forEach(v => {
               v.code = map[v.businessType]
               v.persentRate = (v.d2dRate * 100).toFixed(1) + '%'

               if (v.unit.indexOf('件') >= 0 || v.unit.indexOf('单') >= 0) {
                  v.teuYesterday = Number(v.teuYesterday).toFixed(0)
               } else {
                v.teuYesterday = Number(v.teuYesterday).toFixed(1)
               }
            })

            res.content.adsDshMonthOrderInfos.forEach(v => {
              v.code = map[v.businessType]
              v.persentRate = (v.m2mRate * 100).toFixed(0) + '%'

              if (v.unit.indexOf('件') >= 0 || v.unit.indexOf('单') >= 0) {
                v.teuYesterday = Number(v.teuYesterday).toFixed(0)
              } else {
                v.teuYesterday = Number(v.teuYesterday).toFixed(1)
              }
            })

            let arr = []
            res.content.adsOvlWarehouseDetails.forEach(v => {
              let index = xy.findIndex(item => item.detailAddress && item.detailAddress.replace(/\s*/g, "") === (v.detailAddress || '').replace(/\s*/g, ""))

              if (index >= 0) {
                v.left = xy[index].left
                v.top = xy[index].top
                arr.push(v)
              }
            })

            let customerList1 = []
            let customerList2 = []
            let customerList3 = []
            let customerList4 = []
            res.content.adsDshKpiInfos.forEach(v => {
              if (v.qtype === '收入贡献_业务线') {
                customerList1.push(v)
              }
              if (v.qtype === '客户数_业务线') {
                customerList2.push(v)
              }
              if (v.qtype === '收入贡献_区域') {
                customerList3.push(v)
              }
              if (v.qtype === '客户数_区域') {
                customerList4.push(v)
              }
            })

            this.customerList1 = customerList1
            this.customerList2 = customerList2
            this.customerList3 = customerList3
            this.customerList4 = customerList4

            this.adsDshYesterdayOrderInfos = arrOrder
            this.adsDshMonthOrderInfos = res.content.adsDshMonthOrderInfos
            this.customerAdsDshKpiInfos = res.content.customerAdsDshKpiInfos
            this.adsDshYesterdaySecondOrderInfos = res.content.adsDshYesterdaySecondOrderInfos
            this.adsOvlWarehouseDetails = arr

            this.supplierAdsDshKpiInfos = res.content.supplierAdsDshKpiInfos

            this.mapTimer() // 地图上的轮转
            // this.renderChart() // 块状图的渲染

            this.$nextTick(() => {
              this.customer3Timer() // 活跃客户的轮转
              this.customer4Timer() // 活跃客户的轮转
              // this.customer2Timer() // 业务线
              this.customer1Timer() // 业务线
            })
          }
        })
      },
      renderChart() {
        let chartDom = document.getElementById('main');
        let myChart = echarts.init(chartDom);
        let option;

        option = {
          // legend: {
          //   top: 'bottom'
          // },
          toolbox: {
            show: false,
            feature: {
              mark: { show: true },
              dataView: { show: true, readOnly: false },
              restore: { show: true },
              saveAsImage: { show: true }
            }
          },
          series: [
            {
              name: 'Nightingale Chart',
              type: 'pie',
              radius: [0, 100],
              center: ['50%', '50%'],
              roseType: 'radius',
              data: [
                // { value: 40, name: 'rose 1' },
                // { value: 38, name: 'rose 2' },
                // { value: 32, name: 'rose 3' },
                // { value: 30, name: 'rose 4' },
                // { value: 28, name: 'rose 5' },
                // { value: 26, name: 'rose 6' },
                // { value: 22, name: 'rose 7' },
                // { value: 18, name: 'rose 8' }
              ],
              label: {
                color: '#6fb6ff'
              },
              labelLine: {
                lineStyle: {
                  color: '#6fb6ff'
                },
                smooth: 0.2,
                length: 10,
                length2: 20
              },
              itemStyle: {
                borderRadius: 24,
                normal: {
                  color: function (colors) {
                    let colorList = [
                      '#00e3ff',
                      '#00c7ff',
                      '#0095ff',
                      '#f9a934',
                      '#0059fb',
                      '#133c99'
                    ];
                    return colorList[colors.dataIndex];
                  }
                },
                shadowBlur: 200,
                shadowColor: '#174163'
              },
              animationType: 'scale',
              animationEasing: 'elasticOut',
              animationDelay: function (idx) {
                return Math.random() * 200;
              }
            }
          ]
        };

        this.supplierAdsDshKpiInfos.forEach(v => {
          option.series[0].data.push({
            value: v.pr1,
            name: v.finalSellerArea + ' ' + Number(v.pr0 * 100).toFixed(1) + '%'
          })
        })

        option && myChart.setOption(option);
      },
      mapTimer() {
        let addressTimer = null
        let changeAddress = () => {
          this.activeDetailAddressSeq++
          if (this.activeDetailAddressSeq > this.adsOvlWarehouseDetails.length) {
            this.activeDetailAddressSeq = 0
          }
          clearTimeout(addressTimer)
          addressTimer = setTimeout(changeAddress, 10000)
        }
        addressTimer = setTimeout(changeAddress, 10000)
      },
      // 业务线收入贡献
      customer1Timer() {
        let targetContainer = document.getElementById("TJLJQ-1-target");
        let copyContainer = document.getElementById("TJLJQ-1-copy");
        let allContainer = document.getElementById("TJLJQ-1");
        this.customerScrollTimer(allContainer, targetContainer, copyContainer)
      },
      // 业务线收入贡献
      customer2Timer() {
        let targetContainer = document.getElementById("TJLJQ-2-target");
        let copyContainer = document.getElementById("TJLJQ-2-copy");
        let allContainer = document.getElementById("TJLJQ-2");
        this.customerScrollTimer(allContainer, targetContainer, copyContainer)
      },
      customer3Timer() {
        let targetContainer = document.getElementById("TJLJQ-3-target");
        let copyContainer = document.getElementById("TJLJQ-3-copy");
        let allContainer = document.getElementById("TJLJQ-3");
        this.customerScrollTimer(allContainer, targetContainer, copyContainer)
      },
      customer4Timer() {
        let targetContainer = document.getElementById("TJLJQ-4-target");
        let copyContainer = document.getElementById("TJLJQ-4-copy");
        let allContainer = document.getElementById("TJLJQ-4");
        this.customerScrollTimer(allContainer, targetContainer, copyContainer)
      },
      customerScrollTimer(allContainer, targetContainer, copyContainer, speed) {
        let timer = null
        speed = speed || 50 // 速度数值越大速度越慢
        // if(targetContainer.offsetHeight <= allContainer.offsetHeight) {
        //   return
        // }
        copyContainer.innerHTML = targetContainer.innerHTML
        function Marquee3() {
          if (copyContainer.offsetHeight + targetContainer.offsetHeight - allContainer.scrollTop - allContainer.clientHeight <= 0) {
            allContainer.scrollTop = 0
          } else {
            allContainer.scrollTop++
          }
          clearTimeout(timer)
          timer = setTimeout(Marquee3, speed)
        }
        timer = setTimeout(Marquee3, speed)
        allContainer.onmouseover = function () {clearTimeout(timer)}
        allContainer.onmouseout = function () {timer = setTimeout(Marquee3, speed)}
      }
    }
  }
</script>
<style lang="scss" scoped>
.v2 {
  background: rgb(28,38,65);
  background-image: url('../../assets/bi/BG_Top.jpg');
  // height: 285px;
  background-position: top;
  background-repeat: no-repeat;
  // background-size: contain;
  padding-top: 80px;
}

@keyframes move {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
}

.bg-buttom {
  overflow:hidden;
  height: 62px;
  line-height: 62px;
  background-image: url('../../assets/bi/BG_bottom.png');
  background-position: top;
  background-repeat: no-repeat;
  width: 836px;
  position: absolute;
  bottom: 0px;
  left: 50%;
  margin-left: -418px;

  .bg-buttom-container{
    position: relative;
		animation: move 300s linear infinite;
    padding-left: 20px;
    width: fit-content;
    align-items: center;
    box-sizing: border-box;
    word-break: break-all;
    white-space: nowrap;
  }
  .bg-buttom-item{
    display:inline-block;
    height: 100%;
    margin-right: 15px;
    font-size: 14px;

    .channel{
      color: #6fb6ff;
      margin-right: 10px;
    }
    .num{
      margin-right: 10px;
    }
    .icon-arrow{
      width: 20px;
      margin-top: 21px;
      float: right;
    }
  }
}

.content {
  color: white;
}

.border-light{
  border: 2px solid rgb(4,85,167);
  box-shadow: 1px 0px 20px 1px rgb(5,76,149);
  border-radius: 5px;
}
.PACKAGE{
  background-position: -5px -2px !important;
}
.SEA{
  background-position: -3px -73px !important;
}
.FBA{
  background-position: -3px -150px !important;
}
.AIR{
  background-position: -3px -112px !important;
}
.OVL{
  background-position: -4px -38px !important;
}
.RAILWAY{
   background-position: -4px -192px !important;
}

.up{
  color: #ffaa31
}
.down{
  color: #00f9be
}
.zero{
  color: #01d1ec;
}

.content-left {
  padding: 20px 10px 20px 20px;

  background-image: url('../../assets/bi/BG_Light.jpg');
  background-repeat: no-repeat;
  background-position: bottom;

  .content-left-data {
    padding: 25px 5px;
    height: 180px;
    overflow: hidden;

    .left-item-show:last-child .item{
      border-right: none;
    }
    .item.OVL, .item.FBA{
      width: 26%;
      padding: 0;
    }

    .item {
      width: 16%;
      float: left;
      text-align: left;
      padding: 0 13px;
      border-right: 1px solid rgb(7,101,181);

      .business-col{
        padding-left: 13px;

        .business-part{
          border-right: 1px solid rgba(7,101,181, 0.3);;
        }
      }

      .business-col:last-child{
         padding-right: 0px;
        .business-part{
          border-right: none;
        }
      }


      .title{
        text-align: center;
        height: 30px;
        line-height: 30px;
        color: #6fb6ff;
        font-weight: 600;
        font-size: 16px;

        .title-icon{
          background-image: url('../../assets/bi/icons.png');
          background-position: -10px -2px;
          background-repeat: no-repeat;
          width: 30px;
          height: 30px;
          display: inline-block;
          vertical-align: top;
        }
      }
      .number{
        margin: 18px 0;

        .num{
          font-size: 30px;
          font-family: 'digital';
          margin-right: 10px;
          text-shadow: 0 0 10px #01d1ec, 0 0 20px #01d1ec, 0 0 30px #01d1ec, 0 0 40px #01d1ec;
          color: #01d1ec;
        }
        .unit{
          color: rgb(4,179,208);
          font-size: 13px;
        }

      }
      .persent{
        overflow: hidden;
        line-height: 24px;
        font-size: 12px;

        span{
          float:left;
        }
        .icon-arrow{
          float: left;
          width: 16px;
          margin-left: 3px;
          margin-top: 4px;
        }
      }
    }
  }
}


.content-right {
  padding: 20px 20px 5px 10px;

  .content-right-data-p1{
    padding: 5px 0px 12px 0px;
    height: 180px;
    overflow: hidden;

    .item:nth-child(odd){
      border-right: 1px solid rgba(7,101,181, 0.3);
    }
    .item:nth-of-type(odd){
      border-right: 1px solid rgba(7,101,181, 0.3);
    }
    .item{
      display:flex;
      height: 32px;
      line-height: 32px;
      font-size: 12px;
      width: 50%;
      float: left;
      padding-left: 15px;

      .title{
        flex: 1;
        text-align: left;
        color: #6fb6ff;
        font-size: 12px;
        min-width: 95px;
        overflow: hidden;

        .title-icon{
          background-image: url('../../assets/bi/icons.png');
          background-position: -10px -2px;
          background-repeat: no-repeat;
          width: 30px;
          height: 30px;
          display: inline-block;
          vertical-align: top;
          zoom: 0.7;
          margin-top: 7px;
          margin-right: 3px;
        }
      }
      .number{
        flex: 1.6;
        display: flex;
        .num{
          flex: 2;
          text-align: center;
          color: rgb(2,203,229);
          margin-right: 10px
        }
        .unit{
          flex: 1;
          text-align: center;
          font-size: 12px;
          color:white;
          margin-right: 12px;
          min-width: 40px;
        }
      }

    }
  }
  .content-right-data-p2{
      padding: 10px ;
      margin-top: 8px;
  }
}

.colee-container{
  font-size:13px;
  color: #6fb6ff;
  touch-action:none;

  overflow: hidden;
  ul{
    margin: 0;
    padding: 0;
  }
  li{
    overflow: hidden;
    height: 30px;
  }
  .city-name{
    float: left;
    text-align: right;
    width: 75px;
    display: inline-block;
  }
  .city-p{
    padding-left: 85px;
  }
}

#TJLJQ-1, #TJLJQ-2{
  height: 220px;
}

.customerList1{
  .city-name{
    float: left;
    text-align: right;
    width: 90px;
    display: inline-block;
  }
   .city-p{
    padding-left: 100px;
  }
}


.customerList2{
  .city-name{
    float: left;
    text-align: right;
    width: 72px;
    display: inline-block;
  }
   .city-p{
    padding-left: 82px;
  }
}


#TJLJQ-3,
#TJLJQ-4{
  height: calc(100vh - 640px);
  font-size:13px;
  color: #6fb6ff;
  touch-action:none;
  overflow: hidden;
}

.customerList3{
  .city-name{
    float: left;
    text-align: right;
    width: 45px;
    display: inline-block;
  }
   .city-p{
    padding-left: 55px;
  }
}

.customerList4{
  .city-name{
    float: left;
    text-align: right;
    width: 72px;
    display: inline-block;
  }
   .city-p{
    padding-left: 82px;
  }
}

.right-img{
  width:80%;
  margin-left: 10%;
  margin-bottom: 10px;
  margin-top: 5px;
}

.content-right-data-p2 img{
  width:60%!important;
  margin-left: 20%;
}

.content-left-map{
  height: calc(100vh - 313px);
  padding-top: 30px;
  position: relative;
  overflow: hidden;
  background-size: 10px 10px;
}

.map{
  position: relative;

  .circle-point{
    position: absolute;
    width: 12px;
    height: 12px;
    // border-radius: 50%;
    // background-color: #01d1ec;
    background-image: url('../../assets/bi/icon_01.png');
    background-size: 10px 10px;
    background-repeat: no-repeat;
    cursor: pointer;

    .circle-point-by-line{
      display: none;
      width: 46px;
      height: 2px;
      position: absolute;
      top: -20px;
      left: -2px;
      // background: #1b7fe9;
      transform:rotate(120deg)
    }

    .circle-dia{
      z-index: 9999;
      display: none;
      min-width: 100px;
      position: absolute;
      top: -20px;
      left: 10px;
      // border: 2px solid #087cf1;
      padding: 8px;
      // background: rgba(0,0,0, 0.3);
      font-size: 16px;
      border-radius: 3px;

      .dia-p{
        background: rgba(16,138,227, 0.3);
        line-height: 35px;
        color: #6fb6ff;
        padding: 0 10px;
      }
      .dia-p-row-full{
        color: white;

        .warehouse-icon{
          background-image: url('../../assets/bi/icons.png');
          background-color: inherit;
          background-size: 100%;
          background-repeat: no-repeat;
          width: 30px;
          height: 30px;
          display: inline-block;
          background-position: -3px -24.5px !important;
          vertical-align: top;
        }
      }
      .dia-p-row{
        border-bottom: 1px solid #0765b5;
        overflow: hidden; //超出的文本隐藏
        text-overflow: ellipsis; //溢出用省略号显示
        white-space: nowrap;  // 默认不换行；
      }
      .dia-p-row:last-child{
        border-bottom: none;
      }
      .dia-p-col{
        border-right: 1px solid #0765b5;
        text-align: center;
        color: white;
      }
      .col-title{
          color: #6fb6ff;
      }
      .col-des{
          color: #01d1ec;
      }
      .dia-p-col:last-child{
        border-right: none;
      }
    }
  }
  .circle-point:before {
    content: '';
    display: block;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: #01d1ec;
    opacity: 0.7;
    animation: scale 2s infinite cubic-bezier(0,0,.49,1.02);
    animation-delay: 300ms
  }

  .circle-point.active{
    //  background-color: yellow;
     z-index: 10;
    background-image: url('../../assets/bi/icon_02.png');

     .circle-dia{
      display: block;
     }
     .circle-point-by-line{
      display: block;
     }
  }

  .circle-point.active:before{
     background-color: yellow;
  }


  @keyframes scale {
    0% {
      transform: scale(1)
    }

    50%,
    75% {
      transform: scale(3)
    }

    78%,
    100% {
      opacity: 0
    }
  }
}


::v-deep .el-progress-bar__outer{
  background-color: inherit;
  overflow: inherit;
}

::v-deep .el-progress__text{
  color: #ffaa31
}

::v-deep .el-progress-bar__inner{
  background: linear-gradient(to right, #1c2641, #01d1ec);
}

::v-deep .el-progress-bar__inner::after{
  display: inline-block;
  content: "";
  height: 100%;
  vertical-align: middle;
  width: 8px;
  height: 8px;
  position: absolute;
  right: 0;
  top: -1px;
  background: #01d1ec;
  box-shadow: 0px 0px 4px 2px #01d1ec;
  border-radius: 50%;
}

.sp-row-sp{
  border-bottom: 1px solid rgba(7,101,181,0.3);

  .sp-row-col{
    height: 100%;
    padding-right: 10px;
    border-right: 1px solid rgba(7,101,181,0.3);
  }
  .sp-row-col:last-child{
    padding-right: 0px;
    border-right: none;
  }
}

.sp-row-sp:last-child{
  border-bottom: none;
}

</style>
