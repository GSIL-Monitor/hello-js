<template>
<Popup :mask="true" position="bottom" :maskClosable="false" :visible="isShow" type="schedule-popup" @mask-click="$emit('on-hide')">
  <div class="refund-ticket-notice">
    <div class="header border-bottom-1px">
      <span class="font-18">退票说明</span>
      <img class="close-icon" @click="$emit('on-hide')" :src="closeIcon" />
    </div>
    <div class="notice-content">
      <p>1.晚上22:30-早上6:00期间，需前往火车站人工窗口办理退票业务。</p><br/>
      <p>2.其他时候:未取票且距发车前30分钟，可以在滴滴订单中操作退票。</p><br/>
      <p>3.铁路部门规定，发车后一律不可退票，请谅解。</p><br/>
      <p>4.已在火车站办理过退票的，系统将会在7天内自动为您退款，如通过7天退款，请在滴滴火车票中提交退票申请。</p><br/>
      <p>5.退票手续费</p><br/>
      <table class="price-table">
        <tr class="theader">
          <th>申请退票距发车时间</th>
          <th>收取手续费</th>
        </tr>
        <tbody>
          <tr>
          <td>·15天(不含)以上</td>
          <td>无</td>
        </tr>
        <tr>
          <td>·48小时——15天</td>
          <td>票价5%</td>
        </tr>
        <tr>
          <td>·24小时——48小时（不含）</td>
          <td>票价10%</td>
        </tr>
        <tr>
          <td>·不足24小时</td>
          <td>票价20%</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</Popup>
</template>
<script>
import { mapActions } from "vuex";
import { Popup } from 'cube-ui'
import closeIcon from '@/assets/images/close@3x.png'

export default {
  name: 'RefundNotice',
  components: {
    Popup,
  },
  data() {
    return {
      closeIcon,
    }
  },
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
  },
  computed: {},
  created() {
    const { no_header } = this.$route.query;
    this.changeHeader({
      headerStatus: no_header,
    });
  },
  mounted() {},
  beforeDestroy() {},
  destroyed() {},
  watch: {},
  methods: {
    ...mapActions([
      'changeHeader'
    ]),
  }
}
</script>
<style scoped lang="less">
@import "~assets/styles/var.less";
  .refund-ticket-notice{
    width: 100%;
    min-height: @drawer-height-min;
    max-height: @drawer-height-max;
    background-color: #FFFFFF;
    display: flex;
    flex-direction: column;
    .header {
      height: 5.04rem;
      line-height: 5.04rem;
      text-align: center;
      position: relative;
      flex: 0 0 5.04rem;
      .close-icon {
        height: 1.333rem;
        width: 1.333rem;
        position: absolute;
        right: 1.25rem;
        top: 0;
        bottom: 0;
        margin: auto;
      }
    }
    .notice-content{
      font-size: 14px;
      color: #666666;
      line-height: 24px;
      margin-top: 1rem;
      text-align: left;
      flex: 1 1;
      padding: 1.33rem 1.33rem 1.17rem;
      overflow-y: scroll;
      table{
        font-size: 12px;
        border-collapse: collapse;
        .theader{
          font-family: 'PingFangSC-Medium';
          th{
            padding: 0.67rem 1.42rem 0.5rem 1.33rem;
          }
          th:nth-child(1){
            color: #999999;
            background: #F3F4F5;
          }
          th:nth-child(2){
            color:  #FC9153;
            background: #FFE6CA;
          }
        }
        tbody{
          tr td{
            padding: 1.33rem 1.33rem 1rem;
          }
          tr{
            td:nth-child(1){
              color: #666666;
            }
            td:nth-child(2){
              font-family: 'PingFangSC-Medium';
              color: #FC9153;
              background: #FEF4ED;
            }
          }
        }
      }
      table tr td,th {
       border: 1px solid #E5E5E5;
      }
    }
  }
</style>
