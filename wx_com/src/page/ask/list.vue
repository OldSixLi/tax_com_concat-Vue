<template>
  <div class="container">
    <mt-header fixed title="问题列表">
      <router-link to="/" slot="left">
        <mt-button icon="back">返回</mt-button>
      </router-link>
      <mt-button slot="right" @click="addQuestion">+&nbsp;提问问题</mt-button>
    </mt-header>
    <mt-navbar v-model="currentPanel">
      <mt-tab-item id="1">已解决</mt-tab-item>
      <mt-tab-item id="2">未解决</mt-tab-item>
    </mt-navbar>
    <mt-tab-container v-model="currentPanel">
      <mt-tab-container-item id="1">
        <div v-infinite-scroll="loadMore1" infinite-scroll-disabled="loading1" infinite-scroll-distance="40" class="white">
          <div class="ask-li msg-child" v-if="askList1.length>0" v-for="(x,$index)  in askList1" @click="toDetail(x.id||'1')">
            <p class="title"> {{x.queTitle}}</p>
            <!-- 消息时间 -->
            <p class="time"><img src="@/assets/img/time.png"><span>{{x.queTime | toStamp |toTime}}</span></p>
          </div>
          <div v-if="askList1.length==0&&currentPage1==0&&totalPage1==0" class="nomore-data">
            暂无数据
          </div>

          <p v-show="(loading1&&currentPage1<totalPage1)" class="page-infinite-loading">
            <mt-spinner type="fading-circle"></mt-spinner>
            加载中...
          </p>
          <div v-show="currentPage1==totalPage1&&currentPage1>0" class="nomore-data">无更多内容</div>
        </div>
      </mt-tab-container-item>
      <mt-tab-container-item id="2">
        <div v-infinite-scroll="loadMore0" infinite-scroll-disabled="loading0" infinite-scroll-distance="40"
          infinite-scroll-immediate-check="false" class="white">
          <div class="ask-li msg-child" v-if="askList0.length>0" v-for="(x,$index)  in askList0" @click="toDetail(x.id||'1')">
            <p class="title"> {{x.question}}</p>
            <!-- 消息时间 -->
            <p class="time"><img src="@/assets/img/time.png"><span>{{x.queTime | toStamp |toTime}}</span></p>
          </div>
          <div v-if="askList0.length==0&&currentPage0==0&&totalPage0==0" class="nomore-data">
            暂无数据
          </div>
          <p v-show="loading0&&currentPage0<totalPage0" class="page-infinite-loading">
            <mt-spinner type="fading-circle"></mt-spinner>
            加载中...
          </p>
          <div v-show="currentPage0==totalPage0&&currentPage0>0" class="nomore-data">无更多内容</div>
        </div>
      </mt-tab-container-item>
    </mt-tab-container>
  </div>
</template>
<script>
  import {
    Toast
  } from 'mint-ui';
  export default {
    name: "AskList",
    props: {},
    data: function () {
      //组件内数据部分
      return {
        currentPanel: "1",
        // 已回答
        currentPage1: 1,
        totalPage1: 2,
        askList1: [],
        loading1: false,
        // 未回答
        currentPage0: 1,
        totalPage0: 2,
        askList0: [],
        loading0: false
      }
    },
    beforeCreate: function () {

    },
    mounted: function () {
      //组件生成时调用

    },
    methods: {
      addQuestion() {
        this.$to("/ask/add");
      },
      /**
       * 获取问题列表 
       * @param {*} state 问题类型 0:未回答 1:已回答
       * @param {*} currentPage 当前页面
       * @returns 
       */
      getQuestionList(state, currentPage = 1) {
        this[`loading${state}`] = true;
        this
          .$get(`/queres/list`, {
            currentPage,
            state,
            userId: "1"
          })
          .then(
            data => {
              if (data.success) {
                this[`askList${state}`] = this[`askList${state}`].concat(data.bean.data);
                this[`currentPage${state}`] = data.bean.pageNum;
                this[`totalPage${state}`] = data.bean.pageCount;

                if (this[`currentPage${state}`] > this[`totalPage${state}`]) {
                  this[`currentPage${state}`] = this[`totalPage${state}`];
                }
                if (data.bean && data.bean.data && data.bean.data.length > 0) {
                  this[`loading${state}`] = ((this[`currentPage${state}`] >= this[
                    `totalPage${state}`]));
                }
              } else {
                this[`currentPage${state}`] = this[`totalPage${state}`] = 0;
                this.$tip("请求服务失败,请稍后重试!");
              }
            },
            err => {
              this[`askList${state}`] = [];
              this[`currentPage${state}`] = 0;
              this[`totalPage${state}`] = 0;
              this.$alert("请求服务失败,请重试!");
            });
      },
      loadMore1() {
        let currentType = 1;
        if (this.currentPanel == 1) {
          let page = ++this.currentPage1;
          let total = this.totalPage1;
          this.getQuestionList("1", page);
        }
      },

      loadMore0() {
        if (this.currentPanel == 2) {
          let page = ++this.currentPage0;
          let total = this.totalPage0;
          this.getQuestionList("0", page);
        }
      },
      toDetail(id) {
        this.$to(`/ask/detail/${id}`)
      }
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.askList1 = vm.askList0 = [];
        vm.getQuestionList("0");
        vm.getQuestionList("1");
      })
    }
  }

</script>
<style scoped>
  .container {
    padding-top: 41px;
  }

  .mint-navbar .mint-tab-item.is-currentPanel {
    margin-bottom: 0;
  }

  .mint-tab-item {
    margin: 0 1rem;
  }

  .msg-child:first-child {
    /* margin-top: 3px; */
  }

  .msg-child {
    height: 5rem;
    overflow: hidden;
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    margin-top: 1rem;
    padding: 0 1rem;
    position: relative;
    line-height: 2rem;
  }

  .msg-child>p.title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin: 0.5rem;
    margin-bottom: 0.4rem;

  }

  .page-infinite-loading {
    text-align: center;
    height: 50px;
    line-height: 50px;
  }

  .msg-child>p.time>img {
    margin: 0 0.3rem 0 0.5rem;
    width: 1.4rem;
    height: 1.4rem;
  }

  .msg-child>p.time {
    font-size: 1.3rem;
    line-height: 1.8rem;
    margin: 0;

  }

  .msg-child>p.time>span {
    line-height: 1.8rem;
    position: relative;
    top: -0.2rem;
    color: #8b8b8b;
  }

</style>
<style>
  .mint-tab-item .mint-tab-item-label {
    font-size: 1.5rem;
  }

  .ask-li {
    line-height: 50px;
  }

</style>
