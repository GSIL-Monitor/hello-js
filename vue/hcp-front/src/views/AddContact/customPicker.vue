<template>
  <div>

  </div>
</template>

<script>
import Vue from 'vue'
import { Style, Picker, Form, DatePicker, Button, createAPI } from 'cube-ui'
createAPI(Vue, Picker, ['click'], true)

export default {
  name: 'CustomPicker',
  props: {
    value: {
      type: Array,
      default() {
        return []
      }
    },
    data: {
      type: Array,
      default() {
        return []
      }
    },
    title: {
      type: String,
      default() {
        return '乘客类型'
      }
    }
  },
  data() {
    return {
      selected: []
    }
  },
  mounted() {},
  methods: {
    showPicker() {
      this.picker = this.$createPicker({
        title: this.title,
        data: [this.data],
        selectedIndex: this.value,
        onSelect: this.selectHandler,
        // confirm: this.selectHandler,
      })
      console.log(this.picker);
      this.picker.show()
    },
    selectHandler(selectedVal, selectedIndex, selectedTxt) {
      console.log('=====')
      this.selected = selectedTxt
      console.log('-----')
      console.log(selectedTxt);
      this.$emit('select', selectedVal)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
