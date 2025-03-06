<template>
  <div class="app-wrapper">
    <div :class="['top-menu-wrap', {'hide-fixed': !showTopMenu}]">
      <top-menu />
    </div>
    <div class="bottom-content-wrap" :class="classObj">
      <div :class="['extend-mark', {'extend-mark-active': shwoExtendMenu}]"></div>
      <div :class="['show-fixed', {'show-slowly': !showTopMenu}]" @click="showTopMenu = true">
        <el-tooltip :content="$t('common.navbar.showFixed')">
          <i class="iconfont icon-zhankai2"></i>
        </el-tooltip>
      </div>
      <div v-if="sidebar.opened" class="drawer-bg" @click="handleClickOutside" ></div>
      <sidebar class="sidebar-container" />
      <div :class="{hasTagsView:needTagsView}" class="main-container">
        <div :class="{'fixed-header':fixedHeader}">
          <navbar @change-password-from-navbar-because-of-shit="oldPassword='';newPassword='';newPasswordAgain='';isShowingChangePasswordDialog=true;" />
          <tags-view v-if="needTagsView" />
        </div>
        <app-main />
        <right-panel v-if="false">
          <settings />
        </right-panel>
      </div>
    </div>
  </div>
</template>

<script>
import RightPanel from '@/components/RightPanel'
import { Navbar, Sidebar, AppMain, TagsView, Settings, TopMenu } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { mapState } from 'vuex'
// import '../../public/static/svgIconjs/flagsvg'
import Bus from '@/utils/eventBus.js'

export default {
	name: 'Layout',
	components: {
		RightPanel,
		Navbar,
		Sidebar,
		AppMain,
		TagsView,
		Settings,
		TopMenu
	},
	mixins: [ResizeMixin],
	data() {
		return {
			showTopMenu: true,
			shwoExtendMenu: false,
			isShowingChangePasswordDialog: false,
			oldPassword: '',
			newPassword: '',
			newPasswordAgain: ''
		}
	},
	computed: {
		...mapState({
			sidebar: state => state.app.sidebar,
			device: state => state.app.device,
			showSettings: state => state.settings.showSettings,
			needTagsView: state => state.settings.tagsView,
			fixedHeader: state => state.settings.fixedHeader
		}),
		classObj() {
			return {
				'top-menu-shown': this.showTopMenu,
				hideSidebar: !this.sidebar.opened,
				openSidebar: this.sidebar.opened,
				withoutAnimation: this.sidebar.withoutAnimation,
				mobile: this.device === 'mobile'
			}
		}
	},
	watch: {
		showTopMenu(val) {
			setTimeout(() => {
				Bus.$emit('resetTopMenu', val)
			}, 400)
		}
	},
	methods: {
		handleClickOutside() {
			this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
		},
		hideTopMenu() {
			this.showTopMenu = false
		},
		switchExtendMenu(flag) {
			this.shwoExtendMenu = flag
		}
	},
	mounted() {
		Bus.$on('hideTopMenu', this.hideTopMenu)
		Bus.$on('switchExtendMenu', this.switchExtendMenu)
	}
}
</script>

<style lang="scss">
$topMenuHeight: 65px;
@mixin flexRowStart {
	display: flex;
	flex-flow: row nowrap;
	justify-content: flex-start;
	align-items: flex-start;
}
.app-wrapper {
	height: 100%;
	overflow: hidden;
}
.top-menu-wrap {
	position: relative;
	width: 100%;
	height: $topMenuHeight;
	padding: 0;
	margin: 0;
	top: 0;
	left: 0;
	border-bottom: 1px solid #ccc;
	transition: all 0.3s linear;
	// box-shadow: 0 0 10px 2px #ccc;
	&.hide-fixed {
		height: 0px;
		overflow: hidden;
	}
}
.bottom-content-wrap {
	position: relative;
	@include flexRowStart;
	// margin-top: $topMenuHeight;
	height: 100%;
	.sidebar-container {
		background: rgb(48, 65, 86);
	}
	.show-fixed {
		position: absolute;
		top: 20px;
		right: 40px;
		cursor: pointer;
		z-index: 3000;
		visibility: hidden;
		&.show-slowly {
			visibility: visible;
			transition: all 1s ease 1s;
		}
	}
}
.top-menu-shown {
	height: calc(100% - #{$topMenuHeight});
	overflow: hidden;
}
.main-container {
	height: 100%;
}
// .app-main{
//   height: 100%;
//   overflow: auto;
// }
#app .app-main-inner {
	font-size: 12px;
	line-height: 28px;
}
// #app .app-main-inner .el-dialog__body{
//   padding:10px 40px;
// }
/* #app .app-main-inner .el-dialog__body .el-form .el-form-item{
    margin-bottom: 8px;
  }
  #app .app-main-inner .el-dialog__body .el-form .el-form-item__error{
   position: relative;
  } */
/* .el-form .el-form-item__error{
   position: relative !important;
  } */
/* #app .app-main-inner .el-dialog__body .el-form .el-form-item__content .el-select{
    width: 100%;
  } */
