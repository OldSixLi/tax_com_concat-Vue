<template>
  <div class="router-block">
    <!-- 顶部信息提示框 -->
    <mt-popup v-model="showTopTip" popup-transition="popup-fade" position="top" class="mint-popup-2" :modal="false">
      <p> {{tipWord}}</p>
    </mt-popup>
    <div class="center-img">
      <img src='./../assets/img/shuiwu.png' class='' alt='自定义'>
      <!-- {{checkState}} -->
     </div>
      <div style="padding:0 1rem;">
        <h3 class="text-center" style="margin-top:0;padding-top:1rem;">提交审核信息</h3>
        <mt-field label="所属分局" id="taxs" class="tax-select" disabled="true" :value="tax" @click.native="showList"
          placeholder="请选择所属税务分局">
        </mt-field>
        <mt-field label="公司名称" placeholder="请输入公司名称" v-model="username"></mt-field>
        <mt-field label="税号" placeholder="请输入税号" type="number" v-model="shxydm"></mt-field>
        <mt-field label="手机号" placeholder="请输入您的手机号" type="number" v-model.trim="phone"></mt-field>
        <mt-field label="验证码" v-model.trim="checkCode" placeholder="请输入验证码" :attr="{ maxlength: 4 }">
          <mt-button size="small" :disabled="restNum>0" @click="getCheckCode">
            <span v-if="restNum>0">{{restNum}}s后重新获取</span>
            <span v-if="restNum==0">获取验证码</span>
          </mt-button>
        </mt-field>
      </div>
      <p style="padding:0 2rem;">
        <mt-button type="primary" size="large" class="submit-btn" @click="submitInfo">提交审核</mt-button>
      </p>
      <!-- 税务分局列表    -->
      <mt-popup v-model="isShowList" position="bottom" class="mint-popup-4">
        <mt-picker :slots="taxList" @change="onDateChange" :visible-item-count="5" :show-toolbar="false" value-key="name"></mt-picker>
      </mt-popup>
    </div>
