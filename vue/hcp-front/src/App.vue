<template>
  <div id="app">
    <!-- <div class="header" v-show="$route.path !=='/' && !headerStatus">
      <i class="header-left cubeic-back" @click="goBack"></i>
      <span class="header-center">{{pageTitle}}</span>
      <span :class="`header-right font-14 ${headerRightTextClass}`" @click="rightTextCallback">{{headerRightText}}</span>
    </div> -->
    <Back></Back>
    <router-view/>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex"
import { getWebView } from "@/utils/userAgent"
import api from "service/api";
import { config } from '@/config/appConf.js'
import Back from '@/components/BackHomePage/back'

export default {
  name: "App",
  components: {
    Back
  },
  data() {
    return {};
  },
  props: {},
  computed: {
    ...mapGetters({
      headerStatus: "headerStatus",
      pageTitle: "pageTitle",
      omegaKey: "omegaKey",
      omegaParams: "omegaParams",
      omegaName: "omegaName",
      headerRightText: "headerRightText",
      servicePhone: "servicePhone",
      headerRightTextClass: "headerRightTextClass",
      headerRightUrl: "headerRightUrl",
      gobackHasCallback: "gobackHasCallback"
    })
  },
  created() {},
  mounted() {
    let webView = getWebView();
    this.detectWebView({ webView });
    this.setPassportConfig(webView)
    this.getCommonConfig();
    this.fetchStationListUrl();
  },
  beforeDestroy() {},
  destroyed() {},
  watch: {},
  methods: {
    ...mapActions([
      "changeHeader",
      "detectWebView",
      "updateServiceData",
      "updateHotCity",
      "updatePreSaleTime",
      "updateHoliday",
      "updateServicePhone",
      "updateTicketNumThreshold",
      "updateCityList",
      "updateRefundNoticeStatus",
      "updateTrainSeatGroup",
      "updateServiceStatus",
      'updatePollingInterval'
    ]),
    setPassportConfig(webView) {
      let appId = config.appIdWechat
      if (webView == 'WeChat') {
        appId = config.appIdWechat
      } else if (webView == 'Alipay') {
        appId = config.appIdAliPay
      }
      try {
        window.login.setConfig({ appid: appId })
      } catch (e) {
        console.error('set passport config failed');
      }
    },
    async getCommonConfig() {
      const res = await api.fetchCommonConfig();
      if (res && res.errno == 0) {
        let { data } = res;
        this.updatePreSaleTime({ preSaleTime: data.pre_sale_time });
        this.updateHoliday({ holiday: data.holiday })
        this.updateHotCity({ searchHotCity: data.search_hot_city });
        this.updateServiceData({
          service_time: data.service_time,
          service_time_text: data.copywriting.out_of_service_time
        });
        this.updateTrainSeatGroup({ trainSeatGroup: data.train_chose_seat_group })
        this.updateServicePhone({ servicePhone: data.customer_service_number });
        this.updateTicketNumThreshold(data.show_ticket_num_threshold); // 目前已不使用该值作为余票数量展示判断
        this.updateServiceStatus({ notServiceTime: !res.service_time_flag })
        // 抢票轮训间隔
        this.updatePollingInterval(data.grab_realtime_info_polling_interval)
      } else {
        console.log("获取公用配置信息失败");
      }
    },
    // 获取火车站点列表url地址
    async fetchStationListUrl() {
      const res = await api.fetchStationListUrl({ last_version: '1.0.2' });
      if (res.errno === 0) {
        this.fetchStaionList();
      } else {
        console.log("获取火车站点列表url地址失败");
      }
    },
    // 请求火车站点列表
    async fetchStaionList() {
      const res = await api.fetchCityList({ name: "getCityList" });
      this.updateCityList({ cityList: res.data });
    }
  }
};
</script>

<style lang="less">
@import './assets/styles/var.less';
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  .header {
    text-align: center;
    position: relative;
    height: 35px;
    display: flex;
    align-items: center;
    background-color: #fff;
    padding: 0.73rem 1.33rem;
    .header-left {
      position: absolute;
      left: 1.33rem;
      font-size: 18px;
    }
    .header-center {
      font-size: 18px;
      font-family: 'PingFangSC-Medium';
      margin: 0 auto;
    }
    .header-right {
      position: absolute;
      right: 1.33rem;
      color: #666666;
    }
  }
}
</style>
