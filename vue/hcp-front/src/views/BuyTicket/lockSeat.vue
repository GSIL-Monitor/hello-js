<template>
    <div class="buy-ticket-dialog">
      <Dialog
        :show="dialogType == 'locking'"
        :showClose="false"
        iconType="time"
        class="locking"
      >
        <div slot="body" class="locking-body">
          <p class="tips font-14"> {{dialogMessage}} </p>
          <!-- <p class="tips font-14"> 正在为您占座，请耐心等待... </p> -->
          <p class="lock-info font-12">
            {{trainInfo.startStation}}-{{trainInfo.endStation}}({{returnDate(trainInfo.startDate)}} {{trainInfo.startTime}}) </p>
          <Spinner class="locking-spinner border-top-1px"></Spinner>
        </div>
      </Dialog>

      <Dialog
        :show="dialogType == 'lockFailed' || dialogType == 'payFailed'"
        :showClose="true"
        iconType="warn"
        class="no-ticket"
        cancelText="我知道了"
        @on-cancel="onClose('lockFailed')"
        @on-confirm="onConfirm"
        @on-close="onClose"
      >
        <div slot="body">
          <p class="font-14 tips">{{dialogMessage}}</p>
          <!-- <p class="font-14 tips">很抱歉地通知您，该车次现已无票，占座失败</p> -->
        </div>
      </Dialog>

      <Dialog
        :show="dialogType == 'conflict'"
        :showClose="true"
        iconType="warn"
        class="conflict"
        @on-cancel="onClose('conflict')"
        @on-confirm="onConfirm"
        @on-close="onClose"
      >
        <div slot="body">
          <p class="font-14">很抱歉地通知您，因与现有行程：xxx-xxx冲突，占座失败</p>
        </div>
      </Dialog>
      <Dialog
        :show="dialogType == 'lockSuccess'"
        :showClose="true"
        iconType="success"
        class="lock-success"
        confirmText="去付款"
        @on-confirm="onLockSuccessConfirm"
        @on-close="onLockSuccessClose"
      >
        <div slot="body" class="lock-success-body">
          <p class="font-16 tips">占座成功</p>
          <p class="need-pay border-bottom-1px">
            <span>需支付</span>
            <span>¥{{formatPrice(orderDetail.pay_fee)}}</span>
          </p>
          <div class="passenger-info" v-for="ticket in orderDetail.tickets" :key="ticket.passenger_name + ticket.ticket_type">
            <span>{{ticket.passenger_name}}</span>
            <span>·{{ticket.ticket_type_name}}</span>
            <span class="seat_type_name">{{ticket.seat_type_name}}·{{ticket.coach_no}}</span>
            <span>¥{{formatPrice(ticket.price)}}</span>
          </div>
        </div>
      </Dialog>
    </div>
</template>
<script>
import IconLocking from '@/assets/images/dialog_icon_time@3x.png'
import { mapGetters, mapActions } from 'vuex'
import { Popup } from 'cube-ui'
import Dialog from '@/components/Dialog/index.vue'
import Spinner from '@/components/Spinner/index.vue'
import { returnDate } from '@/utils/commonlibs.js'

export default {
  components: {
    Dialog,
    Popup,
    Spinner
  },
  data() {
    return {
      IconLocking,
      returnDate
    }
  },
  props: {
    trainInfo: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  computed: {
    ...mapGetters({
      // dialogShow: 'dialogShow',
      dialogType: 'dialogType',
      dialogMessage: 'dialogMessage',
      orderId: 'orderId',
      orderDetail: 'orderDetail'
    }),
  },
  mounted() {},
  watch: {},
  methods: {
    ...mapActions([
      'changeDialog'
    ]),
    onClose(type) {
      this.checkJump()
    },
    onConfirm() {
      this.checkJump()
    },
    checkJump() {
      if (this.dialogType == 'payFailed') {
        this.$router.push({ path: 'orderDetail', query: { order_id: this.orderId } })
      }
      this.changeDialog({ type: '' })
    },
    formatPrice(val) {
      return Number(val / 100) || 0;
    },
    onLockSuccessClose() {
      this.$router.push({ path: 'orderDetail', query: { order_id: this.orderId } })
    },
    onLockSuccessConfirm() {
      this.eventHub.$emit("lock-success-call-pay")
      this.changeDialog({ type: '' })
    }
  }
}
</script>
<style scoped lang="less">
.buy-ticket-dialog {
  .tips, .lock-info {
    line-height: 1.75rem;
    padding-left: 1.33rem;
    padding-right: 1.33rem;
  }
  .locking-body {
    height: 100%;
    .lock-info {
      color: #999999;
    }
    .locking-spinner {
      width: 100%;
      height: 4.18rem;
      line-height: 4.18rem;
      position: absolute;
      bottom: 0;
    }
  }
  .no-ticket {
    color: #666666;
    line-height: 1.75rem;
  }
  .lock-success {
    color: #333;
    .lock-success-body {
      .tips {
        text-align: center;
      }
      .passenger-info {
        color: #999999;
        font-size: 11px;
        margin-top: 0.71rem;
        margin-bottom: 1.21rem;
      }
      .need-pay, .passenger-info {
        line-height: 1.75rem;
        margin-left: 1.33rem;
        margin-right: 1.33rem;
        display: flex;
      }
      .need-pay {
        padding-bottom: 0.67rem;
        span:nth-child(1) {
          text-align: left;
        }
        span:nth-child(2) {
          flex-grow: 1;
          text-align: right;
        }
      }
      .passenger-info {

        span:last-child {
          flex-grow: 1;
          text-align: right;
        }
        .seat_type_name {
          margin-left: 8px;
        }
      }
      @media only screen and (min-device-width: 320px) and (max-device-width: 568px) and (-webkit-min-device-pixel-ratio: 2) {
        .passenger-info {
          font-size: 9px;
        }
      }
    }
  }
}

</style>
