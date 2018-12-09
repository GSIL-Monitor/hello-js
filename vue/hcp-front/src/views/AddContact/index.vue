<template>
  <div class='add-pass-container' :class="{ 'visibility': this.visibility }">
    <div class="content">
      <div class="select_icon" @click="showTypePicker(certificateType, 'credentials')">
        <span class="label">证件类型</span>
        <span class="value">{{chooseCertificate.content}}</span>
      </div>
      <div class="border-bot" @click="Omega('train_ticket_addpa_number_ck','添加乘客页面证件号码输入框点击')">
        <span class="label">证件号码</span>
        <cube-input placeholder="与乘客证件号码一致"  :value="contact.number" @input="updateContactNumber"></cube-input>
      </div>
      <div class="border-bot">
        <div class="label name-icon">
          <span>姓名</span>
          <img src="../../assets/images/question@2x.png" class="icon" @click="(value) => showNameTip(value)">
        </div>
        <cube-input placeholder="与乘客证件姓名一致" :value="contact.name" @input="updateContactName"></cube-input>
      </div>
      <div class="select_icon" @click="showTypePicker(sexType, 'gender')">
        <span class="label">性别</span>
        <span class="value">{{chooseSex.content}}</span>
      </div>
      <!-- 当证件类型为护照国家地区展示 -->
      <div class="select_icon" @click="showCountry" v-if="chooseCertificate.value === 'B'">
        <span class="label">国家/地区</span>
        <span class="value">{{country.name}}</span>
      </div>
      <div class="select_icon" @click="showTypePicker(passengerType, 'passenger')">
        <span class="label">乘客类型</span>
        <span class="value">{{choosePerson.content}}</span>
      </div>
    </div>
    <p class="tip" v-if="false">注:12306规定常用联系人在添加后180天内不可以删除，每个账号最多允许添加15个联系人</p>
    <div class="footer font-12">
      <div class="shouldknow fixed-bottom-container-shadow">
        <p>
          <span>查看</span>
          <span class="hight-light" @click="showIdentityProto">《核验须知》</span>
        </p>
      </div>
      <div class="btn-container fixed-bottom-container">
      <cube-button type="submit" :disabled="!contact.name || !contact.number"  @click="submitHandler">添加乘客</cube-button>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import { mapGetters, mapActions } from "vuex";
import { Button, Input, createAPI } from "cube-ui";
import CountryList from "@/components/CountryList/index.vue";
import NameNotice from "@/views/Protocol/nameNotice.vue";
import api from "@/service/api";
import axios from "@didi/dajax";
createAPI(Vue, CountryList, ["on-select", "on-cancel"], true);
createAPI(Vue, NameNotice, ["on-hide"], true);


