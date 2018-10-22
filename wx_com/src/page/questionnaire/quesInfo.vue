<template>
  <div class="container" v-show="obj.title">
    <h3 class="text-center"> {{obj.title}}</h3>
   <div class="ask-answer title-span-block" v-show="currentIndex==0"><span>问卷介绍</span>
      <p>{{obj.content}}</p>
    </div>
    <div class="title-span-block" v-show="currentIndex>0">
      <span style="padding: 0.2rem 1rem;">
        {{currentIndex}} / {{askList.length}}
      </span>
      <question :obj="askObj" :oldans="oldAns" @preValueChange="setQusVal">
      </question>
    </div>
    <!-- 结束欢迎区域 -->
    <div class="end-area"></div>
    <!-- 角标 -->
    <div class="tit-count spans" v-show="askList.length>0&&currentIndex>0">
      <mt-badge @click.native="spanClick($index+1)" size="small" v-for="(n, $index) in askList" :key="$index" class="index-span"
        :class="getValInAnswers(n.qustion.id)?'span-full':'span-empty'">{{($index+1)}}</mt-badge>
    </div>
    <div style="" class="bottom-btn-area">
      <mt-button class="next bottom-btn" type="primary" size="large" @click="btnBegin" v-if="currentIndex==0" style="width:100%;">开始答题</mt-button>
      <mt-button class="next bottom-btn" type="primary" size="large" @click="btnBackStart" v-if="currentIndex==1">返回</mt-button>
      <mt-button class="next bottom-btn" type="primary" size="large" @click="btnPrev" v-if="currentIndex>1">上一题</mt-button>
      <mt-button class="next bottom-btn" type="primary" size="large" @click="btnNext" v-if="currentIndex<askList.length&&currentIndex>0">下一题</mt-button>
      <mt-button class="next bottom-btn" type="primary" size="large" @click="btnSubmit" v-if="currentIndex==askList.length">提交</mt-button>
    </div>
    <div class="zhanwei"></div>
  </div>
</template>
<script>
  import question from '@/components/single-qus.vue';
  export default {
    name: "quesInfo",
    components: {
      question
    },
    methods: {
      btnSubmit() {
        if (this.askList.length != this.answerList.length) {
          this.$alert(`您还有问题未回答,请完成问卷后再进行提交!`);
          return false;
        }
        //得到最终提交的答案
        this.answerList.forEach(element => {
          element.optAnswer = this.filterOther(element.optAnswer)
        });

        this.$post(`/question/saveAnswer`, {
          qnaId: this.detailId,
          answer: JSON.stringify(this.answerList)
        }).then(data => {
          console.log("■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■");
          console.log(data);
          console.log("■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■");
          if (data.success) {
            //TODO 改成最后显示页面
            this.$alert("提交问卷成功,感谢您的回答！").then(() => {
              this.$to('/');
            })
          }else{
            this.$alert("提交问卷失败,请重试！").then(() => {
              this.$to('/');
            })
          }
        })
      },
      filterOther(str) {
        var reg = new RegExp(/(other,)|(,other)|(other)/, 'gm');
        return str.toString().replace(reg, "");
      },
      btnBegin() {
        this.currentIndex = 1;
      },
      btnBackStart() {
        this.currentIndex = 0;
      },
      spanClick(index) {
        this.currentIndex = index;
      },
      /**
       * 设置问题答案 
       * @returns 
       */
      setQusVal(queId, optAnswer, areaVal) {
        // 有答案的话就给原答案赋值,没答案的话就添加
        let indexInAnswer = -1;
        if (((optAnswer == "other" || optAnswer == "") && areaVal == "")) {
          //先验证当前问题用户是否回答,没有回答不添加到答案列表中
          if (this.answerList.some((ele, index) => {
              if (ele.queId == queId) {
                indexInAnswer = index;
              }
              return ele.queId == queId
            })) {
            // 如果原来的答案有值 但是重新回答后没有值  则从答案列表中删除即可
            // 数组删除的方法
            indexInAnswer >= 0 && this.answerList.splice(indexInAnswer, 1);
          }
          return;
        } else {
          //添加或更新问题答案
          let obj = this.getValInAnswers(queId);
          if (obj != undefined) {
            obj.textAnswer = areaVal;
            obj.optAnswer = optAnswer;
          } else {
            this.answerList.push({
              queId: queId,
              textAnswer: areaVal,
              optAnswer: optAnswer
            });
          }
        }
      },
      getValInAnswers(queId) {
        let indexInAnswer = -1;
        let isHave = this.answerList.some((ele, index) => {
          if (ele.queId == queId) {
            indexInAnswer = index;
          }
          return ele.queId == queId
        });
        return isHave ? this.answerList[indexInAnswer] : undefined;
      },
      toMsgDetail(id, index) {
        if (id) {
          this.msgList[index].isread = 1; //进行已读回执操作
          this.$to("/questionnaire/detail/" + id);
        }
      },
      btnPrev() {
        if (this.currentIndex != 1) {
          this.currentIndex--;
        }
      },
      btnNext() {
        if (this.currentIndex != this.askList.length) {
          this.currentIndex++;
        } else {}
      },
      /**
       * 获取问卷详情 
       * @returns 
       */
      getQuanDetail(qnaId) {
        this.$post(`/question/getQnaState`, {
          qnaId
        }).then(x => {
          if (x.success) {
           return  Promise.resolve(true)
          } else {
            console.log("■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■");
            console.log(x);
            console.log(x.message);
            console.log("■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■");
           return  Promise.reject(x.message)
          }
        })
        .then(() => {
          return this.$post(`/question/detail`, {
            qnaId
          });
        }).then(data => {
          if (data.success) {
            this.obj = data.bean.qna;
            this.askList = data.bean.questions;
          } else {
            this.$alert("获取问卷信息失败,请重试！").then(action => {
              this.$to('/');
            })
          }
        }).catch(
          msg => {
            console.log("■■■■■■■■■msg■■■■■■■■■■■■■■■■■■■■");
            console.log(msg);
            console.log("■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■");
            this.$alert(msg).then(data => {
              this.$to("/");
            })
          }
        );
      }
    },
    data() {
      //组件内数据部分
      return {
        detailId: "", //当前问卷的主键
        type: 1,
        radio: '',
        radio1: [],
        introduction: '',
        color: '#888',
        isAnswered: false,
        askList: [],
        currentIndex: 0,
        answerList: [],
        oldAns: undefined, //原来的旧的答案
        obj: {
          title: "",
          content: "",
        }
      }
    },

    computed: {
      askObj() {
        let obj = undefined;
        obj = (this.askList.length > 0 && this.askList[this.currentIndex - 1]) || {};
        let queId = (obj.qustion && obj.qustion.id) || "";
        this.oldAns = queId ? this.getValInAnswers(queId) : undefined;
        return obj;
      }
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        console.log("■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■");
        console.log(to);
        console.log("■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■");
        let id = to.params && to.params.id;
        if (id) {
          vm.detailId = id;
          vm.getQuanDetail(id);
        }
      })
    },
    watch: {
      // detailId(newValue, oldValue) {
      //   this.getQuanDetail(this.detailId)
      // }
    },

  }
