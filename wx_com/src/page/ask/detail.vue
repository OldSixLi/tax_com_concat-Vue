<!-- 问题答案页面 -->
<template>
  <div class="router-block">
    <mt-header fixed title="">
      <mt-button icon="back" @click="topBack" slot="left">
        问题详情
      </mt-button>
    </mt-header>
    <div class="page-content">
      <p class="ask-title"> {{detailObj.queTitle}} </p>
      <div class="ask-detail title-span-block"><span>问题描述</span>
        <p> {{detailObj.question}} </p>
        <p class="text-left ask-time" style="margin-bottom: 0;" v-if="detailObj.queTime">
          <img src="@/assets/img/time.png" class="time-icon">
          <span v-show="detailObj.queTime">{{detailObj.queTime|toStamp|toTime}}</span>
        </p>
      </div>

      <div class="ask-answer title-span-block"><span>答案详情</span>

        <p v-if="detailObj.response">{{detailObj.response}}</p>
        <p v-if="!detailObj.response" class="nomore-data">您的问题暂未被回复</p>
        <p class="text-left ask-time" v-if="detailObj.response" style="margin-top: 1.2rem;margin-bottom: 0;">
          <img src="@/assets/img/user.png" class="time-icon">
          <span>{{detailObj.resUserId}}</span>
          <img src="@/assets/img/time.png" class="time-icon" style="margin-left:2rem;">
          <span> {{detailObj.resTime|toStamp|toTime}}</span>
        </p>
      </div>
      <mt-button size="small" type="primary" style="float:right;" @click="topBack">返回列表</mt-button>
    </div>
  </div>
</template>
<script>
  export default {
    name: "askDetail",
    props: {},
    data: function () {
      // 组件内数据部分
      return {
        currentId: "",
        detailObj: {
          // title: "今年的政策形势?",
          // detail: "我们公司需要缴纳的税额",
          // answer: "中小高新型企业全免",
          // time: ""
        }
      }
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.currentId = to.params.id;
      });
    },
    mounted: function () {
      //组件生成时调用
    },
    methods: {
      getDetail(qurResId) {
        this.$get(`/queres/detail`, {
          qurResId
        }).then(
          data => {
            if(data.success){
              this.detailObj = data.bean;
            }else{
              this.$alert(data.message).then(x => {
                this.$to("/ask/list");
              })
            }
           
          }
        )
      },
      topBack() {
        this.$to("/ask/list");
      },
      backList() {
        this.$back();
      }
    },
    watch: {
      currentId(newValue, oldValue) {
        // this.getDetail(this.currentId);
        this.getDetail(newValue);
      }
    },
  }
</script>
<style scoped>
  .page-content {
    padding: 1rem;
    padding-top: 4rem;
  }

  .ask-title {
    font-weight: bold;
    border: none;
  }

  .title-span-block>span:first-child {
    content: "问题描述";
    display: block;
    position: absolute;
    /* height: 2rem; */
    top: -1rem;
    left: 50%;
    /* margin-left: -50%; */
    transform: translateX(-50%);
    background-color: #26a2ff;
    padding: 0.2rem 0.5rem;
    font-size: 1rem;
    border: 1px solid #38f;
    border-radius: 2px;
    color: #fff;
  }

  .ask-detail,
  .ask-answer {
    position: relative;
    border-radius: 0.5rem;
    border: 0.1rem solid #ddd;
    min-height: 5rem;
    margin: 2rem 0 1rem 0;
    padding: 1rem 0.5rem;
  }

  .ask-answer>p {
    margin: 0.5rem 0;
  }

  .ask-time span {
    color: #ab7f7f;
  }

  /* .ask-answer {} */
</style>
