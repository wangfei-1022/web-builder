<template>
  <div style="position: relative;">
    <div class="table-setting" v-if="enabled" style="">
      <span>
        <el-select v-model="selectId" size="mini" style="width: 100px;" @change="setSelectFn">
          <el-option v-for="item in selectList" :key="item.id" :label="item.schemeName" :value="item.id">
            <div @mouseenter="enterFn(item)" @mouseleave="leaveFn(item)" style="overflow: hidden;padding-right: 30px;">
              <span style="float: left">{{ item.schemeName }}</span>
              <span v-if="item.isShow" style="float: right;color: #8492a6; font-size: 13px;padding-left: 10px;position: absolute; right: 15px;">
                <i class="el-icon-edit"  @click="editFn($event, item)"></i>
                <i class="el-icon-delete"  @click="deleteFn($event, item)" v-if="selectList.length > 1"></i>
              </span>
            </div>
          </el-option>
        </el-select>
        <div style="float: right;line-height: 28px;">
          <i class="icon-set iconfont icon-checkbox-outline" @click="updateColunmFn" v-if="isChangeTable" title="保存"></i>
          <i class="icon-set el-icon-setting" @click="saveAnotherColunmFn" v-if="isChangeTable" title="另存为"></i>
        </div>
      </span>
    </div>
    <ag-grid-vue
      :locale-text-func="_i18nGridLocalText"
      :grid-options="gridOptions"
      :side-bar="sideBarDefs"
      :column-defs="columnFields"
      :row-data="data"
      :enable-col-resize="true"
      :enable-sorting="true"
      :pagination="false"
      :pagination-auto-page-size="false"
      :grid-ready="onReadyFn"
      :column-moved="columnMoved"
      :column-visible="columnVisible"
      :column-resized="columnResized"
      :column-pinned="columnPinned"
      :style="styleGrid"
      :class="isNoOper ? 'ag-theme-balham no-oper' : 'ag-theme-balham'"
    />
    <el-dialog :visible.sync="saveAnotherVisible"  :close-on-click-modal="false" width="500px" :title="saveAnotherTitle">
      <el-form @submit.native.prevent ref="saveAnotherForm" :rules="saveAnotherRule" :model="saveAnotherForm" label-width="120px" size="small" class="settlement-form">
        <el-form-item label="模板名称" prop="name">
            <el-input v-model="saveAnotherForm.name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="option-btn-wrap">
        <el-button size="mini" @click="saveAnotherVisible = false">{{ $t("contract.cancel") }}</el-button>
        <el-button size="mini" type="primary" @click="confirmFn">{{ $t("contract.confirm") }}</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import { getGridSchemeListApi, gridSchemeUpdateApi, gridSchemeSaveApi, gridSchemeUpdateTemplateNameApi, gridSchemeDeleteApi } from '@/api/common'

import { AgGridVue } from "ag-grid-vue"

// 注意事项（重要）
// 在改造表头数据时候
// 1.原来的 minWidth 改成 width。直接用width进行渲染了
// 2.原来的headerName 改成 headerNameKey， $t 去掉。存储到后端的都是key值。然后取出 进行国际化
// 3.原来的onReady 里面监听 resize 进行 自适应渲染 也去掉。根据客户设定的width 渲染即可
// 4.原来的cellRender 尽可能的改成 js 处理好之后进行渲染，否则需要cellRendererFramework进行处理了。
// 5.当页面是有复选框进行操作的时候，则要给复选框的Column命名一个fieldId。
// 6.columnFields 即 对应的  schemeContent 当中的数据 fieldId 不能重复

