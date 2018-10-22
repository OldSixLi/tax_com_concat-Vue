<template>
  <el-row>
    <div class="err-info-page">
      <img src="@/assets/img/404.png" style="width:60%;">
      <h4 style="margin:6rem 0;">对不起,您访问的路径不存在!</h4>
      <mt-button size="large" @click="backIndex">返回主页</mt-button>
    </div>
  </el-row>
</template>
<script>
  export default {
    name: "Lost",
    methods: {
      backIndex() {
        this.$to("/")
      }
    }
  }
</script>
