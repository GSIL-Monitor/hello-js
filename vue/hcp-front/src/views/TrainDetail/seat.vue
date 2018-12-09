<template>
  <div class="seats">
    <div class="seat-item font-14" v-for="(seat) in seatInfo" :key="seat.name + seat.num">
      <span class="seat-type">{{seat.name}}</span>
      <span class="seat-num" :class="{ 'empty': formatTicketNumText(seat.num) == noTicketText }">
        {{formatTicketNumText(seat.num)}}
      </span>
      <span class="seat-price">¥{{formatPrice(seat.price)}}</span>
      <Button
        :primary="true"
        :inline="true"
        @click="onChangeTicket(seat)"
        class="btn-buy" v-if="formatTicketNumText(seat.num) !== noTicketText && isChangeTicket">改签</Button>
      <Button

        :inline="true"
        @click="onBuyClick(seat)"
        class="btn-buy" v-if="formatTicketNumText(seat.num) !== noTicketText && !isChangeTicket">购票</Button>
      <Button
        :inline="true" @click="onGrabClick(seat)" class="btn-grab" v-if="formatTicketNumText(seat.num) == noTicketText && !isChangeTicket">抢票</Button>
      <Button
        :outline="true"
        :disabled="true"
        :inline="true" class="btn-grab" v-if="formatTicketNumText(seat.num) == noTicketText && isChangeTicket">改签</Button>
    </div>
  </div>
</template>
<script>
import { Button, Loading } from "cube-ui";
import { formatTicketNumText, noTicketText } from 'utils/commonlibs'

export default {
  components: {
    Button,
    Loading
  },
  data() {
    return {
      formatTicketNumText,
      noTicketText
    };
  },
  props: {
    seatInfo: {
      type: Array,
      default: function() {
        return [];
      }
    },
    isChangeTicket: {
      type: Boolean,
      default: false
    }
  },
  computed: {},
  created() {},
  mounted() {},
  beforeDestroy() {},
  destroyed() {},
  watch: {},
  methods: {
    formatPrice(val) {
      let price = Number(val / 100) || "";
      return price;
    },
    onChangeTicket(val) {
      this.$emit("on-change", val, "changeTicket");
    },
    onBuyClick(val) {
      this.$emit("on-buy", val, "buyTicket");
      this.Omega("train_ticket_detail_buy_ck", "车次详情页购票点击");
    },
    onGrabClick(val) {
      this.$emit("on-grab", val, "grabTicket");
      this.Omega("train_ticket_detail_grab_ck", "车次详情页抢票点击");
    }
    // TODO 刷新座位无数据时的展示方案
  }
};
</script>
<style scoped lang="less">
.seats {
  background-color: #fff;
  text-align: left;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  color: #333333;
  .seat-item {
    height: 4.21rem;
    margin-left: 1.33rem;
    margin-right: 1.33rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgba(0, 0, 0, 0.04);
    &:last-child{
      border-bottom: none;
    }
    .seat-type {
      width: 6.84rem;
    }
    .seat-num {
      width: 9.33rem;
      &.empty {
        color: #adadad;
      }
    }
    .seat-price {
      width: 7.08rem;
      color: #fc9153;
      font-weight: 500;
    }
    .btn-buy,
    .btn-grab {
      width: 5.33rem;
      font-weight: 500;
      font-weight: bold;
      // height: 2.5rem;
    }
    .btn-buy {
      background-color: #FC9153;
    }
  }
}
</style>
