<!-- 联系方式 -->
<template>
  <div class="contact">
    <span class="label font-14">联系方式</span>
    <Input
      placeholder="请输入手机号"
      :clearable="false"
      v-model="phone"
      class="contact-input font-14"
      type="number"
      @blur="onBlur"
      @focus="onFocus"
    >
    </Input>
    <!-- <img class="icon-contact" :src="IconContact"></img> -->
  </div>
</template>
<script>
import { Input } from 'cube-ui'
import IconContact from '@/assets/images/contact@3x.png'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    Input
  },
  data() {
    return {
      phone: '',
      IconContact
    }
  },
  props: {
    omegaInfo: {
      type: Object,
      default: null
    }
  },
  computed: {
    ...mapGetters({
      passengerPhone: 'passengerPhone'
    })
  },
  created() {},
  mounted() {},
  beforeDestroy() {},
  destroyed() {},
  watch: {
    passengerPhone: {
      handler: function(val, oldVal) {
        this.phone = val
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions([
      'updatePhone'
    ]),
    onBlur(e) {
      // 验证手机号 —— 去掉手机号前后空格
      if (this.phone.trim()) {
        let phoneStr = /^\d{11}$/ // 11位数字
        if (phoneStr.test(this.phone.trim())) {

        } else {
          this.$createToast({
            type: 'warn',
            time: 1000,
            txt: '输入的手机号不合法，请核对后重试'
          }).show()
        }
      }
      this.updatePhone({ passengerPhone: this.phone })
    },
    onFocus() {
      this.omegaInfo && this.Omega(this.omegaInfo.omegaKey,this.omegaInfo.omegaName)
    }
  }
}
</script>
<style scoped lang="less">
  .contact {
    background-color: #FFF;
    height: 4.17rem;
    color: #999999;
    position: relative;
    text-align: left;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .label {
      margin-left: 1.33rem;
    }
    .contact-input {
      padding-left: 2rem;
      color: #333333;
      height: 100%;
      flex-grow: 1;
    }
    .icon-contact {
      display: inline-block;
      position: absolute;
      right: 0;
      right: 1.29rem;
      width: 2.08rem;
      height: 2.08rem;
      bottom: 1.04rem;
    }
  }
</style>
