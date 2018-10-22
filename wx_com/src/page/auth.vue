<template>
  <div class="router-block">
    <!-- <h2 class="text-center">授权页面跳转</h2>
    <p> {{code}}</p>  -->
  </div>
</template>
<script>
  import {
    Indicator
  } from 'mint-ui';
  export default {
    name: "Auth", 
    data() {
      return {
        code: "",
        state: "",
        data: {}
      }
    },
    mounted() {
      Indicator.open();
    },
    methods: {
      getInfo() {
        try {
          let code = this.code;
          this.$post(`/self/login`, {
            code
          }).then(
            data => {
              this.data = data;
              // alert(JSON.stringify(data))
              if (data.success) {
                Indicator.close();
                try {
                  let flag = data.bean.flag || "";
                  switch (flag) {
                    // 0-访问微信接口错误 
                    // 1-不是该企业的成员 
                    // 2-该用户未添加企业 
                    // 3-企业未提交审核 
                    // 4-审核中或企业信息更新，重新审核中 
                    // 5-企业审核通过 
                    // 6-企业审核未通过,返回未通过原因
                    case '0':
                      alert("请求错误:访问微信接口失败");
                      break;
                    case '1':
                      alert("请求错误:您不是该企业的成员");
                      break;
                    case '2':
                      alert("请求错误:您还未添加企业");
                      break;
                    case '3':
                      this.$store.commit("changeCheckState", 4);
                      break;
                    case '4':
                      this.$store.commit("changeCheckState", 0);
                      break;
                    case '5':
                      this.$store.commit("changeCheckState", 1);
                      break;
                    case '6':
                      this.$store.commit("changeCheckState", 2, data.bean.reason);
                      break;
                    default:
                      console.log("访问微信接口失败,错误代号:" + flag)
                  }
                  if (flag >= 3) {
                    this.$store.commit('setwxUserInfo', data.bean);
                    this.$store.commit('setComUserId', data.bean.userId);
                    this.$store.commit('setComId', data.bean.corpId);
                    this.$store.commit('changeToken', data.bean.token);
                    if (this.state) {
                      this.$to(unescape(this.state))
                    } else {
                      this.$to("/")
                    }
                  }
                } catch (error) {
                  console.log(error)
                }
              } else {
                Indicator.close();
                this.$alert("获取企业信息失败,请重试!");
              }
            }, err => {
              console.log(err)
            }
          ).catch(
            err => {
              console.log(err)
            }
          )
        } catch (error) {
          console.log(error)
        }
      },
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
      }
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        try {
          let query = vm.urlSearch();
          vm.code = query.code || "";
          vm.state = query.state || "";
          if (vm.code) {
            vm.getInfo();
          }
        } catch (error) {}
      })
    }
  }
</script>
