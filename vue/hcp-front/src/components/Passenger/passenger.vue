<template>
  <div class="passenger">
    <div class="passenger-list">
      <div :class="`person ${index<passengers.length-1?'border-bottom-1px':''}`" v-for="(person, index) in passengers" :key="person.id_no + person.person_type + index ">
        <i class="icon-remove" @click="removePassenger(person, index)"></i>
        <p class="font-14 name">
          <span class="">{{person.name}}</span>
          <span class="ticket-type">{{formatTicketType(person.person_type)}}</span>
          <img :src="IconQuestion" class="icon-question" v-if="person.person_type == Child_Ticket_Code" @click="showChildProtocol"/>
        </p>
        <p class="font-12 num">
          <span class="id-num">{{person.id_no}}</span>
        </p>
        <!-- 下属的儿童 -->
        <!-- <div class="sub-child" v-if="person.child.length">
          <i class="icon-remove"></i>
          <p class="font-14 name">
            <span class="">{{person.name}}</span>
            <span class="ticket-type">{{formatTicketType(person.person_type)}}</span>
          </p>
          <p class="font-12 num">
            <span class="id-num">{{person.id_no}}</span>
          </p>
        </div> -->
      </div>
    </div>
    <div class="btn-group">
      <div class="add-person font-14" @click="addPassenger">
        <span class="add">+</span>
        <span class="text">添加乘客</span>
      </div>
      <div class="add-child font-14" @click="addChild">
        <span class="add">+</span>
        <span class="text">添加儿童票</span>
      </div>
    </div>
    <AddPassengerPicker
      @on-cancel="onPasPickerCancel"
      @on-confirm="onPasPickerConfirm"
      @on-delete="deleteContact"
      :contactList="contactList"
      :passengers="passengers"
      :show="passengerPickerShow"
      :omegaInfo="{omegaKey:omegaInfo.omegaDeleteKey,omegaName:omegaInfo.omegaDeleteName}"
      >
    </AddPassengerPicker>
    <AddChildPicker
      :show="childPickerShow"
      @on-cancel="onChildPickerCancel"
      @on-select="onChildPickerSelect"
      :passengers="passengers"
      >
    </AddChildPicker>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import AddPassengerPicker from "./addPassengerPicker.vue";
import AddChildPicker from "./addChildPicker.vue";
import api from "service/api";
import {
  formatTicketType,
  Child_Ticket_Code,
  Adult_Ticket_Code,
  Lonely_Child_Text,
  Max_Passenger_Text,
  No_Passenger_Text
} from "./passengerMap";
// import Dialog from "@/components/Dialog/index.vue";
import ChildTicketNotice from "@/views/Protocol/childTicketNotice.vue";
import IconQuestion from "@/assets/images/question@2x.png";
import Vue from "vue";
import { createAPI } from "cube-ui";
createAPI(Vue, ChildTicketNotice, ["on-hide"], true);

