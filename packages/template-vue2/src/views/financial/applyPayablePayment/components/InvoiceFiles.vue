<template>
  <div>
    <div v-for="(item, index) in applyPayAmounts" :key="index">
     <invoice-files-item :ref="'invoice_files_item_' + index" :item="item" :check="check"/>
    </div>
  </div>
</template>
<script>
import InvoiceFilesItem from './InvoiceFilesItem';

export default {
	name: "InvoiceFiles",
  components: {
    InvoiceFilesItem
  },
  props: {
    applyPayAmounts: {
      type: Array,
      default: function() {
        return []
      }
    },
    check: {
      type: Boolean,
      default: false
    }
  },
	data() {
		return {
     
		};
	},
	created() {
    
	},
	methods: {
    validate() {
      let valid = true
      Object.keys(this.$refs).forEach(key => {
        if (this.$refs[key][0]) {
          let v = this.$refs[key][0].validate()
          if (!v) {
            valid = false
          }
        }
      })
      if(!valid) {
        this.$message.error(this.$t('fmsPayablePayment.invoiceFilesError'))
      }
      return valid
    },
		getValue() {
			let arr = []
      Object.keys(this.$refs).forEach(key => {
        if (this.$refs[key][0]) {
          let item = this.$refs[key][0].getValue()
          arr.push(item)
        }
      })
			return arr
		},
	}
};
</script>
<style scoped lang="scss">

</style>
