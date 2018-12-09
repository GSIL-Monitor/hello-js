<template>
  <div class='country-list-container' v-if="countryListShow">
    <div class="sug-div" id="sug-div">
      <Input
        v-model="country"
        placeholder="中文/拼音/首字母搜索国家地区"
        type="text"
        :clearable="true"
        class="sug-input"></Input>
      <span class="cancel" @click="cancelSelect($event)">取消</span>
    </div>
    <IndexList
    :data="cityData"
    @select="selectItem"
    >
    </IndexList>
    <div class="search-result" v-if="resultCountryData.length > 0">
      <ul>
        <li v-for="item in resultCountryData"
         :key="item.name" class="border-bottom-1px font-14" @click="chooseItem(item, $event)">{{item.name}}</li>
      </ul>
    </div>
    <div class="search-result no-result" v-if="country.length > 0 && !resultCountryData.length">
      <CommonError :show="true" :tips="tips" :subTips="subTips"></CommonError>
    </div>
  </div>
</template>
<script>
import { Style, IndexList, Input } from "cube-ui";
import { mapGetters, mapActions } from "vuex";
import CommonError from "@/components/Common/commonError.vue";
// import api from "@/service/api.js";
// import { getJP } from '@/utils/pinyin.js';

export default {
  name: "CountryList",
  components: {
    IndexList,
    Input,
    CommonError
  },
  data() {
    return {
      country: "",
      cityData: [],
      countryData: null,
      resultCountryData: [],
      renderCount: 0,
      tips: "查询无结果",
      subTips: "换个查询试试"
    };
  },
  props: {
    countryListShow: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters({
      countryList: "countryList"
    })
  },
  created() {},
  mounted() {
    this.Omega('train_ticket_addpa_country_sw', '添加乘客国家地区页面展现');
  },
  beforeDestroy() {},
  destroyed() {},
  watch: {
    // 当输入城市名称——检索
    country: "filterCountry",
    countryList: {
      handler: function(val, oldVal) {
        this.queryStationList()
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    selectItem(item) {
      this.$emit("on-select", item);
    },
    queryStationList() {
      this.cityData = [];
      this.countryData = [...this.countryList];
      this.countryList && this.countryList.forEach(item => {
        this.cityData.push({
          name: item.index,
          items: item.countries
        });
      });
    },
    // 搜索sug
    filterCountry(curVal, oldVal) {
      this.resultCityData = [];
      if (!curVal.length) {
        this.resultCountryData = [];
      } else {
        let stationTemp = [];
        this.countryData.forEach(item => {
          item.countries.forEach(country => {
            if (
              !country.jp.indexOf(curVal.toLowerCase(), 0) ||
              !country.pinyin.indexOf(curVal.toLowerCase(), 0) ||
              country.name.indexOf(curVal, 0) > -1
            ) {
              stationTemp.push(country);
            }
          });
        });
        this.resultCountryData = stationTemp;
      }
    },
    // 点击选中
    chooseItem(item, e) {
      this.city = "";
      this.$emit("on-select", item);
      e.stopPropagation();
    },
    // 取消
    cancelSelect(e) {
      this.city = "";
      this.$emit("on-cancel");
      e.stopPropagation();
      this.Omega('train_ticket_addpa_cancle_ck', '添加乘客国家地区页面取消按钮点击');
    },
  }
};
</script>
<style lang='less'>
@import '~assets/styles/var.less';
.country-list-container {
  background: #f3f4f5;
  text-align: left;
  z-index: @z-cityList;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  overflow: hidden;
  .sug-div {
    margin-bottom: .83rem;
    position: relative;
    background-color: #fff;
    padding: 0.83rem;
    height: 2.81rem;
    .cube-input {
      margin-right: 3.79rem;
      .cube-input-field {
        caret-color: #fc9153;
        padding: 8px;
        padding-left: 0 !important;
      }
    }
    .cube-input-append {
      height: 1.5rem;
      border-right: 1px solid #e6e6e6;
    }
    .cube-input::after {
      border: none;
    }
    .cancel {
      position: absolute;
      right: 0.83rem;
      top: 1.83rem;
      font-size: 14px;
      color: #999999;
    }
  }
  .cube-index-list{
    margin: 0 .83rem;
    box-shadow: 0 2px 6px 0 rgba(0,0,0,0.08);
    border-radius: 2px;
    &::before{
      content: '';
      display: block;
      width: 100%;
      height: 10px;
      background: #ffffff;
    }
    .cube-scroll-wrapper{
      top: 10px;
    }
    .cube-index-list-fixed{
      top: 10px;
    }
    .cube-index-list-item {
      height: 4.21rem;
      line-height: 4.21rem;
      border-bottom: 0.08rem solid rgba(0, 0, 0, 0.04);
    }
    .cube-index-list-content{
      & > ul{
        & > li:last-child{
          margin-bottom: 70px;
        }
      }
    }
  }
  .search-result {
    position: absolute;
    bottom: 0;
    top: 5.44rem;
    left: 0.83rem;
    right: 0.83rem;
    background: #ffffff;
    color: #333;
    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.08);
    border-radius: 2px;
    overflow-y: scroll;
    z-index: @z-cityList;
    li {
      height: 4.17rem;
      line-height: 4.17rem;
      padding-left: 1.5rem;
    }
  }
  .no-result{
    background: #f3f4f5;
  }
  .noresult {
    text-align: center;
  }
}
</style>
