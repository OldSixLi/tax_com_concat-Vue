<!-- 页面描述:用户回答列表-->
<template>
  <div>

    <h2 class="text-center"><span v-if="title">《{{title}}》</span> 调查结果</h2>
    <el-row style="margin-top: 15px;">
      <el-col :span="22" :offset="1"> 
        <p class="table-title text-right">
        <span style="float:left;line-height: 35px;">问卷调查结果列表</span>  
          <el-button type="primary" size="small" @click="backList" >返回问卷列表</el-button>
        </p>
        <el-table ref="tableSet" border :data="list" style="min-width: 100%;" :maxHeight="availHeight()"
          :row-class-name="tableRowClassName">
          <el-table-column type="index" width="50" fixed align="center">
          </el-table-column>
          <template>
            <el-table-column prop="name" label="用户名称">
            </el-table-column>
            <el-table-column prop="entName" label="企业名称">
            </el-table-column>
            <el-table-column prop="roleName" label="用户身份">
            </el-table-column>
          </template>
          <template>
            <el-table-column label="提交时间" align="center">
              <template slot-scope="scope">
                {{scope.row.time}}
              </template>
            </el-table-column>
          </template>

          <el-table-column label="操作" align="left" fixed="right">
            <template slot-scope="scope">
              <icon-btn :circle="true" @clicks="detailClick(scope.row)" :src="require('@/assets/img/detail.png')" word="答案详情"></icon-btn>
            </template>
          </el-table-column>
        </el-table>
        <div style="margin-top:15px;">
          <el-pagination style="float:right;" @current-change="handleCurrentChange" :current-page.sync="currentPage1"
            layout="total, prev, pager, next" background :page-count="totalPage" :total="totalNum" v-show="totalPage>0">
          </el-pagination>
        </div>
      </el-col>
    </el-row>

    <el-dialog title="问卷回答" :visible.sync="detailModal" :modal-append-to-body='false'>
      <div>

        <p class="table-title">
          <span style="">问卷基本信息</span>
          
        </p>

        <div class="panel panel-default noPadding scroll-target">
          <div class="panel-body">
            <el-row :gutter="20" class="detail-row">
              <el-col :span="6" class="text-right title">问卷标题</el-col>
              <el-col :span="14" class="right-panel">
                <el-input :value="title" disabled></el-input>
              </el-col>
            </el-row>
            <el-row :gutter="20" class="detail-row">
              <el-col :span="6" class="text-right title">填写用户</el-col>
              <el-col :span="14" class="right-panel">
                <el-input :value="currentUserInfo.username" disabled placeholder="请输入消息标题"></el-input>
              </el-col>
            </el-row>
            <el-row :gutter="20" class="detail-row">
              <el-col :span="6" class="text-right title">所属公司</el-col>
              <el-col :span="14" class="right-panel">
                <el-input :value="currentUserInfo.com" disabled placeholder="请输入消息标题"></el-input>
              </el-col>
            </el-row>
            <el-row :gutter="20" class="detail-row">
              <el-col :span="6" class="text-right title">用户身份</el-col>
              <el-col :span="14" class="right-panel">
                <el-input :value="currentUserInfo.roleName" disabled placeholder="请输入消息标题"></el-input>
              </el-col>
            </el-row>
          </div>
        </div>
        <p class="table-title">
          <span style="">问卷问题</span>
         
        </p>
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
                          <el-radio :label="y.id.toString()" :key="y.id" v-model="x.optionAnswer" readonly v-if="x.question.typeArr&&(x.question.typeArr.indexOf('1')>-1)">{{''}}</el-radio>
                          <el-checkbox readonly v-if="x.question.typeArr&&(x.question.typeArr.indexOf('2')>-1)"
                            :checked="x.optionAnswer&&x.optionAnswer.split(',').indexOf(y.id.toString())>-1"></el-checkbox>
                          <b>{{y.content}}</b>
                        </li>
                      </ul>
                      <span v-if="x.question.type=='3'&&x.textAnswer">
                        <el-radio :checked="true"></el-radio> 其他
                        <br></span>
                        <span v-if="x.question.type=='4'&&x.textAnswer">
                          <el-checkbox :checked="true"></el-checkbox> 其他
                          <br></span>
                          <el-input v-if="x.textAnswer" style="margin-top:10px;width:80%;" class="dis" type="textarea"
                            :disabled="true" :value="x.textAnswer"></el-input>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <p class="text-right">
          <el-button type="primary" @click="closeModal">返回</el-button>
        </p>
      </div>
    </el-dialog>

  </div>
