<template>
  <div class="logo">
    <img alt="logo" src="~@/assets/logo.png" />
    <!-- <img v-else alt="logo" src="~@/assets/logo-mini.png"/> -->
    <!-- <h1 v-if="showTitle">{{ title }}</h1> -->
  </div>
</template>

<script>

export default {
  name: 'Logo',
  components: {
  },
  props: {
    // title: {
    //   type: String,
    //   default: '',
    //   required: false
    // },
    // showTitle: {
    //   type: Boolean,
    //   default: true,
    //   required: false
    // },
    // collapsed: {
    //   type: Boolean,
    //   default: false
    // }
  }
}
</script>
<style lang="less" scoped>
.logo{
  height: 64px;
  border-bottom: 1px solid transparent;
   border-color: rgba(151, 151, 151, 0.1);
  box-shadow: 0px 2px 10px rgba(41, 12, 127, 0.1);
}
  img {
    margin-top: 18px;
    margin-left: 46px;
    width:90px;
    height:35px !important;
    background-color: #fff;
  }
</style>