export default {
  components: {
    AddPassengerPicker,
    AddChildPicker,
    // Dialog,
    ChildTicketNotice,
  },
  data() {
    return {
      formatTicketType,
      passengerPickerShow: false,
      childPickerShow: false,
      IconQuestion,
      Child_Ticket_Code
    };
  },
  props: {
    omegaInfo: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  computed: {
    ...mapGetters({
      passengers: "passengers",
      contactList: "contactList"
    })
  },
  created() {},
  mounted() {
    this.getContact();
  },
  beforeDestroy() {},
  destroyed() {},
  watch: {},
  methods: {
    ...mapActions([
      "updateContact",
      "updatePassengers",
      "updateContactInfo",
      "updateServiceStatus"
    ]),
    checkOver() {
      let isOver = false;
      if (this.passengers.length == 5) {
        isOver = true;
        this.toast(Max_Passenger_Text);
      }
      return isOver;
    },
    showChildProtocol() {
      const instance = this.$createChildTicketNotice({
        isShow: true
      });
      instance.$on("on-hide", e => {
        instance.remove();
      });
      const { path } = this.$route
      console.log(path)
      let omegaParams = {
      // 抢票为0、购买为1
        way: 1
      };
      switch (path) {
        case '/buyTicket':
          omegaParams.way = 1;
          break;
        case '/grabTicket':
          omegaParams.way = 0;
          break;
        default:
          break;
      }
      this.Omega(
        "train_ticket_fillorder_child_ck",
        "下单页面乘客为儿童时儿童须知问号点击",
        omegaParams
      );
    },
    removePassenger(person, index) {
      let passengers = this.passengers.slice();
      if (person.person_type == Child_Ticket_Code) {
        passengers.splice(index, 1);
      } else if (person.person_type == Adult_Ticket_Code) {
        // 如果移除的是携带儿童的成人，还需要将其附带的儿童也移除
        passengers = passengers.filter(item => {
          return item.id_no !== person.id_no;
        });
      }
      this.updatePassengers({ passengers });
      if (
        passengers.length &&
        passengers.every(item => item.person_type == Child_Ticket_Code)
      ) {
        this.toast(Lonely_Child_Text);
      }
    },
    async getContact() {
      const res = await api.fetchContactList();
      if (res.errno == 0) {
        this.updateContact(res.data);
        this.updateServiceStatus({ notServiceTime: !res.service_time_flag });
      } else {
        // TODO
      }
      // 从添加乘客页跳转回来展示选择乘客picker
      if (Number(this.$route.query.passengerPickerShow)) {
        this.passengerPickerShow = true;
        const { query } = this.$route;
        // 更新路由参数
        const newQuery = Object.assign({}, query, { passengerPickerShow: 0 });
        this.$router.replace({ query: newQuery });
      }
    },
    addPassenger() {
      if (this.checkOver()) {
        return;
      }
      this.updateContactInfo({
        name: "",
        number: ""
      });
      this.passengerPickerShow = true;
      this.omegaInfo &&
        this.Omega(this.omegaInfo.omegaKey, this.omegaInfo.omegaName);
    },
    onPasPickerCancel() {
      this.passengerPickerShow = false;
    },
    onPasPickerConfirm(val) {
      // 一个都未选择时
      if (!val.length) {
        this.toast(No_Passenger_Text);
        return;
      }
      // 只选了儿童，无成人时
      if (
        val.length &&
        val.every(item => item.person_type == Child_Ticket_Code)
      ) {
        this.toast(Lonely_Child_Text);
        return;
      }
      // 超过五个时
      if (val.length > 5) {
        this.toast(Max_Passenger_Text);
        return;
      }
      this.passengerPickerShow = false;
      this.updatePassengers({ passengers: val });
    },
    addChild() {
      // 超过五个时
      if (this.checkOver()) {
        return;
      }
      // 未添加成人时或者所有的乘客都是儿童
      let allChild =
        this.passengers &&
        this.passengers.every(item => item.person_type == Child_Ticket_Code);
      if (!this.passengers.length || allChild) {
        this.toast("请先添加一位成人");
        return;
      }
      // 只有单个成人时，默认为当前成人添加儿童票
      let adult = this.passengers.filter(
        item => item.person_type == Adult_Ticket_Code
      );
      if (adult.length == 1) {
        this.addChildForThisAdult(this.passengers, adult);
        return;
      }
      this.childPickerShow = true;
      this.omegaInfo &&
        this.Omega(this.omegaInfo.childOmegakey, this.omegaInfo.childOmegaName);
    },
    addChildForThisAdult(passengers, adult) {
      let child = { ...adult[0], person_type: Child_Ticket_Code };
      let newPassengers = passengers.concat(child);
      this.updatePassengers({ passengers: newPassengers });
    },
    onChildPickerCancel() {
      this.childPickerShow = false;
    },
    onChildPickerSelect(val) {
      // 添加儿童关闭picker——校验乘客数
      if (this.checkOver()) {
        return;
      }
      let passengers = this.passengers.slice();
      passengers = passengers.concat(val);
      this.updatePassengers({ passengers });
      this.childPickerShow = false;
    },
    async deleteContact(person) {
      const params = { ...person };
      const res = await api.delContact(params);
      if (res.errno == 0) {
        this.getContact();
      } else {
        this.toast("删除联系人失败");
      }
    },
    toast(msg, type = "warn", time = 1000) {
      this.$createToast({ txt: msg, type, time }).show();
    }
  }
};
</script>
<style scoped lang="less">
.passenger {
  background-color: #fff;
  .passenger-list {
    .person {
      position: relative;
      margin-left: 1.33rem;
      margin-right: 1.33rem;
      .icon-remove {
        background-image: url("~assets/images/remove@3x.png");
        background-size: 2rem 2rem;
        width: 2rem;
        height: 2rem;
        position: absolute;
        // left: 1.17rem;
        left: -0.2rem;
      }
      .icon-question {
        width: 14.2px;
        height: 14.2px;
        position: relative;
        top: 2px;
      }
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      color: #333333;
      padding-top: 1.25rem;
      padding-bottom: 1.25rem;
      & > p {
        // margin-left: 3.83rem;
        margin-left: 2.64rem;
      }
      .name {
        flex-grow: 1;
        flex-basis: 100%;
        text-align: left;
        line-height: 1.67rem;
        .ticket-type {
          margin-left: 0.58rem;
          color: #999999;
        }
      }
      .num {
        line-height: 1.42rem;
      }
      &:last-child {
        border-bottom: none;
      }
    }
  }
  .btn-group {
    height: 4.17rem;
    display: flex;
    align-items: center;
    border-top: 1px solid rgba(0, 0, 0, 0.04);
    .add-person {
      position: relative;
    }
    .add-person:after {
      content: "";
      position: absolute;
      right: 0;
      // top: -1.3rem;
      display: inline-block;
      height: 4rem;
      background-color: rgba(0, 0, 0, 0.1);
      width: 1px;
      transform: scale(0.5);
    }
    .add-person,
    .add-child {
      justify-content: space-around;
      color: #fc9153;
      width: 50%;
      height: 4.17rem;
      line-height: 4.17rem;
      .add {
        font-weight: bold;
      }
      &:active {
        background-color: rgba(0, 0, 0, 0.04);
      }
    }
  }
  .notice-content-body {
    height: 370px;
    overflow-y: scroll;
    z-index: 1000;
  }
}
</style>
