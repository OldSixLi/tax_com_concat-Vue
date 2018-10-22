<template>
  <div class="hello">
    <el-row style="margin-top: 10px;">
      <el-col :span="12" :offset="6">
        <h1 class="text-center">欢迎使用智慧财税支撑服务平台</h1>
        <img src="./../assets/img/logo.png" alt="">
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import axios from 'axios';
  export default {
    name: 'HelloWorld',
    data() {
      return {
        input23: "",
        sltValue: '',
        options: [],
        tableData: [],
        colData: ['日期', '姓名', '地址'], //选中的列名
        cities: ['日期', '姓名', '地址']
      }
    },
    methods: {
      getTable() {
        this.$get('/api/table')
          .then(
            data => this.tableData = data,
            err => this.tableData = []
          );
      },
      getOption() {
        this.$get("/api/users")
          .then(
            data => this.options = data,
            err => this.options = []
          );
      }
    },
    mounted() {
      axios.defaults.headers.common['Authorization'] = "666666";
      this.getTable();
      this.getOption();
    }
  }
</script>

<style scoped>
  h1,
  h2 {
    font-weight: normal;
    font-size: 25px;
    text-align: center;
  }
  
  .hello {
    padding: 10px;
  }
  
  ul {
    list-style-type: none;
    padding: 0;
  }
  
  a {
    color: #42b983;
  }
  
  .grid-content {
    border: 1px solid #ddd;
  }
  
  .table-title {
    border: 1px solid #ddd;
    border-bottom: none;
    margin-bottom: 0;
    padding: 10px;
    color: #909399;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    background-color: #f9f7f7;
    position: relative;
  }
</style>