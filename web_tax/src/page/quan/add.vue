<!-- 页面描述:添加问卷功能 -->
<template>

  <el-row>
    <el-col :span="21" :offset="1">
      <h1 class="text-center">新增问卷</h1>
      <p class="table-title">
        <span style="">问卷基本信息</span>
      </p>
      <div class="panel panel-default noPadding scroll-target">
        <div class="panel-body" style="padding:10px;">
          <el-row :gutter="20">
            <el-col :span="4" class="text-right line30"><b>问卷标题</b> </el-col>
            <el-col :span="18">
              <el-input placeholder="请输入问卷标题" v-model="obj.title"></el-input>
            </el-col>
          </el-row>
          <el-row :gutter="20" style="margin-top:15px;">
            <el-col :span="4" class="text-right line30"><b>问卷宣传</b> </el-col>
            <el-col :span="18">
              <el-input type="textarea" :rows="5" placeholder="请输入问卷宣传或描述内容" v-model="obj.introduction"></el-input>
            </el-col>
          </el-row>
          <el-row :gutter="20" class="detail-row">
            <el-col :span="4" class="text-right title line30" style="line-height:40px;">
              <el-popover placement="top" title="精准推送" width="200" trigger="click" content="消息设置为精准推送后,仅企业中选择的特殊角色员工可回答此问卷。">
                <span slot="reference" style="cursor:pointer;"> <i class="el-icon-question"></i></span>
              </el-popover>
              <b>精准推送</b>
            </el-col>
            <el-col :span="14" class="right-panel" style="line-height:38px;">
              <el-switch v-model="isAccuratePush" active-text="是" inactive-text="否">
              </el-switch>
            </el-col>
          </el-row>
          <transition name="el-zoom-in-top">
            <div v-show="isAccuratePush">
              <el-row :gutter="20" class="detail-row">
                <el-col :span="4" class="text-right title" style="line-height:40px;">
                  <b>选择角色</b>
                </el-col>
                <el-col :span="20" class="right-panel" style="line-height:38px;">
                  <el-checkbox-group v-model="checkedRoles">
                    <el-checkbox v-for="city in roleList" :label="city.id" :key="city.id">{{city.name}}</el-checkbox>
                  </el-checkbox-group>
                </el-col>
              </el-row> 
            </div>
          </transition>
        </div>
      </div>
      <el-row style="margin-top: 15px;">
        <p class="table-title">
          <span style="line-height:30px;">问卷问题</span>
          <span class="text-right" style="float:right;">
            <el-button size="small" type="primary" v-show="quesList.length==0" class="btn btn-primary addQuestion" @click="addQuestion()"
              icon="el-icon-plus"><span class="glyphicon glyphicon-plus"></span>&nbsp;新增问题</el-button>
            <!-- <el-button size="small" type="primary" class="btn btn-primary preview" @click="preview()" icon="el-icon-view">预览问卷</el-button> -->
          </span>
        </p>
      </el-row>
      <div class="panel panel-default noPadding scroll-target">
        <div class="panel-body">
          <div class="row">
            <h2 class="text-center" style="color:#847272;" v-if="quesList.length==0">录入问卷问题</h2>
            <div class="col-md-8 col-md-offset-2 ">
              <div>
                <div v-for="(x,$index) in quesList" class="singleQuestion" style="position: relative;">

                  <div class="btn-group btn-group-sm btn-ope" role="group" style="position: absolute;right: 0;top: 0;">
                    <el-button type="button" class="btn btn-default" v-if="$index!=0" @click="up($index)" title="上移"
                      icon="el-icon-upload2"></el-button>
                    <el-button type="button" class="btn btn-default" v-if="$index!=(quesList.length-1)" title="下移"
                      @click="down($index)" icon="el-icon-download"></el-button>
                    <el-button type="button" class="btn btn-default" @click="delQues($index)" title="删除此问题" v-if="!isDetail"
                      icon="el-icon-delete"></el-button>
                  </div>

                  <p style="font-size:0;">
                    <span style="display:inline-block;min-width: 20px;font-size: 14px;">{{$index+1}}.</span>
                    <el-input style="display:inline-block;width:80%;" class="form-control " type="text" name="" v-model="x.qustion.stem"
                      placeholder="请在此输入问题" :disabled="isDetail"></el-input>
                  </p>
                  <p style="padding-left: 20px;">
                    <b>问题类型：</b>
                    <el-checkbox v-model="x.qustion.typeArr" label="1" :disabled="isDetail" @change="checkTypeChange($index,'2')">单选</el-checkbox>
                    <el-checkbox v-model="x.qustion.typeArr" label="2" :disabled="isDetail" @change="checkTypeChange($index,'1')">多选</el-checkbox>
                    <el-checkbox v-model="x.qustion.typeArr" label="3" :disabled="isDetail" @change="checkChange($index)">其他</el-checkbox>
                  </p>
                  <div class="form-group chooseContain" style="padding-left: 20px;padding-right: 20px;">
                    <el-button type="primary" size="mini" class="btn btn-success addChoose " @click="addOption($index) "
                      style="margin: 0;" :disabled="(x.qustion.typeArr.indexOf('1')<=-1&&x.qustion.typeArr.indexOf('2')<=-1)||isDetail">添加选项</el-button>
                    <ul v-for="(y,yIndex) in x.options" v-show="x.qustion.typeArr&&(x.qustion.typeArr.indexOf('1')>-1||x.qustion.typeArr.indexOf('2')>-1)">
                      <li style="list-style: none; ">
                        <el-input type="text " v-model="y.content " class="form-control " style="width: 60%;display: inline-block;"
                          size="medium" :disabled="isDetail" placeholder="请输入选项内容"></el-input>
                        <el-button size="mini" v-show="!isDetail" :data-index="yIndex" @click="delAns($index,yIndex)"
                          type="primary" style="margin-bottom: 5px;padding:6px;" icon="el-icon-close" circle></el-button>
                      </li>
                    </ul>
                    <el-input style="margin-top:5px;" type="textarea" v-show="x.qustion.typeArr&&(x.qustion.typeArr.indexOf('3')>-1)"
                      placeholder="其他" :disabled="true"></el-input>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="panel-footer" v-if="quesList.length>0">
          <div class="row">
            <div class="col-xs-12 text-right">
              <el-button type="primary" class="btn btn-primary addQuestion" size="small" @click="addQuestion()"
                :disabled="isDetail" icon="el-icon-plus">新增问题</el-button>
            </div>
          </div>
        </div>

        <p class="text-right">
          <el-button type="primary" icon="el-icon-check" @click="saveInfo" :loading="saveLoading">保存</el-button>
          <el-button type="button" icon="el-icon-close" @click="backList">取消</el-button>
        </p>
      </div>
    </el-col>
  </el-row>
