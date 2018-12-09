<!--预约、待出行、全部订单页 -->
<template>
  <div class="order-list" :class="{ 'empty-list': isEmpty, 'is-fullof-screen': isFullof, 'grab-list': orderStatus == ORDER_TYPE_GRAB }">
    <!-- 抢票且无订单，显示抢票首页 -->
    <GrabAdvertise v-if="orderStatus === ORDER_TYPE_GRAB && noResultShow" style="margin-bottom: 100px;"></GrabAdvertise>
    <div v-else class="scroll-wrapper" :style="{ 'height': swHeight + 'px' }">
      <Scroll
        :options="options"
        @pulling-down="onPullingDown"
        ref="scroll"
      >
        <div class="order-list-container">
          <Loading v-show="loading" class="loading-fixed" v-if="!pullLoading"></Loading>
          <OrderCard
             v-for="(item, index) in orderData"
             :key="ts + '_' + index"
             :orderInfo="item"
             @onClick="toOrderDetail(item)">
          </OrderCard>
          <div class="error-content" v-if="noResultShow" @click="queryOrderList">
            <CommonError :show="noResultShow" :tips="tips" :subTips="subTips" :errorType="errorType"></CommonError>
          </div>
        </div>
        <!-- <CustomerService v-if="customerShow && isFullof" omegaKey="train_ticket_allorder_service_ck" omegaName="订单列表页面客服点击"></CustomerService> -->
      </Scroll>
    </div>
    <!-- <CustomerService v-if="customerShow && !isFullof" omegaKey="train_ticket_allorder_service_ck" omegaName="订单列表页面客服点击"></CustomerService> -->
    <div v-if="orderStatus === ORDER_TYPE_GRAB">
      <div class="fixed-bottom-tips fixed-bottom-container-shadow">
        查看<span class="radius-orange-span">?</span><span style="color:#FC9153" @click="grabTips">抢票攻略</span>
      </div>
      <div class="fixed-bottom-container">
        <div class="fixed-bottom-btn" @click="addGrapTicket">添加抢票</div>
      </div>
    </div>
  </div>
</template>
<script>

const ORDER_TYPE_ALL = 0 // 全部订单
const ORDER_TYPE_RECENT = 1 // 待出行订单
const ORDER_TYPE_GRAB = 2 // 抢票订单

import format from "date-fns/format";
import { mapGetters, mapActions } from "vuex";
import { Scroll, Loading } from "cube-ui";
import CommonError from "@/components/Common/commonError.vue";
import CustomerService from "@/components/CustomerService/index.vue";
import GrabAdvertise from "./grabAdvertise.vue";
import OrderCard from "./orderCard.vue";
import api from "@/service/api.js";
import {
  computedScrollWrapperHeight,
  pullDownRefresh
} from "utils/pullRefresh";

