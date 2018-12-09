<template>
  <section class="banner home-banner" v-if="items.length">
    <!-- <Slide :data="items" :loop="false" :showDots="showDots" :autoPlay="false"/> -->
    <Swiper :list="items" :auto="true" :loop="true" height="98px" :show-desc-mask="false" :interval="interval"></Swiper>
  </section>
</template>
<script>
import api from "service/api"
import { config } from '@/config/appConf.js'
// import { Slide } from 'cube-ui'
import { Swiper, SwiperItem } from '@/components/Swiper/index.js'
export default {
  components: {
    // Slide
    Swiper,
    SwiperItem
  },
  data() {
    return {
      items: [],
      showDots: false,
      interval: 3000
    }
  },
  props: {
    geoLocation: {
      type: Object,
      default: function() {
        return {
          lat: '',
          lng: '',
          city_id: ''
        }
      }
    }
  },
  computed: {},
  created() {},
  mounted() {

  },
  beforeDestroy() {},
  destroyed() {},
  watch: {
    geoLocation: {
      handler: function(val, oldVal) {
        if (val.city_id) {
          console.log(val);
          this.getAD(val)
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    async getAD(geoLocation) {
      let params = {
        resource_name: 'didipas_multi_banner',
        business_id: config.productLine,
        city_id: geoLocation.city_id,
        lng: geoLocation.lng,
        lat: geoLocation.lat,
      }
      // params = qs.stringify(params)
      const res = await api.fetchBannerAD(params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      if (res.errno == 0 && res.data && res.data.length) {
        if (res.data.length > 1) {
          this.showDots = true
        }
        if (res.data[0].interval) {
          this.interval = Number(res.data[0].interval)
        }
        this.items = res.data.map((item, index) => {
          return {
            image: item.image,
            img: item.image,
            url: item.link,
            title: ''
          }
        })
      }
    }
  }
}
</script>
<style lang="less">
// .cube-slide-group {
//   max-width: 1380px;
// }
// .cube-slide-item {
//   max-width: 345px;
// }
.banner {
  width: 92%;
  margin: 0 auto;
  height: 98px;
  margin-bottom: 10px;
  overflow: hidden;
  .cube-slide-item img {
    // width: 100%;
  }
}
</style>
