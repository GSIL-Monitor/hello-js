<template>
  <div class="vux-swiper-item"><slot></slot></div>
</template>

<script>
/* eslint-disable */

export default {
  name: 'swiper-item',
  mounted () {
    this.$nextTick(() => {
      this.$parent.rerender()
    })
  },
  beforeDestroy () {
    const $parent = this.$parent
    this.$nextTick(() => {
      $parent.rerender()
    })
  }
}
</script>
