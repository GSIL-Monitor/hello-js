<template>
    <div class="timerangepicker">
        <Popup :mask="true" position="top" :maskClosable="true" :visible="show" type="add-child-picker-popup" @mask-click="onCancel">
            <div class="timerangeslot">
                <div class="picker-content">
                    <TimeRangeSlide v-model="timerange"></TimeRangeSlide>
                </div>
                 <div class="picker-header">
                    <Button class="cancel" :inline="true" @click="cancel">取消</Button>
                    <Button class="confirm" :inline="true" @click="confirm" :primary="true">确认</Button>
                </div>
            </div>
        </Popup>
    </div>
</template>

<script>
import { Popup, Button } from "cube-ui";
import TimeRangeSlide from "@/components/TimeRangeSlide/index.vue";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "timerangepicker",
  props: {},
  data() {
    return {
      show: false,
      timerange: ["00:00", "24:00"]
    };
  },
  components: {
    Popup,
    TimeRangeSlide,
    Button
  },
  mounted() {
    let self = this;
    self.eventHub.$on("change-timepicker-status", function(data) {
      self.show = data;
    });

    self.eventHub.$on("on-timerange-change", function(val) {
      self.timerange = val;
    });
  },
  computed: {
    ...mapGetters({})
  },
  methods: {
    ...mapActions(["updateFilterCondition", "fetchFilterTrainList"]),
    confirm() {
      //do something
      this.updateFilterCondition({
        startHour: this.timerange[0],
        endHour: this.timerange[1]
      });
      this.fetchFilterTrainList();
      this.show = false;
    },
    cancel() {
      this.show = false;
    },
    onCancel() {
      this.show = false;
    }
  }
};
</script>

<style lang="less" scoped>
.timerangepicker {
  .timerangeslot {
    height: 16rem;
    background: #fff;
    margin-top: 50px;
    .picker-header {
      // height: 4rem;
      // line-height: 4rem;
      font-size: 0;
      border-top: 1px solid rgba(0, 0, 0, 0.1);
      .cancel {
        background: #fff;
        color: #666;
      }
      button {
        width: 50%;
        height: 50px;
        font-size: 16px;
        border-radius: 0;
      }
    }
    .picker-content {
      padding: 1.5rem;
      padding-left: 2rem;
    }
  }
}
</style>
