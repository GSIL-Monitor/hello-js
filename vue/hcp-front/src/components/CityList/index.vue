<template>
  <div class='city-list-container' v-if="cityListShow">
    <div class="sug-div" id="sug-div">
      <input
        v-model="city"
        placeholder="中文/拼音/首字母搜索城市"
        @keydown="inputKeydown"
        class="sug-input"></input>
      <img src="../../assets/images/cancel@3x.png" alt="" class="cancel-icon"
        v-show="city.trim().length > 0" @click="clearInputCity" />
      <div class="right-border" v-show="city.trim().length > 0"></div>
      <span class="cancel-btn" @click="cancelSelect($event)">取消</span>
    </div>
    <IndexList
    :data="cityData"
    >
      <cube-index-list-group
        v-for="(group, index) in cityData"
        :key="index"
        :group="group">
          <cube-index-list-item
          v-for="item in group.items"
          :key="item.name"
          :item="item"
          @select="selectItem(group.groupname, item)"
          >
          <div v-if="item.name"
          :class="{'custom-item' : group.groupname == 'location' || group.groupname == 'hotcity'}">
          <img src="~assets/images/location@3x.png" alt="" v-if="item.index === 'location'">
            {{item.name}}
          </div>
        </cube-index-list-item>
      </cube-index-list-group>
    </IndexList>
    <div class="search-result" v-if="resultCityData.length > 0">
      <ul>
        <li v-for="item in resultCityData"
         :key="item.name" class="border-bottom-1px font-14" @click="chooseItem(item, $event)">{{item.name}}</li>
      </ul>
    </div>
    <div class="search-result no-result" v-if="city.trim().length > 0 && !resultCityData.length">
      <CommonError :show="true" :tips="tips" :subTips="subTips"></CommonError>
    </div>
  </div>
</template>
<script>
import { Style, IndexList, Input } from "cube-ui";
import { mapGetters, mapActions } from "vuex";
import CommonError from "@/components/Common/commonError.vue";
// import api from "@/service/api.js";
import { getJP } from '@/utils/pinyin.js';

