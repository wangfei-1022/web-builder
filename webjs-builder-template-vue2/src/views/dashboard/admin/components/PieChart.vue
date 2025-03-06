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
      default: '300px'
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.initChart()
    this.__resizeHandler = debounce(() => {
      if (this.chart) {
        this.chart.resize()
      }
    }, 100)
    window.addEventListener('resize', this.__resizeHandler)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    window.removeEventListener('resize', this.__resizeHandler)
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: ['整箱', '自拼箱', '委托拼箱', 'Buyer Consol', '散杂货', '项目']
        },
        calculable: true,
        series: [
          {
            name: '整拼类型',
            type: 'pie',
            roseType: 'radius',
            radius: [15, 95],
            center: ['50%', '38%'],
            data: [
              { value: 179, name: '整箱', itemStyle: { color: '#36a3f7' }},
              { value: 130, name: '自拼箱', itemStyle: { color: '#2ec7c9' }},
              { value: 93, name: '委托拼箱', itemStyle: { color: '#b6a2de' }},
              { value: 54, name: 'Buyer Consol', itemStyle: { color: '#5ab1ef' }},
              { value: 33, name: '散杂货', itemStyle: { color: '#ffb980' }},
              { value: 14, name: '项目', itemStyle: { color: '#d87a80' }}
            ],
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      })
    }
  }
}
</script>
