<template>
  <div class="router-block">

    <mt-header fixed title="">
      <mt-button icon="back" @click="topBack" slot="left">{{"消息列表"}}</mt-button>
    </mt-header>
    <div class="page-content">
      <!-- 有内容 -->
      <template>
        <div v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="40" class="white">
          <!-- 消息 -->
          <div class="msg-child" v-for="(x,$index) in msgList" @click="toMsgDetail(x.id,x.userId,$index)">
            <!-- 已读 -->
            <img class="msg-img unread" v-if="x.userId" src="@/assets/img/readed.png" >
            <!--  未读 -->
            <img class="msg-img " v-if="!x.userId" src="@/assets/img/unread.png">
            <!-- 消息标题 -->
            <p class="title">{{x.title}}</p>
            <!-- 消息时间 -->
            <p class="time"><img src="@/assets/img/time.png"><span>{{x.createTime | toStamp | toTime}}</span></p>
          </div>
          <!-- 总数为空 -->
          <div class="text-center" style="margin-top:5rem;" v-if="msgList.length==0&&totalPage==0&&currentPage==0">
            <img src="@/assets/img/nocontent.png">
            <p class="text-center no-msg">您暂未收到消息通知</p>
          </div>
          <p v-show="loadingData" class="page-infinite-loading">
            <mt-spinner type="fading-circle"></mt-spinner>
            加载中...
          </p>
          <div v-show="currentPage==totalPage&&currentPage>=1&&totalPage>=1" class="nomore-data">无更多内容</div>
        </div>
      </template>
      <!-- 无内容 -->
    </div>
  </div>
</template>
<script>
  export default {
    name: "MessageList",
    props: {},
    data() {
      //组件内数据部分
      return {
        msgList: [],
        msgLists: [],
        loading: false,
        currentPage: 1,
        totalPage: 1,
        loadingData: false
      }
    },
    methods: {
      /**
       * 跳转消息详情页面 
       * @returns 
       */
      toDetail() {
        this.$to("/message/detail");
      },
      /**
       * 获取当前的列表 
       * @returns 
       */
      getList(currentPage = 1) {
        this.loading = true;
        this.loadingData = true;
        this.$get(
          `/message/list`, {
            currentPage,
            comId: this.comId,
            userId: "1"
          }).then(data => {
            if (data.success) {
              this.currentPage = data.bean.pageNum;
              this.totalPage = data.bean.pageCount;
              if (this.currentPage > this.totalPage) {
                this.currentPage = this.totalPage;
              }
              if (data.bean && data.bean.data && data.bean.data.length > 0) {
                this.loading = (this.totalPage == 0) || (this.currentPage >= this.totalPage);
                this.msgList = this.msgList.concat(data.bean.data || []);
              }
            } else {
              this.$tip("请求服务失败,请重试!");
              this.totalPage = 0;
              this.currentPage = 0;
            }
          },
          err => {
            this.currentPage = 0;
            this.totalPage = 0;
          }).finally(
          data => {
            this.loadingData = false;
          }
        )
      },
      toMsgDetail(id, isRead, index) {
        if (id) {
          let readState = 0; //代表未读
          if (isRead) {
            readState = 1; //代表已读
          }
          this.$to("/message/detail/" + id + "?isRead=" + readState);
          this.msgList[index].userId = 1; //进行已读回执操作
        }
      },
      topBack() {
        this.$to("/")
      },

      loadMore() {
        this.loading = true;
        this.currentPage++;
        this.getList(this.currentPage);
      }
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.msgList = [];
        vm.getList(1);
      })
    },
    created() {
      this.rightButtons = [{
          content: '标为已读',
          style: {
            background: 'lightgray',
            color: '#fff'
          }
        },
        {
          content: '删除',
          style: {
            background: 'red',
            color: '#fff'
          },
          handler: () => this.$confirm('确认删除吗?')
        }
      ];
    }
  }
</script>
<style scoped>
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

  .msg-child>p.title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin: 0.5rem;
    margin-bottom: 0.4rem;

  }

  .msg-child>img.msg-img {
    width: 4rem;
    height: 4rem;
    position: absolute;
    left: 1rem;
    top: 0.5rem;
  }

  .msg-child>img.msg-img.unread {
    width: 3.5rem;
    height: 3rem;
    left: 1rem;
    top: 1rem;
  }

  .no-msg {
    padding-top: 3rem;
    color: #707070;
    font-weight: bold
  }

  .nomore-data {}

  .page-infinite-loading {
    text-align: center;
    height: 50px;
    line-height: 50px;
  }
</style>