<template>
    <div v-show="show" class="noresult">
      <img :src="pngArr[errorType]" @click="iconClick">
      <div class="tips">{{tips}}</div>
      <div class="sub-tips">{{subTips}}</div>
    </div>
</template>

<script>
import NoResultPng from "assets/images/noresult.png";
import NetErrorPng from "assets/images/neterror.png";
import NoOrderPng from "assets/images/noorder.png";

export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    errorType: {
      type: Number,
      default: 0
    },
    tips: {
      type: String,
      default: "无可用班次"
    },
    subTips: {
      type: String,
      default: "重新选择出发时间试一试"
    }
  },
  name: "no-result",
  data() {
    return {
      pngArr: [NoResultPng, NetErrorPng, NoOrderPng]
    };
  },
  methods: {
    iconClick() {
      this.$emit("on-click");
    }
  }
};
</script>

<style scoped lang="less">
.noresult {
  // background: #FAFAFA;
  margin: 0 auto;
  margin-top: 10rem;
  img {
    width: 12rem;
  }
  .tips {
    font-size: 14px;
    color: #666;
    letter-spacing: 0;
    text-align: center;
  }
  .sub-tips {
    font-size: 12px;
    color: #999;
    text-align: center;
    margin-top: 1rem;
  }
}
</style>