export default {
  name: "CityList",
  components: {
    IndexList,
    // Input,
    CubeIndexListGroup: IndexList.Group,
    CubeIndexListItem: IndexList.Item,
    CommonError
  },
  data() {
    return {
      city: "",
      cityData: [],
      stationData: null,
      resultCityData: [],
      renderCount: 0,
      tips: "查询无结果",
      subTips: "换个查询条件试试"
    };
  },
  props: {
    cityListShow: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters({
      searchHotCity: "searchHotCity",
      cityList: "cityList",
      localCity: 'localCity'
    })
  },
  created() {},
  mounted() {

  },
  beforeDestroy() {},
  destroyed() {},
  watch: {
    // 当输入城市名称——检索
    city: "filterCity",
    searchHotCity: "renderHotCity",
    cityListShow: {
      handler: function(val, oldVal) {
        console.log('cityList show change');
        val && this.Omega('train_ticket_sta_sw','车站站点页面展示');
      },
      immediate: true,
      deep: true
    },
    cityList: {
      handler: function(val, oldVal) {
        this.queryStationList()
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    selectItem(groupname, item) {
      this.$emit("on-select", item);
      if (!this.cityData[0].items.length || this.cityData[0].items[0].code !== item.code) {
        this.saveHistroyStation(item)
      }
      // eslint-disable-next-line
      if(groupname === 'location'){
        // eslint-disable-next-line
        if(item.index === 'location') { // 定位城市index标识为location
          this.Omega('train_ticket_sta_loca_ck', '车站站点定位城市点击');
        } else {
          this.Omega('train_ticket_sta_his_ck', '车站站点历史查询城市点击');
        }
      } else if (groupname === 'hotcity') {
        this.Omega('train_ticket_hotsta_popu_ck', '车站站点热门站点点击');
      } else {
        this.Omega('train_ticket_sta_popu_ck', '车站站点页面列表车站点击');
      }
    },
    queryStationList() {
      this.cityData = [
        {
          name: "当前定位/历史搜索",
          groupname: "location",
          items: []
        },
        {
          groupname: "hotcity",
          name: "热门城市",
          items: []
        }
      ];
      this.stationData = [...this.cityList];
      // 获取定位城市
      let localCity = ''
      try {
        localCity = this.localCity || this.$route.query.local_city || JSON.parse(localStorage.getItem("localCity"));
        // 通过定位城市获取城市对应的code
        let hostCityObjTemp = {};
        if (localCity && localCity !== 'null') {
          hostCityObjTemp[localCity] = this.filterStationCode(localCity)
          this.cityData[0].items.unshift(hostCityObjTemp[localCity]);
        }
      } catch (e) {
        // eslint-disable-next-line
      }
      // 历史记录
      let hostCity = []
      try {
        hostCity = JSON.parse(localStorage.getItem("history_log_array"));
        // eslint-disable-next-line
        hostCity &&
        hostCity.forEach(item => {
          this.cityData[0].items.push(item);
        });
      } catch (e) {
        // eslint-disable-next-line
      }
      this.renderHotCity();
      this.cityList.forEach(item => {
        this.cityData.push({
          name: item.index,
          items: item.stations
        });
      });
    },
    // 根据定位城市筛选城市code
    filterStationCode(localCity) {
      let localCityTemp = {}
      // eslint-disable-next-line
      this.cityList && this.cityList.forEach(item => {
        item.stations.forEach(station => {
          if (station.name === localCity) {
            localCityTemp = { ...station, index: 'location' }
          }
        })
      })
      return localCityTemp
    },
    // 热门城市
    renderHotCity() {
      if (!this.cityData[1].items.length) {
        // eslint-disable-next-line
        this.searchHotCity &&
          this.searchHotCity.forEach(item => {
            this.cityData[1].items.push({
              name: item.name,
              code: item.code
            });
          });
      }
    },
    // 搜索sug
    inputKeydown() {
      window.focus();
      document.querySelector('.sug-input').focus();
      this.Omega('train_ticket_sta_search_ck', '车站页搜索框点击');
    },
    filterCity(val, oldVal) {
      this.resultCityData = [];
      let curVal = val.trim() // 去掉首尾的空格
      if (!curVal.length) {
        this.resultCityData = [];
      } else {
        let stationTemp = [];
        this.stationData.forEach(item => {
          item.stations.forEach(station => {
            if (
              !station.jp.indexOf(curVal.toLowerCase(), 0) ||
              !station.pinyin.indexOf(curVal.toLowerCase(), 0) ||
              station.name.indexOf(curVal, 0) > -1
            ) {
              stationTemp.push(station);
            }
          });
        });
        this.resultCityData = stationTemp;
      }
    },
    clearInputCity() {
      this.city = ''
      this.Omega('train_ticket_sta_clear_ck', '车站页搜索框输入内容后的叉叉按钮点击');
    },
    // 点击选中
    chooseItem(item, e) {
      this.city = "";
      if (!this.cityData[0].items.length || this.cityData[0].items[0].code !== item.code) {
        this.saveHistroyStation({ name: item.name, code: item.code })
      }
      // this.saveHistroyStation({ name: item.name, code: item.code })
      // 点击存入历史城市—— 最多展示4个
      this.$emit("on-select", item);
      e.stopPropagation();
    },
    // 取消
    cancelSelect(e) {
      this.city = "";
      this.$emit("on-cancel");
      e.stopPropagation();
      this.Omega('train_ticket_sta_cancle_ck', '车站页取消按钮点击');
    },
    // 将点击结果保存到localStorage中
    saveHistroyStation(item) {
      // 点击存入历史城市—— 最多展示4个
      try {
        let history_log_array = JSON.parse(localStorage.getItem("history_log_array"))
        if (history_log_array && history_log_array.length > 0) {
          // 如果有搜索城市历史，只保留最新的四个历史
          let is_exit_index = history_log_array.findIndex(station => JSON.stringify(station) === JSON.stringify(item))
          if (is_exit_index > -1) {
            // 历史记录存在选中站点——删除站点
            history_log_array.splice(is_exit_index, 1)
          }
          history_log_array.unshift({ ...item })
          history_log_array = history_log_array.slice(0, 4)
          localStorage.setItem("history_log_array", JSON.stringify(history_log_array));
        } else {
          // 无历史记录，将点击城市保存在localStorage中
          let history_log = [];
          history_log.push(item)
          localStorage.setItem("history_log_array", JSON.stringify(history_log));
        }
      } catch (e) {
        // eslint-disable-next-line
      }
    }
  }
};
</script>
<style lang='less'>
@import '~assets/styles/var.less';
.city-list-container {
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
    margin-bottom: 0.83rem;
    display: flex;
    align-items: center;
    background-color: #fff;
    padding: 0.83rem;
    height: 2.81rem;
    .sug-input {
      flex: 1;
      caret-color: #fc9153;
    }
    .cancel-icon {
      width: 16px;
      height: 16px;
      margin-left: 0.83rem;
      margin-right: 0.83rem;
    }
    .right-border {
      height: 1.5rem;
      margin-right: 1rem;
      border-right: 1px solid #e6e6e6;
    }
    .cancel-btn {
      font-size: 14px;
      color: #999999;
    }
  }
  .cube-index-list {
    margin: 0 0.83rem;
    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.08);
    border-radius: 2px;
  }
  .cube-index-list-fixed {
    background: #ffffff;
  }
  .cube-scroll-wrapper {
    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.08);
    border-radius: 2px;
  }
  .cube-index-list-nav {
    transform: translateY(-60%);
    & > ul {
      & > li:nth-child(1),
      & > li:nth-child(2) {
        display: none;
      }
    }
  }
  .cube-index-list-nav > ul > li {
    padding: 6px 12px 0 12px;
  }
  .cube-index-list-content {
    & > ul {
      & > li:nth-child(1),
      & > li:nth-child(2) {
        h2 {
          background: #fff;
        }
        & > ul {
          margin: 0 1.33rem;
          li {
            display: inline-block;
            margin-right: 0.83rem;
            margin: 0 0.83rem 0.83rem 0;
            padding: 0;
          }
          div {
            width: 7.67rem;
            max-width: 7.67rem;
            height: 30px;
            font-size: 14px;
            line-height: 30px;
            text-align: center;
            border: 1px solid rgba(74, 76, 91, 0.4);
            border-radius: 2px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            padding: 0;
            box-sizing: border-box;
          }
        }
      }
      & > li:last-child {
        margin-bottom: 70px;
      }
      .custom-item img {
        width: 16px;
        height: 16px;
        vertical-align: sub;
        margin-right: -3px;
      }
      & > li:nth-child(n + 3) {
        .cube-index-list-item {
          padding: 0 1.33rem;
          height: 4.21rem;
          line-height: 4.21rem;
          border-bottom: 0.08rem solid rgba(0, 0, 0, 0.04);
        }
        .cube-index-list-item_active {
          // background: #fff;
          background: rgba(0,0,0,0.04);
        }
      }
    }
  }
  .cube-index-list-group .cube-index-list-item {
    & > div {
      font-size: 14px;
      color: #333;
    }
  }
  @media only screen and (min-device-width: 320px) and (max-device-width: 320px) and (-webkit-min-device-pixel-ratio: 2) {
    .cube-index-list-content {
      .cube-index-list-item .custom-item {
        width: 6.5rem;
        max-width: 6.5rem;
        font-size: 12px;
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
  .no-result {
    background: #f3f4f5;
    // background: transparent;
  }
  .noresult {
    text-align: center;
  }
}
</style>
