<template>
  <div style="overflow: hidden;">
    <span style="float: left;margin-right: 10px;" v-if="item.currency">{{item.currency}}&nbsp;&nbsp;{{item.value}}</span>
    <upload-file v-model="invoiceFiles" multiple accept=".pdf" style="float: left;width: 330px;" drag></upload-file>
  </div>
</template>

<script>
export default {
	name: "InvoiceFilesItem",
  props: {
    item: {
      type: Object,
      default: function() {
        return {}
      }
    },
    check: {
      type: Boolean,
      default: false
    }
  },
    watch: {
        item: {
            handler(val) {
                if(val.files && val.files.length) {
                    val.files.forEach(v => {
                        v.name = v.originFileName || v.name
                    })
                    this.invoiceFiles = val.files
                }
            },
            deep: true,
            immediate: true
        }
    },
	data() {
		return {
            invoiceFiles: []
		};
	},
	methods: {
    validate() {
      if(this.check && this.invoiceFiles.length === 0) {
        return false
      } else {
        return true
      }
    },
    getValue() {
      return {
        currencyCode: this.item.currency,
        amount: this.item.value,
        files: this.invoiceFiles
      }
    }
	}
};
</script>
<style scoped lang="scss">

</style>
