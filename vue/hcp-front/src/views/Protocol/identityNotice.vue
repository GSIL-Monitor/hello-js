<template>
  <!-- <h1>身份核验须知</h1> -->
  <div class="indentity-notice">
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
      <div
      v-for="(item, index) in indentityQues"
      :key="index"
      >
        <p class="question border-bottom-1px" @click="item.displayStatus = !item.displayStatus">
          <span>{{item.question}}</span>
          <img :src="item.displayStatus ? arrowUp : arrowDown" alt="">
        </p>
        <div class="answer" v-show="item.displayStatus">{{item.answer}}</div>
      </div>
    </div>
    <div class="divTab" v-show="nowIndex===1">
      <div
      v-for="(item, index) in otherQues"
      :key="index"
      >
        <p class="question border-bottom-1px" @click="item.displayStatus = !item.displayStatus">
           <span>{{item.question}}</span>
           <img :src="item.displayStatus ? arrowUp : arrowDown" alt="">
        </p>
        <div class="answer" v-show="item.displayStatus">{{item.answer}}</div>
      </div>
    </div>
  </div>
</template>
<script>
const indentityQues = [
  {
    question: '身份核验结果有哪几种状态？',
    answer: '铁路系统对注册用户和常用联系人（乘车人）进行身份信息核验后，持居民身份证的有“已通过”“待核验”和“未通过”三种状态，持港澳居民来往内地通行证、台湾居民来往大陆通行证、按规定可使用的有效护照的有“已通过”“请报验”“预通过”和“未通过”四种状态。'
  },
  {
    question: '乘车人是“待核验”怎么办？',
    answer: '“待核验”状态的乘车人无法购票，请持二代居民身份证原件到车站售票窗口办理身份信息核验。通过核验后，舒心乘车人身份信息核验结果变为“已通过”，即可正常购票。'
  },
  {
    question: '乘车人是“未通过”能买票吗？',
    answer: '“未通过”状态的乘车人无法购票，大多数未通过的乘车人都是信息填写有误，请确认填写信息与原证件信息完全一致，并在修改后重新提交；若仍为“未通过”，则需要本人持所用证件，至火车站售票窗口办理身份核验；'
  },
  {
    question: '乘车人是“请报验”怎么办？',
    answer: '首次持护照、通行证购票的用户，乘车人状态大多为“请报验”，此类乘车人可以正常购票、退改签，但上限为4张，需要在窗口取票，办理身份信息核验，状态变更为“已通过”后，即可正常购票。'
  }
]
const otherQues = [
  {
    question: '12306账号核验未通过怎么办?',
    answer: '12306账号为待核验”或“未通过”状态时,可能是您的12306的注册信息可能填写有误,请确保所填信息与证件完全一致;若仍为“待核验”状态,请持有效证件至窗口办理“12306账号核验”'
  },
  {
    question: '手机未核验不能购票',
    answer: '12306规定,账号未经过手机号核验时,无法购票,请尽快完成手机核验以免影响出行；'
  },
  {
    question: '添加乘车人显示“身份信息被冒用”怎么办?',
    answer: '请持本人和冒用人的身份证原价到火车站窗口办理身份冒用核验(请告诉售票员需要给哪一位乘车人做相关核验),核验通过后即可正常购票；'
  },
  {
    question: '添加乘车人显示“超过15个乘车人上限”',
    answer: '一个12306账号最多可添加15个常用联系人购票,且添加核验成功后,半年内无法删除,请及时清理删除您不需要用的乘车人信息；'
  }
]
import { mapActions } from "vuex";
// arrow
import arrowDown from '@/assets/images/dropdown@3x.png'
import arrowUp from '@/assets/images/dropup@3x.png'
export default {
  components: {

  },
  data() {
    return {
      arrowDown,
      arrowUp,
      tabsParam: ['身份核验问题', '其他问题'],
      nowIndex: 0, // 默认第一个tab为激活状态,
      indentityQues: [],
      otherQues: [],
      firstTab: [false, false, false, false],
      secondTab: [false, false, false, false],
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
    // 初始化tab中每个问题的状态
    this.initQuesStatus();
    document.getElementsByTagName('title')[0].innerHTML = '身份校验须知'
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
    initQuesStatus() {
      this.indentityQues = indentityQues.map(item => {
        return { ...item, displayStatus: false }
      })
      this.otherQues = otherQues.map(item => {
        return { ...item, displayStatus: false }
      })
    },
  }
}
</script>
<style scoped lang="less">
.indentity-notice{
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
  }
  .divTab{
    margin-top: .83rem;
    text-align: left;
    .question{
      font-size: 14px;
      padding-left: 1.33rem;
      color: #333333;
      background: #FFFFFF;
      height: 4.33rem;
      line-height: 4.33rem;
      position: relative;
      img{
        position: absolute;
        width: 1rem;
        height: 1rem;
        right: 1.33rem;
        top: 1.67rem;
      }
    }
    .answer{
      color: #666666;
      line-height: 18px;
      padding: 1rem 1.58rem 1.5rem 1.33rem;
    }
  }
}
</style>
