<template>
  <Popup :mask="true" position="center" :maskClosable="false" :visible="show" type="dialog-popup">
    <div class="dialog">
      <div class="exit" @click="onClose" v-if="showClose"><i class="cubeic-close"></i></div>
      <div class="dialog-header" v-if="iconType">
        <img :src="IconTime" v-if="iconType == 'time'" class="dialog-icon">
        <img :src="IconWarn" v-if="iconType == 'warn'" class="dialog-icon">
        <img :src="IconSuccess" v-if="iconType == 'success'" class="dialog-icon">
      </div>
      <div class="dialog-body">
        <slot name="body"></slot>
      </div>
      <div class="dialog-footer border-top-1px" v-if="confirmText || cancelText">
        <div @click="onCancel" class="cancel font-16" :class="{ 'hight-light': !confirmText }" v-if="cancelText">
         {{cancelText}}
       </div>
        <div @click="onConfirm" class="confirm font-16 hight-light" v-if="confirmText">
          {{confirmText}}
        </div>
      </div>
    </div>
  </Popup>
</template>
<script>
import { Popup, Button } from 'cube-ui'
import IconTime from '@/assets/images/dialog_icon_time@2x.png'
import IconWarn from '@/assets/images/warn@3x.png'
import IconSuccess from '@/assets/images/lockSuccess@3x.png'

export default {
  components: {
    Popup,
    Button
  },
  data() {
    return {
      IconTime,
      IconWarn,
      IconSuccess
    }
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    showClose: {
      type: Boolean,
      default: false,
    },
    iconType: {
      type: String,
      default: '' // 'warn'或者'time'
    },
    confirmText: {
      type: String,
    },
    cancelText: {
      type: String,
    }
  },
  computed: {},
  created() {},
  mounted() {},
  beforeDestroy() {},
  destroyed() {},
  watch: {},
  methods: {
    onCancel() {
      this.$emit('on-cancel')
    },
    onConfirm() {
      this.$emit('on-confirm')
    },
    onClose() {
      this.$emit('on-close')
    }
  }
}
</script>
<style scoped lang="less">
  .dialog {
    width: 22.25rem;
    min-height: 16.25rem;
    background-color: #FFF;
    position: relative;
    .exit {
      font-size: 18px;
      position: absolute;
      right: 0.83rem;
      top: 0.83rem;
      color: #999999;
    }
    .dialog-header {
      padding-top: 1.67rem;
      padding-bottom: 1.35rem;
      .dialog-icon {
        width: 4.17rem;
        height: 4.17rem;
      }
    }
    .dialog-body {
      text-align: left;
      min-height: 5rem;
    }
    .dialog-footer {
      // position: absolute;
      // bottom: 0;
      // left: 0;
      // right: 0;
      display: flex;
      height: 4.18rem;
      align-items: center;
      text-align: center;
      .cancel {
        flex-grow: 1;
        height: 100%;
        line-height: 4.18rem
      }
      .confirm {
        flex-grow: 1;
        height: 100%;
        line-height: 4.18rem
      }
    }
  }
</style>
