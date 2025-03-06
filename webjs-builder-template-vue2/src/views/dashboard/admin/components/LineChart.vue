<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import { debounce } from '@/utils'

export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null,
      sidebarElm: null
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  mounted() {
    this.initChart()
    if (this.autoResize) {
      this.__resizeHandler = debounce(() => {
        if (this.chart) {
          this.chart.resize()
        }
      }, 100)
      window.addEventListener('resize', this.__resizeHandler)
    }

    // 监听侧边栏的变化
    this.sidebarElm = document.getElementsByClassName('sidebar-container')[0]
    this.sidebarElm && this.sidebarElm.addEventListener('transitionend', this.sidebarResizeHandler)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    if (this.autoResize) {
      window.removeEventListener('resize', this.__resizeHandler)
    }

    this.sidebarElm && this.sidebarElm.removeEventListener('transitionend', this.sidebarResizeHandler)

    this.chart.dispose()
    this.chart = null
  },
  methods: {
    sidebarResizeHandler(e) {
      if (e.propertyName === 'width') {
        this.__resizeHandler()
      }
    },
    setOptions({ SeaExport, SeaImport, AirExport, AirImport } = {}) {
      this.chart.setOption({
        xAxis: {
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          data: ['SeaExport', 'SeaImport', 'AirExport', 'AirImport']
        },
        series: [{
          name: 'SeaExport', itemStyle: {
            normal: {
              color: '#36a3f7',
              lineStyle: {
                color: '#36a3f7',
                width: 2
              }
            }
          },
          smooth: true,
          type: 'line',
          data: SeaExport,
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        }, {
          name: 'SeaImport',
          smooth: true,
          type: 'line',
          itemStyle: {
            normal: {
              color: '#f4516c',
              lineStyle: {
                color: '#f4516c',
                width: 2
              }
            }
          },
          data: SeaImport,
          animationDuration: 2800,
          animationEasing: 'quadraticOut'
        }, {
          name: 'AirExport',
          smooth: true,
          type: 'line',
          itemStyle: {
            normal: {
              color: '#b6a2de',
              lineStyle: {
                color: '#b6a2de',
                width: 2
              }
            }
          },
          data: AirExport,
          animationDuration: 2800,
          animationEasing: 'quadraticOut'
        }, {
          name: 'AirImport',
          smooth: true,
          type: 'line',
          itemStyle: {
            normal: {
              color: '#ffb980',
              lineStyle: {
                color: '#ffb980',
                width: 2
              }
            }
          },
          data: AirImport,
          animationDuration: 2800,
          animationEasing: 'quadraticOut'
        }]
      })
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    }
  }
}
</script>
