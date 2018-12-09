<template>
  <div class="chose-seat" v-show="passengers.length">
    <div class="chose-seat-title border-bottom-1px">
      <p class="font-14">在线选座</p>
      <p class="">所选座位余票不足时，将优先有票座位为您出票</p>
    </div>
    <div class="row border-bottom-1px" v-for="(item, rowIndex) in selectSeatArr" :key="rowIndex">
      <div class="left-seats">
        <span class="font-14 window">窗</span>
        <div
          class="seat-item"
          v-for="(seatCode, seatIndex) in row[rowIndex].left"
          :key="seatCode"
          @click="onClick(seatIndex, rowIndex, 'left')">
            <SeatIcon
              @click="selectSeat(seatCode)"
              width='20px'
              height="16px"
              :status="row[rowIndex].leftStatus[seatIndex]"
              :seatCode="seatCode">
            </SeatIcon>
        </div>
      </div>
      <div class="aisle font-14">
        过道
      </div>
      <div class="right-seats">
        <div
          class="seat-item"
          v-for="(seatCode, seatIndex) in row[rowIndex].right"
          :key="seatCode"
          @click="onClick(seatIndex, rowIndex, 'right')"
        >
          <SeatIcon
            @click="selectSeat(seatCode)"
            width='20px'
            height="16px"
            :status="row[rowIndex].rightStatus[seatIndex]"
            :seatCode="seatCode">
          </SeatIcon>
        </div>
        <span class="font-14 right-window">窗</span>
      </div>
    </div>
  </div>