</script>

<style scoped>
  .container {
    background-color: #fff;
    background-clip: border-box;
    box-sizing: border-box;
    padding: 0 10px;
    padding-top: 2rem;
    padding-bottom: 7rem;
    min-height: 100%;

  }

  .body {
    border: 1px solid black;
    border-radius: 10px;
    padding-bottom: 10px;
  }

  .tit-count {
    text-align: center;
    padding-top: 3px;

  }

  .question {
    text-align: center;
  }

  .next {
    margin: 1rem auto;
  }

  .no-msg {
    padding-top: 3rem;
    color: #5d5151;
  }

  .red {
    background-color: red !important;
  }

  .count-character {
    text-align: right;
  }

  .zhanwei {
    height: 50px;
  }

  .bottom-btn-area {
    position: fixed;
    bottom: 0;
    width: 100%;
    box-sizing: border-box;
    padding: 0 1rem;
    left: 0;
    display: flex;
    justify-content: space-between;
    background-color: #fff;
    box-shadow: 0 -2px 5px 1px rgba(5, 0, 38, 0.1);
  }

  .tit-count .mint-badge {
    margin-left: 0.5rem;
    margin-top: 0.3rem;
    color: #3a3838;
    border: 1px solid #ddd;
  }

  .question-area {
    padding: 1rem;
  }

  .tit-count .mint-badge.span-full {
    background-color: #26a2ff;
    color: #fff;
  }

  .tit-count.spans>.mint-badge.index-span.is-primary.is-size-small.span-empty {
    background-color: #fff;
  }

  .span-empty.mint-badge.is-primary {
    background-color: #fff;
  }

  .tit-count.spans {
    margin-top: 2rem;
  }

  .next.bottom-btn {
    width: 45%;
  }

  .title-span-block {
    position: relative;
    border-radius: 0.5rem;
    border: 0.1rem solid #ddd;
    min-height: 5rem;
    margin: 2rem 0 1rem 0;
    padding: 1rem 0.5rem;


  }

  .title-span-block>p {
    text-indent: 2em;
  }

  .title-span-block>span:first-child {
    content: "问题描述";
    display: block;
    position: absolute;
    top: -1rem;
    left: 50%;
    transform: translateX(-50%);
    background-color: #26a2ff;
    padding: 0.2rem 0.5rem;
    font-size: 1.4rem;
    border: 1px solid #38f;
    border-radius: 2px;
    color: #fff;
  }
</style>