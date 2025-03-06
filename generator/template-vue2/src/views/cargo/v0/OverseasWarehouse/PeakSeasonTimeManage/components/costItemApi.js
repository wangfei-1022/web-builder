
import { getFeeDropdownApi } from '@/api/OverseasWarehouse/fuelRate'
export default {
	data() {
		return {
			drowFeeList: []
		}
	},
	async created() {
  console.log(getFeeDropdownApi)
		// let res = await getFeeDropdownApi()
		// if (res.ok) {
		// 	this.drowFeeList = res.content
    //   console.log(res.content)

		// }
	}
}


