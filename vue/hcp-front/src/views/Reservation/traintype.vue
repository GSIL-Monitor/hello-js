<template>
    <div class="traintype-picker">
        <Popup :mask="true" position="top" :maskClosable="true" :visible="show" type="add-child-picker-popup" @mask-click="onCancel">
            <div class="timerangeslot">
                <div class="picker-content">
                    <div class="picker-content-item" v-for="(item, index) in trainTypeFilterPickerData" :key="item.content">
                        <span class="text">{{item.content}}</span>
                        <span class="checkbox"><Checkbox style="font-size:120%;padding-right:0" :option="{value:item.type,disable:false}" :value="item.selected" @input="updatetraintype(index)" position="right"></Checkbox></span>
                    </div>
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
import { Popup, Checkbox, Button } from "cube-ui";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "timerangepicker",
  props: {},
  data() {
    return {
      show: false,
      selected: [1, 2, 3],
      trainTypeFilterPickerData: [
        {
          content: "高铁动车(G/D/C)",
          type: "2",
          selected: true
        },
        {
          content: "特快直达(T/Z)",
          type: "1",
          selected: true
        },
        {
          content: "其他车型",
          type: "3",
          selected: true
        }
      ]
    };
  },
  components: {
    Popup,
    Checkbox,
    Button
  },
  mounted() {
    let self = this;
    self.eventHub.$on("change-traintypepicker-status", function(data) {
      self.show = data;
    });
  },
  beforeDestroy() {
    // this.eventHub.$off("change-traintypepicker-status");
  },
  computed: {
    ...mapGetters({})
  },
  methods: {
    ...mapActions(["updateFilterCondition", "fetchFilterTrainList"]),
    updatetraintype(index) {
      let element = this.trainTypeFilterPickerData[index];
      this.selected = [];
      element.selected ? (element.selected = false) : (element.selected = true);
      this.trainTypeFilterPickerData.forEach(element => {
        if (element.selected) {
          this.selected.push(element.type);
        }
      });
      this.updateFilterCondition({ trainType: this.selected });
    },
    confirm() {
      if (!this.selected.length) {
        this.$createToast({
          txt: "请至少选择一种车型",
          time: 1500,
          type: "warn"
        }).show();
        return false;
      }
      this.updateFilterCondition({ trainType: this.selected });
      //do something
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
.traintype-picker {
  .timerangeslot {
    height: 19rem;
    background: #fff;
    margin-top: 50px;
    .picker-header {
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
      .picker-content-item {
        height: 5rem;
        line-height: 5rem;
        border-bottom: 1px solid rgba(0, 0, 0, 0.04);
        font-size: 0;
        span {
          display: inline-block;
          width: 50%;
          font-size: 1.25rem;
          box-sizing: border-box;
        }
        .text {
          text-align: left;
          padding-left: 1.5rem;
        }
        .checkbox {
          padding-right: 1.5rem;
          text-align: right;
        }
        &:last-child {
          border-bottom: none;
        }
      }
    }
  }
}
</style>
<style lang="less">
  .traintype-picker {
    .timerangeslot{
      .picker-content{
        color:#333!important;
      }
    }
  }
</style>


