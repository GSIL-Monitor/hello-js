<template>
<Popup :mask="true" position="bottom" :maskClosable="false" :visible="isShow" type="schedule-popup" @mask-click="$emit('on-hide')">
  <div class="name-notice-page">
    <div class="header border-bottom-1px">
      <span class="font-18">姓名填写说明</span>
      <img class="close-icon" @click="$emit('on-hide')" :src="closeIcon" />
    </div>
    <div class="notice-content">
      <p>1.确认姓名中生僻字无法输入时，可用生僻字拼音或同音字替代；</p>
      <br/>
      <p>2.输入姓名保存后，遇有系统无法正确显示的汉字，可用该汉字的拼音或同音字重新修改后保存；</p>
      <br/>
      <p>3.姓名中有繁体字无法输入时，可用简体替代；</p>
      <br/>
      <p>4.姓名较长，汉字与英文字符合计超过30个（1个汉字算2个字符）的，需按姓名中第一个汉字或英文字符开始按顺序连续输入30个字符（空格字符不输入），其中英文字符输入时不区别大小写。</p>
      <br/>
      <p>5.姓名中有“.”或“·”时，请仔细辨析身份证件原件上的“.”或“·”，准确输入。</p>
    </div>
  </div>
</Popup>
</template>
<script>
import { Popup } from 'cube-ui'
import closeIcon from '@/assets/images/close@3x.png'

export default {
  name: 'NameNotice',
  components: {
    Popup,
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
  created() {},
  mounted() {},
  beforeDestroy() {},
  destroyed() {},
  watch: {},
  methods: {}
}
</script>
<style scoped lang="less">
@import "~assets/styles/var.less";
  .name-notice-page{
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
