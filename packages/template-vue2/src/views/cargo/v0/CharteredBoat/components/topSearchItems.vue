<template>
  <div :class="['search-item-wrap', {'slider-down': multipleInput}]">
    <div class="single-search" v-show="showSingleMode">
      <slot name="single">
        <el-input size="mini" type="text" placeholder="请输入船次"></el-input>
      </slot>
      <el-button class="single-btn" size="mini" @click="multipleInput = !multipleInput">
        <span v-show="!multipleInput">更多搜索条件</span>
        <span v-show="multipleInput">简单搜索条件</span>
        <i class="el-icon-arrow-down el-icon--right" v-show="!multipleInput"></i>
        <i class="el-icon-arrow-up el-icon--right" v-show="multipleInput"></i>
      </el-button>
    </div>
    <div class="mutliple-search" v-show="multipleInput">
      <slot name="mutliple">
        <el-form :inline="true" v-model="demoForm">
          <el-form-item label="船名">
            <el-input size="mini" v-model="demoForm.vesselName" placeholder="船名"></el-input>
          </el-form-item>
          <el-form-item label="船次">
            <el-input size="mini" v-model="demoForm.voyageNo" placeholder="船次"></el-input>
          </el-form-item>
        </el-form>
      </slot>
    </div>
    <div class="search-btn-wrap">
      <slot name="searchBtnGroup"></slot>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'CharteredBoatSearchBar',
    props: {
      showSingleInput: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        multipleInput: false,
        demoForm: {
          vesselName: '',
          voyageNo: ''
        }
      }
    },
    computed: {
      showSingleMode() {
        this.setMultipleInput()
        return this.showSingleInput
      }
    },
    methods: {
      setMultipleInput() {
        this.multipleInput = !this.showSingleInput
      }
    },
    created() {},
    mounted() {}
  }
</script>
<style lang="scss" scoped>
  .search-item-wrap{
    position: relative;
    width: 100%;
    height: 60px;
    overflow: hidden;
    box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.05);
    padding: 10px 20px;
    &.slider-down{
      height: auto;
    }
    .single-search{
      padding: 10px;
      height: 40px;
      display: flex;
      flex-flow: row nowrap;
      justify-content: flex-end;
      align-items: center;
      background: #f5f7f7;
      .single-btn{
        margin-left: 20px;
      }
    }
    .mutliple-search{
      padding: 10px;
       width: 100%;
    }
    .top-search-btn-wrap{
      width: 100%;
      text-align: right;
    }
  }
</style>
