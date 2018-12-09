<template>
    <button @click="showPickerStyle">显示traintype-picker</button>
</template>

<script>
import { mapGetters } from "vuex";
const PICKER_ALIGN = "left";

export default {
  name: "traintype-picker",
  props: {
    pickerData: {
      type: Array,
      default: function() {
        return [
          {
            content: "全部车型",
            type: 0,
            align: PICKER_ALIGN
          },
          {
            content: "特快直达(T/Z)",
            type: 1,
            align: PICKER_ALIGN
          },
          {
            content: "高铁动车(G/D/C)",
            type: 2,
            align: PICKER_ALIGN
          },
          {
            content: "其他车型",
            type: 3,
            align: PICKER_ALIGN
          }
        ];
      }
    }
  },
  data() {
    return {};
  },
  components: {
    ActionSheet
  },
  computed: {
    ...mapGetters({
      showTrainTypePicker: "showTrainTypePicker"
    })
  },
  methods: {
    showPickerStyle() {
      this.$createActionSheet({
        data: this.pickerData,
        onSelect: (item, index) => {
          //   this.$emit("on-select-traintype", item.type);
          this.$createToast({
            txt: `Clicked ${item.type}`,
            type: "correct",
            time: 1000
          }).show();
        },
        onCancel: () => {
          //   this.$emit("on-cancel-traintype");
        }
      }).show();
    }
  }
};
</script>

<style lang="less" scoped>
.traintype-picker-body {
  .cube-action-sheet-space {
    display: none !important;
  }
  .cube-action-sheet-cancel {
    display: none !important;
  }
}
</style>


