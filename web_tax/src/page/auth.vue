<template>
  <div class="hello">
    <el-row style="margin-top: 10px;">
      <el-col :span="12" :offset="6">
        <!-- <h1 class="text-center">信息获取中</h1> -->
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import axios from 'axios';
  import { Loading } from 'element-ui';
  import {
    wxUrl
  } from '@/_config';

  let loader= Loading.service({ fullscreen: true });
  export default {
    name: 'Auth',
    data() {
      return {
        code: ""
      }
    },
    methods: {
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

      resolveErr(tip, path = 'login') {
        this.$alert(tip).then(data => {
            this.$to(path);
        })
      },

      getInfo() {
        let code = this.code;
        if (!code) {
          return;
        }
        this.$post(`/tax/login/qr_code`, {
          code
        }).then((data) => {
          if (data.success) {
            let flag = data.bean.flag.toString() || "";
            switch (flag) {
              // "0":访问微信接口错误
              // "1":用户不在税务分局的通讯录中,无法进行登录
              // "2":税务分局未授权或已被作废
              // "3":税务分局未提交审核
              // "4":审核中或税务分局信息更新，重新审核中
              // "5":税务分局审核通过
              // "6":税务分局审核未通过,返回未通过原因
              case '0':
                this.resolveErr("请求错误:访问微信接口失败");
                break;
              case '1':
                this.resolveErr("对不起,您所在企业没有开通应用权限").then(action => {
                  this.$to("/login")
                });
                break;
              case '2':
                this.resolveErr("对不起,您所在企业未被授权登录此应用");
                break;
              case '3':
                this.resolveErr("您所属的企业未提交审核,无法登陆本应用");
                break;
              case '4':
                this.resolveErr("您所属的企业信息审核中,暂时无法登陆本应用");
                break;
              case '5':
                let token = data.bean.token;
                this.$store.dispatch('logIn', data.bean);
                //TODO 后期添加根据参数跳转的功能
                this.$to("/");
                break;
              case '6':
                this.resolveErr("您所属的企业信息审核未通过,暂时无法登陆本应用");
                break;
              default:
                console.log("访问微信接口失败,错误代号:" + flag);
            }

          } else {
            this
              .$alert(`获取信息失败,请重新扫码登录`)
              .then(action => {
                this.$store.dispatch("logOut");
                window.location.href = wxUrl;
              });
          }
        }).catch(x => {
          this
            .$alert(`获取信息失败,请重新扫码登录`)
            .then(action => {
              this.$store.dispatch("logOut");
              window.location.href = wxUrl;
            });
        });
      }
    },
    mounted() {
      // axios.defaults.headers.common['token'] = "666666";
      let obj = this.urlSearch();
      this.code = obj.code || "";
      if (this.code && !this.$store.state.isLogin) {
        this.getInfo();
      }else if(!this.code){
        window.location.href = wxUrl;
      }else if(this.$store.state.isLogin){
        this.$to("/")
      }else{
        window.location.href = wxUrl;
      }
     
    },
    created() {

    },
    beforeRouteLeave(to, from, next) {
      loader.close();
      next();
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