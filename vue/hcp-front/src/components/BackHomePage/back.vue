<template>
  <div class="back-home-page" v-show="$route.path !=='/' && !headerStatus">
  <!-- <div class="back-home-page" v-show="$route.path !=='/' && !headerStatus" contenteditable="false" ontouchstart> -->
    <div :class="[ active ? 'active': '', 'img-back', 'back-entry']"></div>
  </div>
</template>
<script>
import Draggabilly from 'draggabilly'
import { mapGetters, mapActions } from "vuex"
import { getWebView } from 'utils/userAgent'
import { config } from '@/config/appConf'

export default {
  name: 'BackHomePage',
  components: {

  },
  data() {
    return {
      el: null,
      draggabilly: null,
      active: false
    }
  },
  props: {},
  computed: {
    ...mapGetters({
      headerStatus: "headerStatus"
    })
  },
  created() {},
  mounted() {
    this.el = document.querySelector('.back-entry')
    this.init()
  },
  beforeDestroy() {
  },
  destroyed() {
  },
  watch: {},
  methods: {
    onClick() {
      let webView = getWebView()
      let isHttps = window.location.protocol.includes('https')
      let { menuid } = config
      let protocol = 'https'
      // 当前host并非是https时，跳转的host也需要是http
      if (!isHttps) {
        protocol = 'http'
      }
      if (webView == 'WeChat') {
        window.location.href = `${protocol}://common.diditaxi.com.cn/general/webEntry?wx=true&menuid=${menuid}`
      } else if (webView == 'Alipay') {
        window.location.href = `${protocol}://common.diditaxi.com.cn/general/webEntry?menuid=${menuid}`
      } else {
        this.$router.push({ path: '/' })
      }
    },
    init() {
      const el = document.querySelector('.back-entry')
      const app = document.querySelector('html')
      const draggabilly = new Draggabilly(el)
      // NOTE 设成true，同时将父容器fixed top0 left0之后，添加儿童的click事件不起作用，莫名其妙;
      // const draggabilly = new Draggabilly(el, {
      //   // containment: true // 包裹的容器即元素可移动的范围；如果true，容器将是父元素
      //   // containment: app
      // })
      this.draggabilly = draggabilly
      this.bindEvent()
      let pos = this.getCachePos()
      if (!pos) {
        pos = this.initPos()
      }
      this.setPos(pos)
      // let cachePos = {}
    },
    bindEvent() {
      let { draggabilly, el } = this
      draggabilly.on('dragStart', () => {
        this.active = true
      })
      draggabilly.on('dragEnd', () => {
        this.active = false
        let pos = this.getCurrentPos()
        this.checkIsValidPos(pos)
      })
      draggabilly.on('staticClick', () => {
        this.onClick()
      })
    },
    /* Turn string like '0px' to number.
     */
    pxToNum(str) {
      return Number(str.replace('px', '')) || 0
    },
    getCurrentPos() {
      let { el } = this
      return {
        x: this.pxToNum(el.style.left),
        y: this.pxToNum(el.style.top)
      }
    },
    getCachePos() {
      let pos = {}
      try {
        pos = JSON.parse(localStorage.getItem('pos'))
      } catch (e) {

      }
      return pos
    },
    initPos() {
      let pos = {}
      pos.x = 0 // left:0
      const { innerHeight } = window
      let bottom = 50 // bottom: 0
      let EntryHeight = 50
      pos.y = innerHeight - bottom - EntryHeight
      return pos
    },
    setPos(pos) {
      let x = pos && pos.x ? pos.x : 0
      let y = pos && pos.y ? pos.y : 0
      this.draggabilly.setPosition(x, y)
    },
    savePos(pos) {
      try {
        localStorage.setItem('pos', JSON.stringify(pos))
      } catch (e) {

      }
    },
    checkIsValidPos(pos) {
      const { innerHeight, innerWidth } = window
      const elWidth = 66
      const elHeight = 66
      let valid = true
      let newPos = Object.assign({}, pos)
      // 超出范围的将其吸附在边界上
      if ((pos.x >= innerWidth - elWidth)) {
        valid = false
        newPos.x = innerWidth - elWidth
      }
      if (pos.x <= elWidth) {
        valid = false
        newPos.x = 0
      }
      if (pos.y >= innerHeight - elHeight) {
        valid = false
        newPos.y = innerHeight - elHeight
      }
      if (pos.y <= elHeight) {
        valid = false
        newPos.y = 0
      }
      if (valid) {
        console.log('valid drag');
        this.savePos(pos)
      } else {
        console.log('invalid drag, reset');
        // reset
        this.setPos(newPos)
      }
    }
  }
}
</script>
<style scoped lang="less">
@import "~assets/styles/var.less";
.back-home-page {
  // position: absolute;
  // left: 0;
  // top: 0;
  // width: 100%;
  // height: 100%;

  // pointer-events: none;
  // will-change: transform;
  // position: fixed;
  // left: 0;
  // top: 0;
  // width: 100%;
  // height: 100%;
  // z-index: 100000;
  // font-size: 14px;
  // direction: ltr;
  .img-back {
    position: absolute;
    // position: relative;
    // z-index: 1000;
    bottom: 50px;
    left: 0;
    z-index: @z-backhome;
    display: block;
    width: 66px;
    height: 66px;
    background-image: url('~assets/images/home@3x.png');
    background-size: 66px 66px;
    &.active {
      background-image: url(~assets/images/home-click@3x.png);
    }
  }
}
</style>
