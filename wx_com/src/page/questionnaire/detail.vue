<template>
  <div class="container">

    <!-- <mt-header fixed title="消息详情"></mt-header> -->
    <mt-header fixed title="">
      <mt-button icon="back" @click="topBack" slot="left">{{"消息详情"}}</mt-button>
      <!-- <mt-button icon="more" slot="right"></mt-button> -->
    </mt-header>
    <mt-checklist
      title="复选框列表"
      v-model="value"
      :options="['选项A', '选项B', '选项C']">
    </mt-checklist>
    <div class="content">
      <p class="text-left question-title"><span>问卷标题：</span><span class="right">{{msgTitle}}</span></p>
      <p class="text-left question-title"><span>添加时间：</span><span class="right">2018-09-11 17:13:04</span></p>
      <p class="text-left question-title"><span>添加人员：</span><span class="right">吴老六</span></p>
      <p class="text-left question-title"><span>最后修改时间：</span><span class="right">2018-09-11 17:13:04</span></p>
      <p class="text-left question-title"><span>最后修改人员：</span><span class="right">吴老六</span></p>
      <p class="text-left question-title"><span>问卷访问地址：</span><span class="right"><a href="https://www.baidu.com">https://www.baidu.com</a></span></p>
      <p class="text-left question-title"><span>开始时间：</span><span class="right">2018-09-11 17:13:04</span></p>
      <p class="text-left question-title"><span>结束时间：</span><span class="right">2018-09-11 17:13:04</span></p>
      <p class="text-left question-title"><span>问卷状态：</span><span class="right">已开启</span></p>
      <mt-button size="small" type="primary" style="float:right;" @click="backList">返回列表</mt-button>
    </div>
  </div>
</template>
<script>
  export default {
    name: "QuestionDetail",
    data() {
      return {
        msgTitle: "为什么太平洋周围地震最多",
        msgContent: "这些消息的描述",
        answerUser: "张三丰",
        detailId: ""
      }
    },
    created() {
      this.detailId = this.$param(this).id;
    },
    methods: {
      topBack() {
        this.$to("/questionnaire/quesinfo");
      },
      backList() {
        this.$back();
      },
      showview(e) {
        console.log(e);
      }
    }
  }
</script>
<style scoped>
  .container {
    padding-top: 1rem;
  }
  .content {
    margin-top: 40px;
    padding-top: 1rem;
  }

  .answer-area {
    border-radius: 0.5rem;
    border: 0.1rem solid #ddd;
    min-height: 1rem;
    margin: 0 0 1rem 0;
    padding: 0.5rem;
  }

  .ask-time {
    font-size: 1.2rem;
  }
  .right {
    float: right;
  }
</style>