</template>
<script>
  //引入方法
  import {
    toNormalTime
  } from '@/util/helper.js';
  import {
    getWindowHeight
  } from '@/util/dom.js';

  import IconBtn from '@/components/IconBtn';
  // import { mapGetters } from 'vuex';
  export default {
    name: "quanList",
    //对外获取的数据
    props: {},
    components: {
      'icon-btn': IconBtn
    },
    data() {
      return {
        list: [],
        detailModal: false,
        isShowPop: false,
        deleteLoading: false,
        currentPage1: 1, //列表的当前页
        totalPage: 0, //列表的总页数,
        totalNum: 0, //总记录条数
        title: "",
        qnaId: "",
        quesList: [],
        obj: {
          title: ""
        },
        currentUserInfo: {}
      }
    },
    methods: {
      closeModal() {
        this.detailModal = false;
      },
      backList() {
        this.$to("/quan/list")
      },
      /**
       * 列表初始化将index赋值 
       * @returns 
       */
      tableRowClassName({
        row,
        rowIndex
      }) {
        row.index = rowIndex;
      },
      /**
       * 当前页码改变时 重新请求列表 
       * @returns 
       */
      handleCurrentChange(x) {
        this.getTable(this.currentPage1)
      },
      detailClick(row) {
        // if (row.userId) {
        //   this.$to(`/quan/list/ansDetail/${this.qnaId}/${row.userId}`)
        // }
        this.detailModal = true;
        let userId = row.userId;
        let qnaId = this.qnaId;
        this.getDetail(qnaId, userId);
        this.currentUserInfo = {
          username: row.name,
          com: row.entName,
          roleName: row.roleName
        }
      },

      getTable(qnaId) {
        this.$get(`/tax/question/inputList`, {
          currentPage: this.currentPage1 || 1,
          qnaId
        }).then((data) => {
          if (data.success) {
            let arr = data.bean.data;
            arr.forEach(x => {
              x.isOpen = false;
              x.switchDisable = false;
              // 1-未开启 2-已开启 3-已结束 4-已作废 5-已发送 
              let state = x.STATE;
              if (state == '2') {
                x.isOpen = true;
              }
              if (state == '3') {
                x.switchDisable = true;
              }
            });
            this.tableData = data.bean.data;
            this.totalPage = data.bean.pageCount;
            this.currentPage1 = data.bean.pageNum;
            this.totalNum = data.bean.rowCount;
            this.list = arr;
          }
        })
      },


      getDetail(qnaId, userId) {
        this.$post(`/tax/question/anwerDetail`, {
            qnaId,
            userId
          })
          .then(data => {
            if (data.success) {
              this.obj.title = data.bean.title;
              this.obj.title = data.bean.title;
              let arr = data.bean.questions;
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
              this.quesList = arr;
            } else {
              tool.alert("提示", "未获取到数据");
              this.detailModal = false;
            }
          }).catch((x) => {
            tool.alert("提示", "请求服务失败,请重试!");
          })

      },

      /**
       * 获取屏幕可用高度 
       * @returns 
       */
      availHeight() {
        return getWindowHeight() - 100;
      },
      getQuanDetail(qnaId) {
        this.$post(`/tax/question/detail`, {
          qnaId
        }).then(data => {
          if (data.success) {
            this.title = data.bean.qna.title || "";
          }
        })
      }
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        // vm.quesList=[];
        let qnaId = to.params && to.params.qnaId;
        if (qnaId) {
          vm.qnaId = qnaId;
          vm.getTable(qnaId);
          vm.getQuanDetail(qnaId);
        }
      });
    },
   
  beforeRouteLeave (to, from, next) {
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
    this.quesList=[];
    this.title="";
    next();
  } ,
    filters: {
      /**
       * 转换时间 
       */
      toTime(time) {
        return toNormalTime(time);
      }
    },
    watch: {
      detailModal(newValue, oldValue) {
        if (!newValue) {
          //信息清空
          this.currentUserInfo = {};
          this.quesList = [];
        }
      }
    },
  }
</script>
<style scoped>
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

  .el-switch.is-disabled {
    opacity: 0.3;
  }

  .panel-body {
    padding: 15px;
    border: 1px solid #ddd;
  }

  .text-right.title {
    line-height: 40px;

  }

  .detail-row {
    margin-top: 10px;
  }
</style>