</template>
<script>
  import {
    Toast
  } from 'mint-ui';
  import {
    mapGetters
  } from 'vuex';
  export default {
    name: "Regist",
    data() {
      return {
        shxydm: "",
        username: "",
        checkCode: "",
        phone: "",
        checkBtnDisabled: true,
        restNum: 0,
        showTopTip: false,
        tipWord: "内容",
        timer: null,
        isShowList: false,
        tax: "",
        taxList: [{
          flex: 1,
          defaultIndex: -1,
          values: [],
          className: 'slot1',
          textAlign: 'right',
          valueIndex: -1
        }],
        systemTaxs: []

      }
    },
    mounted() {
      this.getTaxList();
    },
    computed: {
      ...mapGetters([
        'departmentId',
        'companyId',
        'comUserId',
        'checkState'
      ]),
      // 当前选中的税务局的ID
      taxId() {
        if (this.tax && this.systemTaxs && this.systemTaxs.length > 0) {
          let arr = this.systemTaxs.filter(x => x.name == this.tax);
          return arr[0].id;
        }
      },

    },
    beforeRouteEnter(to, from, next) {
      //进入之前
      next(vm => {
        if (vm.checkState == 1) {
          //审核已通过
          vm.$alert("您的企业已通过审核,不能重新提交审核信息").then(action => {
            next("/")
          })
        }
      })
      next()
    },
    methods: {
      /**
       * 获取企业在微信中的注册信息
       * @returns 
       */
      getComInfo(corpId) {
        this.$get(`/audit/getEntepriseInfo?corpId=${corpId}`)
          .then(data => {
            if (data.success) {
              this.username=data.bean.entName;
            }
          })
      },
      /**
       * 选择税务分局 
       * @returns 
       */
      onDateChange(picker, values) {
        this.tax = values[0];
      },
      /**
       * 显示税务分局列表 
       * @returns 
       */
      showList() {
        this.isShowList = true;
      },
      /**
       * 顶部提示方法 
       * @returns 
       */
      tip(msg = "") {
        if (this.showTopTip == true) {
          clearTimeout(this.timer);
        }
        this.tipWord = msg;
        this.showTopTip = true;
        this.timer = setTimeout(() => {
          this.showTopTip = false;
        }, 2000);
      },
      /**
       * 验证码倒计时处理逻辑
       *
       */
      restNumHandler() {
        this.restNum && this.restNum--;
        if (this.restNum > 0) {
          setTimeout(() => {
            this.restNumHandler()
          }, 1000);
        }
      },
      /**
       * 获取验证码 
       * @returns 
       */
      getCheckCode() {
        let phoneNumber = this.phone;
        if (!phoneNumber) {
          this.tip("请输入手机号后再进行操作", "error");
          return false;
        } else {
          if (!this.checkPhone(phoneNumber)) {
            this.tip("请输入正确的手机号", "error");
            return false;
          }
          //TODO 发送验证码
          this
            .$post('/audit/sendCode', {
              phone: phoneNumber
            })
            .then(data => {
              if (data) {
                if (data.success && data.bean) {
                  this.restNum = 60;
                  return Promise.resolve(phoneNumber);
                } else {
                  return Promise.reject("请求服务失败,请重试!");
                }
              } else {
                return Promise.reject("请求服务失败,请重试!");
              }
            });
        }
      },
      /**
       * 电话校验
       * 
       * @param {any} phone 手机号
       * @returns 是否有效 T/F
       */
      checkPhone(phone) {
        if (!(/^1(3|4|5|7|8)\d{9}$/.test(phone))) {
          return false;
        } else {
          return true;
        }
      },
      /**
       * 
       * 信息提交 
       * @returns 
       */
      submitInfo() {
        let name = this.username;
        let shxydm = this.shxydm;
        let _error = [];
        if (!this.taxId) {
          this.$tip(`请选择您所属的税务分局`);
          return false;
        }

        if (!name) {
          this.$tip(`请输入公司名称`);
          return false;
        }
        if (!shxydm) {
          this.$tip(`请输入公司税号`);
          return false;
        }
        // 校验手机号验证码匹配
        let code = this.checkCode;
        let phone = this.phone;
        this.$post(
            '/audit/checkCode', {
              code,
              phone
            })
          .then(
            // 手机验证码是否匹配
            data => {
              if (data.success) {
                return true;
              } else {
                return Promise.reject(false);
              }
            })
          .then(
            //进行信息提交
            success => {
              return this.$post(`/audit/submissionOfAudit`, {
                auditType: "1",
                corpId: this.companyId || "TODO企业微信中的公司ID",
                entName: this.name,
                license: "",
                taxId: this.taxId,
                manager: this.comUserId || "TODO 企业微信中的userId",
                phone: this.phone,
                sh: this.shxydm,
              })
            })
          .then(
            data => {
              data.success && this.$to('/infoChecking/0');
              !data.success && this.$alert(data.message);
            })
          .catch(
            err => {
              this.tip(err || `请求服务失败,请重试！`);
            }
          )
      },
      /**
       * 获取税务分局列表 
       * @returns  税务分局列表
       */
      getTaxList() {
        this.$get(`/audit/getTaxList`)
          .then(data => {
            if (data.success) {
              let arr = [""];
              data.bean.forEach(a => {
                arr.push(a.name)
              });
              this.taxList[0].values = arr;
              this.systemTaxs = data.bean;
            }
          })
      }
    },
    // <!--
    // '##:::::'##::::'###::::'########::'######::'##::::'##:
    //  ##:'##: ##:::'## ##:::... ##..::'##... ##: ##:::: ##:
    //  ##: ##: ##::'##:. ##::::: ##:::: ##:::..:: ##:::: ##:
    //  ##: ##: ##:'##:::. ##:::: ##:::: ##::::::: #########:
    //  ##: ##: ##: #########:::: ##:::: ##::::::: ##.... ##:
    //  ##: ##: ##: ##.... ##:::: ##:::: ##::: ##: ##:::: ##:
    // . ###. ###:: ##:::: ##:::: ##::::. ######:: ##:::: ##:
    // :...::...:::..:::::..:::::..::::::......:::..:::::..::
    // -->
    watch: {
      /**
       * 监听倒计时
       */
      restNum() {
        if (this.restNum == 60) {
          this.restNumHandler();
        }
      }
    }
  }

</script>
<style scoped>
  .center-img {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2rem;
    padding-bottom: 0.5rem;
  }

  .center-img>img {
    width: 10rem;
    border-radius: 20%;
  }

  .regist-block {
    padding: 0.5rem;
  }

  .submit-btn {
    margin-top: 1.5rem;
  }

  .mint-popup-2 {
    width: 100%;
    height: 4rem;
    text-align: center;
    background-color: rgba(0, 0, 0, .7);
    backface-visibility: hidden;
  }

  .mint-popup-2 p {
    line-height: 4rem;
    color: #fff;
    margin: 0;
  }

  .mint-popup-4 {
    width: 100%;
    text-align: center;
  }

  .mint-popup-4 .picker-slot-wrapper,
  .mint-popup-4 .picker-item {
    backface-visibility: hidden;
  }

</style>

<style>
  .mint-popup-4 .picker-item {
    text-align: center;
  }

  .tax-select input[type="text"]:disabled {
    background-color: #fff;
  }

  #taxs input {
    background-color: #fff;
  }

</style>
