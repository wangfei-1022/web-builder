<template>
	<div>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-form-item label="Bonded warehouse license No" label-width="190px" prop="bondedWarehouseInfo.bondedWarehouseLicenseNo">
          <el-input v-model="data.bondedWarehouseLicenseNo" size="mini" maxlength="50" placeholder="Bonded warehouse license No" :disabled='isDetail'></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="ALcode" prop="bondedWarehouseInfo.alCode">
          <el-input v-model="data.alCode" size="mini" maxlength="50" placeholder="ALcode" :disabled='isDetail'></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="UNLOCODE" label-width="140px" prop="bondedWarehouseInfo.unloCode">
          <el-input v-model="data.unloCode" size="mini" maxlength="50" placeholder="UNLOCODE" :disabled='isDetail'></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="Identificatie van het entrepot" label-width="190px" prop="bondedWarehouseInfo.identifyVanHetEntrepot">
          <el-input v-model="data.identifyVanHetEntrepot" size="mini" maxlength="50" placeholder="Identificatie van het entrepot" :disabled='isDetail'></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="Location code" prop="bondedWarehouseInfo.locationCode">
          <el-input v-model="data.locationCode" size="mini" maxlength="50" placeholder="Location code" :disabled='isDetail'></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="Customs office code" label-width="140px" prop="bondedWarehouseInfo.customsOfficeCode">
          <el-input v-model="data.customsOfficeCode" size="mini" placeholder="Customs office code" maxlength="50" :disabled='isDetail'></el-input>
        </el-form-item>
      </el-col>
    </el-row>
	</div>
</template>

<script>
export default {
	name: 'ContactInfo',
	props: {
		data: Object,
		isDetail: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
		}
	},
	created() {
	},
	watch: {

	},
	methods: {
	}
}
</script>

<style scoped lang="less">
</style>
