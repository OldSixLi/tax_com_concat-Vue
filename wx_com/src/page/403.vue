<template>
  <el-row>
    <div class="err-info-page">
      <img src="@/assets/img/noauth.png" >
      <h4 style="margin:6rem 0;">对不起,您没有权限进入此页面!</h4>
      <mt-button size="large" @click="backIndex">返回主页</mt-button>
    </div>
  </el-row>
</template>
<script>
  export default {
    name: "noAuth",
    methods: {
      backIndex() {
        this.$to("/")
      }
    }
  }
</script> 
