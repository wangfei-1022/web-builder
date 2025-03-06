<template>
  <div>
    <el-form-item label="TimeSlot" class="mb-0">
      <div class="flex">
        <div v-if="$isNotEmpty(warehouseTimeSlotList)">
          <div v-for="(item, index) in warehouseTimeSlotList" :key="index" class="flex">
            <div v-if="!isDetail" class="el-icon-remove-outline removeIcon" @click="removeLimit(index)"/>
            <div>
              <div class="mb-10 flex-box">
                <el-form-item label="" label-width="0px" class="mb-0" :prop="`warehouseTimeSlotList[${index}].timeSlotStartTime`" :rules="[{required: true, message: $t('warehouse.please_time_slot')}]">
                  <el-time-picker :disabled="isDetail" valueFormat="timestamp" format="HH:mm" class="w-110" v-model="item.timeSlotStartTime" size="mini" placeholder="任意时间点"></el-time-picker>
                </el-form-item>
                <el-form-item label="" label-width="0px" class="mb-0 ml-10" :prop="`warehouseTimeSlotList[${index}].timeSlotEndTime`" :rules="[{required: true, message: $t('warehouse.please_time_slot')}]">
                  <el-time-picker :disabled="isDetail" valueFormat="timestamp" format="HH:mm" class="w-110" v-model="item.timeSlotEndTime" size="mini" placeholder="任意时间点"></el-time-picker>
                </el-form-item>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="pointer" v-if="!isDetail" @click="addLimit()">
        <span class="el-icon-circle-plus-outline"  />
        {{ $t("warehouse.addItem") }}
      </div>
    </el-form-item>
    </div>
</template>

<script>
export default {
	name: 'TimeSlot',
	props: {
		warehouseTimeSlotList: {
			type: Array,
			default: () => []
		},
		isDetail: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			value1: null,
			value: []
		};
	},
	created() {

	},
	mounted() {

	},
	methods: {
		/**
		 *增加限制条件
		 */
		addLimit() {
			const data = {
				timeSlotStartTime: null,
				timeSlotEndTime: null,
			}
			this.warehouseTimeSlotList.push(data)
		},
		/**
		 * 减少限制条件
		 */
		removeLimit(index) {
			this.warehouseTimeSlotList.splice(index, 1)
		},
	}
};
</script>

<style scoped lang="less">
.removeIcon {
	margin-top: 10px;
	margin-right: 5px;
}
</style>
