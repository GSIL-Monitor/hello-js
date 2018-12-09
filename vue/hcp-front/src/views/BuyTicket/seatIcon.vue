<template>
  <div class="seat-icon">
    <svg :width="width" :height="height" viewBox="0 0 19 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <!-- Generator: Sketch 51.1 (57501) - http://www.bohemiancoding.com/sketch -->
        <title>icon/seata copy</title>
        <desc>Created with Sketch.</desc>
        <defs></defs>
        <g id="icon/seata-copy" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <path d="M2.375,3.2 L2.375,12 C2.375,12.8836556 3.0913444,13.6 3.975,13.6 L15.025,13.6 C15.9086556,13.6 16.625,12.8836556 16.625,12 L16.625,3.2 L17.4,3.2 C18.2836556,3.2 19,3.9163444 19,4.8 L19,14.4 C19,15.2836556 18.2836556,16 17.4,16 L1.6,16 C0.7163444,16 6.19348537e-16,15.2836556 -6.66133815e-16,14.4 L-2.22044605e-16,4.8 C-3.30261205e-16,3.9163444 0.7163444,3.2 1.6,3.2 L2.375,3.2 Z M3.96666667,0 L15.0333333,0 C15.4751611,-8.11624501e-17 15.8333333,0.3581722 15.8333333,0.8 L15.8333333,12 C15.8333333,12.4418278 15.4751611,12.8 15.0333333,12.8 L3.96666667,12.8 C3.52483887,12.8 3.16666667,12.4418278 3.16666667,12 L3.16666667,0.8 C3.16666667,0.3581722 3.52483887,-1.40882155e-16 3.96666667,-2.22044605e-16 Z" id="seat-icon" :fill="fill" fill-rule="nonzero"></path>
        </g>
    </svg>
    <span class="seat-code">{{seatCode}}</span>
  </div>
</template>
<script>
export default {
  components: {

  },
  data() {
    return {}
  },
  props: {
    width: {
      type: String,
      default: '19px'
    },
    height: {
      type: String,
      default: '16px'
    },
    status: {
      type: String,
      default: 'isEmpty',
      validator: function(value) {
        // 这个值必须匹配下列字符串中的一个
        return ['isChose', 'disabled', 'isEmpty'].indexOf(value) !== -1
      }
    },
    seatCode: {
      type: String,
      default: ''
    }
  },
  computed: {
    fill: function() {
      let color = '#CCCCCC'
      let colorMap = {
        isChose: '#FC9153',
        disabled: '#CCCCCC',
        isEmpty: '#999999'
      }
      color = colorMap[this.status]
      return color
    }
  },
  methods: {}
}
</script>
<style scoped lang="less">
.seat-icon {
  position: relative;
  .seat-code {
    position: absolute;
    color: #FFF;
    top: 1px;
    left: 6px;
  }
}
</style>
