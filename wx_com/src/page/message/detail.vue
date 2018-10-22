<template>
  <div class="router-block" v-cloak>
    <mt-header fixed title="">
      <mt-button icon="back" @click="topBack" slot="left">{{"消息详情"}}</mt-button>
    </mt-header>
    <div class="page-content">
      <p class="text-left question-title">{{obj.title||""}}</p>
      <p class="text-left ask-time">
        <img src="@/assets/img/time.png" class="time-icon">
        <span v-if="obj.createTime"> 发布时间 : {{obj.createTime | toStamp | toTime}}</span></p>
      <div class="answer-area">{{obj.content}}</div>
      <mt-button size="small" type="primary" style="float:right;" @click="topBack">返回列表</mt-button>
    </div>
  </div>
</template>
<script>
  export default {
    name: "MessageDetail",
    data() {
      return {
        detailId: "",
        obj: {},
        userId: "1",
        isRead: false
      }
    },
    created() {
      this.detailId = this.$param(this).id;
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.detailId = to.params.id;
        vm.isRead = to.query && to.query.isRead == "1";
        vm.obj = {
          
        }
        vm.getDetail(vm.detailId);
      });
    },
    methods: {
      topBack() {
        this.$to("/message/list");
      },
    
      /**
       * 发送回执 
       * @returns 
       */
      sendBackInfo(messageId = "", userId = "") {
        this.$post(`/message/receipt`, {
          messageId,
          userId
        }).then(
          data => {
            console.log(data);
          }
        )
      },
      /**
       * 获取当前的返回信息 
       * @returns 
       */
      getDetail(id) {
        //TODO 获取答案详情
        this.$get(`/message/detail`, {
          messageId: id
        }).then(
          data => {
            if(data.success){
              
            this.obj = data.bean;
            //发送回执信息
            if (!this.isRead) {
              this.sendBackInfo(id, this.userId);
            }
            }else{
              this.$alert(data.message).then(action => {
                this.$to("/message/list")
              });
            }
          }
        )
      }
    },
    watch: {
      detailId(newValue, oldValue) {
        this.getDetail(newValue);
      }
    },
    beforeRouteUpdate (to, from, next) {
      this.obj = {};
      next();
    }
  }

</script>
<style scoped>
  .content {
    padding: 1rem;
  }

  .question-title {
    margin: 1rem 0;
    font-size: 2rem;
  }

  .answer-area {
    border-radius: 0.5rem;
    border: 0.1rem solid #ddd;
    min-height: 10rem;
    margin: 0 0 1rem 0;
    padding: 0.5rem;
  }

  .page-content {
    padding: 4rem 1rem 4rem;
  }

</style>
