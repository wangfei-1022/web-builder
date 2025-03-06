<!--SearchItem控件-->
<template>
  <div style="height: auto">
    <div class="app-main-inner-row search-bar search-item-row" style="padding-top: 5px!important; padding-bottom: 5px!important;">
      <div class="search-bar-left" style="padding-left:0px;">
        <slot name="search-right">
          <el-button v-if="isSeaExportJobList" type="text" size="mini" style="color:#979797" @click="toFilterByDateRange(0)">今日新单</el-button>
          <el-button v-if="isSeaExportJobList" type="text" size="mini" style="color:#979797" @click="toFilterByDateRange(1)">本周开航</el-button>
          <el-button v-if="isSeaExportJobList" type="text" size="mini" style="color:#979797" @click="toFilterByDateRange(2)">本月开航</el-button>
          <el-button v-if="isFinancialOverview" type="text" size="mini" style="color:#979797" @click="toFilterByDateRange(3)">本月业务</el-button>
          <el-button v-if="isFinancialOverview" type="text" size="mini" style="color:#979797" @click="toFilterByDateRange(4)">上月业务</el-button>
          <el-button v-if="!isSimpleUi" type="text" size="mini" style="color:#979797" @click="toGetMyFocus">我关注的</el-button>
        </slot>
      </div>
      <div class="search-bar-right" style="display: flex;">
        <el-input
          v-show="allowSimQuery"
          v-model="keyWords"
          v-focus
          size="mini"
          style="vertical-align: middle;width:360px;"
          :placeholder="simQueryPlaceholder"
          @keyup.enter.native.prevent="simSearch"
        />
        <el-button :style="{'margin-right':marginR+'px'}" size="mini" @click="expandMoreSearchCondition" v-show="showSwitchBtn">更多条件
          <i :class="isShowingMoreSearchCondition?'el-icon-arrow-up el-icon--right':'el-icon-arrow-down el-icon--right'" />
        </el-button>
      </div>
    </div>
    <div
      v-show="isShowingMoreSearchCondition"
      class="app-main-inner-row more-search-condition"
      style="padding-left: 20px;"
    >
      <div class="filters">
        <!--<el-form v-if="!isSimpleUi" :inline="true" label-width="90px" label-position="left">-->
          <!--<el-form-item label="选择方案" v-if="!searchItemsDefault">-->
            <!--<el-select-->
              <!--v-model="selectedConfigValue"-->
              <!--size="mini"-->
              <!--style="vertical-align: middle;width:190px;"-->
              <!--placeholder="请选择检索方案"-->
              <!--@change="selectedPerConfig"-->
            <!--&gt;-->
              <!--<el-option-->
                <!--v-for="item in perConfigs"-->
                <!--:key="item.id"-->
                <!--:label="item.configName"-->
                <!--:value="item.id"-->
              <!--/>-->
            <!--</el-select>-->
          <!--</el-form-item>-->
        <!--</el-form>-->
        <el-form v-if="isShowSearchItem" :inline="true" label-width="120px" label-position="left">
          <div class="el-form-item-wrapper">
            <el-form-item
              v-for="(item) in [...multipleSelection]"
              :key="item.itemName+(selectedConfigValue)"
              :label="item.itemLabel"
              style="width: 300px"
            >
              <template v-if="item.itemType==='input'">
                <template v-if="item.subType=== 'bigdecimalrange'">
                  <el-input-number v-model="item.itemValue1" :min="-99999" :max="item.itemValue2 || 999999" style="width:97px;" size="mini" controls-position="right" @keydown.native.enter.prevent="onAdvSelectEnter" />
                  -
                  <el-input-number v-model="item.itemValue2" :min="item.itemValue1 || -99999" :max="999999" style="width:97px;" size="mini" controls-position="right" @keydown.native.enter.prevent="onAdvSelectEnter" />
                </template>
                <template v-else>
                  <el-input v-model="item.itemValue" clearable size="mini" class="textInput" @keydown.native.enter.prevent="onAdvSelectEnter" />
                </template>
              </template>

              <el-input
                v-if="item.itemType==='input-m'"
                v-model="item.itemValue"
                size="mini"
                style="width: 190px"
                disabled
                @keydown.native.enter.prevent="onAdvSelectEnter"
              >
                <el-button slot="append" size="mini" @click="toShowEditTextArea(item)">...</el-button>
              </el-input>
              <el-date-picker
                v-if="item.itemType==='date'"
                v-model="item.itemValue"
                :type="item.subType"
                size="mini"
                style="width: 190px"
                clearable
                placeholder="选择日期"
                @keydown.native.enter.prevent="onAdvSelectEnter"
              />
              <!--日期控件 开始截止，暂放勿删-->
              <!--<el-date-picker-->
              <!--v-if="item.itemType==='date-from-to-m'"-->
              <!--v-model="item.itemValue1"-->
              <!--format="yy-MM-dd"-->
              <!--type="date"-->
              <!--size="mini"-->
              <!--clearable-->
              <!--style="width: 100px"-->
              <!--placeholder="日期从"/>-->
              <!--<el-date-picker-->
              <!--v-if="item.itemType==='date-from-to-m'"-->
              <!--v-model="item.itemValue2"-->
              <!--format="yy-MM-dd"-->
              <!--type="date"-->
              <!--size="mini"-->
              <!--clearable-->
              <!--style="width: 100px"-->
              <!--placeholder="日期至"/>-->
              <el-select
                v-if="item.itemType==='select' && item.valueExpression && item.valueExpression.valueType==='static'"
                v-model="item.itemValue"
                :multiple="item.multiple===1"
                clearable
                style="width: 190px"
                size="mini"
                filterable
                :placeholder="$t('common.placeholder')"
                @keydown.native.enter.prevent="onAdvSelectEnter"
              >
                <el-option
                  v-for="_item in item.valueExpression.valueContent"
                  :key="_item.value"
                  :label="_item.label"
                  :value="_item.value"
                />
              </el-select>
              <!--港口-->
              <cargo-advance-select
                v-if="item.itemType==='port'"
                :ref="item.itemName+(selectedConfigValue)"
                :callback-params="{refCode:item.itemName}"
                :url="url.qf.seaport"
                :default-value="item.itemValue"
                :method-params="{}"
                :headers="['五字码','中文名称','英文名称']"
                :fields="['code5','chineseName','englishName']"
                :remote-default-obj="{id:item.itemValue,chineseName:item.itemContent,code5:item.itemValue}"
                tag-value="code5"
                style="width:190px;"
                remote
                @enter="onAdvSelectEnter"
                @parentCallBack="getValueFromChild"
              >
                <template slot-scope="{option:{item,fields}}">
                  <div style="display: flex;justify-content: space-between;width:400px;">
                    <div v-for="(field) in fields" :key="field" :title="(item[field])&&(item[field]).length>5?(item[field]):''" style="width:30%;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">{{ item[field] }}</div>
                  </div>
                </template>
              </cargo-advance-select>
              <!--国家-->
              <cargo-advance-select
                v-if="item.itemType==='country'"
                :ref="item.itemName+(selectedConfigValue)"
                :callback-params="{refCode:item.itemName}"
                :url="url.sys.countryList"
                :default-value="item.itemValue"
                :method-params="{}"
                :headers="['二字码','中文名称','英文名称']"
                :fields="['code2','chineseName','englishName']"
                :remote-default-obj="{id:item.itemValue,chineseName:item.itemContent,code2:item.itemValue}"
                tag-value="code2"
                style="width:190px;"
                remote
                @enter="onAdvSelectEnter"
                @parentCallBack="getValueFromChild"
              >
                <template slot-scope="{option:{item,fields}}">
                  <div style="display: flex;justify-content: space-between;width:400px;">
                    <div v-for="(field) in fields" :key="field" style="width:30%">{{ item[field] }}</div>
                  </div>
                </template>
              </cargo-advance-select>
              <!--船公司-->
              <cargo-advance-select
                v-if="item.itemType==='carrier'"
                :ref="item.itemName+(selectedConfigValue)"
                :callback-params="{refCode:item.itemName}"
                :url="url.qf.partnerOfCarrier"
                :default-value="item.itemValue"
                tag-name="englishShortname"
                :fields="['scacCode', 'englishShortname', 'chineseName', 'englishName']"
                :headers="['代码', '简称', '中文名', '英文名']"
                :remote-default-obj="{id:item.itemValue,scacCode:item.itemValue,chineseName:item.itemContent,englishName:'',englishShortname:''}"
                style="width:190px;"
                remote
                @enter="onAdvSelectEnter"
                @parentCallBack="getValueFromChild"
              />
              <!--结算单位-->
              <cargo-advance-select
                v-if="item.itemType==='member'"
                :ref="item.itemName+(selectedConfigValue)"
                :callback-params="{refCode:item.itemName}"
                :url="'/api/member-service/mem/member/info/selections'"
                :default-value="item.itemValue"
                :method-params="item.subType"
                :headers="['中文名称','英文名称']"
                :fields="['chineseName','englishName']"
                :remote-default-obj="{id:item.itemValue,chineseName:item.itemContent}"
                style="width:190px;"
                remote
                @enter="onAdvSelectEnter"
                @parentCallBack="getValueFromChild"
              >
                <template slot-scope="{option:{item,fields}}">
                  <div style="display: flex;justify-content: space-between;width:400px;">
                    <div v-for="(field) in fields" :key="field" style="width:30%">{{ item[field] }}</div>
                  </div>
                </template>
              </cargo-advance-select>
              <!--结算单位-->
              <cargo-advance-select
                v-if="item.itemType==='customer'"
                :ref="item.itemName+(selectedConfigValue)"
                :callback-params="{refCode:item.itemName}"
                :url="url.sys.partnerDropDownList"
                :default-value="item.itemValue"
                :method-params="item.subType"
                :headers="['中文名称','英文名称']"
                :fields="['chineseName','englishName']"
                :remote-default-obj="{id:item.itemValue,chineseName:item.itemContent}"
                style="width:190px;"
                remote
                @enter="onAdvSelectEnter"
                @parentCallBack="getValueFromChild"
              >
                <template slot-scope="{option:{item,fields}}">
                  <div style="display: flex;justify-content: space-between;width:400px;">
                    <div v-for="(field) in fields" :key="field" style="width:30%">{{ item[field] }}</div>
                  </div>
                </template>
              </cargo-advance-select>
              <!--用户-->
              <cargo-advance-select
                v-if="item.itemType==='user'"
                :ref="item.itemName+(selectedConfigValue)"
                :callback-params="{refCode:item.itemName}"
                :url="url.sys.userDropDownList"
                :default-value="item.itemValue"
                :method-params="item.subType"
                :remote-default-obj="{id:item.itemValue,chineseName:item.itemContent}"
                callback-method-type="obj"
                options-width="200px"
                style="width:190px;"
                remote
                @enter="onAdvSelectEnter"
                @parentCallBack="getValueFromChild"
              />
              <!--费用项-->
              <cargo-advance-select
                v-if="item.itemType==='feeItem'"
                :ref="item.itemName+(selectedConfigValue)"
                :callback-params="{refCode:item.itemName}"
                :url="url.act.feeItemDropdownList"
                :default-multiple-value="item.itemValue"
                :multiple="item.multiple==1"
                :filterable="true"
                :headers="['英文名称','中文名称']"
                :fields="['englishName','chineseName']"
                options-width="450px"
                style="width:190px;"
                @enter="onAdvSelectEnter"
                @parentCallBack="getValueFromChild"
              />
              <!--航线-->
              <cargo-advance-select
                v-if="item.itemType==='term'"
                :ref="item.itemName+(selectedConfigValue)"
                :callback-params="{refCode:item.itemName}"
                :url="url.dmn.terminologyByType"
                :default-value="item.itemValue"
                :method-params="item.subType"
                :headers="['中文名称','CODE']"
                :fields="['chineseName','code']"
                tag-value="code"
                callback-method-type="value"
                options-width="200px"
                style="width:190px;"
                @enter="onAdvSelectEnter"
                @parentCallBack="getValueFromChild"
              />
              <!--公司-->
              <cargo-advance-select
                v-if="item.itemType==='office'"
                :ref="item.itemName+(selectedConfigValue)"
                :callback-params="{refCode:item.itemName}"
                :url="url.sys.companyList"
                :default-value="item.itemValue"
                :method-params="{}"
                options-width="300px"
                style="width:190px;"
                @enter="onAdvSelectEnter"
                @parentCallBack="getValueFromChild"
              />
              <!--币种-->
              <cargo-advance-select
                v-if="item.itemType==='currency'"
                :ref="item.itemName+(selectedConfigValue)"
                :callback-params="{refCode:item.itemName}"
                :url="url.dmn.currencyDropDownList"
                :default-value="item.itemValue"
                :fields="['label']"
                tag-value="value"
                tag-name="label"
                options-width="200px"
                style="width:190px;"
                @enter="onAdvSelectEnter"
                @parentCallBack="getValueFromChild"
              />
              <!--部门-->
              <cargo-advance-select
                v-if="item.itemType==='department'"
                :ref="item.itemName+(selectedConfigValue)"
                :callback-params="{refCode:item.itemName}"
                :url="url.sys.departmentListDown"
                :default-value="item.itemValue"
                :headers="['公司名称','上级部门','部门名称']"
                :fields="['officeName','parentName','departmentName']"
                tag-name="departmentName"
                options-width="450px"
                style="width:190px;"
                @enter="onAdvSelectEnter"
                @parentCallBack="getValueFromChild"
              />
            </el-form-item>
            <el-dialog :visible.sync="isShowSaveAs" title="方案另存为" width="600px" :append-to-body="appendToBody">
              <div style="overflow: hidden;">
                <div style="float: left">
                  <el-form label-width="80px" size="mini">
                    <el-form-item label="方案名称">
                      <el-input v-model="searchTemplate.label" type="mini" style="width: 250px" />
                    </el-form-item>
                  </el-form>
                </div>
                <div style="float: left;">
                  <el-button type="primary" size="mini" @click="saveAs">保存</el-button>
                </div>
                <div style="clear: both" />
                <div style="border-top: 3px solid gainsboro;margin-top: 20px">
                  <el-table
                    ref="multipleTable"
                    :data="perConfigs"
                    size="mini"
                    height="250"
                    tooltip-effect="dark"
                    style="width: 100%"
                  >
                    <el-table-column
                      label="方案名称"
                      show-overflow-tooltip
                    >
                      <template slot-scope="scope">
                        {{ scope.row.configName==='default' ? 'default' : scope.row.configName }}
                      </template>
                    </el-table-column>

                    <el-table-column
                      label="默认"
                      show-overflow-tooltip
                    >
                      <template slot-scope="scope">{{ scope.row.default }}</template>
                    </el-table-column>

                    <el-table-column
                      fixed="right"
                      label="操作"
                      width="120"
                    >
                      <template slot-scope="scope">
                        <el-button
                          type="text"
                          size="mini"
                          icon="el-icon-close"
                          @click.native.prevent="deleteRowSearchTemplate(scope.$index, perConfigs)"
                        />
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </el-dialog>
            <el-dialog :visible.sync="isShowAbc" title="选择查询条件" width="900px" top="5vh" :append-to-body="appendToBody">
              <div style="overflow: hidden;display: flex;justify-content: space-between">
                <div style="width: 50%;">
                  <div style="color:#409EFF;display: flex;justify-content: space-between">
                    <div>
                      所有查询条件【{{ searchItems.length }}个】&nbsp;
                    </div>
                    <div style="width:113px;">
                      <el-button slot="header" type="text" size="mini" @click="toChooseSearchItem">全选</el-button>/
                      <el-button slot="header" type="text" size="mini" @click="toInvertChooseSearchItem">反选</el-button>
                    </div>
                  </div>
                  <el-table
                    ref="multipleTable"
                    :data="searchItems"
                    size="mini"
                    height="400"
                    tooltip-effect="dark"
                    @selection-change="handleSelectionChange"
                  >
                    <!--<el-table-column-->
                    <!--type="selection"-->
                    <!--width="30"/>-->
                    <el-table-column
                      prop="itemLabel"
                      label=""
                      width="30"
                      show-overflow-tooltip
                    >
                      <template slot-scope="scope">
                        <span v-if="scope.row.selected==true">
                          <i style="color: #409EFF" class="el-icon-success" />
                        </span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="itemLabel"
                      label="显示名"
                      width="290"
                      show-overflow-tooltip
                    >
                      <template slot-scope="scope">
                        {{ scope.row.itemLabel }}
                      </template>
                    </el-table-column>
                    <!--<el-table-column-->
                    <!--prop="itemName"-->
                    <!--label="代码"-->
                    <!--width="95"-->
                    <!--show-overflow-tooltip-->
                    <!--/>-->
                    <!--<el-table-column-->
                    <!--label="类型"-->
                    <!--width="85"-->
                    <!--show-overflow-tooltip-->
                    <!--&gt;-->
                    <!--<template slot-scope="scope">-->
                    <!--{{ scope.row.itemType }}-->
                    <!--</template>-->
                    <!--</el-table-column>-->
                    <el-table-column
                      fixed="right"
                      label="操作"
                      width="60"
                    >
                      <template slot-scope="scope">
                        <el-button
                          type="text"
                          size="small"
                          icon="el-icon-d-arrow-right"
                          @click.native.prevent="selectRow(scope.$index, searchItems)"
                        />
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
                <div style="width: 50%;">
                  <div>
                    <div style="float: left;color:#409EFF">我的查询条件【{{ multipleSelection.length }}个】</div>
                    <div style="float: right">
                      <el-button type="primary" size="mini" @click="saveDefault">设置为默认方案</el-button>
                      <el-button type="warning" size="mini" @click="initSearchItems">重置至系统默认方案</el-button>
                    </div>
                  </div>
                  <el-table
                    ref="multipleTable"
                    :data="multipleSelection"
                    class="chooseItemTable"
                    row-key="itemName"
                    size="mini"
                    height="400"
                    tooltip-effect="dark"
                    style="width: 100%"
                  >
                    <el-table-column
                      prop="itemLabel"
                      label="显示名"
                      width="290"
                      show-overflow-tooltip
                    />
                    <!--<el-table-column-->
                    <!--prop="itemName"-->
                    <!--label="代码"-->
                    <!--width="95"-->
                    <!--show-overflow-tooltip-->
                    <!--/>-->
                    <!--<el-table-column-->
                    <!--label="类型"-->
                    <!--width="85"-->
                    <!--show-overflow-tooltip-->
                    <!--&gt;-->
                    <!--<template slot-scope="scope">{{ scope.row.itemType }}</template>-->
                    <!--</el-table-column>-->
                    <el-table-column
                      fixed="right"
                      label="操作"
                      width="120"
                    >
                      <template slot-scope="scope">
                        <!--<el-button-->
                        <!--type="text"-->
                        <!--size="small"-->
                        <!--icon="el-icon-upload2"-->
                        <!--@click.native.prevent="moveUp(scope.$index, multipleSelection)"/>-->
                        <!--<el-button-->
                        <!--type="text"-->
                        <!--size="small"-->
                        <!--icon="el-icon-download"-->
                        <!--@click.native.prevent="moveDown(scope.$index, multipleSelection)"/>-->
                        <el-button
                          type="text"
                          size="small"
                          icon="el-icon-close"
                          @click.native.prevent="deleteSearchItem(scope.$index, multipleSelection)"
                        />
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </el-dialog>
          </div>
        </el-form>
      </div>
      <slot name="triggers">
        <div class="triggers">
          <div>
            <el-button size="mini" style="width:100%" type="primary" @click="advSearch">搜索</el-button>
          </div>
          <div v-show="reset" style="margin-top: 5px;">
            <el-button size="mini" style="width:100%" @click="toResetSearch">重置</el-button>
          </div>
          <!--<div v-show="true" style="margin-top: 5px;">
            <el-button size="mini" style="width:100%" @click="toSetValueForSearch">赋值</el-button>
          </div>-->
          <div style="display:flex;justify-content:space-between;font-size:21px;color:#b2b5bc;padding-top:6px; display: none;">
            <div @click="toShowConfigSearchItem">
              <el-tooltip content="设置方案" placement="bottom">
                <i class="el-icon-setting"/>
              </el-tooltip>
            </div>
            <div @click="initSearchItems">
              <el-tooltip content="重置为系统默认配置" placement="bottom">
                <i class="el-icon-refresh-left"/>
              </el-tooltip>
            </div>
            <div @click="showSaveAsDialog">
              <el-tooltip content="保存/删除方案" placement="bottom">
                <i class="el-icon-circle-plus-outline"/>
              </el-tooltip>
            </div>

          </div>
        </div>
      </slot>
    </div>
    <el-dialog v-el-drag-dialog :visible.sync="isShowEditTextArea" :title="currentInputItem.itemLabel" width="500px">
      <el-form label-width="190px" label-position="top" style="margin-top:-30px;">
        <div style="color:#409EFF">请使用回车进行多个工作号的输入</div>
        <el-form-item label="">
          <el-input v-model="dialogTextAreaValue" size="mini" type="textarea" rows="6" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="toConfirmEditTextArea">确定</el-button>
        <el-button type="primary" size="mini" @click="toCancelEditTextArea">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>

