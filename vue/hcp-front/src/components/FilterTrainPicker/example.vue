<template>
    <div>
        <button @click="changeFilterPickerStatus(true)">显示trainfilter-picker</button>
        <!-- <button @click="changeTrainTypePickerStatus(true)">显示traintype-picker</button> -->
        <!-- <button @click="changeTravelTimePickerStatus(true)">显示traveltime-picker</button> -->
        <FilterTrainPicker @on-cancel-filter-picker = "cancel" @on-confirm-filter-picker = "confirm"
        ></FilterTrainPicker>
        <TrainTypePicker></TrainTypePicker>
        <TravelTimePicker></TravelTimePicker>
    </div>
</template>

<script>
import FilterTrainPicker from "./filtertrainpicker";
import TrainTypePicker from "./traintypepicker";
import TravelTimePicker from "./traveltimepicker";
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      showFilterPicker: "showFilterPicker",
      showTrainTypePicker: "showTrainTypePicker",
      showTravelTimePicker: "showTravelTimePicker"
    })
  },
  components: {
    FilterTrainPicker,
    TrainTypePicker,
    TravelTimePicker
  },
  methods: {
    ...mapActions(["changeFilterPickerStatus","changeTrainTypePickerStatus","changeTravelTimePickerStatus"]),
    cancel() {
      console.log("====================cancel-filter-picker=================");
    },
    confirm(val) {
      console.log("====================confirm-filter-picker=================");
      console.log(val);
    }
  }
};
</script>

