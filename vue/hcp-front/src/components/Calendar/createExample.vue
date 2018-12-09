<template>
  <section class="calendar" @click="showCalendar">
    {{selectedDays}}
  </section>
</template>
<script>
import { createAPI } from 'cube-ui'
import Calendar from './index.vue'
import Vue from 'vue'

createAPI(Vue, Calendar, ['on-select', 'on-cancel'], true)

export default {
  components: {
  },
  data() {
    return {
      selectedDays: ['222']
    }
  },
  props: {

  },
  computed: {},
  created() {},
  mounted() {},
  beforeDestroy() {},
  destroyed() {},
  watch: {},
  methods: {
    showCalendar() {
        // 除了在调用 createAPI 的时候传入了 events，这里对应的就是
        // on{event name} 会被当做事件回调处理
        const instance = this.$createCalendar({
          confirmText: 'create',
          title: 'title',
          formatRule: { type: Array, rule: 'YYYY-MM-DD' },
          calendarShow: true
        })
        instance.$on('on-select', (e) => {
          this.selectedDays = e
          instance.remove() // 这种调用方式, 由于使用了remove移除了实例，所以无需再将calendarShow设为false
        })
        instance.$on('on-cancel', (e) => {
          instance.remove()
        })
    }
  }
}
</script>
<style scoped lang="less">

</style>
