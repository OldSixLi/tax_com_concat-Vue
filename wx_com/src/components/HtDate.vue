<template>
    <el-date-picker
      v-model="value6"
      type="datetimerange"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      :default-time="['12:00:00']">
    </el-date-picker>
</template>
<script>
  export default {
    name: "name",
    props: {
      //对外获取的数据
    },
    data: function() {
      //组件内数据部分
      return {
        value6: ""
      }
    },
    mounted: function() {
      //组件生成时调用
    },
    methods: {}
  }
</script>
<style scoped>

</style>