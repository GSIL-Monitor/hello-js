<template>
  <div class="scroll-wrapper order-detail-wrapper" :style="{ 'height': swHeight + 'px', 'padding-bottom': paddingBottom + 'px' }">
    <Scroll
      :options="options"
      @pulling-down="onPullingDown"
      ref="scroll">
      <!-- 只有单张改签票时，后退的操作就是后退到改签票所在订单的订单详情 -->
      <div :class="['order-detail-container', grabRuntime ? 'liner-bg' : '']">
        <Loading v-show="loading" class="loading-fixed" v-if="!pullLoading"></Loading>
        <!-- 预约买票订单（先支付订单）顶部title -->
        <div class="sub_type3" v-if="orderInfo.sub_type === 3 && orderInfo.head_msg">{{orderInfo.head_msg}}</div>
        <!-- 抢票  -->
        <div class="grab-order-status" v-if="grabRuntime">
          <div class="circle-container">
            <div :class="['circle', orderInfo.grab_detail.grab_time_status === 1 ? 'animation-circle' : '']">
              <template v-if="orderInfo.grab_detail.grab_time_status === 1">
                <div class="grab-count">{{grabCount}}</div>
                <div class="desc">抢票次数</div>
              </template>
              <div v-else class="pre-sale">未开售</div>
            </div>
            <div class="breathing"></div>
          </div>
          <div class="grab-desc">
            <p class="status">{{orderInfo.grab_detail.grab_message}}</p>
            <p class="descrip" v-if="orderInfo.order_msg_detail" v-html="formatOrderMsgDetail(orderInfo.order_msg_detail)"></p>
          </div>
        </div>

        <div class="order-status" v-else>
          <p class="status">{{orderInfo.order_msg}}</p>
          <p class="descrip" v-if="orderInfo.order_msg_detail" v-html="formatOrderMsgDetail(orderInfo.order_msg_detail)"></p>
        </div>
        <!-- 从申请改签页面进入订单详情页改签待支付，改签待确认, 抢票不展示订单号及订单总价 -->
        <!-- v5.2.32 改签待支付，改签待确认 展示取票号及订单总价 -->
        <!-- 普通订单一直显示总计，对于预付订单一直显示预付，免密占座成功之前不展示票价，成功之后展示总计，对于预约买票订单显示总计 -->
        <div class="order-info font-12" v-if="orderInfo && !grabRuntime">
          <span>{{`${ orderInfo.ticket_got_no ? '取票号' : '订单号' }:${orderInfo.ticket_got_no || orderInfo.order_id}`}}</span>
          <span class="price" v-show="moneyShowType(orderInfo.sub_type, orderInfo.order_code)">
            {{`${moneyShowType(orderInfo.sub_type, orderInfo.order_code)}:￥${orderInfo.pay_fee / 100}`}}
          </span>
        </div>
        <TicketCard
          v-for="(item, index) in orderInfo.tickets"
          :key="index"
          :ticketInfo="item"
          :ticketCode="item.ticket_code"
          :mask="true"
          @on-change-ticket="changeTicket"
          @on-return-ticket="returnTicktet"
        ></TicketCard>
        <div class="error-content" v-if="noResultShow"  @click="queryOrderDetail">
          <CommonError :show="noResultShow" :tips="tips" :subTips="subTips"></CommonError>
        </div>
      </div>
      <!-- 抢票、预约买票订单 -->
      <div class="grab-container" v-if="showGrabDetailCard">
        <GrabDetailCard
          :grapOrderInfo="orderInfo.grab_detail"
          :orderCode="orderInfo.order_code"
          :orderId="orderInfo.order_id"
          :subType="orderInfo.sub_type"
          :payFee="orderInfo.pay_fee"
          :isGrabRuntime="grabRuntime"
          >
        </GrabDetailCard>
         <!-- 取消抢票 -->
        <div v-if="showGrabDetailCard && [5019, 5037, 5026].includes(orderInfo.order_code)" class="cancel-grab" @click="applyCancel('grap')">取消抢票</div>
      </div>

      <div v-if="[5001, 5017, 5030].includes(orderInfo.order_code)" class="cancel-grab big-btn" @click="applyCancel('common')">取消订单</div>
      <div v-if="orderInfo.order_code === 5036 && orderInfo.sub_type === 3 && orderInfo.order_can_change === 1" class="cancel-grab big-btn" @click="applyCancel('prepayOrder')">取消订单</div>
      <div v-if="[5010].includes(orderInfo.order_code)" class="cancel-grab big-btn" @click="applyCancel('change')">取消改签</div>

      <CustomerService
        v-if="!loading"
        omegaKey="train_ticket_ordetail_service_ck"
        omegaName="购票进入订单详情页面客服按钮点击"
        class="service-position"
        :style="{ 'margin-top': marginTop + 'px' }"
      >
      </CustomerService>
    </Scroll>
    <!-- 按钮及协议展示区 -->
    <div class="fixed-content" v-if="orderDetailBottomBtn(orderInfo.order_code)">
      <div class="btn-content fixed-bottom-container fixed-bottom-container-shadow"
       v-if="[5001,5017,5030].includes(orderInfo.order_code)">
        <!-- <div class="cancel-btn" @click="applyCancel('common')">取消订单</div> -->
        <div class="price-info">订单总额&nbsp;<span class="icon">￥</span><span class="price">{{orderInfo.need_pay_fee / 100}}</span></div>
        <div :class="`ok-btn ${orderInfo.order_can_change===1?'':'oneBtn'}`" @click="getPayId()">立即支付</div>
      </div>
      <!-- 改签三种状态展示-->
      <p class="showChangeProto fixed-bottom-container-shadow"
       v-if="showChangeProto">查看<span class="hight-light" @click="showChangeTicketProto">《改签须知》</span></p>

      <div v-if="[5010, 5016, 5034].includes(orderInfo.order_code)">
        <div class="btn-content fixed-bottom-container" v-if="[5016, 5034].includes(orderInfo.order_code)">
          <div class="cancel-btn" @click="applyCancel('change')">取消改签</div>
          <div class="ok-btn" @click="changeTicketConfirm">确认改签</div>
        </div>

        <div class="btn-content fixed-bottom-container" v-if="[5010].includes(orderInfo.order_code)">
          <div class="price-info">订单总额&nbsp;<span class="icon">￥</span><span class="price">{{orderInfo.need_pay_fee / 100}}</span></div>
          <div class="ok-btn" @click="getPayId()">立即支付</div>
        </div>
      </div>

      <!-- 预付订单（先支付）按钮展示区 预付成功且order_can_change为1展示取消按钮-->
      <!-- <div class="btn-content fixed-bottom-container fixed-bottom-container-shadow"
       v-if="orderInfo.order_code === 5036 && orderInfo.sub_type === 3 && orderInfo.order_can_change === 1">
        <div class="btn-cancel-grap" @click="applyCancel('prepayOrder')">取消订单</div>
      </div> -->
    </div>
  </div>
