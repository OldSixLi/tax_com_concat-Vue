<template>
  <div class="container router-block">
    <mt-header fixed title="添加问题">
      <router-link to="/" slot="left">
        <mt-button icon="back">返回</mt-button>
      </router-link>
    </mt-header>
    <div class="ask-area">

      <!-- TODO 显示部门详情 -->
      <input type="text" v-model.trim="title" placeholder="请输入问题标题" class="ask-title">
      <!-- <mt-field class="ask-textarea" placeholder="请输入问题描述" type="textarea" rows="4" v-model.trim="question"></mt-field> -->
      <textarea class="ask-title" placeholder="请输入问题描述" name="question" id="question" cols="30" rows="5" v-model.trim="question"></textarea>
      <mt-button type="primary" size="large" class="submit-btn" @click="submitQues">提交问题</mt-button>
    </div>
  </div>
</template>
<script>
  import {
    Field,
    Radio,
    Button,
    Navbar,
    TabItem
  } from 'mint-ui';
  export default {
    name: "name",
    props: {
      //对外获取的数据
    },
    data: function () {
      //组件内数据部分
      return {
        selected: "1",
        question: ""
      }
    },
    mounted: function () {
      //组件生成时调用
    },
    methods: {
      submitQues() {
        let question = this.question;
        let type = this.value;
        let title = this.title;
        if (!question) {
          this.$alert(`请输入问题内容`);
          return false;
        }
        if (!title) {
          this.$alert(`请输入问题标题`);
          return false;
        }
        this.$post(`/queres/saveQue`, {
          corpId: "1", // TODO 正式环境需要配置
          departmentId: "1", // TODO 正式环境需要配置
          question: this.question,
          queTitle: this.title,
          userId: "1" // TODO 正式环境需要配置
        }).then(
          data => {
            if (data.success) {
              this.$alert("您的问题已成功提交,问题解答后会通过企业微信通知您,请注意消息提示!").then(
                action => {
                  //TODO
                  this.$to(`/ask/list`);
                }
              );
            } else {
              this.$alert(`提问失败:${data.message}`);
            }
          }
        )
        // TODO 根据当前问题的内容提交接口处理
      }
    },

    beforeRouteEnter(to, from, next) {
      next(
        vm => {
          vm.question = "";
          vm.title = "";
        });
    }
  }

</script>
<style scoped>
  .container {
    padding: 1rem;
    padding-top: 4.1rem;
  }

  .ask-title {
    padding: 0.8rem 1.2rem;
    font-size: inherit;
    width: 100%;
    border-radius: 0.5rem;
    border: 1px solid #ddd;
    box-sizing: border-box;
    margin: 1rem 0;
  }

</style>
<style>
  .mint-cell-value>textarea {
    border-radius: 0.5rem;
    border: 1px solid #ddd;
    padding: 1rem;
  }

  .mint-cell-wrapper {
    padding: 0;
  }

  .ask-area {
    box-sizing: border-box;
    /* padding: 1rem; */
  }

  .ask-textarea {
    background-image: none;
    width: 100%;
    border: 1px solid #ddd;
  }

</style>
