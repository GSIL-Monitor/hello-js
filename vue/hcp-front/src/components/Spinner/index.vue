<template>
  <div class="spinner">
    <div class="bounce1"></div>
    <div class="bounce2"></div>
    <div class="bounce3"></div>
  </div>
</template>
<script>
export default {
  components: {

  },
  data() {
    return {

    }
  }
}
</script>
<style scoped lang="less">
@color-1: rgba(0,0,0,0.10);
@color-2: rgba(0,0,0,0.30);
@color-3: rgba(0,0,0,0.20);

.spinner {
  margin: 0 auto;
  width: 70px;
  text-align: center;
  & > div {
    width: 0.33rem;
    height: 0.33rem;
    border-radius: 100%;
    display: inline-block;
  }
  .bounce1 {
    -webkit-animation: sk-bouncedelay 1.4s infinite ease-in-out both;
    animation: sk-bouncedelay 1.4s infinite ease-in-out both;
    -webkit-animation-delay: -0.16s;
    animation-delay: -0.16s;
  }
  .bounce2 {
    -webkit-animation: sk-bouncedelay 1.4s infinite ease-in-out both;
    animation: sk-bouncedelay 1.4s infinite ease-in-out both;
    -webkit-animation-delay: -0.32s;
    animation-delay: -0.32s;
  }
  .bounce3 {
    -webkit-animation: sk-bouncedelay 1.4s infinite ease-in-out both;
    animation: sk-bouncedelay 1.4s infinite ease-in-out both;
    -webkit-animation-delay: -0.48s;
    animation-delay: -0.48s;
  }
}

// @-webkit-keyframes sk-bouncedelay {
//   // 0% { -webkit-transform: scale(0) }
//   // 50% { -webkit-transform: scale(1.0) }
//   // 10% { -webkit-transform: scale(1.0) }
// }

@keyframes sk-bouncedelay {
  0% {
    background-color: @color-1;
  }
  50% {
    background-color: @color-2;
  }
  100% {
    background-color: @color-3;
  }
}
</style>