</template>
<script>
import TicketCard from "@/components/TicketCard/index.vue";
import CommonError from "@/components/Common/commonError.vue";
import CustomerService from "@/components/CustomerService/index.vue";
import GrabDetailCard from "./grabDetailCard.vue";
import { Loading, Scroll, Popup } from "cube-ui";

import { mapGetters, mapActions } from "vuex";

import api from "@/service/api.js";
import {
  // orderTopStatus,
  formatCountDown,
  ticketTextCss,
  moneyShowType,
  countTimeZero,
  orderDetailBottomBtn
} from "utils/orderClassStyle.js";
import { checkOpenId } from "utils/getOpenID";
import { goPay, getPayConf } from "@/service/pay.js";
import {
  computedScrollWrapperHeight,
  pullDownRefresh
} from "utils/pullRefresh";

export default {
  name: "OrderDetail",
  components: {
    Scroll,
    Loading,
    Popup,
    TicketCard,
    CommonError,
    GrabDetailCard,
    CustomerService
  },
  data() {
    return {
      checkOpenId: checkOpenId,
      // orderTopStatus,
      ticketTextCss,
      formatCountDown,
      moneyShowType,
      countTimeZero,
      orderDetailBottomBtn,
      loading: false,
      showTime: 0,
      timer: null,
      orderInfo: "",
      tips: "",
      subTips: "",
      noResultShow: false,
      pullDownRefresh: pullDownRefresh,
      swHeight: 0,
      paddingBottom: 0,
      changeTicketInfo: {},
      pullLoading: false, // 是否处于下拉刷新中，为true时，全屏中心的loading不会展示，否则会有两个loading
      loadPopup: false,
      popTitle: "",
      timeOutText: "",
      btnClickStatus: true, // 页面按钮点击状态，当页面展示dialog，toast提示按钮点击无效
      showChangeProto: false, // 当从改签页跳转过来展示改签须知，默认从订单列表进入不展示
      intervalTime: 3000,
      marginTop: 0, // 联系客服区域间距
      timeout: null, // 轮询订单详情定时器
      grabTimeout: null, // 轮询抢票次数定时器
      grabCount: 0,
      btnHeight: 70
    };
  },
  props: {},
  created() {
    // 判断从订单详情页、改签页进入
    if (this.$route.query.ticket_id) {
      this.showChangeProto = true;
    }
  },
  computed: {
    ...mapGetters({
      cityList: "cityList",
      isWeChat: "isWeChat",
      isAliPay: "isAliPay",
      pollingInterval: "pollingInterval"
    }),
    grabRuntime() {
      return this.orderInfo.sub_type === 2 && [5026, 5019, 5037].includes(this.orderInfo.order_code)
    },
    showGrabDetailCard() {
      return this.orderInfo.sub_type == 2 || (this.orderInfo.sub_type == 3 && this.orderInfo.grab_detail)
    },
    options() {
      return {
        observeDOM: true,
        click: true,
        probeType: 1,
        scrollbar: false,
        pullDownRefresh: this.pullDownRefresh,
        pullUpLoad: false
      };
    },
    computedBtnHeight() {
      return this.showChangeProto ? this.btnHeight + 30 : this.btnHeight;
    }
  },
  mounted() {
    let { isWeChat, isAliPay } = this;
    // 没有获取到openid时，通过跳转去获取openid兜底
    if (!this.checkOpenId(isWeChat, isAliPay)) {
      return;
    }
    let omegaParams = {
      // 抢票为0、购票为1
      way: this.$route.query.sub_type == 2 ? 0 : 1
    };
    this.changeHeader();

    this.Omega(
      "train_ticket_ordetail_sw",
      "正常购票进入订单详情页面展现",
      omegaParams
    );
    this.queryOrderDetail();
    // 是否立即拉起支付
    let { pay_immediately, order_id } = this.$route.query
    if (Number(pay_immediately) == 1) {
      this.getPayId(order_id)
    }

    let self = this;
    this.eventHub.$on("cancel-graborder-success", function() {
      self.queryOrderDetail();
    });
    this.setScrollStyle();
  },
  beforeDestroy() {
    clearTimeout(this.timer);
    clearTimeout(this.timeout);
    clearTimeout(this.grabTimeout);
    this.eventHub.$off("cancel-graborder-success");
  },
  destroyed() {},
  watch: {},
  methods: {
    ...mapActions(["changeHeader"]),
    onPullingDown() {
      this.pullLoading = true;
      this.queryOrderDetail();
    },
    // 将order_msg_detail中{}替换为倒计时，{￥5}高亮显示
    formatOrderMsgDetail(order_msg_detail) {
      let str = ''
      str = order_msg_detail.replace('{}',
        `<span style="color:#ff525d">${formatCountDown(this.showTime)}</span>`).replace('{',
        `<span class="hight-light">`).replace('}', `</span>`)
      return str;
    },
    // 订单倒计时
    Countdown(secondTime) {
      if (!this.timer) {
        this.timer = setInterval(() => {
          if (this.showTime > 0) {
            this.showTime--;
          } else {
            // 展示倒计时结束Dialog
            this.showComfirmDialog();
            clearInterval(this.timer);
            this.timer = null;
          }
        }, 1000);
      }
    },
    // 订单详情
    async queryOrderDetail() {
      this.loading = true;
      this.noResultShow = false;
      // 清除设置的定时器
      if (this.timeout || this.timer || this.grabTimeout) {
        clearTimeout(this.timeout);
        clearInterval(this.timer);
        clearInterval(this.grabTimeout)
        this.timeout = null;
        this.timer = null;
        this.grabTimeout = null
      }
      const { order_id, ticket_id } = this.$route.query;
      const res = await api.fetchOrderDetail({ order_id });
      if (res.errno === 0) {
        let { data } = res;
        this.orderInfo = data;
        this.grabCount = data.grab_detail && data.grab_detail.grab_times
        this.filterChangeInfo(data);
        // 如果router中存在ticket_id，订单过滤当前改签票信息
        if (ticket_id) {
          this.orderInfo.tickets =
            this.orderInfo.tickets &&
            this.orderInfo.tickets.filter(
              item => item.ticket_id === Number(ticket_id)
            );
        }
        // 如果item中存在change_ticket字段返回就是change_ticket信息
        this.filterOrderData();
        if (data.need_pay_surplus_time > 0) {
          // 支付倒计时
          this.showTime = data.need_pay_surplus_time;
          this.Countdown(this.showTime);
        } else {
          // 倒计时为0同时还处于待支付与改签待确认,展示倒计时结束Dialog
          if (countTimeZero(this.orderInfo.order_code)) { // eslint-disable-line
            this.showComfirmDialog();
          }
        }
        // 判断是否处于服务时间
        // 如果订单状态为抢票中（5019)
        // 票状态为抢票中、出票中、退票受理中、改签受理中（5003, 5011, 5006, 5019，5026，5023, 5029）需要轮询订单状态
        if (!!res.service_time_flag && this.ticketStatusPoll(this.orderInfo)) {
          this.pollOrderStatus(
            this.orderInfo.order_id,
            this.orderInfo.order_code
          );
          // 抢票次数轮询
          if (this.grabRuntime && this.orderInfo.grab_detail.grab_time_status === 1) {
            this.pollGrabCount(this.orderInfo.order_id)
          }
        }
        // 如果抢票订单，需要根据is_accept_standing决定是否往指定座席里手动添加“无座”
        this.needManualEditSeatType(data)
        this.setScrollStyle();
      } else {
        // 清除数据
        this.orderInfo = "";
        this.changeTicketInfo = {};
        this.noResultShow = true;
        this.tips = res.errmsg || "网络连接异常";
        this.subTips = "点击屏幕，重新加载";
        let serviceHeight = 50; // 联系客服按钮高度
        this.marginTop = this.swHeight - serviceHeight;
      }
      this.$refs.scroll.forceUpdate(); // 调用 Scroll 组件的forceUpdate()方法结束此次下拉刷新
      this.pullLoading = false;
      this.loading = false;
    },
    async pollGrabCount(order_id) {
      const params = {
        order_id: order_id
      }
      const res = await api.fetchGrabCounts(params)
      if (res && res.errno === 0) {
        this.grabCount = res.data.grab_times
        if (!!res.service_time_flag && this.grabRuntime) {
          this.grabTimeout = setTimeout(() => {
            this.pollGrabCount(order_id)
          }, this.pollingInterval * 1000)
        } else {
            this.queryOrderDetail()
        }
      } else {
        this.grabTimeout = setTimeout(() => {
          this.pollGrabCount(order_id)
        }, this.pollingInterval * 1000)
      }
    },
    needManualEditSeatType(data) {
      if (data.grab_detail && !!data.grab_detail.is_accept_standing) {
        let newGrabDetail = data.grab_detail
        if (Array.isArray(newGrabDetail.seat_type_names)) {
          newGrabDetail.seat_type_names.push('无座')
        } else {
          newGrabDetail.seat_type_names += ',无座'
        }
        this.orderInfo.grab_detail = newGrabDetail
      }
    },
    // 筛选出订单详情中改签待确认及改签待支付订单信息
    filterChangeInfo(data) {
      let changeTicketInfo = {};
      data.tickets && // eslint-disable-line
        data.tickets.forEach(item => {
          if ([5010, 5016, 5034].includes(item.ticket_code)) {
            changeTicketInfo.ticket_id = item.ticket_id; // 旧票id
            changeTicketInfo.ticket_code = item.ticket_code; // 旧票code
            changeTicketInfo.ticket_msg = item.ticket_msg; // 旧票的msg
          }
        });
      this.changeTicketInfo = changeTicketInfo; // 改签请求信息
    },
    // 订单中存在改签票，改签票的状态控制
    filterOrderData() {
      this.orderInfo.tickets =
        this.orderInfo.tickets &&
        this.orderInfo.tickets.map(item => {
          if (
            item.change_ticket &&
            [5003, 5010, 5016, 5007, 5034].includes(item.ticket_code)
          ) {
            return {
              ...item.change_ticket,
              ticket_id:
                item.ticket_code === 5007
                  ? item.change_ticket.ticket_id
                  : item.ticket_id,
              ticket_code:
                item.ticket_code === 5007
                  ? item.change_ticket.ticket_code
                  : item.ticket_code,
              ticket_msg:
                item.ticket_code === 5007
                  ? item.change_ticket.ticket_msg
                  : item.ticket_msg,
              ticket_msg_detail:
                item.ticket_code === 5007
                  ? item.change_ticket.ticket_msg_detail
                  : item.ticket_msg_detail
            };
          }
          return { ...item };
        });
    },
    // 设置下拉刷新去高度及padding-bottom
    setScrollStyle() {
      // 存在待支付订单、改签待确认、可取消订单 swHeight = 设备高度-HeaderHeight-BtnGrabHeight 去掉 5019， 5026， 5037
      if (
        [5001, 5016, 5017, 5030].includes(this.orderInfo.order_code) ||
        (this.changeTicketInfo.ticket_id && this.showTime > 0)
      ) {
        let btnGrabHeight = this.computedBtnHeight; // bottom处fix布局按钮的高度
        this.swHeight = computedScrollWrapperHeight() - btnGrabHeight;
        this.paddingBottom = this.computedBtnHeight;
      } else {
        this.swHeight = computedScrollWrapperHeight();
      }
      // 根据存在车票个数和抢票但个数设置联系客服按钮位置
      // 只有一张车票
      let serviceHeight = 50; // 联系客服按钮高度
      let headMsgHeight = 50; // 夜间收单（先支付后占座模式）顶部msg高度
      let marginTop = 0;
      if (this.orderInfo.grab_detail) {
        let grabMsgHeight = 113; // 顶部文案信息
        let grabInfoHeight = 260; // 抢票卡片高度
        if (this.orderInfo.tickets || this.grabRuntime) {
          // eslint-disable-next-line
        } else {
          marginTop = this.swHeight - grabMsgHeight - grabInfoHeight - serviceHeight;
        }
      } else {
        // eslint-disable-next-line
        let orderBasicInfoHeight = 340; // 订单基本信息高度
        if (this.orderInfo.tickets && this.orderInfo.tickets.length === 1) {
          marginTop = this.swHeight - orderBasicInfoHeight - serviceHeight;
        }
      }
      if (this.orderInfo.sub_type === 3 && this.orderInfo.head_msg) {
        marginTop -= headMsgHeight
      }
      marginTop = marginTop > 0 ? marginTop : 0;
      this.marginTop = marginTop
    },
    // 是否开启车票状态轮询
    ticketStatusPoll(data) {
      let flag = false;
      // 如果订单状态为抢票中，票的状态为出票中，改签受理中，退票受理中，抢票中
      // 判断订单的状态
      if ([5003, 5019, 5026, 5037, 5036].includes(data.order_code)) {
        flag = true;
      }
      // 判断票的状态
      if (data.tickets || this.orderInfo.tickets) {
        let tickets = data.tickets || this.orderInfo.tickets;
        tickets.forEach(item => {
          if (
            [5003, 5006, 5011, 5023, 5019, 5026, 5029].includes(
              item.ticket_code
            )
          ) {
            flag = true;
          }
        });
      }
      return flag;
    },
    // 订单及车票状态轮询
    async pollOrderStatus(order_id, order_code) {
      const params = {
        oid: order_id,
        order_type: 2
      };
      const res = await api.fetchOrderStatus(params);
      if (res && res.errno == 0) {
        const { data } = res;
        this.intervalTime = data.interval_time * 1000;
        // eslint-disable-next-line
        // 判断是否处于服务时间
        if (!!res.service_time_flag && this.ticketStatusPoll(data)) {
          this.timeout = setTimeout(() => {
            this.pollOrderStatus(data.oid);
          }, this.intervalTime);
        } else {
          // 重新请求订单详情接口
          this.queryOrderDetail();
        }
      } else {
        // 订单创建成功，但轮询接口请求失败时，再次轮询
        this.timeout = setTimeout(() => {
          this.pollOrderStatus(params.oid);
        }, this.intervalTime);
      }
    },
    // 改签
    changeTicket(ticketInfo) {
      const {
        ticket_id,
        seat_type_code,
        seat_type_name,
        to_station_name,
        from_station_name,
        departure_timestamp,
        passenger_name,
        certificate_no,
        ticket_type // 票类型
      } = ticketInfo;
      // 当orderDetail中ticket中from_station_code与to_station_code为空时本地做station_code映射
      // eslint-disable-next-line
      let from_station_code = ticketInfo.from_station_code;
      // eslint-disable-next-line
      let to_station_code = ticketInfo.to_station_code;
      if (!from_station_code || !to_station_code) {
        // eslint-disable-next-line
        this.cityList &&
          this.cityList.forEach(item => {
            item.stations.forEach(station => {
              if (from_station_name === station.name) {
                from_station_code = station.code;
              }
              if (to_station_name === station.name) {
                to_station_code = station.code;
              }
            });
          });
      }
      this.$router.push({
        path: "/changeTicket",
        query: {
          ticket_id,
          seat_type_code,
          seat_type_name,
          old_to_station: to_station_name,
          old_to_station_code: to_station_code,
          from_station: from_station_name,
          from_station_code: from_station_code,
          departure_timestamp,
          order_id: this.orderInfo.order_id,
          passenger_name,
          certificate_no,
          ticket_type,
          localCity: this.$route.query.localCity
        }
      });
    },
    // 退票
    returnTicktet(ticketInfo) {
      const {
        departure_timestamp,
        from_station_name,
        to_station_name,
        passenger_name,
        price,
        ticket_id
      } = ticketInfo;
      const { order_id } = this.$route.query;
      this.$router.push({
        path: "/applyRefund",
        query: {
          order_id,
          ticket_id,
          departure_timestamp,
          from_station_name,
          to_station_name,
          passenger_name,
          price
        }
      });
    },
    // 获取支付Id
    async getPayId(orderId) {
      const params = {
        order_id: orderId || this.orderInfo.need_pay_order_id
      };
      const res = await api.fetchPayId(params);
      if (res.errno == 0) {
        let outTradeID = res.data.out_trade_id;
        this.pay(outTradeID);
      } else {
        this.$createDialog({
          type: "alert",
          content: "支付失败，请稍后再试",
          icon: "cubeic-alert"
        }).show();
      }
      this.Omega(
        "train_ticket_ordetail_pay_ck",
        "购票进入订单详情页面去支付按钮点击",
        // way上报规则：抢票为0、购票为1，与sub_type有所不同
        { way: this.$route.query.sub_type == 2 ? 0 : 1 }
      );
    },
    pay(outTradeID) {
      let { openid } = this.$route.query;
      let _this = this
      let opts = getPayConf(outTradeID, openid)
      const { DPay } = window
      DPay.pay(opts, (err, result) => {
        if (result) {
          // 支付成功自动关闭弹窗
          window.DPay.close('mainPanel')
          // 支付成功跳转至订单详情页刷新当前页
          // 刷新当前页——重新请求订单详情页接口
          _this.queryOrderDetail();
        } else {
          console.log(JSON.stringify(err))
          // 支付失败
        }
      })
    },
    // 改签确认
    async changeTicketConfirm() {
      if (this.btnClickStatus) {
        this.btnClickStatus = false;
        const toast = this.createCustomToast("正在确认改签...", 0);
        toast.show();
        const { ticket_id } = this.changeTicketInfo;
        const params = {
          product_id: ticket_id
        };
        const res = await api.changeTicketConfirm(params);
        toast.hide();
        if (res.errno === 0) {
          this.createCustomToast("确认成功，出票中", 1000).show();
          // 刷新当前页——重新请求订单详情页接口
          this.queryOrderDetail();
        } else {
          this.createCustomToast("确认失败，请稍后重试", 1000).show();
        }
        setTimeout(() => {
          this.btnClickStatus = true;
        }, 1000);
      }
    },
    // 取消改签
    async cancelChange() {
      const toast = this.createCustomToast("正在取消改签...", 0);
      toast.show();
      const { ticket_id } = this.changeTicketInfo;
      const params = {
        product_id: ticket_id
      };
      const res = await api.cancelChange(params);
      toast.hide();
      if (res.errno === 0) {
        this.createCustomToast("取消成功", 1000).show();
        // 刷新当前页——重新请求订单详情页接口
        this.queryOrderDetail();
      } else {
        this.createCustomToast("取消失败，请稍后重试", 1000).show();
      }
      setTimeout(() => {
        this.btnClickStatus = true;
      }, 1000);
    },
    // 创建自定义toast
    createCustomToast(text, time) {
      return this.$createToast({
        time: time,
        txt: text
      });
    },
    // 取消订单TODO-5001,5017取消订单，5030（占座成功之前取消订单）
    async cancelOrder() {
      const toast = this.createCustomToast("正在取消订单...", 0);
      toast.show();
      const { order_id } = this.$route.query;
      let res = {};
      if ([5001, 5030].includes(this.orderInfo.order_code)) {
        res = await api.cancelOrder({ order_id }); // 占座成功取消订单（5001，5030）
      } else if (this.orderInfo.order_code === 5017) {
        res = await api.cancalGrabTicket({ order_id }); // 占座成功之前取消订单（5017）
      }
      toast.hide();
      if (res.errno === 0) {
        this.createCustomToast("取消成功", 1000).show();
        // 刷新当前页——重新请求订单详情页接口
        this.queryOrderDetail();
      } else {
        this.createCustomToast("取消失败，请稍后重试", 1000).show();
      }
      setTimeout(() => {
        this.btnClickStatus = true;
      }, 1000);
    },
    // 倒计时结束改变订单的状态
    showComfirmDialog() {
      this.btnClickStatus = false;
      // 倒数计时为0展示确认Dialog
      this.timeOutText = "超时未确认，订单自动关闭";
      // 超时未支付，订单自动关闭
      this.$createDialog({
        type: "alert",
        content: this.timeOutText,
        confirmBtn: {
          text: "我知道了",
          active: true
        },
        onConfirm: () => {
          // 倒计时结束——点击我知道
          const { order_id, ticket_id, order_status } = this.$route.query;
          // 从订单详情页改签，在当前页刷新获取该订单全部车票详情
          if (ticket_id) {
            this.$router.push({
              path: '/orderDetail',
              query: { order_id }
            })
          } else { // 从订单列表进入，点击"我知道"回到订单列表页
            this.$router.push({ path: "/orderList", query: { order_status } })
          }
        }
      }).show();
    },
    // 弹出是否确认取消订单，取消改签二次确认toast
    applyCancel(str) {
      if (this.btnClickStatus) {
        let content = "";
        if (str === "common" || str === "prepayOrder") {
          content = "你确定要取消订单吗？";
        } else if (str === "change") {
          content = "你确定要取消改签吗？";
        } else if (str === "grap") {
          content = "你确定要取消抢票吗？";
        }
        this.$createDialog({
          type: "confirm",
          content: content,
          confirmBtn: {
            text: "确定",
            active: true
          },
          cancelBtn: {
            text: "取消",
            active: false
          },
          onConfirm: () => {
            this.btnClickStatus = false;
            if (str === "common") {
              this.cancelOrder();
            } else if (str === "change") {
              this.cancelChange();
            } else if (str == "grap") {
              this.cancelGrabOrderRequest();
            } else if (str === "prepayOrder") {
              this.cancelPrepayOrder();
            }
          },
          onCancel: () => {
            this.btnClickStatus = true;
          }
        }).show();
      } else {
        console.log("取消过程中，不可操作");
      }
    },
    // 改签须知展示
    showChangeTicketProto() {
      this.Omega(
        "train_ticket_checkch_rule_ck",
        "申请改签确认页面确认改签规则点击"
      );
      this.$router.push("/protocol/changeTicketNotice");
    },
    // 取消抢票
    async cancelGrabOrderRequest() {
      const toast = this.createCustomToast("正在取消抢票...", 0);
      toast.show();
      const { order_id } = this.$route.query;
      let res;
      if ([5026, 5019].includes(this.orderInfo.order_code)) {
        res = await api.cancalGrabTicket({ order_id }); // 占座成功之前取消订单（5026, 5019）
      } else if (this.orderInfo.order_code === 5037) {
        res = await api.cancelOrder({ order_id }); // 占座成功取消订单（5037）
      }
      toast.hide();
      if (res.errno === 0) {
        this.createCustomToast("取消成功", 1000).show();
        // 刷新当前页——重新请求订单详情页接口
        this.queryOrderDetail();
      } else {
        this.createCustomToast("取消失败，请稍后重试", 1000).show();
      }
      setTimeout(() => {
        this.btnClickStatus = true;
      }, 1000);
    },
    // 取消预支付订单
    async cancelPrepayOrder() {
      const toast = this.createCustomToast("正在取消抢票...", 0);
      toast.show();
      const { order_id } = this.$route.query;
      const params = {
        order_id: order_id
      };
      const res = await api.cancelPrepayOrder(params);
      toast.hide();
      if (res.errno === 0) {
        this.createCustomToast("取消成功", 1000).show();
        // 刷新当前页——重新请求订单详情页接口
        this.queryOrderDetail();
      } else {
        this.createCustomToast("取消失败，请稍后重试", 1000).show();
      }
      setTimeout(() => {
        this.btnClickStatus = true;
      }, 1000);
    }
  }
};
</script>