#app .app-main-inner-row {
	display: flex;
	justify-content: space-between;
	padding: 8px 16px 0 16px;
}
#app .app-main-inner-row .el-tabs__content {
	padding: 0 15px;
}
#app .app-main-inner-row .el-tabs__item {
	height: 29px;
	font-size: 12px;
	line-height: 28px;
}
#app .app-main-inner-row .el-tabs {
	background-color: #f5f7fa;
	/*background-color: #f0f2f5;*/
}
/* #app .app-main-inner-row .el-form-item{
    margin-bottom: 3px;
  } */
#app .el-form-item__label {
	font-size: 12px;
	font-weight: normal;
}
#app .app-main-inner-row .el-form .el-col {
	margin-top: 10px;
}
#app .app-main-inner-row .el-form .el-col .el-form-item-group {
	background-color: #fff;
	padding: 18px;
	box-shadow: 1px 1px 15px rgba(0, 0, 0, 0.1);
}
/*#app .app-main-inner-row .el-form .el-col .el-form-item-group .el-input__inner{*/
/*height: 28px;*/
/*}*/
#app .app-main-inner-row .el-form .el-col .el-form-item-group .el-date-editor,
#app .app-main-inner-row .el-form .el-col .el-form-item-group .el-select {
	width: 100%;
}
/* #app .app-main-inner-row .el-form .el-col .el-form-item-group .el-form-item__content .el-textarea{
    margin-top: 6px;
    margin-bottom: 2px;
  }
  .edi-wrapper .el-form-item{
    margin-bottom: -9px!important;
  }
  .edi-wrapper .el-form-item .el-input__inner{
    border-radius: 0!important;
  } */

.pinned-top-bar {
	background-color: #fff;
	position: fixed;
	top: 0;
	z-index: 1002;
	width: 100%;
}

/** Dangerous **/
.el-message-box__wrapper
	.el-message-box
	.el-message-box__btns
	button:first-child {
	float: right;
	margin-left: 10px;
}
/* #app .el-form-item{
    margin-bottom: 3px;
  } */
/* #app .el-form-item .el-select--mini{
    width:100%;
  } */

/* #app .el-form-item-group-card{
    padding: 15px;
    background-color: #fff;
    box-shadow: 1px 1px 15px rgba(0,0,0,.1)
  } */

#app .app-main-inner .button-in-grid-success {
	color: #67c23a;
}
#app .app-main-inner .button-in-grid-warning {
	color: #e6a23c;
}
#app .app-main-inner .button-in-grid-danger {
	color: #f78989;
}

/* #app .el-form-item:not(.multiple-item-select) .el-input__inner {
    height: 28px!important;
  } */
/** Dangerous **/

/** el-table start **/
#app .app-main-inner .el-table .el-table-row-header th {
	font-weight: normal;
	font-size: 12px;
	color: black;
	text-align: center;
}

#app .app-main-inner .el-table .el-table__header th,
#app .app-main-inner .el-table .el-table__header tr,
#app .app-main-inner .el-table .el-table__body tr,
#app .app-main-inner .el-table .el-table__body td {
	padding: 0;
	height: 25px;
}
#app .app-main-inner .el-table .el-table__body .el-table__row td .cell {
	padding: 0;
	padding-left: 10px;
}
/** el-table end **/
/* #app .app-main-inner-row .el-table .el-form-item__error{
    padding-top: 0px;
    margin-top: -5px;
  } */

/*input content right align*/
/* #app .input-content-right input{
    text-align:right;
  } */

/* #app .el-input-number .el-input input{
    text-align:right
  } */

/*.el-checkbox__label*/
/* #app .el-checkbox__label,.el-radio__label{
    font-size:12px;
  } */

/*ag-grid start*/
.ag-theme-balham .ag-row-even {
	background-color: rgba(249, 205, 127, 0.01);
}
.ag-theme-balham .ag-row-odd {
	background-color: #f3f4f9;
}
.ag-theme-balham .ag-row-hover {
	background-color: rgba(24, 144, 255, 0.2) !important;
}
// .ag-theme-balham  .ag-row-focus{
//     background-color: #97beff;
//   }
#app .clear-detail .ag-theme-balham .clear-history-row {
	background-color: #ffd383;
}
.ag-theme-balham .ag-menu {
	z-index: 99;
}
/*ag-grid end*/

/*require item start*/
/*#app .el-form-item.is-required-after:not(.is-no-asterisk) > .el-form-item__label:after,
  .el-form-item.is-required-after:not(.is-no-asterisk) .el-form-item__label-wrap > .el-form-item__label:after {
    content: '*';
    color: #ff4949;
    margin-left: 4px;
  }*/
/* #app .el-form-item.is-required-after > .el-form-item__label:after,
  .el-form-item.is-required-after .el-form-item__label-wrap > .el-form-item__label:after {
    content: '*';
    color: #ff4949;
    margin-left: 4px;
  } */
/*require item end*/
</style>
<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "~@/styles/variables.module.scss";
.fixed-header {
	// position: fixed;
	// top: 0;
	// right: 0;
	// z-index: 9;
	// width: calc(100% - #{$sideBarWidth});
	width: 100%;
	transition: width 0.28s;
}

// .hideSidebar .fixed-header {
//   width: calc(100% - 60px)
// }

.mobile .fixed-header {
	width: 100%;
}
.extend-mark {
	width: 100%;
	height: 100%;
	position: absolute;
	top: 0;
	left: 0;
	background: rgba(0, 0, 0, 0.3);
	display: none;
}
.extend-mark-active {
	display: block;
	z-index: 100;
}
</style>
