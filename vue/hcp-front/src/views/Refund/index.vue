<template>
  <div class="apply-refund-container">
    <div class="content">
      <p class="tip-msg">若您已在车站办理，票款将与1-15个工作日退回原支付账户</p>
      <div class="ticket-info border-bottom-1px">
        <p>{{formatBJ(parseInt(ticketInfo.departure_timestamp, 10) * 1000, 'MM月DD日')}}
           {{ticketInfo.from_station_name}} - {{ticketInfo.to_station_name}}</p>
        <p>{{ticketInfo.passenger_name}}</p>
      </div>
      <div class="ticket-price">
        <p>火车票价</p>
        <span class="process-price-tip">距离发车时间15天(不含)以上，无手续费</span>
        <img src="../../assets/images/question@3x.png" alt="" class="icon" @click="showRefundNotice">
        <span class="price">￥{{ticketInfo.price / 100}}</span>
      </div>
    </div>
    <div class="refund-footer fixed-bottom-container-shadow">
      <p>查看<span class="hight-light" @click="showRefundNotice">《退票须知》</span></p>
      <div class="refund-btn" @click="applyRefund">申请退票</div>
    </div>
  </div>
</template>

<script>
// import format from "date-fns/format";
import { formatBJ } from "@/utils/commonlibs";
import RefundNotice from "../Protocol/refundNotice.vue";
import { createAPI } from "cube-ui";
import Vue from "vue";
import { mapGetters, mapActions } from "vuex";
import api from "@/service/api.js";

createAPI(Vue, RefundNotice, ["on-hide"], true);

export default {
  components: {
    RefundNotice
  },
  data() {
    return {
      formatBJ,
      // format,
      showRefund: false,
      ticketInfo: {},
      queryStatus: true
    };
  },
  computed: {
    ...mapGetters({
      // refundNoticeStatus: "refundNoticeStatus"
    })
  },
  mounted() {
    this.changeHeader();
    // 退票信息
    this.getReturnInfo();
    this.Omega("train_ticket_refund_sw", "申请退票页面展现");
  },
  methods: {
    ...mapActions([
      "changeHeader"
      // "updateRefundNoticeStatus"
    ]),
    // 退票信息
    getReturnInfo() {
      this.ticketInfo = this.$route.query;
    },
    applyRefund() {
      if (this.queryStatus) {
        this.queryStatus = false;
        this.$createDialog({
          type: "confirm",
          content: "确定提交退票申请吗？",
          confirmBtn: {
            text: "确定",
            active: true
          },
          cancelBtn: {
            text: "取消",
            active: false
          },
          onConfirm: () => {
            // 请求取消退票的接口
            this.fetchReturnTicket();
          },
          onCancel: () => {
            this.queryStatus = true;
          }
        }).show();
        this.Omega(
          "train_ticket_refund_check_ck",
          "申请退票页面申请退票按钮点击"
        );
      }
    },
    // 退票请求
    async fetchReturnTicket() {
      const toast = this.$createToast({
        time: 0,
        txt: "正在申请退票..."
      });
      toast.show();
      const params = {
        order_id: this.ticketInfo.order_id,
        ticket_ids: this.ticketInfo.ticket_id
      };
      const res = await api.returnTicket(params);
      toast.hide();
      if (res && res.errno === 0) {
        // 退票成功 —— 跳转订单详情页
        this.$router.push({
          path: "/orderDetail",
          query: {
            order_id: this.ticketInfo.order_id
          }
        });
      } else {
        // 退票失败
        this.$createDialog({
          type: "alert",
          content: res.errmsg || "申请退票失败，请稍后重试",
          confirmBtn: {
            text: "我知道了",
            active: true
          },
          onConfirm: () => {}
        }).show();
      }
      setTimeout(() => {
        this.queryStatus = true;
      });
    },
    showRefundNotice() {
      this.Omega("train_ticket_refund_notice_ck", "退票说明点击");
      // this.updateRefundNoticeStatus({
      //   refundNoticeStatus: !this.refundNoticeStatus
      // });
      const instance = this.$createRefundNotice({
        isShow: true
      });
      instance.$on("on-hide", e => {
        instance.remove();
      });
    }
  }
};
</script>

<style lang="less" scoped>
.apply-refund-container {
  .content {
    text-align: left;
    .tip-msg {
      color: #999999;
      margin: 1.17rem 1.25rem;
    }
    .ticket-info,
    .ticket-price {
      padding-left: 1.33rem;
      background: #ffffff;
    }
    .ticket-info {
      font-size: 14px;
      line-height: 20px;
      color: #333333;
      padding: 1rem 1.33rem;
      & p:nth-child(1) {
        margin-bottom: 4px;
      }
    }
    .ticket-price {
      color: #666666;
      position: relative;
      padding-top: 0.83rem;
      padding-bottom: 9px;
      line-height: 18px;
      p {
        font-size: 12px;
        margin-bottom: 1px;
      }
      .process-price-tip {
        font-size: 10px;
        color: #999999;
        vertical-align: middle;
      }
      .price {
        font-size: 16px;
        color: #fc9153;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: 1.67rem;
      }
      .icon {
        width: 1.18rem;
        height: 1.18rem;
        vertical-align: middle;
      }
    }
  }
  .refund-footer {
    font-family: "PingFangSC-Medium";
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    background: #fff;
    // padding-left: 1.33rem;
    // padding-right: 1.33rem;
    padding-bottom: 10px;
    p {
      text-align: left;
      height: 30px;
      font-size: 10px;
      line-height: 30px;
      background: #fafafa;
      color: #666666;
      padding-left: 1.33rem;
      padding-right: 1.33rem;
    }
    .refund-btn {
      font-size: 17px;
      color: #ffffff;
      height: 50px;
      line-height: 50px;
      border-radius: 2px;
      background: #4a4c5b;
      margin-left: 1.33rem;
      margin-right: 1.33rem;
      margin-top: 10px;
    }
  }
  .content-body {
    height: 392px;
    overflow-y: scroll;
  }
  .failed-body {
    text-align: center;
    .font-14 {
      font-size: 14px;
    }
    .tip {
      margin: 10px;
      color: #666;
    }
  }
}
</style>

<style>
.cube-popup-content .cube-dialog-content {
  margin: 0;
  line-height: 20px;
  padding: 25px 0;
}
.dialog .dialog-footer {
  position: static !important;
}
</style>
