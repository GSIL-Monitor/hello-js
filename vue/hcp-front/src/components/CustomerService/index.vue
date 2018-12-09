<template>
<div :class="{'customer-service': true, 'no-icon': type!=='icon'}" @click="customerSerivce">
  <a :href="`tel:${servicePhone}`">
    <span v-if="type !== 'icon'">{{type === 'grab' ? '抢票' : ''}}遇到问题？请</span>
    <span v-else class="service-icon"><img src="../../assets/images/service@3x.png" /></span>
    <span class="service">联系客服</span>
  </a>
</div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { getWebView } from "@/utils/userAgent";

export default {
  name: "customer-service",
  props: {
    omegaKey: {
      type: String,
      default: ""
    },
    omegaName: {
      type: String,
      default: ""
    },
    omegaParams: {
      type: Object,
      default: function() {
        return {};
      }
    },
    type: {
      // grab buy icon
      type: String,
      default: 'buy'
    }
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      servicePhone: "servicePhone",
      isWeChat: "isWeChat",
      isAliPay: "isAliPay"
    })
  },
  methods: {
    customerSerivce() {
      this.Omega(this.omegaKey, this.omegaName, this.omegaParams);
    }
  }
};
</script>

<style lang="less" scoped>
.customer-service {
  font-size: 12px;
  color: #999;
  height: 50px;
  line-height: 50px;
  img {
    width: 14px;
    height: 14px;
  }
  .service-icon {
    vertical-align: middle;
  }
}

.no-icon {
  font-size: 14px;
  .service {
    color: #fc9153;
  }
}
</style>
