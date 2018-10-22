<template>
  <div class="index-block">
    <h2 class="text-center" style="margin-top: 5rem;font-size: 5rem;color:#fff;">税企通</h2>
    <!-- {{token}}
    {{companyId}}
    {{comUserId}} -->
    <router-view name="path"></router-view>
    <!-- <mt-button @click="clearStroage">清除缓存</mt-button> -->
    <div class="box">
      <div class="column">
        <span class="item" @click="toRegist">
          <img src="./../assets/img/index-icon/info-icon.png">
          <span>注册信息</span>
        </span>
        <span class="item" @click="toRole">
          <img src="./../assets/img/index-icon/system-icon.png">
          <span class="icon-title">系统设置</span>
        </span>
      </div>
      <div class="column">
        <span class="item" @click="toAsk">
          <img src="./../assets/img/index-icon/ask-icon.png">
          <span>问题咨询</span>
        </span>
        <span class="item" @click="toMessage">
          <img src="./../assets/img/index-icon/msg-icon.png">
          <span>消息通知</span>
        </span>
      </div>
    </div>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex';
  import {
    Toast,
    Indicator,
    MessageBox
  } from 'mint-ui';

  export default {
    name: "Index",
    computed: {
      ...mapGetters([
        'departmentId',
        'companyId',
        'comUserId',
        'token',
        'checkState'
      ])
    },
    methods: {
      clearStroage() {
        let storage = window.localStorage;
        storage.setItem('currenComId', '');
        storage.setItem('comUserId', '');
      },
      toasts() {
        Toast({
          message: '操作成功',
          iconClass: 'icon icon-success'
        });
      },
      alerts() {
        MessageBox({
          title: '提示',
          message: '确定执行此操作?',
          showCancelButton: true
        });
      } ,
      toRole() {
        this.$to("/system/role");
      },
      toRegist() {
        if (this.checkState == 1) {
          this.$alert("您的企业已通过审核,不能重新提交审核信息");
          return;
        } else {
          this.$to("/regist");
        }
      },
      toAsk(){
        this.$to("/ask/list");
      }, 
      toMessage() {
        this.$to("/message/list");
      }
    },
    beforeRouteEnter(to, from, next) {
      next();
    },
    beforeRouteLeave(to, from, next) {
      next();
    },
    mounted() {
      Indicator.close(); 
    }
  }
</script>
<style scoped>
  .index-block {
    box-sizing: border-box;
    height: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: space-between;
    padding: 0 2rem;
    padding-bottom: 10rem;
    background-color: #6a8db7;
    max-width: 720px;
    margin: 0 auto;
  }

  .box {
    display: flex;
    flex-wrap: wrap;
    align-content: space-between;
    background-color: #fff;
    border-radius: 1rem;
  }

  .column {
    flex-basis: 100%;
    display: flex;
    justify-content: space-between;
  }

  .column>.item {
    width: 50%;
    height: auto;
    box-sizing: border-box;
    padding: 2rem;
    border-right: 0.1rem solid #ddd;
    border-bottom: 0.1rem solid #ddd;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  }

  .column>.item img {
    width: 40%;
    margin-bottom: 1rem;
  }

  .column>.item span {
    color: #58585a;
    font-weight: bold;
  }

  .column>.item:nth-child(2) {
    border-right: none;
  }

  .box>.column:nth-child(2)>.item {
    border-bottom: none;
  }
</style>
