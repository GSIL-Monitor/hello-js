<template>
  <div @click="showCityList" class="haha">
    {{city}}
  </div>
</template>

<script>
import { createAPI } from 'cube-ui'
import CityList from './index.vue'
import Vue from 'vue'

createAPI(Vue, CityList, ['on-select', 'on-cancel'], true)
export default {
  data() {
    return {
      city: '北京'
    }
  },
  methods: {
    showCityList() {
      // 除了在调用 createAPI 的时候传入了 events，这里对应的就是
      // on{event name} 会被当做事件回调处理
      const instance = this.$createCityList({
        cityListShow: true
      })
      instance.$on('on-select', (e) => {
        this.city = e
        instance.remove() // 这种调用方式, 由于使用了remove移除了实例，所以无需再将calendarShow设为false
      })
      instance.$on('on-cancel', (e) => {
        console.log(111)
        instance.remove()
      })
    }
  }
}
</script>

<style lang="less" scoped>
.haha{
  height: 100px;
  border: 1px solid red;
}
</style>
