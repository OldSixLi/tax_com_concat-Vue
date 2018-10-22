<template>
  <div class="router-block">
    <div id="resultBlock" v-if="isSuccess==2">
      <div class="header">
        <div class="imgContain"> <img src="@/assets/img/check-fail.png" class="checkImg"> </div>
          <img src="@/assets/img/mine-bg.png" class="img-bg" > </div>
          <div class="msg">对不起，您的信息审核失败</div>
          <div class="msgCause">未通过原因:{{reason||"上传资料信息有误"}}</div>
        </div>
        <p class="p-btn" v-if="isSuccess==2">

          <mt-button type="default" size="large" @click="back" v-if="isAdmin">重新提交注册信息</mt-button>
        </p>
        <div id="resultBlock" v-if="isSuccess==4">
          <div class="header" style="background-color: #4D81FF;">
            <div class="imgContain">
              <img src="@/assets/img/checkings.png" class="checkImg img"> </div>
              <img src="@/assets/img/mine-bg.png" class="img-bg" > </div>
              <div class="msg">您的公司还未提交审核信息！</div>
              <p class="p-btn">
                <mt-button type="default" size="large" @click="back">提交注册信息</mt-button>
              </p>
            </div>
            <div id="resultBlock" v-if="isSuccess==0||isSuccess==3">
              <div class="header" style="background-color: #4D81FF;">
                <div class="imgContain"><img src="@/assets/img/check-success.png"  class="checkImg "></div>
                  <img src="@/assets/img/mine-bg.png" class="img-bg" ></div>
                  <div class="msg">您的信息已提交审核,请耐心等待！</div>
                </div>
              </div>
</template>
<script>
  import { mapGetters } from 'vuex';
  export default {
    name: "InfoChecking",
    data() {
      return {
        isSuccess: 0
        // 0:审核中 1:审核通过 2:审核失败 3:重新提交审核 4:未提交审核
        ,
        // 当状态为 2 :审核未通过
        isAdmin:false,
        managerId:""

      }
    },
    computed: {
      ...mapGetters([
        'comUserId'
      ])
    },
    methods: {
      back() {
        this.$to("/regist");
      },
      toSystem() {
        this.$to("/system/role");
      },

      getComInfo(redirectUrl) {
        this.$post(`/audit/getEntepriseInfo`, {
          corpId: this.$store.state.companyId
        }).then((data) => {
          // 0-审核中 1-审核通过 2-审核未通过 3-重新提交审核，审核中 4-未提交审核
          if (data.bean.auditState != '') {
            this.isSuccess=data.bean.auditState;
            this.$store.commit('changeCheckState', data.bean.auditState);
            let currentState = data.bean.auditState;
            if (currentState == '1') {
              if(!redirectUrl){
                this.$to('/');
              }else{
                this.$to(decodeURIComponent(redirectUrl));
              }
            }
            else if(currentState == '2'){
              if(this.comUserId == data.bean.entInfo.manager) {
                this.managerId=data.bean.entInfo.manager;
                this.isAdmin=true;
              }
            }
          }
        })
      }
    },
    created() {
      this.isSuccess = this.$param(this).state || "4";
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.isSuccess = to.params.state;
        let redirectUrl=(to.query&&to.query.redirect)||"";
        vm.isAdmin=false;
        vm.getComInfo(redirectUrl);
      })
    }
  }
</script>
<style scoped>
  #resultBlock {
    display: flex;
    display: -webkit-flex;
    flex-wrap: nowrap;
    flex-direction: column;
    align-items: center;
    background-color: #fff;
  }

  #resultBlock div {
    flex-grow: 1;
    flex-shrink: 1;
  }

  #resultBlock .header {
    width: 100%;
    padding: 5rem 0 0 0;
    height: 17.6rem;
    background-color: #E7673E;
    position: relative;
  }

  .header .imgContain {
    width: 50%;
    margin: 0 auto;
    text-align: center;
  }

  .header .checkImg {
    width: 100%;
    max-width: 17rem;
  }

  .header .checkImg.img {
    width: 70%;
    max-width: 17rem;
  }

  .msg {
    font-size: 1.8rem;
    font-weight: bold;
    margin: 2rem 0;
  }

  .img-bg {
    position: absolute;
    bottom: 0;
    width: 100%;
    z-index: 1;
  }

  .msgCause {
    font-size: 1.4rem;
    color: #403232;
  }

  .p-btn {
    padding: 5rem 2rem;
    width: 100%;
    box-sizing: border-box;
  }
</style>
