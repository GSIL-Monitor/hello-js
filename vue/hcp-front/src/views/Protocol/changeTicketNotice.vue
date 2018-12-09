<template>
  <!-- <h1>改签协议</h1> -->
  <div class="change-ticket-notice">
    <p class="question-title">改签须知</p>
      <div class="question-content">
        <p>1.每张票仅可改签一次；</p>
        <p>2.改签后票价低于原票价，差价按照现行退票规定收取；</p>
        <table class="price-table">
          <tr class="theader">
            <th>改签退票时间</th>
            <th>收取手续费</th>
          </tr>
          <tbody>
            <tr>
            <td>·距发车前48小时——15天内改签且距离改签后发车前时间前15天内退票</td>
            <td>票价5%</td>
          </tr>
          <tr>
            <td>·改签或者变更到站后的发车时间在春运期间（具体时间由12306通知）退票</td>
            <td>票价20%</td>
          </tr>
          </tbody>
        </table>
        <table class="price-table">
          <tr class="theader">
            <th>申请退票距发车时间</th>
            <th>可改签车次</th>
          </tr>
          <tbody>
            <tr>
            <td>·48小时（不含）以上</td>
            <td>预售期内车次</td>
          </tr>
          <tr>
            <td>·48小时——30分钟</td>
            <td>发车日期内车次</td>
          </tr>
          </tbody>
        </table>
      </div>
      <p class="question-title">改签后退票手续费</p>
      <div class="question-content">
        <p>1.改签或变更到站的车票乘车日期在春运期间，退票时一律按照20%核收退票费</p>
        <table class="price-table">
          <tr class="theader">
            <th>改签情况</th>
            <th>改签方式</th>
          </tr>
          <tbody>
            <tr>
            <td>·非22:00——6:00期间，未取票且距离发车时间30分钟以上</td>
            <td>滴滴火车票订单中改签</td>
          </tr>
          <tr>
            <td>·22:30——6:00期间</td>
            <td>火车站窗口改签</td>
          </tr>
          <tr>
            <td>·已取票</td>
            <td>火车站窗口改签</td>
          </tr>
          <tr>
            <td>·距发车时间不足30分钟</td>
            <td>火车站窗口改签</td>
          </tr>
          <tr>
            <td>·发车后</td>
            <td>火车站窗口改签</td>
          </tr>
          </tbody>
        </table>
      </div>
  </div>
</template>
<script>
import { mapActions } from "vuex";

export default {
  components: {},
  data() {
    return {

    }
  },
  props: {},
  computed: {},
  created() {
    const { no_header } = this.$route.query;
    this.changeHeader({
      headerStatus: no_header,
    });
  },
  mounted() {
    document.getElementsByTagName('title')[0].innerHTML = '改签须知'
  },
  beforeDestroy() {
    document.getElementsByTagName('title')[0].innerHTML = '滴滴火车票'
  },
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
.change-ticket-notice{
  margin-top: .83rem;
  background: #FFFFFF;
  // height: 300px;
  padding: 0 1.33rem 1.58rem 2rem;
  text-align: left;
  .question-title{
    font-size: 14px;
    color: #333333;
    padding-top: 2rem;
  }
  .question-content{
    color: #666666;
    line-height: 18px;
    p, .price-table{
      margin-top: 1.33rem;
    }
    table{
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
