<!-- 页面描述:添加问卷功能 -->
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

          <el-row :gutter="20" class="detail-row">
            <el-col :span="4" class="text-right title line30" style="line-height:40px;">
              <el-popover placement="top" title="精准推送" width="200" trigger="click" content="消息设置为精准推送后,仅企业中选择的特殊角色员工可回答此问卷。">
                <span slot="reference" style="cursor:pointer;"> <i class="el-icon-question"></i></span>
              </el-popover>
              <b>精准推送</b>
            </el-col>
            <el-col :span="14" class="right-panel" style="line-height:38px;">
              <el-switch disabled :value="checkedRoles.length>0" active-text="是" inactive-text="否">
              </el-switch>
            </el-col>
          </el-row>
          <el-row :gutter="20" class="detail-row" v-if="checkedRoles.length>0">
            <el-col :span="4" class="text-right title" style="line-height:40px;">
              <b>选择角色</b>
            </el-col>
            <el-col :span="20" class="right-panel" style="line-height:38px;">
              <el-checkbox-group disabled v-model="checkedRoles">
                <el-checkbox class="dis" v-for="city in roleList" :label="city.id" :key="city.id">{{city.name}}</el-checkbox>
              </el-checkbox-group>
            </el-col>
          </el-row>
        </div>
      </div>
      <el-row style="margin-top: 15px;">
        <p class="table-title text-left">
          <span style="line-height:30px;">问卷问题</span>
          <span class="text-right">
            <el-button size="small" type="primary" v-if="quesList.length==0" class="btn btn-primary addQuestion" @click="addQuestion()"
              icon="el-icon-plus"><span class="glyphicon glyphicon-plus"></span>&nbsp;新增问题</el-button>
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

                  <p style="font-size:0;">
                    <span style="display:inline-block;min-width: 20px;font-size: 14px;">{{$index+1}}.</span>
                    <el-input class="dis" style="display:inline-block;width:80%;" type="text" name="" v-model="x.qustion.stem"
                      placeholder="请在此输入问题" :disabled="isDetail"></el-input>
                  </p>
                  <p style="padding-left: 20px;">
                    <b>问题类型：</b>
                    <el-checkbox class="dis" v-model="x.qustion.typeArr" label="1" :disabled="isDetail" @change="checkTypeChange($index,'2')">单选</el-checkbox>
                    <el-checkbox class="dis" v-model="x.qustion.typeArr" label="2" :disabled="isDetail" @change="checkTypeChange($index,'1')">多选</el-checkbox>
                    <el-checkbox class="dis" v-model="x.qustion.typeArr" label="3" :disabled="isDetail" @change="checkChange($index)">其他</el-checkbox>
                  </p>
                  <div class="form-group chooseContain" style="padding-left: 20px;padding-right: 20px;">

                    <ul v-for="(y,yIndex) in x.options" v-show="x.qustion.typeArr&&(x.qustion.typeArr.indexOf('1')>-1||x.qustion.typeArr.indexOf('2')>-1)">
                      <li style="list-style: none; ">
                        <el-input type="text " v-model="y.content " class="dis" style="width: 60%;display: inline-block;"
                          size="medium" :disabled="isDetail" placeholder="请输入选项内容"></el-input>
                        <el-button size="mini" v-show="!isDetail" :data-index="yIndex" @click="delAns($index,yIndex)"
                          type="primary" style="margin-bottom: 5px;padding:6px;" icon="el-icon-close" circle></el-button>
                      </li>
                    </ul>
                    <el-input style="margin-top:10px;width:80%;" class="dis" type="textarea" v-show="x.qustion.typeArr&&(x.qustion.typeArr.indexOf('3')>-1)"
                      placeholder="其他" :disabled="true"></el-input>
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
  // import { mapGetters } from 'vuex';
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
        roleId: "",
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
        checkedRoles: []
      }
    },
    methods: {
      backList() {
        this.$to("/quan/list")
      },
      getDetail(qnaId) {
        var self = this;
        this.$post(`/tax/question/detail`, {
          qnaId
        }).then(data => {
          if (data.success) {
            self.obj = data.bean.qna;
            let roleIds = data.bean.qna.roleId;
            if (roleIds) {
              this.checkedRoles = roleIds.split(',')
            } else {
              this.checkedRoles = []
            }

            self.obj.surveyChannel = (self.obj.surveyChannel && self.obj.surveyChannel.split(',')) || [];
            // 处理TypeArr
            var arr = data.bean.questions;
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
    watch: {
      //实时监控数据变化
      detailId(newValue, oldValue) {
        this.getDetail(newValue);
      }
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        // 每次进入页面之前进行的操作
        vm.obj.title = "";
        vm.obj.introduction = "";
        vm.quesList = [];
        let param = to.query;
        if (param.detailId) {
          vm.detailId = param.detailId;
          vm.getDetail(vm.detailId);
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
  .dis.el-input.is-disabled .el-input__inner,
  .dis.el-textarea.is-disabled .el-textarea__inner {
    color: #737986;
  }


  .dis>.el-checkbox__input.is-disabled+span.el-checkbox__label {
    color: #737986;
  }

  .dis>.el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after {
    border-color: #333438;
  }

  .dis>.el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
    border-color: #6c7384;
  }
</style>