export default {
  components: {
    CubeInput: Input,
    CubeButton: Button
  },
  data() {
    return {
      passengerType: [],
      certificateType: [],
      sexType: [],
      name: "",
      number: "",
      loadingStatus: false, // 是否正在加载
      country: {
        // 国家默认为中国
        name: "中国",
        code: "CN"
      },
      choosePerson: {},
      chooseCertificate: {},
      chooseSex: {},
      visibility: true
    };
  },
  props: {},
  computed: {
    ...mapGetters({
      contact: "contact"
    })
  },
  created() {
    // 请求联系人菜单配置
    this.fetchContactOption();
  },
  mounted() {
    this.changeHeader();
    this.Omega("train_ticket_addpa_sw", "添加乘客页面展现");
  },
  beforeDestroy() {},
  destroyed() {},
  watch: {
    // 当id_type为护照是请求国家接口数据
    "chooseCertificate.value"(val) {
      if (val === "B") {
        this.fetchCountryListUrl();
      }
    }
  },
  methods: {
    ...mapActions(["changeHeader", "updateContactInfo", "updateCountryList"]),
    // 请求联系人菜单配置
    async fetchContactOption() {
      const res = await api.fetchContactOption();
      if (res.errno === 0) {
        const { id_type, person_type, sex } = res.data;
        this.sexType = this.formatContent(sex);
        this.certificateType = this.formatContent(id_type);
        this.passengerType = this.formatContent(person_type);
        this.choosePerson = { ...this.passengerType[0], default: 0 };
        this.chooseCertificate = { ...this.certificateType[0], default: 0 };
        this.chooseSex = { ...this.sexType[0], default: 0 };
      } else {
        console.log(res.errmsg || "获取联系人配置失败");
      }
    },
    formatContent(data) {
      return (
        data &&
        data.map(item => {
          return {
            align: "left",
            content: item.name,
            value: item.code
          };
        })
      );
    },
    updateContactName(val) {
      this.updateContactInfo({ name: val });
    },
    updateContactNumber(val) {
      this.updateContactInfo({ number: val.toUpperCase() });
    },
    submitHandler(e) {
      if (!this.loadingStatus) {
        this.loadingStatus = true;
        this.Omega("train_ticket_addpa_add_ck", "添加乘客页面添加乘客按钮点击");
        // 证件类型验证
        let flag = true;
        switch (this.chooseCertificate.value) {
          case "1":
            flag = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(
              this.contact.number
            );
            break;
          case "C": // 港澳
            flag = /^[HMhm]{1}([0-9]{10}|[0-9]{8})$/.test(this.contact.number);
            break;
          case "G": // 台湾
            flag =
              /^[0-9]{8}$/.test(this.contact.number) ||
              /^[0-9]{10}$/.test(this.contact.number);
            break;
          case "B": // 护照
            flag =
              /^[a-zA-Z]{5,17}$/.test(this.contact.number) ||
              /^[a-zA-Z0-9]{5,17}$/.test(this.contact.number);
            break;
          default:
            break;
        }
        if (flag) {
          // 请求后台接口
          this.addPassengerInfo();
        } else {
          this.$createToast({
            txt: "证件号码格式有误，确认后重新输入",
            type: "warn",
            time: 1000
          }).show();
        }
        this.loadingStatus = false;
      }
    },
    async addPassengerInfo() {
      this.$createToast({
        txt: "正在添加乘客...",
        time: 0
      }).show();
      const params = {
        person_type: Number(this.choosePerson.value),
        id_type: this.chooseCertificate.value,
        sex: this.chooseSex.value,
        name: this.contact.name,
        id_no: this.contact.number
      };
      if (this.chooseCertificate.value === "B") {
        params.country_code = this.country.code;
      }
      const res = await api.addContact(params);
      if (res.errno === 0) {
        let { data } = res;
        this.$createToast({
          txt: "添加乘客成功",
          type: "correct",
          time: 1500
        }).show();
        const { pageIndex } = this.$route.query;
        let path = "/buyTicket";
        if (pageIndex === "grabTicket") {
          path = "/grabTicket";
        }
        setTimeout(() => {
          sessionStorage.setItem("previous_contact", "1");
          this.$router.push({
            path: path,
            query: { ...this.$route.query, passengerPickerShow: 1 }
          });
        }, 1000);
      } else {
        this.$createToast({
          txt: res.errmsg || "获取信息失败",
          type: "warn",
          time: 1000
        }).show();
      }
    },
    showTypePicker(data, type) {
      let activeIndex = 0;
      switch (type) {
        case "passenger":
          activeIndex = this.choosePerson.default;
          break;
        case "credentials":
          activeIndex = this.chooseCertificate.default;
          break;
        case "gender":
          activeIndex = this.chooseSex.default;
          break;
        default:
          break;
      }
      // omega
      let eventid = {
        passenger: "train_ticket_addpa_type_ck",
        credentials: "train_ticket_addpa_id_ck",
        sex: "train_ticket_addpa_gender_ck"
      };
      let eventname = {
        passenger: "添加乘客页面乘客类型点击",
        credentials: "添加乘客页面证件类型点击",
        sex: "添加乘客页面性别点击"
      };

      this.$createActionSheet({
        data: data,
        active: activeIndex,
        onSelect: (item, index) => {
          switch (type) {
            case "passenger":
              this.choosePerson = Object.assign(
                {},
                { ...item, default: index }
              );
              break;
            case "credentials":
              this.chooseCertificate = Object.assign(
                {},
                { ...item, default: index }
              );
              break;
            case "gender":
              this.chooseSex = Object.assign({}, { ...item, default: index });
              break;
            default:
              break;
          }
          let omega_params = {};
          // 区分证件类型与乘客类型与性别点击
          if (type === "credentials") {
            let value = 0;
            switch (true) {
              case item.content == "中国居民身份证" || item.value == "1":
                value = 0;
                break;
              case item.content == "护照" || item.value == "B":
                value = 1;
                break;
              case item.content == "港澳居民来往内地通行证" ||
                item.value == "C":
                value = 2;
                break;
              case item.content == "台湾居民来往大陆通行证" ||
                item.value == "G":
                value = 3;
                break;
              default:
                break;
            }
            omega_params.credentials = value;
          } else {
            omega_params[type] = item.content;
          }
          this.Omega(eventid.type, eventname.type, omega_params);
        },
        onCancel: () => {}
      }).show();
    },
    showNameTip(e) {
      const instance = this.$createNameNotice({
        isShow: true
      });
      instance.$on("on-hide", e => {
        instance.remove();
      });
      e.stopPropagation();
      this.Omega(
        "train_ticket_addpa_namenotice_ck",
        "添加乘客页面姓名旁问号提示点击"
      );
    },
    // 校验须知
    showIdentityProto() {
      this.omegaInfo &&
        this.Omega("train_ticket_addpa_notice_ck", "添加乘客页面核验须知点击");
      this.$router.push("/protocol/identityNotice");
    },
    showCountry() {
      this.Omega(
        "train_ticket_addpa_country_ck",
        "添加乘客页面国家地区选择项点击"
      );
      const instance = this.$createCountryList({
        countryListShow: true
      });
      this.visibility = false
      this.changeHeader({ headerStatus: 1 })
      instance.$on("on-select", e => {
        this.country = e;
        this.visibility = true
        this.changeHeader({ headerStatus: 0 })
        instance.remove();
      });
      instance.$on("on-cancel", e => {
        instance.remove();
        this.visibility = true
        this.changeHeader({ headerStatus: 0 }) //  为了修复安卓拉起输入法同时下拉会露出回到首页的问题
      });
    },
    // 获取国家列表url地址
    async fetchCountryListUrl() {
      // TODO last_version参数不传出错
      const res = await api.countryList({ last_version: "1.0.2" });
      if (res.errno === 0) {
        this.fetchCountryList();
      } else {
        console.log("获取国家列表url地址失败");
      }
    },
    // 请求国家列表
    async fetchCountryList() {
      // TODO 需要根据接口返回的data中url地址请求
      const res = await api.fetchCountryList();
      this.updateCountryList(res.list);
    }
  }
};
</script>
<style lang='less'>
@bgc: #f3f4f5;
@text: #333333;
@labelColor: #999999;
.add-pass-container {
  visibility: hidden;
  &.visibility {
    visibility: visible;
  }
  .content {
    width: 100%;
    background-color: #fff;
    margin-top: 0.83rem;

    box-sizing: border-box;
    text-align: left;
    & > div {
      display: flex;
      height: 50px;
      align-items: center;
      padding-left: 1.33rem;
      padding-right: 1.33rem;
      .label {
        width: 65px;
        margin-right: 20px;
        font-size: 14px;
        color: @labelColor;
      }
    }
    .name-icon {
      position: relative;
    }
    .value {
      font-size: 14px;
      color: @text;
    }
    .cube-input {
      flex: 1;
    }
    .cube-input::after {
      border: none;
    }
    .cube-input-field {
      padding-left: 0 !important;
    }
    .icon {
      position: absolute;
      top: 50%;
      left: 2rem;
      transform: translateY(-50%);
      width: 14.2px;
      height: 14.2px;
      margin-left: 5.9px;
    }
    .border-bot {
      border-bottom: 0.5px solid rgba(0, 0, 0, 0.04);
    }
    .select_icon {
      // background: url("../../assets/images/right@3x.png") no-repeat center right;
      // background-size: 1rem 1rem;
      border-bottom: 0.5px solid rgba(0, 0, 0, 0.04);
      position: relative;
      &::after {
        content: '';
        background: url("../../assets/images/right@3x.png");
        background-size: 1rem 1rem;
        width: 1rem;
        height: 1rem;
        position: absolute;
        right: 1.33rem;
      }
      &:active {
        background-color: rgba(0, 0, 0, 0.04);
      }
    }
  }
  .tip {
    font-size: 12px;
    text-align: left;
    color: @labelColor;
    margin: 1.29rem 0.58rem 0 1.33rem;
    line-height: 1.2rem;
  }
  .footer {
    // position: fixed !important;
    // bottom: 0;
    // left: 0;
    // right: 0;
    .btn-container {
      // padding-left: 1.33rem;
      // padding-right: 1.33rem;
      // padding-top: 10px;
    }
    .shouldknow {
      position: fixed !important;
      bottom: 70px;
      width: 100%;
      height: 30px;
      line-height: 30px;
      text-align: left;
      background: #fafafa;
      color: #666666;
      position: relative;
      p {
        // transform: scale(0.83);
        // position: absolute;
        // left: 0.41rem;
        font-size: 10px;
        margin-left: 1.33rem;
      }
    }
  }
}
</style>

<style>
.cube-action-sheet-space,
.cube-action-sheet-cancel {
  display: none !important;
}
.cube-dialog-close {
  display: none !important;
}
.cube-dialog-title-def {
  margin: 1.33rem 7.13rem 0 !important;
}
.cube-action-sheet-item_active {
  background: url("../../assets/images/check@3x.png") no-repeat center right;
  background-position-x: 95%;
  background-size: 1.33rem 1.33rem;
}
.cube-action-sheet-item {
  font-size: 15px !important;
  /* color: #333333 !important; */
}
.cube-toast-tip {
  max-height: none !important;
  min-height: 20px;
}
</style>