</template>
<script>
  // import { mapGetters } from 'vuex';
  let tool = {};
  tool.alert = (a, b) => {
    Vue.prototype.$alert(b, a);
  }
  export default {
    name: "name",
    //对外获取的数据
    props: {},
    data() {
      return {
        isAdd: true,
        isEdit: false,
        currentId: "",
        isDetail: false,
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
        detailId: "",
        quesList: [],
        isAccuratePush: false, //是否精准推送
        isNeedBack: false,

        checkedRoles: [],
        roleList: [{
          name: "管理员",
          id: "1"
        }, {
          name: "企业法人",
          id: "2"
        }, {
          name: "公司经理",
          id: "3"
        }, {
          name: "财务总监",
          id: "4"
        }, {
          name: "公司董事",
          id: "5"
        }, ],
        saveLoading:false
      }
    },
    methods: {
      backList() {
        this.$to("/quan/list")
      },
      saveInfo() {
        if (!this.obj.title) {
          tool.alert("提示", "请输入问卷标题");
          return false;
        }
        if (this.obj.title.length > 50) {
          tool.alert("提示", "问卷标题长度不能大于50个字符");
          return false;
        }
        if (this.quesList.length > 0) {
          let obj = this.quesList[this.quesList.length - 1];
          if (obj.qustion.stem == "") {
            tool.alert("提示", "请先完善上一个问题内容");
            return false;
          }
          if (obj.qustion.type == "") {
            tool.alert("提示", "请先完善上一个问题的答案类型");
            return false;
          }
          if (obj.qustion.type != "5") {
            if ((obj.options.length == 1 && obj.options[0].content == "") || obj.options.length == 0) {
              tool.alert("提示", "您上一个问题中包含选择类型,请至少填写一个选项");
              return false;
            }
          }
        } else {
          tool.alert("提示", "您还没有录入任何问题,无法保存问卷");
          return false;
        }
        let postData = {
          title: this.obj.title,
          surveyChannel: this.obj.surveyChannel.join(','),
          requiredLogin: this.obj.requiredLogin,
          giveFlag: this.obj.giveFlag,
          score: this.obj.score,
          state: "1",
          content: this.obj.introduction,
          userId: 1,
          type: "add",
          roleId: this.checkedRoles.join(',')
        };
        if (this.isEdit) {
          postData.id = this.obj.id;
          postData.type = "edit";
        }



        let str = JSON.stringify(this.quesList);
        let newArr = JSON.parse(str);
        newArr.forEach(element => {
          let arr = [];
          element.options.forEach(function (op) {
            op.content && arr.push(op.content);
          })
          element.options = arr;
          element.type = element.qustion.type;
          element.stem = element.qustion.stem;
          element.id = element.qustion.id;
        });
        postData.questions = JSON.stringify(newArr);

        this.saveLoading=true;
        let url = "/question/saveQna";
        this.$post(`/tax/question/saveQna`, postData).then(data => {
          if (data.success) {
            
            this.$alert("保存成功!", "提示").then(() => {
              this.$to("/quan/list")
            })
          } else {
            tool.alert("提示", data.message);
          }
        }).finally(()=>{
          this.saveLoading=false;
        })
      },
      up(index) {
        let a = this.quesList[index];
        this.quesList.splice(index - 1, 0, a);
        this.quesList.splice(index + 1, 1);
      },
      down(index) {
        let a = this.quesList[index];
        this.quesList.splice(index + 2, 0, a);
        this.quesList.splice(index, 1);
      },
      addQuestion() {
        if (this.quesList.length > 0) {
          let obj = this.quesList[this.quesList.length - 1];
          if (obj.qustion.stem == "") {
            tool.alert("提示", "请先完善上一个问题内容");
            return false;
          }
          if (obj.qustion.type == "") {
            tool.alert("提示", "请先完善上一个问题的答案类型");
            return false;
          }
          if (obj.qustion.type != "5") {
            if ((obj.options.length == 1 && obj.options[0].content == "") || obj.options.length == 0) {
              tool.alert("提示", "您上一个问题中包含选择类型,请至少填写一个选项");
              return false;
            }
          }
          this.quesList.push({
            qustion: {
              stem: "",
              type: "",
              typeArr: []
            },
            options: [{
              content: ""
            }]
          })
        } else {
          this.quesList = [{
            qustion: {
              stem: "",
              type: "",
              typeArr: []
            },
            options: [{
              content: ""
            }]
          }]
        }
      },
      /**
       * 单选,type:'1' 
       */
      checkTypeChange(index, type) {
        let typeArr = this.quesList[index].qustion.typeArr;
        if (typeArr.indexOf(type) > -1) {
          typeArr.splice(typeArr.indexOf(type), 1);
        }
        this.checkChange(index);
      },
      // 根据用户选择typeArr改变typoe
      checkChange(index) {
        let arr = this.quesList[index].qustion.typeArr;
        arr.sort(function (a, b) {
          return a - b;
        });
        let str = arr.join('');
        switch (str) {
          case '':
            this.quesList[index].qustion.type = "";
            this.quesList[index].options = [{
              content: ""
            }];
            break;
          case '1':
            this.quesList[index].qustion.type = '1';
            break;
          case '2':
            this.quesList[index].qustion.type = '2';
            break;
          case '13':
            this.quesList[index].qustion.type = '3';
            break;
          case '23':
            this.quesList[index].qustion.type = '4';
            break;
          case '3':
            this.quesList[index].qustion.type = '5';
            this.quesList[index].options = [{
              content: ""
            }];
            break;
          default:
            this.quesList[index].qustion.type = "";
            this.quesList[index].options = [{
              content: ""
            }];
        }
      },
      /**
       * 多选,type:'2' 
       * @returns 
       */
      delQues(index) {
        this.quesList.splice(index, 1);
      },
      addOption(index) {
        if (this.quesList[index].options && this.quesList[index].options.length > 0 && this.quesList[index].options[
            this.quesList[index].options.length - 1].content != "") {
          this.quesList[index].options.push({
            "content": "",
          })
        } else if (this.quesList[index].options.length == 0) {
          this.quesList[index].options = [{
            "content": ""
          }]
        } else {
          tool.alert("提示", "请先完善上一个选项");
        }
      },
      delAns(qindex, aindex) {
        this.quesList[qindex].options.splice(aindex, 1);
      },

      getDetail(qnaId) {
        let self = this;
        this.$post(`/tax/question/detail`, {
          qnaId
        }).then(data => {
          if (data.success) {
            self.obj = data.bean.qna;
            this.obj.introduction = this.obj.content;
            let roleIds = data.bean.qna.roleId;
            if (roleIds) {
              this.isAccuratePush = true;
              this.checkedRoles = roleIds.split(',')
            } else {
              this.checkedRoles = [];
              this.isAccuratePush = false;
            }
            self.obj.surveyChannel = (self.obj.surveyChannel && self.obj.surveyChannel.split(',')) || [];
            // 处理TypeArr
            let arr = data.bean.questions;
            //转换为Vue数据
            arr.forEach(element => {
              switch (element.qustion.type) {
                case '1':
                  element.qustion.typeArr = ['1'];
                  break;
                case '2':
                  element.qustion.typeArr = ['2'];
                  break;
                case '3':
                  element.qustion.typeArr = ['1', '3'];
                  break;
                case '4':
                  element.qustion.typeArr = ['2', '3'];
                  break;
                case '5':
                  element.qustion.typeArr = ['3'];
                  element.options = [];
                  break;
                default:
                  element.qustion.typeArr = [];
                  element.options = [];
              }
            });
            self.quesList = arr;
          } else {
            tool.alert("提示", "未获取到数据");
          }
        }).catch(() => {
          tool.alert("提示", "请求服务失败,请重试!");
        })

      }
    },
    created() {
      // 创建组件实例时钩子函数
    },
    mounted() {
      // 挂载到dom后的钩子函数
    },
    watch: {
      isAccuratePush(newValue, oldValue) {
        if (!newValue) {
          this.checkedRoles = [];
          // this.isNeedBack = false;
        }
      }
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.obj.title = "";
        vm.obj.introduction = "";
        vm.quesList = [];
        vm.isAccuratePush = false;
        let param = to.query;
        if (param.detailId) {
          vm.detailId = param.detailId;
          vm.isEdit = true;
          vm.getDetail(vm.detailId);
        } else {

          vm.isEdit = false;
        }
      });
    }
  }
