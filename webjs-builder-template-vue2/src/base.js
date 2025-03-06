/**
 * vue 全局方法、全局混入定义
 *
 */
import { isEmptyObject, isNotEmptyObject, extendObjects, copyProperties, objectIsArray as isArray } from './utils/objectUtils'
import validate from '@/utils/validate.js'
import { AgGridVue } from 'ag-grid-vue'
import AgGridVuePro from '@/components/AgGridVuePro'
import InputNumber from '@/components/InputNumber'
import MemberList from '@/components/MemberList'
import CommonPicker from '@/components/Cargo/Common/datepicker'
import SearchDatePicker from '@/components/Form/SearchDatePicker'
import SvgIcon from '@/components/SvgIcon'
import StatusIcon from '@/components/SvgIcon/StatusIcon'
import Provinces from '@/components/Form/Provinces'
import Pagination from '@/components/Pagination'
import UploadFile from '@/components/UploadFile'
import SelectFilter from '@/components/SelectFilter'
import CompanySelect from '@/components/Form/CompanySelect'
import AdvanceSelect from '@/components/Form/AdvanceSelect'
import TypeSelect from '@/components/Form/TypeSelect'
import UexpressTypeSelect from '@/components/Form/UexpressTypeSelect'
import AdvanceAutocomplete from '@/components/Form/AdvanceAutocomplete'
import TypeAutocomplete from '@/components/Form/TypeAutocomplete'
import ConstantSelect from '@/components/Form/ConstantSelect'
import BaseSelect from '@/components/Form/BaseSelect'
import FmsSelect from '@/components/Form/FmsSelect'
import UexpressSelect from '@/components/Form/UexpressSelect'
import OvlSelect from '@/components/Form/OvlSelect'
import CountryState from '@/components/Form/CountryState'
import AttachSreenshot from '@/components/Form/AttachSreenshot'
import FilePreview, { ImagePreview, PdfPreview } from '@/components/FilePreview'
import normalNumberInput from '@/components/Cargo/Common/normalNumberInput'
import TopSearchItemsSlot from '@/components/Cargo/Common/topSearchItemsSlot'
import topSearchItems from '@/views/cargo/v0/CharteredBoat/components/topSearchItems'
import lbTable from '@/components/Lb-table/lb-table'
import moment from 'moment'
import querystring from 'querystring'

// global filters
import * as filters from './filters'
export default function install(Vue, options) {
  // ------------------------------------- 添加全局方法或属性  -------------------------------------
  // 全局 momentjs

  Vue.prototype.$moment = moment
  // 常用对象方法
  Vue.prototype.$isEmpty = isEmptyObject
  Vue.prototype.$isNotEmpty = isNotEmptyObject
  Vue.prototype.$extends = extendObjects
  Vue.prototype.$copyProps = copyProperties
  Vue.prototype.$validators = validate
  Vue.prototype.$querystring = querystring
  Vue.prototype.$isArray = isArray
  // ------------------------------------- 组件注入 -------------------------------------
  Vue.component('Provinces', Provinces)
  Vue.component('AgGridVue', AgGridVue)
  Vue.component('InputNumber', InputNumber)
  Vue.component('Pagination', Pagination)
  Vue.component('CommonPicker', CommonPicker)
  Vue.component('SearchDatePicker', SearchDatePicker)
  Vue.component('SvgIcon', SvgIcon)
  Vue.component('StatusIcon', StatusIcon)
  Vue.component('CompanySelect', CompanySelect)
  Vue.component('UploadFile', UploadFile)
  Vue.component('SelectFilter', SelectFilter)
  Vue.component('AdvanceSelect', AdvanceSelect)
  Vue.component('TypeSelect', TypeSelect)
  Vue.component('UexpressTypeSelect', UexpressTypeSelect)
  Vue.component('AdvanceAutocomplete', AdvanceAutocomplete)
  Vue.component('TypeAutocomplete', TypeAutocomplete)
  Vue.component('ConstantSelect', ConstantSelect)
  Vue.component('BaseSelect', BaseSelect)
  Vue.component('FmsSelect', FmsSelect)
  Vue.component('UexpressSelect', UexpressSelect)
  Vue.component('OvlSelect', OvlSelect)
  Vue.component('CountryState', CountryState)
  Vue.component('AttachSreenshot', AttachSreenshot)
  Vue.component('normalNumberInput', normalNumberInput)
  Vue.component('TopSearchItemsSlot', TopSearchItemsSlot)
  Vue.component('topSearchItems', topSearchItems)
  Vue.component('lbTable', lbTable)
  Vue.component('MemberList', MemberList)
  Vue.component('AgGridVuePro', AgGridVuePro)
  Vue.component('FilePreview', FilePreview)
  Vue.component('ImagePreview', ImagePreview)
  Vue.component('PdfPreview', PdfPreview)
  // ------------------------------------- 全局filter -------------------------------------
  Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
  })
}