</template>
<script>
import SeatIcon from './seatIcon.vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    SeatIcon
  },
  data() {
    return {
      left: [],
      right: [],
      seatStatus: [{}, {}],
      row: [{
        left: [],
        right: [],
        leftStatus: [],
        rightStatus: []
      }, {
        left: [],
        right: [],
        leftStatus: [],
        rightStatus: []
      }]
    }
  },
  props: {
    chooseSeat: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapGetters({
      passengers: 'passengers',
      contactList: 'contactList',
      trainSeatGroup: 'trainSeatGroup',
      // seatStatus: 'seatStatus'
    }),
    selectSeatArr: function() {
      let { passengers } = this
      return passengers.length > 1 ? [1, 2] : [1] // 可选座次展示排数
    }
  },
  created() {
  },
  mounted() {

  },
  beforeDestroy() {},
  destroyed() {},
  watch: {
    trainSeatGroup: {
      handler: function(val, oldVal) {
        this.initSeatGroup()
      },
      deep: true,
      immediate: true
    },
    passengers: function(val, oldVal) {
      // 当删除了乘客时，重置已选择座席
      if (val.length < oldVal.length) {
        this.reset()
      } else if (val.length > oldVal.length) {
      // 当增加了乘客时，重新计算disabled的座位
        this.computedDisabled()
      }
    }
  },
  methods: {
    ...mapActions([
      'updateSeatStatus'
    ]),
    selectSeat(seat) {
      this.Omega('train_ticket_fillorder_choice_ck', '订单填写页面在线选座点击', { seat: seat })
    },
    initSeatGroup() {
      let row = this.computeRow()
      this.row = [
        {
          left: row.left,
          right: row.right,
          leftStatus: Array.from({ length: row.left.length }).map(status => 'isEmpty'),
          rightStatus: Array.from({ length: row.right.length }).map(status => 'isEmpty')
        },
        {
          left: row.left,
          right: row.right,
          leftStatus: Array.from({ length: row.left.length }).map(status => 'isEmpty'),
          rightStatus: Array.from({ length: row.right.length }).map(status => 'isEmpty')
        }
      ]
    },
    computeRow() {
      let { train_type, chosen_seat } = this.$route.query
      let seat_type = chosen_seat.code
      let { trainSeatGroup } = this
      let seatGroup = []
      let left = []
      let right = []
      try {
        seatGroup = trainSeatGroup[train_type][seat_type]
        seatGroup = seatGroup.join('').split('|')
        this.left = seatGroup[0].split('')
        this.right = seatGroup[1].split('')
        left = seatGroup[0].split('')
        right = seatGroup[1].split('')
      } catch (e) {
        // do nothing
      }
      return { left, right }
    },
    switchStatus(oldVal) {
      let val = ''
      switch (true) {
        case !oldVal:
          val = 'isChose'
          break;
        case oldVal == 'isChose':
          val = 'isEmpty'
          break;
        case oldVal == 'disabled':
          val = 'disabled'
          break;
        case oldVal == 'isEmpty':
          val = 'isChose'
          break;
        default:
          break;
      }
      return val
    },
    onClick(seatIndex, rowIndex, type) {
      let row = this.row[rowIndex]
      let oldStatus = ''
      let newStatus = ''
      let leftStatus = []
      let rightStatus = []
      if (type == 'left') {
        oldStatus = row.leftStatus[seatIndex]
        newStatus = this.switchStatus(oldStatus)
        leftStatus = row.leftStatus.slice()
        leftStatus[seatIndex] = newStatus
        this.$set(this.row[rowIndex].leftStatus, seatIndex, newStatus)
      } else {
        oldStatus = row.rightStatus[seatIndex]
        newStatus = this.switchStatus(oldStatus)
        rightStatus = row.rightStatus.slice()
        rightStatus[seatIndex] = newStatus
        this.$set(this.row[rowIndex].rightStatus, seatIndex, newStatus)
      }
      this.computedDisabled()
    },
    computedDisabled() {
      let maxActive = this.passengers.length
      let nowActive = 0
      this.row.forEach(item => {
        let rowLeftActive = item.leftStatus.filter(status => status == 'isChose').length
        let rowRightActive = item.rightStatus.filter(status => status == 'isChose').length
        nowActive = nowActive + rowLeftActive + rowRightActive
      })
      if (nowActive == maxActive) {
        this.row.forEach(item => {
          item.leftStatus = item.leftStatus.map(status => {
            if (status !== 'isChose') {
              return 'disabled'
            }
            return status
          })
          item.rightStatus = item.rightStatus.map(status => {
            if (status !== 'isChose') {
              return 'disabled'
            }
            return status
          })
        })
      }
      if (nowActive < maxActive) {
        this.row.forEach(item => {
          item.leftStatus = item.leftStatus.map(status => {
            if (status == 'disabled') {
              return 'isEmpty'
            }
            return status
          })
          item.rightStatus = item.rightStatus.map(status => {
            if (status == 'disabled') {
              return 'isEmpty'
            }
            return status
          })
        })
      }
      this.getSelectSeat()
      // console.dir(this.row);
    },
    // e.g.选了 row1:AB、row2:BEF
    // 输出 1A2B1E1F, 即num+Code
    getSelectSeat() {
      let firstRowActive = []
      let secondRowAcitve = []
      let active = []
      this.row.forEach(item => {
        item.leftStatus.forEach((status, index) => {
          if (status == 'isChose') {
            active.push(item.left[index])
          }
        })
        item.rightStatus.forEach((status, index) => {
          if (status == 'isChose') {
            active.push(item.right[index])
          }
        })
      })
      // console.log(active);
      let count = {}
      active.forEach(code => {
        count[code] = (count[code] || 0) + 1
      })
      let seatStatus = ''
      Object.keys(count).forEach(key => {
        seatStatus = seatStatus + count[key] + '' + key
      })
      this.updateSeatStatus({ seatStatus: seatStatus })
    },
    reset() {
      this.initSeatGroup()
      this.updateSeatStatus({ seatStatus: '' })
    }
  }
}
</script>
<style scoped lang="less">
.chose-seat {
  background-color: #FFF;
  .chose-seat-title {
    color: #999999;
    // height: 3.33rem;
    // line-height: 3.33rem;
    text-align: left;
    padding: 1rem 1.33rem .83rem;
    // padding-left: 1.33rem;
    // padding-right: 1.33rem;
    .font-14{
      margin-bottom: 5px;
    }
  }
  .row {
    padding-left: 1.33rem;
    padding-right: 1.33rem;
    height: 4.13rem;
    display: flex;
    align-items: center;
    .left-seats {
      display: flex;
    }
    .right-seats  {
      display: flex;
    }
  }
  .seat-item {
    position: relative;
    // margin-right: 1.9rem;
    margin-right: 20%;
    .seat-code {
      color: #FFF;
      z-index: 2;
      position: absolute;
      top: 10px;
    }
  }
  .window{
    display: inline-block;
    // margin-right: 2.5rem;
    margin-right: 30%;
  }
  .aisle{
    margin-left: 26%;
    // margin-right: 2.5rem;
    margin-right: 7%;
  }
  .right-window{
    margin-left: 26%;
  }
}
</style>
