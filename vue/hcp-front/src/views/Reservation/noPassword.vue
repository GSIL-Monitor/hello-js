<template>
  <div class="no-pass">
    <div class="text-tips">
      <span class="title">先占座，后付款</span>
      <span class="sub-title">开通代扣服务，占座成功自动扣款</span>
      <!-- <span>已开通微信免密支付，占座成功将自动扣款</span> -->
      <!-- <span>已开通支付宝免密支付，占座成功将自动扣款</span> -->
    </div>
    <div class="switch" @click="openAutoPay">
      <cube-switch style="display:inline-block;" v-model="payfirst" :value="payfirst"></cube-switch>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { getSignStatus, goToSign } from './signStatus'
import { Checkbox } from "cube-ui";

export default {
  components: {
    Checkbox
  },
  data() {
    return {
      payfirst: false
    }
  },
  props: {},
  computed: {
    ...mapGetters({
      grabCreatOrderParms: "grabCreatOrderParms",
      train_date_reservation: "train_date_reservation",
      passengers: "passengers",
      passengerPhone: "passengerPhone",
      train_code: "train_code",
      train_number: "train_number",
      deadline_date: "deadline_date",
      grap_end_time: "grap_end_time",
      alternative_seat: "alternative_seat",
      selectedTrainList: "selectedTrainList",
      reservation_orginTrainlist: "reservation_orginTrainlist"
    })
  },
  created() {},
  mounted() {
    // 查询用户在当前渠道的免密签约状态
    getSignStatus()
      .then(isSign => {
        this.payfirst = isSign
      })
  },
  beforeDestroy() {},
  destroyed() {},
  watch: {
    payfirst(val) {
      // 支付方式 1:预支付；2：免密支付
      let pay_mode = 1;
      if (val) {
        this.Omega('train_ticket_addgrab_openpay_ck', '添加抢票页面先占座后付款打开点击')
        pay_mode = 2;
      } else {
        this.Omega('train_ticket_addgrab_closepay_ck', '添加抢票页面先占座后付款关闭点击')
      }
      this.changeRequestParms({ pay_mode: pay_mode });
    }
  },
  methods: {
    ...mapActions([
      "changeRequestParms"
    ]),
    openAutoPay() {
      let { payfirst, isWeChat, isAliPay } = this
      // DEBUG
      if (this.payfirst) {
        return
      }
      let token = '' // TODO
      let params = {
        token,
        openid: this.$route.query.openid
      }
      this.saveQueryToStoratge()
      // alert(window.navigator.userAgent)
      // alert(JSON.stringify(params))
      // 调起签约界面，成功／失败会回调到当前页面
      // DEBUG
      goToSign(params)
    },
    saveQueryToStoratge() {
      // let { query } = this.$route
      // let newQuery = Object.assign({}, query, { has_jump_sign: 1 });
      // this.$router.replace({ query: newQuery });
      localStorage.setItem('has_jump_sign','1');
      // 签约免密会将页面跳走，跳走前，将已选信息存储到localStorage中
      localStorage.setItem('grabCreatOrderParms', JSON.stringify(this.grabCreatOrderParms))
      localStorage.setItem('passengers', JSON.stringify(this.passengers))
      localStorage.setItem('train_date_reservation', JSON.stringify(this.train_date_reservation))
      localStorage.setItem('train_code', JSON.stringify(this.train_code))
      localStorage.setItem('train_number', JSON.stringify(this.train_number))
      localStorage.setItem('deadline_date', JSON.stringify(this.deadline_date))
      localStorage.setItem('grap_end_time', JSON.stringify(this.grap_end_time))
      localStorage.setItem('alternative_seat', JSON.stringify(this.alternative_seat))
      localStorage.setItem('selectedTrainList', JSON.stringify(this.selectedTrainList))
      localStorage.setItem('reservation_orginTrainlist', JSON.stringify(this.reservation_orginTrainlist))
    }
  }
}
</script>
<style scoped lang="less">
.no-pass {
  height: 70px;
  background: #fff;
  text-align: left;
  padding-left: 1.33rem;
  padding-top: 15px;
  box-sizing: border-box;
  & > div {
    display: inline-block;
    font-size: 0;
    box-sizing: border-box;
  }
  .text-tips {
    width: 70%;
    & > span {
      display: inline-block;
      width: 100%;
      line-height: 20px;
    }
    .title {
      font-size: 14px;
      color: #333;
    }
    .sub-title {
      font-size: 12px;
      color: #999;
    }
  }
  .switch {
    float: right;
    padding-right: 1.5rem;
    .cube-switch-input {
      display: inline-block;
    }
  }
}
</style>
