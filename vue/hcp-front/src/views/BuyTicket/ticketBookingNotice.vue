<template>
  <div calss="iframe-container">
    <iframe ref="iframe" id="bdIframe" frameborder=0 name="showHere" scrolling="auto" src="https://dpubstatic.udache.com/static/dpubimg/dpub2_project_88111/index_88111.html"></iframe>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {

    }
  },
  mounted() {
    this.changeHeader();
    this.setIframeWH()
    // 如果用户在唤起数字键盘后，点击打开火车票购票协议页，此时屏幕高度不正确，所以延时再获取一次，保证容器高度正确
    setTimeout(this.setIframeWH, 300)
  },
  methods: {
    ...mapActions([
      "changeHeader"
    ]),
    setIframeWH() {
      // iframe-宽高自适应显示
      const oIframe = document.getElementById('bdIframe');
      const deviceWidth = document.documentElement.clientWidth;
      const deviceHeight = document.documentElement.clientHeight;
      oIframe.style.width = (Number(deviceWidth)) + 'px'; // 数字是页面布局宽度差值
      oIframe.style.height = (Number(deviceHeight)) + 'px'; // 数字是页面布局高度差
    }
  }
}
</script>


<style scoped lang="less">
</style>
