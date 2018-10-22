<template>
  <div class="hello">
    <el-row style="margin-top: 10px;">
      <el-col :span="12" :offset="6">
        <h1 class="text-center">欢迎使用税企通管理平台</h1>
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
        // input23: "",
        // sltValue: '',
        // options: [],
        // tableData: [],
        // colData: ['日期', '姓名', '地址'], //选中的列名
        // cities: ['日期', '姓名', '地址'],
        // code: ""
      }
    },
    methods: {
      // getTable() {
      //   this.$get('/api/table')
      //     .then(
      //       data => this.tableData = data,
      //       err => this.tableData = []
      //     );
      // },
      // getOption() {
      //   this.$get("/api/users")
      //     .then(
      //       data => this.options = data,
      //       err => this.options = []
      //     );
      // },
      /**
       * 分隔获取各个参数
       * 根据URL地址获取其参数
       */
       urlSearch() {
        var name, value;
        var str = location.href; //取得整个地址栏
        var num = str.indexOf("?");
        str = str.substr(num + 1);
        let obj = {};
        var arr = str.split("&"); //各个参数放到数组里
        for (var i = 0; i < arr.length; i++) {
          num = arr[i].indexOf("=");
          if (num > 0) {
            name = arr[i].substring(0, num);
            value = arr[i].substr(num + 1);
            obj[name] = value;
          }
        }
        return obj;
      },

      getInfo() {
        let code = this.code;
        if (!code) {
          return;
        }
        this.$post(`/tax/login/qr_code`,
          { code }
        ).then((data) => {
          if (data.success) {
              let token=data.bean.token;
              axios.defaults.headers.common['token'] =token;
              this.$store.dispatch('logIn',data.bean);
            
          } else {
            // 跳转到微信登录页面
            this
            .$alert(`获取信息失败,请重新扫码登录`)
            .then(action => {
              let goToDetail = "https://open.work.weixin.qq.com/wwopen/sso/qrConnect?appid=wxa059996e5d72516b&agentid=1000009&redirect_uri=http%3a%2f%2fdev-ws.htyfw.com.cn%3a18002%2f&state=";
              window.location.href = goToDetail;
            });
          }
        }).catch(x=>{
          alert(x);
          this
            .$alert(`获取信息失败,请重新扫码登录`)
            .then(action => {
              let goToDetail = "https://open.work.weixin.qq.com/wwopen/sso/qrConnect?appid=wxa059996e5d72516b&agentid=1000009&redirect_uri=http%3a%2f%2fdev-ws.htyfw.com.cn%3a18002%2f&state=";
              window.location.href = goToDetail;
            });
        });
      }
    },
    mounted() {
      // axios.defaults.headers.common['token'] = "666666";
      // this.getTable();
      // this.getOption();
      // let obj = this.urlSearch();
      // this.code = obj.code || "";
      // if(this.code&&!this.$store.state.isLogin){
      //   this.getInfo();
      // }
    },
    created() {

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