<style lang="less" scoped>
@import '~assets/styles/var.less';
@green: #46c284;
@grey: #666666;
@orange: #fc9153;
@red: #ff525d;
.order-detail-wrapper {
  background-color: #fafafa;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  .order-detail-container {
    .sub_type3 {
      font-size: 12px;
      color: #fc9153;
      letter-spacing: 0;
      line-height: 18px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      padding: 6px 1.33rem;
      background: rgba(252, 145, 83, 0.1);
    }
    .grab-order-status {
      .grab-desc {
        color: #fff;
        font-size: 12px;
        margin-bottom: 10px;
      }
      .descrip {
        padding-top: 6px;
        opacity: 0.5;
      }
      .circle-container {
        position: relative;
        padding: 10px 0;
        .breathing {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          margin: auto;
          width: 78px;
          height: 78px;
          border-radius: 50%;
          animation: 2s pulse linear infinite;
          background: #fff;
        }
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 0.9;
          }
          100% {
            transform: scale(1.6);
            opacity: 0;
          }
        }
        .circle {
          position: relative;
          margin: auto;
          width: 108px;
          height: 108px;
          font-size: 18px;
          z-index: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          .grab-count,
          .desc,
          .pre-sale {
            font-family: PingFangSC-Semibold;
            color: #fff;
            text-align: center;
          }
          .desc {
            font-size: 9px;
          }
          .pre-sale {
            font-size: 14px;
          }
        }
        .circle::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
          background-image: url('~assets/images/circle@3x.png');
          background-size: contain;
        }
        .animation-circle::before {
          background-image: url('~assets/images/orange-circle@3x.png');
          background-size: contain;
          animation: 2s circle-life linear infinite;
        }

        @keyframes circle-life {
          0% {
            transform: rotate(0);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      }
    }

    .order-status {
      padding-top: 10px;
      padding-left: 1.33rem;
      padding-right: 1.33rem;
      margin-bottom: 10px;
      text-align: left;
      .status {
        font-family: 'PingFangSC-Medium';
        font-size: 24px;
        line-height: 25px;
        margin-bottom: 0.17rem;
        font-weight: 500;
        color: #fff;
      }
      .descrip {
        // color: @grey;
        min-height: 32px;
        line-height: 18px;
        font-size: 12px;
        color: #fff;
        opacity: 0.5;
        .red {
          color: @red;
        }
        .orange {
          color: @orange;
        }
      }
    }
    .order-info {
      display: flex;
      height: 40px;
      line-height: 40px;
      font-size: 14px;
      color: #999999;
      padding: 0 1.33rem;
      // margin-bottom: 0.83rem;
      background: #4a4c5b;
      .price {
        margin-left: auto;
      }
    }
    .error-content {
      text-align: center;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      .noresult {
        background: #fafafa;
      }
    }
  }
  .order-detail-container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 136px;
    background: #4a4c5b;
    z-index: -1;
  }
  .liner-bg::before {
    height: 260px;
    background: linear-gradient(
      0deg,
      rgba(74, 76, 91, 0) 0%,
      #4a4c5b 22%,
      #4a4c5b 100%,
      #4a4c5b 100%
    );
  }
  .fixed-content {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: @z-orderDetailBtn;
    .btn-content {
      height: 70px;
      line-height: 70px;
      text-align: center;
      font-size: 17px;
      color: #ffffff;
      display: flex;
      .price-info {
        width: 170px;
        height: 50px;
        line-height: 50px;
        font-size: 12px;
        color: #333;
        text-align: left;
        .icon {
          color: #fc9153;
        }
        .price {
          font-size: 22px;
          color: #fc9153;
        }
      }
      .cancel-btn,
      .ok-btn {
        flex: 1;
        height: 50px;
        line-height: 50px;
        border-radius: 2px;
        font-size: 16px;
        box-sizing: border-box;
      }
      .oneBtn {
        margin-left: 0 !important;
      }
      .cancel-btn {
        border: 1px solid rgba(151, 151, 151, 0.4);
        // background: #4a4c5b;
        color: #4a4c5b;
        border-radius: 2px;
        margin-right: 5px;
        &:active {
          background: rgba(0,0,0,0.04);
        }
      }
      .ok-btn {
        background: #4a4c5b;
        margin-left: 5px;
        &:active {
          opacity: 0.96;
        }
      }
    }
    .showChangeProto {
      position: fixed;
      bottom: 70px;
      background: #fafafa;
      width: 100%;
    }
    p {
      height: 30px;
      font-size: 10px;
      line-height: 30px;
      text-align: left;
      padding-left: 1.33rem;
      background: #fafafa;
      color: #666666;
      text-align: left;
      box-shadow: 0 -1px 8px 0 rgba(0, 0, 0, 0.16);
    }
  }
  .grab-container {
    margin: 0 10px 10px 10px;
  }
  .cancel-grab {
    margin: 10px 0;
    height: 50px;
    line-height: 50px;
    background: #fff;
    color: #999;
    font-size: 16px;
  }

  .big-btn {
    margin: 10px;
  }
}
</style>