export default {
  components: {
    Scroll,
    Loading,
    OrderCard,
    CommonError,
    CustomerService,
    GrabAdvertise
  },
  data() {
    return {
      ORDER_TYPE_ALL,
      ORDER_TYPE_RECENT,
      ORDER_TYPE_GRAB,
      loading: false,
      orderStatus: 0,
      orderData: [],
      noResultShow: false,
      tips: "",
      subTips: "",
      errorType: 2, // errorType对应展示图标 2无订单 1网络异常
      swHeight: 0,
      pullDownRefresh: pullDownRefresh,
      pullLoading: false,
      customerShow: false,
      ts: "",
      isFullof: false,
      isEmpty: false
    };
  },
  props: {},
  computed: {
    ...mapGetters({
      servicePhone: "servicePhone",
      isWeChat: "isWeChat",
      isAliPay: "isAliPay"
    }),
    options() {
      return {
        observeDOM: true,
        click: true,
        probeType: 1,
        scrollbar: false,
        pullDownRefresh: this.pullDownRefresh,
        pullUpLoad: false
      };
    }
  },
  created() {},
  mounted() {
    document.getElementsByTagName("title")[0].innerHTML = "滴滴火车票"; // 从协议页物理返回时，beforeDestory可能不会被执行
    this.ts = new Date().valueOf();
    let pageTitle = this.fecthOrderStatus();
    let self = this;
    this.changeHeader();
    this.queryOrderList();
    // 1、全部订单页，swHeight = 设备高度-HeaderHeight
    // 2、抢票订单页，swHeight = 设备高度-HeaderHeight-BtnGrabHeight
    if (this.orderStatus == ORDER_TYPE_GRAB) {
      let btnGrabHeight = 100; // bottom处fix布局的抢票按钮的高度
      this.swHeight = computedScrollWrapperHeight() - btnGrabHeight;
      this.Omega("train_ticket_grablist_sw", "抢票列表页面展现");
    } else {
      let hackHeight = 0;
      if (this.isAliPay && this.isIPhoneX()) {
        hackHeight = 34;
      }
      this.swHeight = computedScrollWrapperHeight() - hackHeight;
    }
    if (this.orderStatus === ORDER_TYPE_RECENT) {
      this.Omega("train_ticket_wait_sw", "待出行页面展现");
    }
    if (this.orderStatus === ORDER_TYPE_ALL) {
      this.Omega("train_ticket_allorder_sw", "订单列表页面展现");
    }
    // this.disabledBFCache()
  },
  beforeDestroy() {},
  destroyed() {},
  watch: {},
  methods: {
    ...mapActions(["changeHeader"]),
    isIPhoneX(fn) {
      var u = navigator.userAgent;
      var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios终端
      if (isIOS) {
        if (screen.height == 812 && screen.width == 375) {
          // 是iphoneX
          return true;
        } else {
          // 不是iphoneX
          return false;
        }
      }
    },
    onPullingDown() {
      this.pullLoading = true;
      this.queryOrderList();
    },
    // 订单状态判断 0——全部、1——待出行、2——预约抢票
    fecthOrderStatus() {
      const { order_status } = this.$route.query;
      this.orderStatus = parseInt(order_status, 10);
      switch (this.orderStatus) {
        case ORDER_TYPE_ALL:
          return "全部订单";
        case ORDER_TYPE_RECENT:
          return "待出行订单";
        case ORDER_TYPE_GRAB:
          return "抢票订单";
        default:
          return "";
      }
    },
    // 获取用户订单
    async queryOrderList() {
      this.loading = true;
      this.noResultShow = false;
      const params = {
        order_status: this.orderStatus,
        ts_webapp_request: new Date().valueOf() // 避免浏览器回退时，该get请求被缓存
      };
      // console.log('fetch list' + new Date().valueOf());
      const res = await api.fetchListOrder(params);
      if (res.errno === 0) {
        let { data } = res;
        // 如果存在抢票订单，更改start_date格式
        this.orderData =
          data &&
          data.map(item => {
            if (item.sub_type === 2) {
              let start_date =
                item.start_date &&
                item.start_date.map(item => {
                  // item example: 20180202
                  return format(item, "MM.DD");
                });
              return { ...item, start_date };
            }
            return { ...item };
          });
        // this.orderData = data;
        if (!data.length) {
          this.noResultShow = true;
          this.tips = "暂无订单";
          this.subTips = "";
          this.errorType = 2;
          this.isEmpty = true
        }
      } else {
        // 清除订单信息
        this.orderData = [];
        this.noResultShow = true;
        this.tips = res.errmsg || "网络连接异常";
        this.subTips = "点击屏幕，重新加载";
        this.errorType = 1;
        this.isEmpty = true
      }
      this.$refs.scroll.forceUpdate();
      this.pullLoading = false;
      this.loading = false;
      this.customerShow = true;
      this.computedServicePos()
    },
    // 跳转订单详情
    toOrderDetail(orderInfo) {
      if (this.orderStatus === ORDER_TYPE_RECENT) {
        this.Omega("train_ticket_wait_ticket_ck", "我的行程页面车票点击");
      }
      this.$router.push({
        path: "/orderDetail",
        query: {
          order_id: orderInfo.order_id,
          sub_type: orderInfo.sub_type,
          local_city: this.$route.query.local_city,
          order_status: this.$route.query.order_status
        }
      });
    },
    addGrapTicket() {
      this.Omega("train_ticket_grablist_add_ck", "抢票列表页面添加抢票点击");
      let { query } = this.$route;
      this.$router.push({
        path: "/grabTicket",
        query: {
          train_date: query.train_date,
          from_station_code: query.from_station_code,
          from_station_name: query.from_station_name,
          to_station_code: query.to_station_code,
          to_station_name: query.to_station_name,
          local_city: query.local_city
        }
      });
    },
    // 跳转抢票攻略
    grabTips() {
      this.Omega(
        "train_ticket_grablist_raiders_ck",
        "抢票列表页右上角抢票攻略点击"
      );
      this.$router.push({
        name: "GrabNotice"
      });
    },
    // 计算“联系客服”模块是否需要fixed
    // 当内容未满一屏时，需要fixed在页面底部
    // 否则，跟在最后一个orderCard后展示即可
    computedServicePos() {
      this.$nextTick(() => {
        let ele = document.querySelector('.order-list-container')
        if (ele) {
          let orderListHeight = ele.offsetHeight
          const { innerHeight } = window // 视窗高度
          let { order_status } = this.$route.query
          let btnGrabHeight = 100 // 底部抢票按钮组件(fixed)的高度
          let orderListViewHeight = order_status == ORDER_TYPE_GRAB ? innerHeight - btnGrabHeight : innerHeight
          if (orderListHeight < orderListViewHeight) {
            this.isFullof = false
          } else {
            this.isFullof = true
          }
        }
      })
    }
  }
};
</script>
<style lang="less" scoped>
.order-list-container {
  overflow-y: scroll;
}
.order-list {
  .error-content {
    text-align: center;
    .noresult {
      background: #f3f4f5;
    }
  }
  .service-phone-fixed {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
  }
  // 吸底提示及按钮
  .fixed-bottom-tips {
    font-family: PingFangSC-Regular;
    font-size: 10px;
    background-color: #fafafa;
    color: #666666;
    text-align: left;
    width: 100%;
    line-height: 30px;
    padding: 0 1.33rem;
    position: fixed;
    bottom: 70px;
    .radius-orange-span {
      text-align: center;
      vertical-align: baseline;
      display: inline-block;
      width: 13px;
      line-height: 13px;
      border-radius: 50%;
      background-color: #fc9153;
      color: #ffffff;
      margin: 0 0.39rem;
    }
  }
  .fixed-bottom-btn {
    height: 50px;
    line-height: 50px;
    background: #444654;
    // background: #fc9153;
    text-align: center;
    font-size: 17px;
    color: #ffffff;
    border-radius: 2px;
    // margin: 10px 0.83rem;
  }
  .customer-service {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
  }
}

.empty-list {
  .order-list-container {
    min-height: inherit;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .noresult {
    margin-top: 0;
  }
}

.is-fullof-screen {
  .customer-service {
    position: relative;
    bottom: inherit;
  }
  &.empty-list {
    .customer-service {
      position: fixed;
      bottom: 0;
    }
  }
}

.grab-list {
  .customer-service {
    bottom: 100px;
  }
  &.is-fullof-screen {
    .customer-service {
      position: relative;
      bottom: inherit;
    }
  }
  &.empty-list {
    .customer-service {
      display: none;
      // position: relative;
      // bottom: inherit;
    }
  }
}

</style>