</script>
<style scoped>
  .checkForm {
    line-height: 30px;
    margin: 5px 0;
  }

  .quesactive {
    border: 1px solid #FFFFFF;
    padding: 20px;
    overflow: auto;
  }

  .quesactive:hover {
    border: 1px solid #0095DA;
  }

  .opera {
    visibility: hidden;
  }

  .quesactive:hover>.opera {
    visibility: visible;
  }

  .marginLeft {
    margin-left: -15px;
  }

  .addChoose {
    line-height: 15px;
    margin: 10px 0px 10px 15px;
  }

  #othername {
    margin-left: -20px;
    margin-top: 10px;
  }

  .showCount,
  .showScore {
    display: none;
  }

  .singleQuestion {
    border: 2px dashed #ddd;
    border-radius: 10px;
    margin: 10px;
    padding: 10px;
  }

  .btn-ques-del {
    display: none;
    position: absolute;
    font-weight: 500;
    right: -2px;
    top: -2px;
    border-top-right-radius: 10px;
    border-bottom-left-radius: 10px;
    border: 2px dashed #ddd;
  }

  .singleQuestion:hover .btn-ques-del {
    display: inline-block;
  }

  .pdt8 {
    padding-top: 8px;
  }

  .btn-ope>.btn {
    border: 2px dashed #ddd;
    border-top: none;
    border-right: none;
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

  .panel-footer {
    border: 1px solid #ddd;
    border-top: none;
    margin-bottom: 0;
    padding: 10px;
    color: #909399;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    background-color: #f9f7f7;
    position: relative;
  }

  .line30 {
    line-height: 30px;
  }
</style>