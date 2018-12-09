<template>
  <div class="city-list-frame">
    <span @click="showCityList">{{selectedCity}}</span>
    <CityList
      :cityListShow="cityListShows"
      @on-select="onCityChange"
      @on-cancel="hideCityList"
    ></CityList>
  </div>
</template>

<script>
// import CitySelect from './index.vue';

export default {
  components: {
    // CitySelect
  },
  data() {
    return {
      cityListShows: false,
      selectedCity: {}
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
    showCityList() {
      this.cityListShows = true
    },
    onCityChange(val) {
      this.cityListShows = false
      // console.log(this.cityListShows)
      this.selectedCity = val
    },
    hideCityList() {
      this.cityListShows = false
    }
  }
}
</script>
<style scoped lang="less">

</style>
