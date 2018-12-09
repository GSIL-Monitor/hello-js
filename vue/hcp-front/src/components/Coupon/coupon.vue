<template>
    <div class="coupon-wrapper font-14">
      <div class="text">优惠券抵扣</div>
      <div class="coupon-price">-¥{{ Number(coupon / 100) || 0 }}</div>
    </div>
</template>

<script>
export default {
  props: {
    coupon: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {}
  }
}
</script>

<style lang="less" scoped>
.coupon-wrapper {
  display: flex;
  height: 4.17rem;
  padding: 0 16px;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  color: #999999;
  .coupon-price {
    color: #fc9153;
  }
}
</style>
