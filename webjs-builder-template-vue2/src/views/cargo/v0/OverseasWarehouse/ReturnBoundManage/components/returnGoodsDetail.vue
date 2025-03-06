<template>
  <div>
    <lb-table stripe :column="columnData" :data="dataList"> </lb-table>
  </div>
</template>

<script lang="jsx">
export default {
    name: 'ReturnGoodsDetail',
    props: {
      dataList: Array
    },
    data() {
        return {
          columnData: [
            {
              label: this.$t('outInStorageManage.number'),
              width: 50,
              render: (h, { $index }) =>
                <div>
                  {
                    $index + 1
                  }
                </div>
            },
            {
              label: this.$t('goodsManagement.elecSkuCode'),
              minWidth: 120,
              prop: 'skuCode',
              showOverflowTooltip: true
            },
            {
              label: this.$t('outInStorageManage.theDelivery'),
              prop: 'quantity',
              showOverflowTooltip: true
            },
            {
              label: this.$t('outInStorageManage.length'),
              prop: 'length',
              showOverflowTooltip: true
            },
            {
              label: this.$t('outInStorageManage.width'),
              prop: 'width',
              showOverflowTooltip: true
            },
            {
              label: this.$t('outInStorageManage.height'),
              prop: 'height',
              showOverflowTooltip: true
            },
            {
              label: this.$t('outInStorageManage.weight'),
              prop: 'weight',
              showOverflowTooltip: true
            },
            {
              label: this.$t('outInStorageManage.plannedReturnQuantity'),
              prop: 'quantity',
              showOverflowTooltip: true
            }
          ]
        }
    },
    created() {

    },
    mounted() {

    },
    methods: {

    }
}
</script>

<style scoped lang="less">

</style>
