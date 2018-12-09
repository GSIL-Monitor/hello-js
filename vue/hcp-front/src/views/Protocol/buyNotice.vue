<template>
  <!-- <h1>购票须知</h1> -->
  <div class="ticket-tab">
    <ul class="tabs border-top-1px border-bottom-1px">
      <li class="li-tab"
      v-for="(item, index) in tabsParam"
      @click="toggleTabs(index)"
      :key="index"
      >
      <span :class="{active:index === nowIndex}">{{item}}</span>
    </li>
    </ul>
    <div class="divTab" v-show="nowIndex===0">
      <p class="question-title">取票方式</p>
      <div class="question-content">
        <p>1.发车前携带购买时填写的证件在任意火车站人工窗口、自助取票机和代售点取票；</p>
        <p>2.部分高铁动车，可直接刷二代身份证检票进出站；</p>
        <p>3.代售点取票时会收取5元/张客票销售服务费；</p>
      </div>
      <p class="question-title">中转换乘</p>
      <div class="question-content">
        <p>1.购票时请您充分考虑各种影响换乘的因素，并自愿承担因自身原因或第三方等原因导致延误换乘的风险；请您根据实际情况，选择是否购票，购票后合理安排时间，及时换乘；</p>
        <p>2.遇有旅客列车晚点，或其中一段停运等铁路原因影响换乘的，退票时按规定不收取退票费。</p>
      </div>
      <p class="question-title">退票说明</p>
      <div class="question-content">
        <p>1.晚上22:30-早上6:00期间，需前往火车站人工窗口办理取票、退票、改签业务；</p>
        <p>2.其他时间：未取票且距离发车前30分钟以上的，可以在滴滴火车票订单中操作退票；</p>
        <p>3.铁路部门规定，发车后一律不可退票，请谅解；</p>
        <p>4.已在火车站办理过退票的，系统会在7天内自动为您退款，如超过7天未退款，请在滴滴火车票中提交退票申请；</p>
      </div>
      <p class="question-title">退票手续费</p>
      <div class="question-content">
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
    <div class="divTab" v-show="nowIndex===1">
      <p class="question-title">改签说明</p>
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
            <td>·距发车前48小时——15天内改签且距改签后发车前时间前15天内退票</td>
            <td>票价5%</td>
          </tr>
          <tr>
            <td>·改签或者变更到站后的发车时间在春运期间（具体时间由12306通知）退票</td>
            <td>票价20%</td>
          </tr>
          </tbody>
        </table>
        <table class="price-table notice-table">
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
  </div>
</template>
<script>
import { mapActions } from "vuex";

export default {
  components: {
  },
  data() {
    return {
      tabsParam: ['购票取票', '退票改签'],
      nowIndex: 0, // 默认第一个tab为激活状态
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
    document.getElementsByTagName('title')[0].innerHTML = '购票须知'
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
    toggleTabs(index) {
      // console.log(index)
      this.nowIndex = index;
    },
  }
}
</script>
<style scoped lang="less">
.ticket-tab{
  .tabs{
    height: 3.67rem;
    line-height: 3.67rem;
    padding:0;
    background: #FFFFFF;
  }
  .active{
    color: #FC9153;
    border-bottom: 1px solid  #FC9153;
    display: inline-block;
  }
  .li-tab{
    width: 50%;
    height: 100%;
    font-size: 14px;
    color: #666666;
    display:inline-block;
    // text-align: center;
    // border: 1px solid red;
  }
  .divTab{
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
      .notice-table{
        width:100%;
        th{
          width:50%;
        }
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
}
</style>
