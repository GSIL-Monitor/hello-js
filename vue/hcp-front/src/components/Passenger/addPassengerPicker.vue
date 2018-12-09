<template>
  <Popup :mask="true" position="bottom" :maskClosable="true" :visible="show" type="add-passenger-picker-popup" @mask-click="onCancel">
    <div class="add-passenger-picker">
      <div class="picker-header border-bottom-1px">
        <div class="cancel font-14" @click="onCancel">取消</div>
        <div class="picker-title font-17">选择乘客</div>
        <div class="hight-light font-14 confirm" @click="onConfirm">确认</div>
      </div>

      <!-- <Account :isInPicker="true"></Account> -->

      <div class="add border-top-1px font-14 hight-light border-bottom-1px">
        <span class="bold">+</span>
        <span class="" @click="addPassengers">添加乘客</span>
      </div>
      <div :class="`list ${isAliPay?'list-iphonex-alipay':''}`">
          <div class="person border-bottom-1px" v-for="(person, index) in contactList" :key="person.id_no">
            <swipeout>
              <swipeout-item transition-mode="follow">
                <div slot="right-menu">
                  <swipeout-button @click.native="delContact(person)" type="warn">删除</swipeout-button>
                </div>
                <div slot="content" class="demo-content vux-1px-t">
                  <img class="icon-edit" :src="IconEdit"></img>
                  <div class="info">
                    <Checkbox position="right" v-model="checkedList[index]" style="font-size:160%;">
                      <p class="name font-14">
                        {{person.name}}
                        <img :src="IconChild" class="label-child" v-if="person.person_type == Child_Ticket_Code">
                      </p>
                      <p class="num font-12">{{person.id_no}}</p>
                    </Checkbox>
                  </div>
                </div>
              </swipeout-item>
            </swipeout>
          </div>
      </div>
    </div>
  </Popup>
</template>
<script>
import { Popup, Checkbox, CheckboxGroup, Button } from "cube-ui";
import {
  Swipeout,
  SwipeoutItem,
  SwipeoutButton
} from "@/components/Swipeout/index.js";
// import Account from '@/components/Account/account.vue'
import IconEdit from "@/assets/images/edit@3x.png";
import IconChild from "@/assets/images/label_child.png";
import { Adult_Ticket_Code, Child_Ticket_Code } from "./passengerMap";
import api from "service/api";
import { mapGetters, mapActions } from "vuex";

