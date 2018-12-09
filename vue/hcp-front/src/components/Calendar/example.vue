<template>
  <section class="calendar-frame" @click="showCalendar">
    <span>出发日期</span>
    {{selectedDays}}
    <Calendar
      startTime="2018-07-22"
      endTime="2018-09-22"
      :multiple="true"
      title="出发日期"
      :calendarShow="calendarShow"
      @on-select="onDateChange"
      @on-cancel="hideCalendar"
      :formatRule="{ type: 'String', rule: 'MM-DD' }"
    >
    </Calendar>
  </section>
</template>

<script>

export default {
  components: {
  },
  data() {
    return {
      calendarShow: false,
      selectedDays: []
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
    showCalendar() {
      this.calendarShow = true
    },
    onDateChange(val) {
      this.calendarShow = false
      this.selectedDays = val
    },
    hideCalendar() {
      this.calendarShow = false
    }
  }
}
</script>
<style scoped lang="less">
  .calendar-input {
    height: 40px;
  }
</style>
