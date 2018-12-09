<template>
  <Popup :mask="true" position="bottom" :maskClosable="true" :visible="show" type="add-child-picker-popup" @mask-click="onCancel">
    <div class="add-child-picker">
      <div class="tips font-12">
        需使用成人证件购买儿童票，请选择
      </div>
      <div class="adult-list">
        <div
          class="adult"
          :class="{ 'active': adult.id_no === clickNo }"
          @click="onSelect(adult)"
          v-for="adult in passengers"
          :key="adult.id_no + adult.person_type"
          v-if="adult.person_type !== Child_Ticket_Code"
        >
          <p class="font-14 name">{{adult.name}}</p>
          <p class="font-12 id-num">{{adult.id_no}}</p>
          <i class="cubeic-ok"></i>
        </div>
      </div>
    </div>
  </Popup>
</template>
<script>
import { Popup } from 'cube-ui'
import { Child_Ticket_Code } from './passengerMap'

export default {
  components: {
    Popup
  },
  data() {
    return {
      clickNo: '',
      Child_Ticket_Code
    }
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    passengers: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  computed: {},
  created() {},
  mounted() {},
  beforeDestroy() {},
  destroyed() {},
  watch: {},
  methods: {
    onSelect(adult) {
      this.clickNo = adult.id_no
      let child = { ...adult, person_type: Child_Ticket_Code }
      setTimeout(() => {
        this.clickNo = ''
      }, 1000)
      this.$emit('on-select', child)
    },
    onCancel() {
      this.$emit('on-cancel')
    }
  }
}
</script>
<style scoped lang="less">
  .add-child-picker {
    .tips {
      background-color: #FAFAFA;
      height: 2.5rem;
      line-height: 2.5rem;
      text-align: left;
      padding-left: 1.33rem;
      color: #999999;
    }
    .adult {
      background-color: #FFF;
      height: 5.71rem;
      padding-left: 1.33rem;
      padding-right: 1.33rem;
      text-align: left;
      position: relative;
      .name {
        line-height: 1.67rem;
        padding-top: 1.25rem;
      }
      .id-num {
        line-height: 1.42rem;
      }
      .cubeic-ok {
        position: absolute;
        right: 1.33rem;
        top: 2.39rem;
        font-size: 20px;
        visibility: hidden;
      }
      .active {
        .cubeic-ok {
          visibility: visible;
        }
      }
    }
    .active{
      color: #FC9153;
      background: #FFF url('../../assets/images/check@3x.png') no-repeat center right;
      background-position-x: 95%;
      background-size: 1.33rem 1.33rem;
    }
  }
</style>
