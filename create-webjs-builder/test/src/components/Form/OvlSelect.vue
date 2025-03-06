<template>
  <el-select class="yht-select" v-model="selectValue" style="width: 100%" :filterable="filterable" :multiple="multiple" :clearable="clearable" :disabled="disabled" @change="changeFn">
    <el-option v-for="item in optionList" :key="item[valueKey]" :label="item[labelKey]" :value="item[valueKey]" />
  </el-select>
</template>

<script>
import { getCustomerDropDownListApi } from '@/api/common'

export default {
    name: 'UexpressSelect',
    props: {
        value: {
            type: [String, Number, Array],
            default: ''
        },
        type: {
            type: String,
            default: ''
        },
        params: {
            type: Object,
            default: function () {
                return {}
            }
        },
        disabled: {
            type: Boolean,
            default: false
        },
        filterable: {
            type: Boolean,
            default: false
        },
        multiple: {
            type: Boolean,
            default: false
        },
        clearable: {
            type: Boolean,
            default: false
        },
        addALL: {
            type: Boolean,
            default: false
        },
        addAll: {
            type: Boolean,
            default: false
        }
    },
    // 重置的时候需要 监听到
    watch: {
        value: {
            handler(val) {
                this.selectValue = val
            }
        }
    },
    data() {
        return {
            dictCode: null,
            selectValue: null,
            optionList: [],
            valueKey: 'code',
            labelKey: 'name'
        }
    },
    created() {
        this.selectValue = this.value
        this.init()
    },
    methods: {
        init() {
            let fn = null
            switch (this.type) {
                // customer
                case 'customer':
                    fn = getCustomerDropDownListApi
                    this.valueKey = 'id'
                    this.labelKey = 'chineseName'
                    break
                default:
                    break
            }
            if (fn) {
                let data = this.dictCode ? this.dictCode : this.params
                fn(data).then(res => {
                    if (res.ok) {
                        this.optionList = res.content.list || res.content
                        if (this.addAll || this.addALL) {
                            this.optionList.unshift({
                                [this.valueKey]: '',
                                [this.labelKey]: this.$t('common.ALL')
                            })
                        }
                    }
                })
            }
        },
        changeFn() {
            this.$emit('input', this.selectValue)
            if (this.multiple) {
                let list = []
                this.optionList.forEach(v => {
                    if (this.selectValue.indexOf(v[this.valueKey]) >= 0) {
                        list.push(v)
                    }
                })
                this.$emit('selected', list)
                this.$emit('change', list)
            } else {
                let item = {}
                this.optionList.forEach(v => {
                    if (v[this.valueKey] === this.selectValue) {
                        item = v
                    }
                })
                this.$emit('selected', item)
                this.$emit('change', item)
            }
        }
    }
}
</script>

<style scoped  lang="scss">
.yht-select {
    ::v-deep .el-tag--info {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        position: relative;
        padding-right: 15px;
    }
    ::v-deep .el-tag__close {
        position: absolute;
        right: -1px !important;
        top: 2px !important;
        z-index: 2;
    }
}
</style>
