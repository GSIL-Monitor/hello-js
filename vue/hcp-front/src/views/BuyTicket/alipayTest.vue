<template>
  <div class="">
    <button @click="onClickWithClose" class="btn-1">拉起支付onClose</button>
    <button @click="onClick" class="btn-2">拉起支付</button>
  </div>

</template>
<script>
export default {
  components: {

  },
  data() {
    return {
      count: 0
    }
  },
  props: {},
  computed: {},
  created() {},
  mounted() {
  },
  beforeDestroy() {},
  destroyed() {},
  watch: {},
  methods: {
    getEle() {
      let ele = document.querySelector('.train-pay-wrapper')
      if (!ele) {
        let wrapper = document.createElement('div')
        wrapper.className = 'train-pay-wrapper'
        wrapper.style.fontSize = '16px'
        document.body.appendChild(wrapper)
        ele = document.querySelector('.train-pay-wrapper')
      }
      ele.style.fontSize = '16px'
      return ele
    },
    pay() {
      let queryObj = this.$route.query
      DPay.pay({
        lang: queryObj.lang || 'zh-CN',
        router: true,
        direct: false,
        env: queryObj.env || 'China',
        el: this.getEle(),
        needPassword: true,
        content: {
          payStatus: {
            isTimeOut: '暂时无法确认支付结果',
            reloadPayStatus: '是否已完成支付？'
          }
        },
        pay: {
          open_id: queryObj.open_id || '',
          alipaySchema: 'diditaxi',
          out_trade_id: queryObj.out_trade_id || '20180515f62d6b9c05d27d092985692d19f0962013684951',
          token: queryObj.token || 'njUOduV2CSiPBdqM1cMyZmPtrwZG3DiBSLRFkuY6p1IkzDuOwzAMANG7TE0YFCnKEtvt9w77cT6NAiRIZeTugZF6Bm9nKokvuijCLGQRppGmqipMJ8saw6KMOlyHCbOSRwqSr2-EHxKEXzJajNr7iNqsewj_ZG_CRu48bs_730bqSziRJap6uEUTziTFrax1bd4bwuVjXo_9HQAA__8=',
          sign: queryObj.sign || '',
          ali: queryObj.sign || '',
          sign_type: queryObj.sign_type || 'RSA',
          biz_content: queryObj.biz_content || {},
          isrdqa: 'yes'
        }
      }, function(err, result) {
        console.log(err)
        if (err) {
          console.log(err.type)
          console.log(err.detail.errmsg)
        } else {
          console.log('支付成功')
        }
      })
    },
    onClickWithClose() {
      this.pay()
      let _this = this
      DPay.on('initDone', function() {
        console.log('initDone')
      })
      DPay.on('beforeEnter', function (page, fromPage) {
        window.console.log(page, fromPage)
      })
      DPay.on('close', function (panel) {
        alert('close:'+ panel)
        if (panel == 'coupons') {
          // 支付宝独有的bug，优惠券列表选中关闭后，点击屏幕任一位置还会有响应事件
          if (_this.count % 2 == 1) {
            alert('coupons, not back')
            // 再手动触发一个该位置的点击事件，避免用户点击没响应
          } else {
            alert('coupons, should back')
          }
          _this.count = _this.count + 1
        } else {
          alert('other back')
        }
        window.console.log(panel)
      })
      DPay.on('payClick', function() {
        console.log('payClick')
      })
    },
    onClick() {
      this.pay()
    }
  }
}
</script>
<style scoped lang="less">
  .btn-1, .btn-2{
    width: 120px;
    height: 50px;
    display: inline-block;
    background-color: #FFF;
    border: 1px solid #F1F1F1;
  }
</style>
