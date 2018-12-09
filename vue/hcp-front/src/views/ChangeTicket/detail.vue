<template>
  <div class="change-detail-container">
    <Loading v-show="loading" class="loading-fixed"></Loading>
    <DirectionCard class="train-info" :trainInfo="trainInfo" :omegaInfo="{omegaKey:'train_ticket_checkch_through_ck',omegaName:'申请改签确认页面确认经停信息点击'}"></DirectionCard>
    <div class="passenger-info">
      <p>{{`${changeTicketInfo.passenger_name}${Number(changeTicketInfo.ticket_type) === 2 ? ' 儿童票': ''}`}}</p>
      <p>{{changeTicketInfo.certificate_no}}</p>
    </div>
    <div class="change-tip">
      <p>1.每张车票只能改签一次，已改签车票不能再次改签；</p>
      <p>2.根据铁路部门规定改签可能产生改签手续费。</p>
    </div>
    <div class="fixed-content">
      <p>查看<span class="hight-light" @click="showChangeTicketProto">《改签须知》</span></p>
      <div class="btn-container">
        <div class="change-btn" @click="changeTicket">申请改签</div>
      </div>
    </div>
    <!-- 改签占座信息提示 -->
    <div class="dialog-content" v-if="dialogType === 'lockSeat'">
      <Dialog
        :show="dialogType === 'lockSeat'"
        :showClose="false"
        iconType="time"
        class="locking"
      >
        <div slot="body" class="locking-body">
          <p class="tips font-14">{{ showTicketMsg }}</p>
          <p class="lock-info font-12">
            {{trainInfo.startStation}}-{{trainInfo.endStation}}({{returnDate(trainInfo.startDate)}} {{trainInfo.startTime}})
          </p>
          <Spinner class="locking-spinner border-top-1px"></Spinner>
        </div>
      </Dialog>
    </div>
  </div>
</template>

<script>
import { returnDate } from "@/utils/commonlibs";
import IconLocking from '@/assets/images/lockSuccess@3x.png'
import DirectionCard from '@/components/DirectionCard/index.vue'
import { Loading } from 'cube-ui'
import Spinner from '@/components/Spinner/index.vue'
import Dialog from '@/components/Dialog/index.vue'
import api from '@/service/api.js'
import priceVue from '../../components/Pay/price.vue';