export default {
  components: {
    Popup,
    // Account,
    // CheckboxGroup,
    Checkbox,
    Button,
    Swipeout,
    SwipeoutItem,
    SwipeoutButton
  },
  data() {
    return {
      IconEdit,
      IconChild,
      Child_Ticket_Code,
      checkedList: [],
      cacheCheckedList: []
    };
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    contactList: {
      type: Array,
      default: function() {
        return [];
      }
    },
    passengers: {
      type: Array,
      default: function() {
        return [];
      }
    },
    omegaInfo: {
      type: Object,
      default: null
    }
  },
  computed: {
    ...mapGetters({
      isWeChat: "isWeChat",
      isAliPay: "isAliPay"
    })
  },
  created() {},
  mounted() {},
  beforeDestroy() {},
  destroyed() {},
  watch: {
    // cube-ui的checkbox无onChange事件，所以多用一个变量存储是否被勾选
    contactList: function(val, oldVal) {
      if (val.length) {
        this.checkedList = Array.from({ length: val.length }).map(
          item => false
        );
        this.cacheCheckedList = this.checkedList.slice();
      }
    },
    // data中的checkedList用以存储勾选状态，当已选择的乘客发生变化时(如被删除)，需要同步至checkedList
    passengers: function(val, oldVal) {
      let checkedList = this.generateCheckedList(val, this.contactList);
      this.checkedList = checkedList;
      this.cacheCheckedList = checkedList;
    }
    // checkedList: function(val) {
    //   let checkedNum = val.filter(item => !!item).length
    //
    // }
  },
  methods: {
    ...mapActions(["updateContactInfo"]),
    onConfirm() {
      let passengers = this.generatePassengers(
        this.checkedList,
        this.contactList
      );
      this.cacheCheckedList = this.checkedList.slice();
      this.$emit("on-confirm", passengers);
    },
    onCancel() {
      // 点击取消时，将勾选状态恢复，不保存
      this.checkedList = this.cacheCheckedList.slice();
      this.$emit("on-cancel");
    },
    generatePassengers(checkedIndexList, contactList) {
      let passengers = [];
      checkedIndexList.forEach((itemChecked, index) => {
        if (itemChecked) {
          let person = contactList[index];
          passengers.push(person);
          // 如果该乘客为成人则寻找下属child，为儿童则不寻找
          if (person.person_type === Adult_Ticket_Code) {
            let children = this.findSubChild(person);
            passengers = passengers.concat(children);
          }
        }
      });
      return passengers;
    },
    generateCheckedList(passengers, contactList) {
      let checkedList = Array.from({ length: contactList.length }).map(
        item => false
      );
      let passengersIdNo = passengers.map(item => item.id_no);
      contactList.forEach((person, index) => {
        if (passengersIdNo.indexOf(person.id_no) !== -1) {
          checkedList[index] = true;
        }
      });
      return checkedList;
    },
    // 从passengers中寻找当前contact下属的children（可能存在多个）
    findSubChild(person) {
      let { id_no } = person;
      let { passengers } = this;
      let children = passengers.filter(item => {
        return item.id_no == id_no && item.person_type == Child_Ticket_Code;
      });
      return children;
    },
    addPassengers() {
      // 清除vuex中保存在添加乘客信息
      this.updateContactInfo({ name: "", number: "" });
      // 跳转添加乘客页，需要判断是否超过10个联系人
      if (this.passengers.length > 9) {
        this.creatToast({
          txt: "最多支持添加10个联系人",
          time: 1000
        }).show();
      } else {
        let pageIndex = "buyTicket";
        if (this.$route.path === "/grabTicket") {
          pageIndex = "grabTicket";
        }
        this.$router.push({
          path: "/addContact",
          query: { ...this.$route.query, pageIndex }
        });
      }
    },
    delContact(person) {
      this.$emit("on-delete", person);
      this.omegaInfo &&
        this.Omega(this.omegaInfo.omegaKey, this.omegaInfo.omegaName);
    }
  }
};
</script>
<style scoped lang="less">
.add-passenger-picker {
  background-color: #f3f4f5;
  .picker-header {
    background-color: #fff;
    display: flex;
    height: 5rem;
    align-items: center;
    padding-left: 1.33rem;
    padding-right: 1.33rem;
    .cancel {
      color: #666666;
      height: 100%;
      line-height: 5rem;
      &:active {
        opacity: 0.6;
      }
    }
    .picker-title {
      flex-grow: 1;
      color: #333333;
    }
    .confirm {
      height: 100%;
      line-height: 5rem;
      &:active {
        opacity: 0.6;
      }
    }
  }
  .add {
    background-color: #fff;
    margin-top: 0.83rem;
    height: 4.25rem;
    display: flex;
    align-items: center;
    padding-left: 1.33rem;
    .bold {
      font-weight: bold;
      margin-right: 0.64rem;
    }
    &:active {
      background-color: rgba(0,0,0,0.04);
    }
  }
  .list {
    max-height: 17.13rem;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
  .person {
    background-color: #fff;
    // padding-left: 1.33rem;
    // padding-right: 1.33rem;
    position: relative;
    .icon-edit {
      position: absolute;
      width: 1.5rem;
      top: 1.5rem;
      left: 1.14rem;
    }
    .label-child {
      width: 26px;
      height: 14px;
      position: relative;
      top: 3px;
    }
    .info {
      margin-left: 1.67rem;
      .name {
      }
    }
  }
}
@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
  .list-iphonex-alipay {
    padding-bottom: 34px !important;
    background:#fff;
  }
}
</style>
