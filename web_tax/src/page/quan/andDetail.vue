<!-- 页面描述:某用户回答详情 -->
<template>

  <el-row>
    <el-col :span="21" :offset="1">
      <h1 class="text-center">问卷详情</h1>
      <p class="table-title">
        <span style="">问卷基本信息</span>
      </p>
      <div class="panel panel-default noPadding scroll-target">
        <div class="panel-body" style="padding:10px;">
          <el-row :gutter="20">
            <el-col :span="4" class="text-right line30"><b>问卷标题</b> </el-col>
            <el-col :span="18">
              <el-input placeholder="请输入问卷标题" class="dis" :value="obj.title" disabled></el-input>
            </el-col>
          </el-row>
          <el-row :gutter="20" style="margin-top:15px;">
            <el-col :span="4" class="text-right line30"><b>问卷宣传</b> </el-col>
            <el-col :span="18">
              <el-input type="textarea" class="dis" :rows="5" placeholder="请输入问卷宣传或描述内容" v-model="obj.content" disabled></el-input>
            </el-col>
          </el-row>
        </div>
      </div>
      <el-row style="margin-top: 15px;">
        <p class="table-title text-left">
          <span style="line-height:30px;">问卷问题</span>
        </p>
      </el-row>
      <div class="panel panel-default noPadding scroll-target">
        <div class="panel-body">
          <div class="row">
            <div class="col-md-8 col-md-offset-2 ">
              <div>
                <div v-for="(x,$index) in quesList" class="singleQuestion" style="position: relative;">
                  <p style="font-size:0;font-weight:bold;">
                    <span style="display:inline-block;min-width: 20px;font-size: 14px;">{{$index+1}}.</span>
                    <b style="font-size:14px;">{{x.question.stem}}</b>
                  </p>
                  <div class="form-group chooseContain" style="padding-left: 20px;padding-right: 20px;">
                    <ul v-for="(y,yIndex) in x.options" v-show="x.question.typeArr&&(x.question.typeArr.indexOf('1')>-1||x.question.typeArr.indexOf('2')>-1)">
                      <li style="list-style: none; ">
                        <el-radio :label="y.id.toString()" :key="y.id" v-model="x.optionAnswer"  readonly v-if="x.question.typeArr&&(x.question.typeArr.indexOf('1')>-1)">{{''}}</el-radio>
                        <el-checkbox  readonly v-if="x.question.typeArr&&(x.question.typeArr.indexOf('2')>-1)" :checked="x.optionAnswer&&x.optionAnswer.split(',').indexOf(y.id.toString())>-1"></el-checkbox>
                        <b>{{y.content}}</b> 
                      </li>
                    </ul>
                    <span  v-if="x.question.type=='3'&&x.textAnswer"><el-radio :checked="true"></el-radio> 其他
                      <br></span> 
                    <span  v-if="x.question.type=='4'&&x.textAnswer"><el-checkbox :checked="true"></el-checkbox> 其他
                      <br></span> 
                    <el-input v-if="x.textAnswer" style="margin-top:10px;width:80%;" class="dis" type="textarea" :disabled="true" :value="x.textAnswer"></el-input>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p class="text-right">
          <el-button type="primary" @click="backList">返回</el-button>
        </p>
      </div>
    </el-col>
  </el-row>
</template>
<script>
  let tool = {};
  tool.alert = (a, b) => {
    Vue.prototype.$alert(b, a);
  }
  export default {
    name: "name",
    data() {
      return {
        isAdd: true,
        isEdit: false,
        currentId: "",
        isDetail: true,
        aa: ['3'],
        obj: {
          createTime: '',
          createUserId: "admin",
          endTime: '',
          giveFlag: "",
          introduction: "",
          modifyTime: '',
          modifyUserId: '',
          requiredLogin: "N",
          score: '',
          startTime: '',
          state: '',
          surveyChannel: [],
          surveyUrl: '',
          title: '',
        },
        quesList: [],
        detailId: "",
       
        
      }
    },
    methods: {
      backList() {
        this.$to("/quan/list")
      },
      getDetail(qnaId,userId) {
        var self = this;
        this.$post(`/tax/question/anwerDetail`, {
          qnaId,userId
        })
        .then(data => {
          if (data.success) {
            self.obj.title = data.bean.title;
            self.obj.title = data.bean.title;
            let  arr = data.bean.questions;
            arr.forEach(element => {
              switch (element.question.type) {
                case '1':
                  element.question.typeArr = ['1'];
                  break;
                case '2':
                  element.question.typeArr = ['2'];
                  break;
                case '3':
                  element.question.typeArr = ['1', '3'];
                  break;
                case '4':
                  element.question.typeArr = ['2', '3'];
                  break;
                case '5':
                  element.question.typeArr = ['3'];
                  element.options = [];
                  break;
                default:
                  element.question.typeArr = [];
                  element.options = [];
              }
            });
            self.quesList = arr;
          } else {
            tool.alert("提示", "未获取到数据");
          }
        }).catch((x) => {
          tool.alert("提示", "请求服务失败,请重试!");
        })

      },

      getAnsDetail(qnaId,userId) {
        this.$post(`/tax/question/anwerDetail`,{
          qnaId,
          userId
        }).then(data => {
          if (data.success) {
          }
        })
      }
    },
    watch: {
      //实时监控数据变化
      detailId(newValue, oldValue) {
        this.getDetail(newValue);
      }
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        let param = to.params;
        let userId = param.userId;
        let qnaId = param.qnaId;
        if (userId&&qnaId) {
          // vm.getAnsDetail(qnaId,userId);
          vm.getDetail(qnaId,userId);
        }else{
          vm.$to("/quan/list")
        }
      });
    },
  }
</script>
<style scoped>
  .addChoose {
    line-height: 15px;
    margin: 10px 0px 10px 15px;
  }

  .singleQuestion {
    border: 2px dashed #ddd;
    border-radius: 10px;
    margin: 10px;
    padding: 10px;
  }

  .chooseContain ul {
    padding-left: 0;
  }

  .singleQuestion .el-button+.el-button {
    margin-left: 0;
  }

  .singleQuestion .el-button {
    padding: 6px 12px;

  }

  .singleQuestion .el-button i {
    font-size: 16px;
  }

  .table-title {
    border: 1px solid #ddd;
    border-bottom: none;
    margin-bottom: 0;
    padding: 10px;
    color: #000;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    background-color: #f9f7f7;
    position: relative;
  }

  .panel-body {
    border: 1px solid #ddd;
  }


  .line30 {
    line-height: 30px;
  }
</style>

<style>
  
</style>

<style>
.el-radio__label:empty{
  padding-left: 0;
}
</style>