export default {
  components: {
    Loading,
    DirectionCard,
    Dialog,
    Spinner
  },
  data() {
    return {
      loading: false,
      dialogType: '',
      showTicketMsg: '正在为您占座，请耐心等待...',
      returnDate,
      trainInfo: {},
      changeTicketInfo: {}, // TODO 改签票的乘客信息及车票价格信息
    }
  },
  props: {},
  computed: {},
  created() {},
  mounted() {
    let { query } = this.$route
    this.getTrainDetail(query)
    this.Omega('train_ticket_checkch_sw', '申请改签确认页面展现')
  },
  beforeDestroy() {},
  destroyed() {},
  watch: {},
  methods: {
    getTrainDetail(query) {
      this.trainInfo = {
        startStation: query.from_station_name,
        startTime: query.start_time,
        startDate: query.train_date,
        startCode: query.from_station_code,
        runTime: query.run_time,
        trainCode: query.train_code,
        trainNo: query.train_no,
        endStation: query.to_station_name,
        endTime: query.arrive_time,
        endCode: query.to_station_code,
        endDate: query.train_arrive_date,
        chosenSeat: query.chosen_seat,
      }
      const { passenger_name, certificate_no, ticket_type } = query.old_ticket_info
      const payInfo = {
        passenger_name,
        certificate_no,
        ticket_type
      }
      this.changeTicketInfo = payInfo;
    },
    // 立即改签请求接口
    async changeTicket() {
      if (this.dialogType === '') {
        const toast = this.$createToast({
          time: 0,
          txt: '正在申请改签...'
        })
        toast.show()
        this.Omega('train_ticket_checkch_con_ck', '申请改签确认页面确认改签按钮点击')
        let { query } = this.$route
        const params = {
          order_id: query.old_ticket_info.order_id,
          change_train_no: query.train_no,
          change_train_code: query.train_code,
          change_train_type: query.train_type,
          is_accept_standing: query.chosen_seat.code === 'wz',
          change_departure_time: query.train_date + ' ' + query.start_time + ':00', // 加上秒
          change_arrive_time: query.train_arrive_date + ' ' + query.arrive_time + ':00',
          change_running_time: query.run_time,
          change_seat_type_code: query.chosen_seat.code,
          seat_type_code: query.old_ticket_info.seat_type_code,
          is_change_to_station: query.is_change_to_station,
          from_station_name: query.from_station_name,
          from_station_code: query.from_station_code,
          to_station_name: query.to_station_name,
          to_station_code: query.to_station_code,
          product_id: query.old_ticket_info.ticket_id,
          price: Number(query.chosen_seat.price)
        }
        const res = await api.changeTicket(params);
        toast.hide()
        if (res.errno == 0) {
          // 进行车票状态的轮询
          this.pollOrderStatus(query.old_ticket_info.ticket_id)
        } else {
          this.dialogType = '';
          this.changeTicketFailed(res.errmsg)
        }
      }
    },
    // 车票状态轮询
    async pollOrderStatus(ticket_id) {
      this.dialogType = 'lockSeat';
      const params = {
        oid: ticket_id,
        order_type: 1
      }
      const res = await api.fetchOrderStatus(params)
      if (res && res.errno == 0) {
        const { data } = res
        const orderInfo = {
          orderCode: data.order_code,
          ticketId: ticket_id,
          orderMsg: data.order_msg,
          thirdMsg: data.third_msg,
        }
        // 改签受理中
        if (data.order_code == 5006) {
          // 开始轮询
          this.showTicketMsg = '正在为您占座，请耐心等待...'
          setTimeout(() => {
            this.pollOrderStatus(ticket_id)
          }, data.interval_time * 1000)
        } else {
          this.queryOrderStatus(orderInfo)
        }
      } else {
        // 订单创建成功，但订单轮询接口请求失败时，再次轮询
        setTimeout(() => {
          this.pollOrderStatus(ticket_id)
        }, this.intervalTime)
      }
    },
    // 订单状态判断
    /*
      orderCode：
      self::ORDER_HOLD_SEAT                        => array('code' => 5006, 'msg' => '改签受理中'), // 轮询
      self::ORDER_PRE_PAY                          => array('code' => 5010, 'msg' => '改签待支付'),
      self::ORDER_OUT_TICKET_SUCC                  => array('code' => 5009, 'msg' => '改签失败'), // 停止轮询
      self::PRODUCT_CHANGE_PRE_CONFIRM             => array('code' => 5016, 'msg' => '改签待确认'), // 该状态下才可请求用于用户确认改签接口
      self::PRODUCT_CHANGE_PRE_CONFIRM_LESS        => array('code' => 5034, 'msg' => '改签待确认'
     */
    queryOrderStatus(orderInfo) {
      switch (orderInfo.orderCode) {
        case 5009:
          this.dialogType = '';
          this.changeTicketFailed(orderInfo.thirdMsg)
          break;
        case 5010:// 改签待支付
        case 5016:// 改签待确认
        case 5034:// 改签待确认
          this.dialogType = '';
          // 跳转订单详情页
          this.jump_order_detail()
          break;
        default:
          break;
      }
    },
    // 跳转订单详情页
    jump_order_detail() {
      const { ticket_id, order_id } = this.$route.query.old_ticket_info;
      this.$router.push({
        path: '/orderDetail',
        query: {
          order_id,
          ticket_id
        }
      })
    },
    // 申请改签失败
    changeTicketFailed(msg) {
      this.$createDialog({
        type: 'alert',
        content: msg || '申请改签失败，请稍后重试',
        confirmBtn: {
          text: '我知道了',
          active: true
        },
        onConfirm: () => {},
      }).show()
    },
    showChangeTicketProto() {
      this.Omega('train_ticket_checkch_rule_ck','申请改签确认页面确认改签规则点击')
      this.$router.push('/protocol/changeTicketNotice')
    }
  }
}
</script>

<style lang="less">
  .change-detail-container{
    .train-info, .passenger-info{
      margin-top: .83rem;
    }
    .passenger-info, .fixed-content{
      text-align: left;
      background: #ffffff;
    }
    .passenger-info{
      color: #333333;
      box-sizing: border-box;
      padding: 15px 16px;
      // height: 68px;
      & >p:first-child{
        font-size: 14px;
        line-height: 20px;
        margin-bottom: 0.5rem;
      }
    }
    .change-tip{
      text-align: left;
      margin-left: 1.33rem;
      margin-top: 1.33rem;
      color: #999999;
      & >p:first-child{
        margin-bottom: 6px;
      }
    }
    .fixed-content{
      font-family: 'PingFangSC-Medium';
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      background: #FFFFFF;
      box-shadow: 0 2px 8px 0 rgba(0,0,0,0.16);
      p{
        height: 30px;
        font-size: 10px;
        line-height: 30px;
        padding-left: 1rem;
        background: #FAFAFA;
        color: #666666;
      }
      .btn-container {
        height: 70px;
        line-height: 70px;
        box-sizing: border-box;
        padding: 10px 11px;
        .change-btn{
          font-size: 16px;
          font-family: PingFangSC-Medium;
          text-align: center;
          color: #FFFFFF;
          background: #4A4C5B;
          height: 50px;
          line-height: 50px;
          border-radius: 2px;
        }
      }
    }
    .dialog-content{
     text-align: center;
     .locking-body{
       p{
         padding-left: 1.33rem;
       }
      .tips{
        font-size: 14px;
        color: #666666;
        margin-bottom: 4px;
        line-height: 21px
      }
      .lock-info{
        margin-top: .33rem;
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
   }
  }
</style>