import cargoLimitedSelect from '@/components/Cargo/Common/cargoLimitedSelect'
import lodash from 'lodash'
import cargoAdvanceSelect from '@/components/Cargo/Common/cargoAdvanceSelect'
import URL from '@/api/urlTranslator'
import { getPersonQueryConfig, getGlobalQueryConfig, savePersonQueryConfig, delPersonQueryConfig, getAdvQueryResult, getSimQueryResult } from '@/api/commonComponent'
import Sortable from 'sortablejs'
import { deleteConfirm, confirm } from '@/utils/utilBaseElement'
import {configModule100, configModule101, configModule501, configModule502, configModule503, configModule505, configModule506, configModule507, configModule509, configModule504} from '@/search/index'
import {getDictDataApi} from "@/api/financial/base";
import Vue from "@/main";
import {getDmnTermItemList} from "@/api/seaExport";

export default {
  name: 'SearchItem',
  components: { cargoLimitedSelect, cargoAdvanceSelect },
  directives: {
    // 注册一个局部的自定义指令 v-focus
    focus: {
      // 指令的定义
      inserted: function(el) {
        // 聚焦元素
        el.querySelector('input').focus()
      }
    }
  },
  props: {
    appendToBody: { type: Boolean, default: false }, // 将内层 Dialog 的该属性设置为 true，它就会插入至 body 元素上，从而保证内外层 Dialog 和遮罩层级关系的正确。
    sourcePage: { type: String, default: '' }, // 来源页面
    isSeaExportJobList: { type: Boolean, default: false }, // 是否在海出列表页上
    isFinancialOverview: { type: Boolean, default: false }, // 是否在业务总览页面上
    marginR: { type: [String, Number], default: '0' },
    isSimpleUi: { type: Boolean, default: false }, // 是简单UI（控制 是否可选方案）
    reset: { type: Boolean, default: false }, // 是否可以重置查询
    allowSimQuery: { type: Boolean, default: true }, // 允许简单快速查询
    searchItemCode: { type: String, default: '' },
    searchItemMode: { type: String, default: '' },
    simUrl: { type: String, default: '' },
    advUrl: { type: String, default: '' },
    configModule: { type: String, default: '' },
    /*
     * 是否默认显示全部搜索项目
     * 是，则不显示方案选择
     * 否，显示方案选择
    */
    searchItemsDefault: { type: Boolean, default: false },
    /*
    * 是否隐藏切换按钮
    * 只能使用简单搜索
    * 不能切换高级搜索
    * params: true 显示  false 不显示
    */
    showSwitchBtn: {type: Boolean, default: true}
  },
  data() {
    const str = '快捷检索:业务编号/提单号/关单号'
    let simQueryPlaceholder = str
    switch (this.sourcePage) {
      case 'partner': // 客商
        simQueryPlaceholder = '快捷检索:助记码/简称/中英名'
        break
      case 'invoice': // 发票列表
        simQueryPlaceholder += '/发票号'
        break
      case 'overView': // 业务台账
        simQueryPlaceholder += ''
        break
      case 'se': // 海出列表
        simQueryPlaceholder += ''
        break
      case 'bill': // 账单列表
        simQueryPlaceholder += '/账单号'
        break
      case 'applyPayment': // 付款申请
        simQueryPlaceholder += '/付款申请号'
        break
      case 'chargeDetail': // 财务-费用明细
        simQueryPlaceholder += ''
        break
      case 'clear': // 财务-核销
        simQueryPlaceholder += '/核销编号'
        break
      case 'check': // 财务-对账单
        simQueryPlaceholder += '/对账单号'
        break
      case 'realCash': // 财务-实收付管理
        simQueryPlaceholder += '/实收付编号'
        break
      case 'finReleaseBill': // 财务-放单管理
        simQueryPlaceholder += '/放单号'
        break
      case 'seReleaseBill': // 海出-放单管理
        simQueryPlaceholder += '/放单号'
        break
      case 'chargeScheme': // 计费方案
        simQueryPlaceholder += '/方案编号'
        break
      default:
        simQueryPlaceholder = '快捷检索'
        break
    }
    if (this.configModule === '507') { // 选择费用
      simQueryPlaceholder = str
    }
    return {
      preQueryMode: 'adv', // 上次查询方式（adv-高级，simple简单）
      simQueryPlaceholder: simQueryPlaceholder, // 快捷检索 占位符
      isShowEditTextArea: false,
      dialogTextAreaValue: '',
      currentInputItem: {},
      isShowingSimSearchCondition: false,
      isShowingMoreSearchCondition: false,
      isShowingSummary: true,
      isShowAbc: false,
      isShowSaveAs: false,
      keyWords: null,
      loading: false,
      searchTemplate: {
        value: '',
        label: '',
        default: true
      },
      selectedConfigValue: null, // 选择的方案id
      perConfig: {
        bDefault: false,
        configContent: '',
        configModule: this.configModule,
        configName: 'default',
        configType: 1
      },
      perConfigs: [],
      searchTemplates: [{
        value: '选项1',
        label: '马士基船的数据',
        default: true
      }, {
        value: '选项2',
        label: '鸿基伟业的数据',
        default: false
      }],
      isShowSearchItem: true,
      multipleSelection: [], // 当前选择的配置的 相关项
      searchItems: [ // 可供选择的项（所有）
        /* {
          itemType: 'input',
          itemName: 'jobNo',
          itemLabel: '工作号',
          itemValue: null,
          selected: false,
          valueExpression: null,
          defaultSelected: true,
          defaultValue: null
        },
         {
            itemType: 'input-m',
            itemName: 'jobNos',
            itemLabel: '工作号们',
            itemValue: null,
            selected: false,
            valueExpression: null,
            defaultSelected: false,
            defaultValue: null
          },
          {
            itemType: 'input',
            itemName: 'cusNo',
            itemLabel: '客户编号',
            itemValue: null,
            selected: false,
            valueExpression: null,
            defaultSelected: true,
            defaultValue: null
          },
          {
            itemType: 'country',
            itemName: 'country',
            itemLabel: '国家',
            itemValue: null,
            selected: false,
            valueExpression: {},
            defaultSelected: true,
            defaultValue: null
          },
          {
            itemType: 'port',
            itemName: 'pod',
            itemLabel: '目的港',
            itemValue: null,
            selected: false,
            valueExpression: {},
            defaultSelected: true,
            defaultValue: null
          },
          {
            itemType: 'port',
            itemName: 'del',
            itemLabel: '中转港',
            itemValue: null,
            selected: false,
            valueExpression: {},
            defaultSelected: true,
            defaultValue: null
          },
          {
            itemType: 'input',
            itemName: 'billNo',
            itemLabel: '提运单号',
            itemValue: null,
            selected: false,
            valueExpression: null,
            defaultSelected: true,
            defaultValue: null
          },
          {
            itemType: 'date',
            itemName: 'shipDate',
            itemLabel: '业务日期',
            itemValue: null,
            selected: false,
            valueExpression: null,
            defaultSelected: true,
            defaultValue: null
          },
          {
            itemType: 'date',
            subType: 'date',
            itemName: 'checkDate',
            itemLabel: '单日期',
            itemValue: null,
            selected: false,
            valueExpression: null,
            defaultSelected: false,
            defaultValue: null
          },
          {
            itemType: 'date',
            subType: 'daterange',
            itemName: 'date_from_to_s',
            selected: false,
            valueExpression: null,
            defaultSelected: false,
            defaultValue: null
          },
          {
            itemType: 'date-from-to-m',
            itemName1: 'date1',
            itemName2: 'date2',
            itemLabel: '双日期多框',
            itemValue1: null,
            itemValue2: null,
            selected: false,
            valueExpression: null,
            defaultSelected: false,
            defaultValue: null
          },
          {
            itemType: 'select',
            multiple: false,
            itemName: 's1',
            itemLabel: '单选1',
            itemValue: 2,
            selected: false,
            valueExpression: {valueType: 'static', valueContent: [{label: '启用', value: 1}, {label: '禁用', value: 2}]},
            defaultSelected: false,
            defaultValue: 1
          },
          {
            itemType: 'country',
            itemName: 's2',
            itemLabel: '国家单选2',
            itemValue: null,
            selected: false,
            valueExpression: {},
            defaultSelected: true,
            defaultValue: null
          },
         {
          itemType: 'select',
          multiple: true,
          itemName: 's3',
          itemLabel: '多选1',
          itemValue: [],
          selected: false,
          valueExpression: { valueType: 'static', valueContent: [{ label: '启用', value: 1 }, { label: '禁用', value: 2 }] },
          defaultSelected: false,
          defaultValue: null
        }*/
      ]
    }
  },
  computed: {
    url() {
      return URL
    }
  },
  watch: {
    multipleSelection(newVal, oldVal) {
      console.log('watch multipleSelection')
      this.fillSearchItems()
    }
  },
  mounted() {
    this.fetchInitData()
    // this.rowDrop()
  },
  methods: {
    onReady(params) {
      params.api.sizeColumnsToFit()
      window.addEventListener('resize', function() {
        setTimeout(function() {
          params.api.sizeColumnsToFit()
        })
      })
    },
    rowDrop() { // 拖拽
      this.$nextTick(() => {
        const tbody = document.querySelector('.chooseItemTable .el-table__body-wrapper tbody')
        // console.log('tbody', tbody)
        const _this = this
        Sortable.create(tbody, {
          onEnd({ newIndex, oldIndex }) {
            const currRow = _this.multipleSelection.splice(oldIndex, 1)[0]
            _this.multipleSelection.splice(newIndex, 0, currRow)
          }
        })
      })
    },
    initSearchItems() {
      this.multipleSelection = this.searchItems.filter(item => item.defaultSelected === 1)
      this.selectedConfigValue = ''
      // this.multipleSelection = []
    },
    fillMySearchItems() {
      this.initSearchItems()
      // this.fillSearchItems()
    },
    fillSearchItems() {
      console.log('----- fillSearchItems')
      for (let i = 0; i < this.searchItems.length; i++) {
        this.searchItems[i].selected = this.searchItemsDefault ? 1 : 0
        for (let j = 0; j < this.multipleSelection.length; j++) {
          if (this.multipleSelection[j].itemName === this.searchItems[i].itemName) {
            this.searchItems[i].selected = 1
          }
        }
      }
    },
    toShowConfigSearchItem() {
      this.isShowAbc = true
      this.rowDrop()
    },
    showSaveAsDialog() {
      this.isShowSaveAs = true
    },
    fetchInitData() {
      let searchMap = {
        100: configModule100, // 100 // se
        101: configModule101, // 100 // order
        501: configModule501, // 501 //bill
        502: configModule502, // 502 //invoice
        503: configModule503, // 503 // 对账管理(check)
        504: configModule504, // 504 // 核销管理(clear)
        505: configModule505, // 509 // 付款申请单管理(ApplyPayment)
        507: configModule507, // 507 // actInvoice //actBillManage
        506: configModule506, // 506 //chargeDetail
        509: configModule509 // 509 // 实收付管理(RealCash)
      }
      if (searchMap[this.configModule]) {
        this.searchItems = searchMap[this.configModule]
        this.fillMySearchItems()
        if (this.configModule === '101') {
          this.getOps101()
        }
        return
      }

      getGlobalQueryConfig(1, this.configModule).then(res => {
        this.searchItems = JSON.parse(res.content.configContent)
        this.fillMySearchItems() // 先设置全局默认方案
        return this.getPerConfigs(true, this.configModule) // 如果有个人默认方案，则覆盖全局的默认方案
      }).then(() => {
        // console.log(this.$options.name, '==>fetchInitData 操作成功，测试与getPerConfigs的先后')
        // this.$message.success('fetchInitData 操作成功，测试与getPerConfigs的先后')
      }).catch(err => {
        this.$message.error('全局项加载失败01' + err)
      })

    },
    getOps101() {
      console.log('this.searchItems,', this.searchItems)
      getDictDataApi(3).then(res => {
        if (res.ok) {
          // this.entryStateList = res.content;
          this.searchItems.some(val => {
            if (val.itemName === 'arInvoiceState') {
              val.valueExpression.valueContent = [{"label": this.$t('sea.all'), "value": null}]
              res.content.map(val2 => {
                val.valueExpression.valueContent.push({
                  label: val2.name,
                  value: val2.code
                })
              })
              return true
            }
          })
        }
      })
      getDictDataApi(25).then(res => {
        if (res.ok) {
          this.searchItems.some(val => {
            if (val.itemName === 'arInstructionState') {
              val.valueExpression.valueContent = [{"label": this.$t('sea.all'), "value": null}]
              res.content.map(val2 => {
                val.valueExpression.valueContent.push({
                  label: val2.name,
                  value: val2.code
                })
              })
              return true
            }
          })
        }
      })
      getDictDataApi(4).then(res => {
        if (res.ok) {
          this.searchItems.some(val => {
            if (val.itemName === 'arClearState') {
              val.valueExpression.valueContent = [{"label": this.$t('sea.all'), "value": null}]
              res.content.map(val2 => {
                val.valueExpression.valueContent.push({
                  label: val2.name,
                  value: val2.code
                })
              })
              return true
            }
          })
        }
      })
      // 贸易条款
      getDmnTermItemList({termCode: 'TRADEMODE'}).then(res => {
        this.searchItems.some(val => {
          if (val.itemName === 'tradeTermCode') {
            val.valueExpression.valueContent = [{"label": this.$t('sea.all'), "value": null}]
            res.content.map(val2 => {
              val.valueExpression.valueContent.push({
                label: val2.englishName,
                value: val2.code
              })
            })
            return true
          }
        })
      })
    },
    selectedPerConfig(val) {
      // let id = this.selectedConfigValue;
      const selectedItem = this.perConfigs.find(item => item.id === this.selectedConfigValue)
      console.log('------------selectedPerConfig------------', val)
      // this.multipleSelection = []
      // setTimeout(() => {
      this.multipleSelection = JSON.parse(selectedItem.configContent)
      // }, 50)
      this.$emit('mode-switched')
    },
    // end

    // begin------保存默认查询条件------
    saveDefault() {
      this.perConfig.bDefault = true
      this.perConfig.configContent = [...this.multipleSelection]
      this.perConfig.configName = 'default'
      // 如果已经有用户的默认配置了，那么后台应该去更新default配置
      this.savePerConfigPost(true)
    },
    // end

    // begin-----保存查询模板-------
    saveAs() {
      // 方案名不能重复
      const index = this.perConfigs.findIndex(item => item.configName === this.searchTemplate.label)
      if (index > 0) {
        confirm(this, () => {
          this.toSave()
        }, { content: '方案名称已存在，是否覆盖原有方案？' })
      } else {
        this.toSave()
      }
    },
    toSave() {
      // this.isShowSaveAs = false
      this.perConfig.bDefault = false
      this.perConfig.configContent = [...this.multipleSelection]
      // 配置名称不可重复
      this.perConfig.configName = this.searchTemplate.label
      console.log('perConfig', this.perConfig)
      this.savePerConfigPost(false)
    },
    savePerConfigPost(isDefaultConfig) {
      const perConfig = this.$extends({}, this.perConfig)
      perConfig.configContent = JSON.stringify(this.perConfig.configContent)
      savePersonQueryConfig(perConfig).then(res => {
        this.isShowAbc = false
        this.isShowSaveAs = false
        return this.getPerConfigs(isDefaultConfig, this.perConfig.configName) // 重新查询刚配置的方案
      }).then(() => {
        // this.$message.success('savePerConfigPost操作成功，测试先后')
      }).catch(err => {
        this.$message.error(err)
      })
    },
    getPerConfigs(isDefaultConfig, configName) { // 获取个人配置方案
      return getPersonQueryConfig(1, this.configModule).then(res => {
        this.perConfigs = res.content.list
        if (isDefaultConfig) {
          this.fillPerConfigDefault()
        } else {
          const currentConfig = this.perConfigs.find(item => item.configName === configName)
          this.multipleSelection = []
          setTimeout(() => {
            this.multipleSelection = JSON.parse(currentConfig.configContent)
            this.selectedConfigValue = currentConfig.id
          }, 50)
        }
        console.log('==searchItem 操作个人方案成功')
        // this.$message.success('操作个人方案成功')
      }).catch(err => Promise.reject(err))
    },
    // 填充个人配置的默认检索条件
    fillPerConfigDefault() {
      const defaultConfig = this.perConfigs.find(item => item.bDefault === true)
      console.log('fillPerConfigDefault defaultConfig', defaultConfig)
      if (defaultConfig) {
        console.log('default')
        this.multipleSelection = []
        setTimeout(() => {
          this.multipleSelection = JSON.parse(defaultConfig.configContent)
          this.selectedConfigValue = defaultConfig.id
        })
      }
    },
    simSearch() {
      this.multipleSelection.lineCodes = null
      this.$emit('simSearchItemCallBack', this.keyWords)
      this.preQueryMode = 'simple'
      if (this.searchItemMode === 'querydata') {
        // const params = { params: { keyword: encodeURIComponent((JSON.stringify(this.keyWords))) }}
        // pageSize 页尺 pageNum 页码 sort 排序（？后面传参）
        this.getSimQueryResult({ keyword: this.keyWords })
      }
    },
    getSimQueryResult(params) {
      this.preQueryMode = 'simple'
      params.pageSize = params.pageSize ? params.pageSize : 50
      getSimQueryResult(this.simUrl, params).then(res => {
        console.log('getSimSearchRequest', res.content)
        this.$emit('queryDataCallBack', res.content)
      }).catch(err => {
        this.$message.error(err)
      })
    },
    getAdvRequestData() {
      return this.toDealAdvRequestData()
    },
    toDealAdvRequestData() {
      const requestData = {}
      let tempItem
      lodash.forEach(this.multipleSelection, item => {
        if (item.itemType === 'input' && item.subType === 'bigdecimalrange') {
          if (item.itemValue1 || item.itemValue2) {
            item.itemValue = [item.itemValue1, item.itemValue2]
          } else {
            item.itemValue = []
          }
        }
        if (lodash.isObject(item.itemValue)) {
          console.log('item.itemValue.length', item.itemName, item.itemValue.length)
        }
        if (lodash.isObject(item.itemValue) && item.itemValue.length > 0 || !lodash.isObject(item.itemValue) && item.itemValue || item.itemValue === 0) {
          let itemValue = item.itemValue
          let subType
          if (item.itemType === 'input-m') {
            itemValue = item.itemValue.split(/[\n]/g)
          }
          if (item.itemType === 'date' && item.subType === 'daterange') {
            // subType = item.subType
            requestData[item.itemName + 'Start'] = item.itemValue[0] ? new Date(item.itemValue[0]).getTime() : ''
            requestData[item.itemName + 'End'] = item.itemValue[1] ? new Date(item.itemValue[1]).getTime() : ''
          } else if (item.itemType === 'input' && item.subType === 'bigdecimalrange') {
            // subType = item.subType
            requestData[item.itemName + 'Start'] = item.itemValue[0]
            requestData[item.itemName + 'End'] = item.itemValue[1]
          } else {
            requestData[item.itemName] = itemValue
          }
          // tempItem = { itemType: item.itemType, subType: subType, itemName: item.itemName, itemValue: itemValue }
        }
      })
      requestData.keyword = this.keyWords
      requestData.lineCodes = this.multipleSelection.lineCodes
      return requestData
    },
    advSearch() {
      this.$emit('advSearchItemCallBack', this.multipleSelection)
      this.preQueryMode = 'adv'
      if (this.searchItemMode === 'querydata') {
        // const params = { keyCode: '', params: encodeURIComponent((JSON.stringify(this.multipleSelection))) }
        let advData = this.getAdvRequestData()
        this.$emit('multipleSelectionCallBack', advData)
        this.getAdvQueryResult(advData)
      }
    },
    getAdvQueryResult(data) {
      this.preQueryMode = 'adv'
      if ('jobState' in data) {
        delete data.jobState
      }
      data.pageSize = data.pageSize ? data.pageSize : 50
      getAdvQueryResult(this.advUrl, data, 'get').then(res => {
        if (res.ok) {
          this.$emit('queryDataCallBack', res.content)
        } else {
          return Promise.reject(res.message)
        }
      }).catch(err => {
        this.$message.error(err)
      })
    },
    handleSelectionChange(val) {
      // this.multipleSelection = val
      // console.log('multipleSelection', this.multipleSelection)
    },
    toChooseSearchItem() {
      this.searchItems.forEach(row => {
        row.selected = true
      })
      this.multipleSelection = []
      setTimeout(() => {
        this.multipleSelection = [...this.searchItems]
      }, 50)
    },
    toInvertChooseSearchItem() {
      this.searchItems.forEach(row => {
        row.selected = !row.selected
      })
      this.multipleSelection = []
      setTimeout(() => {
        this.multipleSelection = this.searchItems.filter(row => row.selected)
      }, 50)
    },
    selectRow(index, rows) {
      const selectRow = this.searchItems[index]
      const hasChoose = this.multipleSelection.findIndex(item => item.itemName === selectRow.itemName) > -1
      if (hasChoose) {
        this.$message.warning(`该查询项【${selectRow.itemName}】已经被选择了`)
      } else {
        this.multipleSelection.push(selectRow)
        selectRow.selected = true
      }
    },
    deleteSearchItem(index, rows) {
      const obj = this.multipleSelection[index]
      rows.splice(index, 1)
      this.multipleSelection = rows
    },
    deleteRowSearchTemplate(index, rows) {
      deleteConfirm(this, () => {
        const obj = this.perConfigs[index]
        delPersonQueryConfig(obj.id).then(res => {
          rows.splice(index, 1)
        }).catch(err => {
          this.$message.error('删除方案失败 ' + err)
        })
      })
    },
    moveDown(index, rows) {
      const obj = this.multipleSelection[index]
      this.multipleSelection.splice(index, 1)
      this.multipleSelection.splice(index + 1, 0, obj)
      // rows.splice(index, 1)
    },
    moveUp(index, rows) {
      const obj = this.multipleSelection[index]
      this.multipleSelection.splice(index, 1)
      this.multipleSelection.splice(index - 1, 0, obj)
    },
    onAdvSelectEnter() { // cargoAdvanceSelect组件 点击确定时，调用高级查询
      // todo
      console.log('=====@keydown.native.enter.prevent="onAdvSelectEnter"====')
    },
    getValueFromChild(data) {
      console.log('getValueFromChild', data)
      this.multipleSelection = lodash.map(this.multipleSelection, item => {
        if (item.itemName === data.refCode) {
          console.log('(typeof data.value )', typeof data.value)
          // 组件多选的情况，data.value 是个数组
          // （此处 data如果是个对象，是一定要有value和chineseName属性。为了结构统一，可在cargo-advance-select返回时）
          item.itemValue = typeof data.value === 'object' ? data.value : data.value + ''
          item.itemContent = data.chineseName || ''
          // 把itemContent 存个对象，解决 options项某些列为空的情况
          // item.itemContent = data || {}
        }
        return item
      })
    },
    toShowEditTextArea(inputItem) {
      this.isShowEditTextArea = true
      this.currentInputItem = inputItem
      this.dialogTextAreaValue = inputItem.itemValue
    },
    toConfirmEditTextArea() {
      this.isShowEditTextArea = false
      this.currentInputItem.itemValue = this.dialogTextAreaValue
      this.currentInputItem = {}
    },
    toCancelEditTextArea() {
      this.isShowEditTextArea = false
      this.currentInputItem = {}
      this.dialogTextAreaValue = ''
    },
    toGetMyFocus() {
      this.getSimQueryResult({ bFocus: true })
    },
    toFilterByDateRange(timeRange) {
      // 0-today, 1-week, 2-month | 海出列表页专用
      // 3-上月的，4-本月的 | 财务结算-业务台账页专用
      this.multipleSelection.lineCodes = timeRange.lineCodes
      let advData = this.getAdvRequestData()
      this.$emit('multipleSelectionCallBack', advData)
      this.getSimQueryResult(advData)
    },
    expandMoreSearchCondition() {
      this.isShowingMoreSearchCondition = !this.isShowingMoreSearchCondition
      this.$emit('toggle-is-showing-more-search-condition', this.isShowingMoreSearchCondition)
    },
    toSetValueForSearch(values) { // 为查询条件设置指定值
      // values=> 数组 自定义组件=》[{itemName:'',itemValue:'',itemContent:''}]
      //  input类型=》{itemName:'',itemValue1:'',itemValue2:''}
      //  element组件类型=》{itemName:'',itemValue:''}
      const items = []
      this.multipleSelection.forEach(item => {
        let tempItem = values.find(val => item.itemName === val.itemName)
        if (tempItem) {
          tempItem = { ...item, ...tempItem }
        } else {
          // todo
          tempItem = { ...item }
        }
        items.push(tempItem)
      })
      this.multipleSelection = [...items]
    },
    toResetSearch() {
      const items = []
      this.multipleSelection.forEach(item => {
        const ref = item.itemName + this.selectedConfigValue
        console.log('ref', ref)
        console.log('this.$refs[ref]', this.$refs[ref])
        if (this.$refs[ref]) {
          // 如果找到引用
          if (item.itemValue) {
            // 有值
            this.$refs[ref][0].toClear()
          } else {
            // 没有值 todo 不做处理
          }
        } else {
          // 视作 element的元素处理
          if (item.itemType === 'input' && item.subType === 'bigdecimalrange') {
            item.itemValue1 = ''
            item.itemValue2 = ''
          } else {
            item.itemValue = ''
          }
        }
        items.push(item)
      })
      this.multipleSelection = [...items]
      this.multipleSelection.lineCodes = null
      this.keyWords = null
      this.$emit('resetSearch')
      this.advSearch()
    }
  }
}

</script>
<style>
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #b2d6ff;
  }
</style>
<style scoped>
  .search-item-row {
    background-color: #f5f7f7;
    padding: 15px 8px !important;
    display: flex;
    justify-content: space-between;
  }

  .el-input--mini .el-input__suffix-inner .el-input__icon {
    height: 28px;
  }

  .search-bar-right .el-button--mini {
    height: 28px;
    margin-left: 4px;
    margin-right: 8px;
  }

  .more-search-condition .el-form-item {
    margin-bottom: 4px;
  }

  .more-search-condition .el-date-editor {
    width: 208px;
  }

  .el-form-item .el-input {
  }

  .el-form-item .el-input i.arrow {
    width: 9px;
  }

  .el-form-item .el-input.textInput {
    width: 190px;
  }
  .el-form-item-wrapper ::v-deep .el-form-item__label{ text-align: right}
  ::v-deep .el-form-item__content{ width: calc(100% - 120px)}
</style>
