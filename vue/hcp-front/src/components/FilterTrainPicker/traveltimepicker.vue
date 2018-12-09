<template>
    <!-- <ActionSheet :maskClosable="true" :visible="showTravelTimePicker" :data="pickerData"></ActionSheet> -->
    <button @click="showPickerStyle">显示traveltime-picker</button>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
const PICKER_ALIGN = "left";

export default {
  name: "traveltime-picker",
  props: {
    pickerData: {
      type: Array,
      default: function() {
        return [
          {
            content: "最早出发",
            type: 0,
            align: PICKER_ALIGN
          },
          {
            content: "最晚出发",
            type: 1,
            align: PICKER_ALIGN
          },
          {
            content: "耗时最短",
            type: 2,
            align: PICKER_ALIGN
          }
        ];
      }
    }
  },
  components: {},
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      showTravelTimePicker: "showTravelTimePicker"
    })
  },
  methods: {
    showPickerStyle() {
      this.$createActionSheet({
        data: this.pickerData,
        onSelect: (item, index) => {
          this.$createToast({
            txt: `Clicked ${item.type}`,
            type: "correct",
            time: 1000
          }).show();
        },
        onCancel: () => {
          this.$createToast({
            txt: `Clicked canceled`,
            type: "warn",
            time: 1000
          }).show();
        }
      }).show();
    }
  }
};
</script>

<style>
</style>
