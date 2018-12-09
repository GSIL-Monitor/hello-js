<template>
<Popup :mask="true" position="bottom" :maskClosable="false" :visible="isShow" type="schedule-popup" @mask-click="$emit('on-hide')">
  <div class="child-ticket-notice">
    <div class="header border-bottom-1px">
      <span class="font-18">购买儿童票须知</span>
      <img class="close-icon" @click="$emit('on-hide')" :src="closeIcon" />
    </div>
    <div class="notice-content">
      <p>1.儿童原则上不能单独乘车。</p><br/>
      <p>2.一名成年人旅客可以免费携带一名身高不足1.2米的儿童。如果身高不足1.2米的儿童超过一名时，一名儿童免费，其他儿童须购买儿童票。儿童身高为1.2～1.5米的，须购买儿童票；超过1.5米的，须购买全价座票。</p><br/>
      <p>3.儿童票可享受客票、加快票和空调票的优惠，儿童票票价按相应客票和附加票票价的50%计算。免费乘车及持儿童票乘车的儿童单独使用卧铺时，应另收全价卧铺票价，有空调时还应另收半价空调票票价。儿童票的座别应与成年人旅客的车票相同，到站不得远于成年人旅客车票的到站。。</p><br/>
      <p>4.成年人旅客持卧铺车票时，儿童可以与其共用一个卧铺，并应按上述规定免费或购票。</p><br/>
      <p>5.在铁路售票窗口购买实名制车票时，儿童票不实行实名制。在中国铁路客户服务中心网站http://www.12306.cn购票时，须提供乘车儿童的有效身份证件信息；乘车儿童未办理有效身份证件的，可以使用同行成年人的有效身份证件信息。</p><br/>
      <p>6.在车站售票窗口、检票口、出站口及列车端门都设有测量儿童身高的标准线。测量儿童身高时，以儿童实际身高（脱鞋）为准。</p><br/>
    </div>
  </div>
</Popup>
</template>
<script>
import { mapActions } from "vuex";
import { getWebView } from "@/utils/userAgent"
import { Popup } from 'cube-ui'
import closeIcon from '@/assets/images/close@3x.png'

export default {
  name: 'ChildTicketNotice',
  components: {
    Popup
  },
  data() {
    return {
      closeIcon
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
  mounted() {
    let webView = getWebView();
    if (webView === 'DIDI') {
      this.swHeight = 'auto';
      document.getElementsByTagName('title')[0].innerHTML = '购买儿童票须知'
    }
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
@import "~assets/styles/var.less";
  .child-ticket-notice {
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
    }
  }
</style>