export default {
	name: 'AgGridVuePro',
	components: {
		AgGridVue
	},
	props: {
		// 需要渲染的列表数据
		data: {
			type: Array,
			default: function () {
				return []
			}
		},
		// AgGrid样式
		styleGrid: {
			type: Object,
			default: function () {
				return {}
			}
		},
		// 默认的表头数据
		columnFieldsDefault: {
			type: Object,
			default: function () {
				return {}
			}
		},
		// Ready 之后的回调
		gridReady: {
			type: Function,
			default: function () {
				return function () { }
			}
		},
		// 原来的属性 默认之后 也可自定义
		gridOptions: {
			type: Object,
			default: function () {
				return {
					rowSelection: "multiple", // 设置多行可选
					animateRows: true,
					suppressRowClickSelection: true,
          enableRangeSelection: true, 
          rowMultiSelectWithClick: true, 
					context: {
						componentParent: this.$parent
					}
				}
			}
		},
		// 原来的属性 默认之后 也可自定义
		sideBarDefs: {
			type: Object,
			default: function () {
				return {
					toolPanels: ["columns", "filters"],
					visible: false
				}
			}
		},
    // 没有操作按钮，还需要设置表头功能的情况下
		isNoOper: {
			type: Boolean,
			default: false
		},
    // 是否启用表头设置功能, 默认启用。可关闭此功能
		enabled: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			selectId: '',
			selectList: [],
			pageTableList: [],

			editId: '',
			saveAnotherVisible: false,
			saveAnotherTitle: '另存为',
			isChangeTable: false,
			saveAnotherForm: {
				name: ''
			},
			saveAnotherRule: {
				name: [{ required: true, message: this.$t("common.cannot_be_null") }]
			},
			gridApi: {},
			columnApi: {},
			columnFields: []
		}
	},
	created() {
		this.init()
	},
	methods: {
		onReadyFn(params) {
			this.gridReady(params)
			this.columnApi = params.columnApi
			this.gridApi = params.api

			// params.api.sizeColumnsToFit()
			// window.addEventListener("resize", function () {
			// 	setTimeout(function () {
			// 		params.api.sizeColumnsToFit()
			// 	})
			// })
		},
		init() {
      if (this.enabled === false) {
        // 如果不启用则以默认的去渲染表格
        this.renderTable(this.columnFieldsDefault)
        return
      }
			// 如果存在Code
			let code = this.columnFieldsDefault.moduleCode
			if (code) {
				getGridSchemeListApi(code).then(res => {
					if (res.ok) {
						// 判断返回的模板数据的条数
						if (res.content.length > 0) {
							let arr = []
							res.content.forEach(v => {
								try {
									// 对保存的JSON数据进行parse
									v.schemeContent = JSON.parse(v.schemeContent)
								} catch (error) {
									console.log(error)
									console.log('数据有问题，请联系管理人员！')
									return
								}
								arr.push({
									id: v.id,
									schemeName: v.schemeName,
									isShow: false
								})
								// 把默认项上的一些属性构造给保存的对象，然后去渲染
								v.schemeContent.forEach((item, index) => {
									let indexDefault = this.columnFieldsDefault.schemeContent.findIndex(x => x.field === item.field)
									if (indexDefault >= 0) {
										v.schemeContent[index] = {
											...this.columnFieldsDefault.schemeContent[indexDefault],
											// 把变更的几项 还原 其余的使用默认的
											// 此项操作是为了假如命名定义的变更 或者 某些变更是不需要刷数据库的
											// 当渲染或者再次保存的时候启用前端设定的值
											pinned: item.pinned,
											width: item.width,
											hide: item.hide,
											sort: item.sort
										}
									}
								})

                // 当默认当中不存在的了 则同步删除存数据库的。
                v.schemeContent = v.schemeContent.filter(item => {
                  let indexDefault = this.columnFieldsDefault.schemeContent.findIndex(x => x.field === item.field)
                  return indexDefault >= 0
                })

								// 进行对比 少则加
								this.columnFieldsDefault.schemeContent.forEach(item => {
									let index = v.schemeContent.findIndex(x => x.field === item.field)
									// 在保存的当中没有  则表示为需要增加的项
									if (index < 0) {
										v.schemeContent.push(item)
									}
								})
							})
							// 默认取第一条
							this.renderTable(res.content[0])
							this.selectList = arr
							this.pageTableList = res.content || []
						} else {
							// 静默保存一次
							this.silenceSave()
						}
					}
				})
			}
		},
		// 当第一次访问 则静默保存一次
		silenceSave() {
			let item = this.columnFieldsDefault
			let data = {
				moduleCode: item.moduleCode,
				moduleName: item.moduleName,
				schemeName: item.schemeName,
				schemeContent: JSON.stringify(item.schemeContent),
				defaultFlag: item.defaultFlag
			}
			gridSchemeSaveApi(data).then(res => {
				if (res.ok) {
					this.init()
				}
			})
		},
		// 渲染
		renderTable(templateItem) {
			// 传入要渲染的那一项
			let fieldsList = this.$extends(true, [], templateItem.schemeContent)

			// 处理模板数据
			fieldsList.forEach(v => {
				v.headerName = v.headerName || this.$t(v.headerNameKey)
        delete v.headerNameKey
				if (v.cellRendererFramework) {
					// 将在父组件引入的组件 挂在在当前 方便ag grid 获取
					this.$options.components[v.cellRendererFramework] = this.$parent.$options.components[v.cellRendererFramework]
				}
			})

			this.selectId = templateItem.id
			if (this.gridApi && this.gridApi.setColumnDefs) {
				this.gridApi.setColumnDefs(fieldsList)
			} else {
				this.columnFields = fieldsList
			}
		},

		// 选中切换
		setSelectFn() {
			this.isChangeTable = false
			let index = this.pageTableList.findIndex(item => item.id === this.selectId)
			this.renderTable(this.pageTableList[index])
		},
		// 鼠标进入
		enterFn(item) {
			item.isShow = true
		},
		// 鼠标移除
		leaveFn(item) {
			item.isShow = false
		},
		// 编辑
		editFn(e, item) {
			e.preventDefault()
			e.stopPropagation()
			this.saveAnotherTitle = '编辑'
			this.saveAnotherForm.name = item.schemeName
			this.editId = item.id
			this.saveAnotherVisible = true
		},
		// 删除
		deleteFn(e, target) {
			e.preventDefault()
			e.stopPropagation()
			let id = target.id
			this.$confirm('此操作删除 ' + target.schemeName + ', 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				gridSchemeDeleteApi(id).then(res => {
					if (res.ok) {
						// 进行数据清除
						let index = this.selectList.findIndex(item => item.id === id)
						if (index >= 0) {
							this.selectList.splice(index, 1)
						}
						let i = this.pageTableList.findIndex(item => item.id === id)
						if (i >= 0) {
							this.pageTableList.splice(i, 1)
						}

						if (this.selectId === id) {
							// 如果删除的是当前项。则需要重新渲染表格
							this.renderTable(this.pageTableList[0])
						}
						this.$message.success('删除成功')
					}
				})
			}).catch(() => {

			});
		},
		// 保存-更新当前模板
		updateColunmFn() {
			this.isChangeTable = false
			let currentItem = {}
			this.pageTableList.forEach(v => {
				if (v.id === this.selectId) {
					currentItem = v
				}
			})
			if (currentItem.id) {
				let columns = this.getColumns()
				// 组装数据
				let data = {
					id: currentItem.id,
					schemeName: currentItem.schemeName,
					schemeContent: JSON.stringify(columns)
				}
				gridSchemeUpdateApi(data).then(res => {
					if (res.ok) {
						this.$message.success('保存成功')
						// 同时更新到当前的数据对象里去
						this.pageTableList.forEach(v => {
							if (v.id === this.selectId) {
								v.schemeContent = columns
							}
						})
					}
				})
			}
		},
		// 另存为
		saveAnotherColunmFn() {
			this.editId = ''
			this.saveAnotherForm.name = ''
			this.saveAnotherVisible = true
		},
		// 另存为
		confirmFn() {
			this.$refs.saveAnotherForm.validate(valid => {
				if (valid) {
					if (this.editId) {
						let data = {
							schemeId: this.editId,
							schemeName: this.saveAnotherForm.name
						}
						gridSchemeUpdateTemplateNameApi(data).then(res => {
							if (res.ok) {
								this.saveAnotherVisible = false
								let index = this.selectList.findIndex(item => item.id === this.editId)
								if (index >= 0) {
									this.selectList[index].schemeName = this.saveAnotherForm.name
								}
								let i = this.pageTableList.findIndex(item => item.id === this.editId)
								if (i >= 0) {
									this.pageTableList[i].schemeName = this.saveAnotherForm.name
								}
								this.$message.success('编辑成功')
							}
						})
						return
					}
					let columns = this.getColumns()
					let data = {
						moduleCode: this.columnFieldsDefault.moduleCode,
						moduleName: this.columnFieldsDefault.moduleName,
						schemeName: this.saveAnotherForm.name,
						schemeContent: JSON.stringify(columns),
						defaultFlag: false
					}
					gridSchemeSaveApi(data).then(res => {
						if (res.ok) {
							// 设置下拉列表数据
							this.selectId = res.content
							this.selectList.push({
								id: res.content,
								schemeName: data.schemeName,
								isShow: false
							})
							data.id = res.content
							data.schemeContent = columns
							this.pageTableList.push(data)

							this.isChangeTable = false
							this.saveAnotherVisible = false
							this.$message.success('保存成功')
						}
					})
				}
			})
		},
		// 获取要保存的列信息
		getColumns() {
			// console.log(typeof this.columnApi.getAllColumns === 'function' && this.columnApi.getAllColumns())
			if (typeof this.columnApi.getAllColumns === 'function') {
				let columns = this.columnApi.getAllColumns()
				// 基于当前的进行拷贝
				let index = this.pageTableList.findIndex(item => item.id === this.selectId)
				let fieldsList = []
				if (index >= 0) {
					fieldsList = this.$extends(true, [], this.pageTableList[index].schemeContent)
					fieldsList.forEach(col => {
						// 用于重复操作之后 columns 的colId 会变成 _1 如 id -> id_1
						// 因此增加columns的原生属性判断
						let index = columns.findIndex(v => v.colId === col.field || v.userProvidedColDef && v.userProvidedColDef.field === col.field)
						if (index >= 0) {
							let item = columns[index]
							col.pinned = item.pinned
							col.width = item.actualWidth
							col.hide = !item.visible
							col.sort = item.sort
						}
					})
				}
				return fieldsList
			}
			return []
		},
		// 拖拽拉伸款段
		columnResized() {
			console.log('ColumnResizedEvent')
			this.isChangeTable = true
		},
		// 拖拽调整顺序
		columnMoved(column) {
			// 移动位置
			let index = this.pageTableList.findIndex(item => item.id === this.selectId)
			let fieldsList = this.pageTableList[index].schemeContent
			let colIndex = fieldsList.findIndex(item => item.field === column.column.colId || column.column.userProvidedColDef && column.column.userProvidedColDef.field === item.field)
			if (colIndex >= 0) {
				let target = fieldsList[colIndex]
				fieldsList.splice(colIndex, 1)
				fieldsList.splice(column.toIndex, 0, target)
			}

			console.log('columnMoved')
			this.isChangeTable = true
		},
		// 设置是否展示
		columnVisible() {
			console.log('columnVisible')
			this.isChangeTable = true
		},
		// 设置是否左右固定
		columnPinned() {
			console.log('columnPinned')
			this.isChangeTable = true
		}
	}
}
</script>
<style lang="scss" scoped>
.icon-set {
	font-size: 22px;
	cursor: pointer;
	color: #1890ff;
	margin-left: 8px;
}
.el-icon-edit,
.el-icon-delete {
	cursor: pointer;
	color: #1890ff;
}

.no-oper {
	margin-top: 50px;
}
.table-setting {
    position: absolute; 
    top: -38px; 
    right: 0;
}
</style>
