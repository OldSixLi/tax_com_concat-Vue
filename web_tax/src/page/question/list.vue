<template>
  <div class="hello">
    <el-row style="margin-top: 10px;">
      <el-col :span="22" :offset="1">
        <el-popover placement="top" width="160" v-model="isShowPop" ref="delPop">
          <p class="text-center">确认删除此消息吗?</p>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="cancelPop">取消</el-button>
            <el-button type="primary" size="mini" @click="confirmDelete" :loading="deleteLoading">确定</el-button>
          </div>
          <span slot="reference"></span>
        </el-popover>
        <h2>问答管理</h2>
        <el-form>
          <!-- <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="消息标题" label-width="100px">
                  <el-input></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="消息名称" label-width="100px">
                  <el-input></el-input>
                </el-form-item>
              </el-col>
            </el-row> -->
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="问题标题" label-width="100px" style="margin-bottom: 0;">
                <el-input v-model.trim="keyWord" clearable placeholder="请输入关键字"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="提问时间" label-width="100px" style="margin-bottom: 0;">
                <el-date-picker v-model="dateValue" type="daterange" style="width:100%" align="right" unlink-panels
                  range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions2">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <p class="text-right" style="margin-bottom:0;">
          <el-button type="primary" icon="el-icon-search" @click="searchList">查询</el-button>
        </p>

        <el-row style="margin-top: 0;">
          <p class="table-title">
            问答管理
          </p>
          <!--
          '########::::'###::::'########::'##:::::::'########:
          ... ##..::::'## ##::: ##.... ##: ##::::::: ##.....::
          ::: ##:::::'##:. ##:: ##:::: ##: ##::::::: ##:::::::
          ::: ##::::'##:::. ##: ########:: ##::::::: ######:::
          ::: ##:::: #########: ##.... ##: ##::::::: ##...::::
          ::: ##:::: ##.... ##: ##:::: ##: ##::::::: ##:::::::
          ::: ##:::: ##:::: ##: ########:: ########: ########:
          -->
          <el-table border :data="tableData" style="min-width: 100%;" :maxHeight="availHeight()" :row-class-name="tableRowClassName">
            <el-table-column type="index" width="50" fixed align="center">
            </el-table-column>
            <template>
              <el-table-column prop="queTitle" label="问题标题" fixed>
              </el-table-column>
            </template>
            <template>
              <el-table-column prop="question" label="问题内容" width="400">
              </el-table-column>
            </template> <template>
              <el-table-column prop="queName" label="提问人" align="center">
              </el-table-column>
            </template>
            <template v-if="colData.indexOf('姓名')>-1">
              <el-table-column label="提问时间" align="center">
                <template slot-scope="scope">
                  {{scope.row.queTime|toTime}}
                </template>
              </el-table-column>
            </template>
            <template v-if="colData.indexOf('地址')>-1">
              <el-table-column label="问题状态" align="center" width="100">
                <template slot-scope="scope">
                  <el-tag :type="scope.row.state=='1'?'':'info'">{{scope.row.state | toStateName}}</el-tag>
                </template>
              </el-table-column>
            </template>

            <el-table-column fixed="right" label="操作" width="200" align="left">
              <template slot-scope="scope">
                <icon-btn :circle="true" @clicks="detailClick(scope.row)" :src="require('@/assets/img/detail.png')"
                  word="问题详情"></icon-btn>
                <icon-btn :circle="true" @clicks="replyClick(scope.row)" :src="require('@/assets/img/reply.png')" word="回复问题"
                  v-show="scope.row.state=='0'"></icon-btn>

                <!-- <el-popover placement="top" width="160" :value="currentDeleteId==scope.row.id">
                  <p class="text-center">确认删除此问题吗?</p>
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="currentDeleteId=''">取消</el-button>
                    <el-button type="primary" size="mini" @click="confirmDelete" :loading="currentDeleteId==scope.row.id&&deleteLoading">确定</el-button>
                  </div> -->
                <icon-btn style="margin-left:10px;" slot="reference" :circle="true" @clicks="deleteClick($event,scope.row)"
                  :src="require('@/assets/img/delete.png')" word="删除问题"></icon-btn>
                <!-- </el-popover> -->
              </template>
            </el-table-column>
          </el-table>
          <div style="margin-top:15px;">
            <el-pagination style="float:right;" @current-change="handleCurrentChange" :current-page.sync="currentPage1"
              layout="total, prev, pager, next" background :page-count="totalPage" :total="totalNum" v-show="totalPage>0">
            </el-pagination>
          </div>
        </el-row>

        <!--
        '########::'########:'########::::'###::::'####:'##:::::::
         ##.... ##: ##.....::... ##..::::'## ##:::. ##:: ##:::::::
         ##:::: ##: ##:::::::::: ##:::::'##:. ##::: ##:: ##:::::::
         ##:::: ##: ######:::::: ##::::'##:::. ##:: ##:: ##:::::::
         ##:::: ##: ##...::::::: ##:::: #########:: ##:: ##:::::::
         ##:::: ##: ##:::::::::: ##:::: ##.... ##:: ##:: ##:::::::
         ########:: ########:::: ##:::: ##:::: ##:'####: ########:
        ........:::........:::::..:::::..:::::..::....::........::
        -->
        <el-dialog title="问题详情" :visible.sync="showInfoModal" :modal-append-to-body='false' @close="modalClose">
          <div style="margin:0 30px;">
            <el-row :gutter="20" class="detail-row">
              <el-col :span="6" class="text-right title">问题标题</el-col>
              <el-col :span="14" class="right-panel">
                <el-input v-model="detailInfo.queTitle" :disabled="true"></el-input>
              </el-col>
            </el-row>
            <el-row :gutter="20" class="detail-row">
              <el-col :span="6" class="text-right title">问题描述</el-col>
              <el-col :span="14" class="right-panel">
                <el-input type="textarea" v-model="detailInfo.question" :disabled="true"></el-input>
              </el-col>
            </el-row>
            <el-row :gutter="20" class="detail-row">
              <el-col :span="6" class="text-right title">提问人</el-col>
              <el-col :span="14" class="right-panel">
                <el-input :value="detailInfo.queName" :disabled="true"></el-input>
              </el-col>
            </el-row>
            <el-row :gutter="20" class="detail-row">
              <el-col :span="6" class="text-right title">提问时间</el-col>
              <el-col :span="14" class="right-panel">
                <el-input :value="detailInfo.queTime|toTime" :disabled="true"></el-input>
              </el-col>
            </el-row>
            <!-- detail -->
            <div v-show="currentState=='detail'">
              <!-- 未回复 -->
              <el-row :gutter="20" class="detail-row" v-if="detailInfo.state=='0'">
                <el-col :span="6" class="text-right title">回复状态</el-col>
                <el-col :span="14" class="right-panel">
                  <el-tag type="info">未回复</el-tag>
                </el-col>
              </el-row>
              <!-- 已回复 -->
              <template v-if="detailInfo.state=='1'">
                <el-row :gutter="20" class="detail-row">
                  <el-col :span="6" class="text-right title">问题回复</el-col>
                  <el-col :span="14" class="right-panel">
                    <el-input type="textarea" :value="detailInfo.response" :disabled="true"></el-input>
                  </el-col>
                </el-row>
                <el-row :gutter="20" class="detail-row">
                  <el-col :span="6" class="text-right title">回复人</el-col>
                  <el-col :span="14" class="right-panel">
                    <el-input :value="detailInfo.resUserId" :disabled="true"></el-input>
                  </el-col>
                </el-row>
                <el-row :gutter="20" class="detail-row">
                  <el-col :span="6" class="text-right title">回复时间</el-col>
                  <el-col :span="14" class="right-panel">
                    <el-input :value="detailInfo.resTime|toTime" :disabled="true"></el-input>
                  </el-col>
                </el-row>
              </template>
            </div>
            <transition name="reply">
              <div v-show="currentState=='edit'" name="reply">
                <el-row :gutter="20" class="detail-row">
                  <el-col :span="6" class="text-right title">问题回复</el-col>
                  <el-col :span="14" class="right-panel">
                    <el-input type="textarea" v-model.trim="userReply" v-areafocus="currentState=='edit'" placeholder="请输入问题回复"
                      id="textareaID" :autofocus="currentState=='edit'"></el-input>
                  </el-col>
                </el-row>
              </div>
            </transition>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button v-show="currentState=='detail'&&detailInfo.state=='0'" type="primary" @click="detailToEdit">回复问题</el-button>
            <transition name="reply">
              <el-button v-show="currentState=='edit'" type="primary" @click="saveReply" icon="el-icon-check" :loading="replyLoad">保存回复</el-button>
            </transition>
            <el-button type="primary" @click="showInfoModal = false">关 闭</el-button>
          </div>
        </el-dialog>

        <el-dialog title="回复问题" :visible.sync="showEditModal" :modal-append-to-body='false'>
          <div slot="footer" class="dialog-footer">
            <el-button @click="showEditModal = false">取 消</el-button>
            <el-button type="primary" @click="showEditModal = false">确 定</el-button>
          </div>
        </el-dialog>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  //引入方法
  import {
    toNormalTime,
    toTimestamp
  } from '@/util/helper.js';
  import {
    getWindowHeight
  } from '@/util/dom.js';
  import axios from 'axios';
  import IconBtn from '@/components/IconBtn';
  //组件逻辑
  export default {
    name: 'QusReplyList',
    components: {
      'icon-btn': IconBtn
    },
    // '########:::::'###::::'########::::'###::::
    //  ##.... ##:::'## ##:::... ##..::::'## ##:::
    //  ##:::: ##::'##:. ##::::: ##:::::'##:. ##::
    //  ##:::: ##:'##:::. ##:::: ##::::'##:::. ##:
    //  ##:::: ##: #########:::: ##:::: #########:
    //  ##:::: ##: ##.... ##:::: ##:::: ##.... ##:
    //  ########:: ##:::: ##:::: ##:::: ##:::: ##:
    // ........:::..:::::..:::::..:::::..:::::..::
    data() {
      return {
        options: [],
        tableData: [], //列表数据
        detailInfo: {}, // 详情数据对象
        userReply: "", //用户回复问题的内容  关闭modal时记得清空
        colData: ['日期', '姓名', '地址'], //选中的列名
        cities: ['日期', '姓名', '地址'],
        currentState: "", // "detail/edit"两种状态 当前是查看详情状态还是编辑回复状态
        showInfoModal: false, //显示modal
        currentDeleteId: "", // 当前要删除的问题ID
        visible2: false,
        deleteLoading: false, //是否正在删除
        replyLoad: false, //是否正在回复操作
        currentPage1: 1, //列表的当前页
        totalPage: 0, //列表的总页数,
        totalNum: 0, //总记录条数
        isShowPop: false,
        keyWord: '',
        dateValue: '',
        searchData: {
          page: 1,
          word: "",
          start: "",
          end: ""
        },
        pickerOptions2: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        
      }
    },
    // '########:'####:'##:::::::'########:'########:'########:::'######::
    //  ##.....::. ##:: ##:::::::... ##..:: ##.....:: ##.... ##:'##... ##:
    //  ##:::::::: ##:: ##:::::::::: ##:::: ##::::::: ##:::: ##: ##:::..::
    //  ######:::: ##:: ##:::::::::: ##:::: ######::: ########::. ######::
    //  ##...::::: ##:: ##:::::::::: ##:::: ##...:::: ##.. ##::::..... ##:
    //  ##:::::::: ##:: ##:::::::::: ##:::: ##::::::: ##::. ##::'##::: ##:
    //  ##:::::::'####: ########:::: ##:::: ########: ##:::. ##:. ######::
    // ..::::::::....::........:::::..:::::........::..:::::..:::......:::
    filters: {
     /**
       * 转换时间 
       */
      toTime(time) {
        return toNormalTime(time);
      },
      /**
       * 当前问题状态 由数字转换为文字
       */
      toStateName(val) {
        let str = "";
        switch (val) {
          case "0":
            str = "未回复";
            break;
          case "1":
            str = "已回复";
            break;
          default:
        }
        return str;
      }
    },
    // '##::::'##:'########:'########:'##::::'##::'#######::'########:::'######::
    //  ###::'###: ##.....::... ##..:: ##:::: ##:'##.... ##: ##.... ##:'##... ##:
    //  ####'####: ##:::::::::: ##:::: ##:::: ##: ##:::: ##: ##:::: ##: ##:::..::
    //  ## ### ##: ######:::::: ##:::: #########: ##:::: ##: ##:::: ##:. ######::
    //  ##. #: ##: ##...::::::: ##:::: ##.... ##: ##:::: ##: ##:::: ##::..... ##:
    //  ##:.:: ##: ##:::::::::: ##:::: ##:::: ##: ##:::: ##: ##:::: ##:'##::: ##:
    //  ##:::: ##: ########:::: ##:::: ##:::: ##:. #######:: ########::. ######::
    // ..:::::..::........:::::..:::::..:::::..:::.......:::........::::......:::
    methods: {
      searchList() {
        this.searchData.page = 1;
        this.searchData.word = this.keyWord;
        if (this.dateValue && this.dateValue.length > 0) {
          let startTime = this.dateValue[0] ? toNormalTime(toTimestamp(this.dateValue[0])) : "";
          let endTime = this.dateValue[1] ? toNormalTime(toTimestamp(this.dateValue[1])) : "";
          this.searchData.start = startTime;
          this.searchData.end = endTime;
        } else {
          this.searchData.start = "";
          this.searchData.end = "";
        }
        this.getTable();
      },
      
      cancelPop() {
        this.isShowPop = false;
      },
      /**
       * 关闭modal时进行的事件 
       * @returns 
       */
      modalClose() {
        this.currentState = "";
        this.userReply = '';
        this.replyLoad = false;
      },
      /**
       * 当前页码改变时 重新请求列表 
       * @returns 
       */
      handleCurrentChange(x) {
        this.getTable(this.currentPage1)
      },
      /**
       * 点击按钮关闭事件 
       * @returns 
       */
      deleteClick({
        target
      }, row) {
        let id = row.id; //删除的问题ID
        this.currentDeleteId = id;
        this.deleteLoading = false;
        // this.isShowPop=true;
        this.isShowPop = true;
        this.$nextTick(() => {
          let pop = this.$refs.delPop;
          if (pop.popperJS) {
            pop.popperJS._reference = target;
            pop.popperJS.state.position = pop.popperJS._getPosition(pop.popperJS._popper, pop.popperJS._reference);
            pop.popperJS.update();
          }
        })
      },
      /**
       * 弹出框中进行确认按钮点击 
       * @returns 
       */
      confirmDelete() {
        let qrId = this.currentDeleteId;
        if (!qrId) {
          this.currentDeleteId = "";
          return;
        }
        this.deleteLoading = true;
        //ajax Request
        this.$post(`/tax/queres/deleteQue`, {
          userId: 1,
          qrId
        }).then(data => {
          if (data.success) {
            this.currentDeleteId = "";
            this.$message({
              message: '问题删除成功',
              type: 'success',
            });
            this.isShowPop = false;
            this.getTable(this.currentPage1);
          } else {
            this.$message.error(data.message);
          }
        })
      },
      /**
       * 保存用户回复的问题答案 
       * @returns 
       */
      saveReply(row) {
        let qrId = this.detailInfo.id;
        if (!this.userReply) {
          this.$message({
            showClose: true,
            message: `请输入回复内容再进行保存操作！`,
            type: 'warning'
          });
        }

        this.replyLoad = true;
        // ajax Request
        this.$post(`/tax/queres/saveAndSend`, {
          response: this.userReply,
          qrId,
          userId: 1
        }).then(data => {
          if (data.success) {
            this.showInfoModal = false;
            this.$message({
              message: '回复问题成功!',
              showClose: true,
              type: 'success'
            });
            this.userReply = '';
            this.detailInfo.state = "1";
            this.getTable(this.currentPage1)
          } else {
            this.$message.error(data.message);
          }
        }).finally(x => {
          this.replyLoad = false;
        })
      },
      /**
       * 点击modal中 '回复问题' 按钮  将当前状态转换为编辑状态
       * @returns 
       */
      detailToEdit() {
        this.currentState = "edit"
      },
      /**
       * 列表-详情按钮点击事件 
       * @returns 
       */
      detailClick(row) {
        this.showInfoModal = true;
        this.currentState = "detail"
        this.detailInfo = row;
      },
      /**
       * 列表-回复按钮点击事件 
       * @returns 
       */
      replyClick(row) {
        this.showInfoModal = true;
        this.currentState = "edit"
        this.detailInfo = row;
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
       * 获取table数据 
       * @returns 
       */
      getTable(
        currentPage = this.searchData.page,
        keywords = this.searchData.word,
        queStartTime = this.searchData.start,
        queEndTime = this.searchData.end) {
        this.$get('/tax/queres/queList', {
            currentPage,
            keywords,
            queStartTime,
            queEndTime,
            scope: "title"
          })
          .then(
            data => {
              if (data.success) {
                this.tableData = data.bean.data;
                this.totalPage = data.bean.pageCount;
                this.currentPage1 = data.bean.pageNum;
                this.totalNum = data.bean.rowCount;
              } else {
                this.tableData = [];
              }
            },
            err => this.tableData = []
          );
      },
      /**
       * 获取下拉菜单 
       * @returns 
       */
      getOption() {
        this.$get("/tax/message/messageList")
          .then(
            data => this.options = data,
            err => this.options = []
          );
      },
      /**
       * 获取屏幕可用高度 
       * @returns 
       */
      availHeight() {
        return getWindowHeight() - 100;
      }
    },
    mounted() {
      this.getTable();
    },
     beforeRouteEnter(to, from, next) {
      next(vm => {
        // 每次进入页面之前进行的操作
        vm.currentPage1 = 1;
        vm.searchData = {
          page: 1,
          word: "",
          start: "",
          end: ""
        }
        vm.getTable();
      });
    },
  }

</script>
<!--
:'######:::'######:::'######::
'##... ##:'##... ##:'##... ##:
 ##:::..:: ##:::..:: ##:::..::
 ##:::::::. ######::. ######::
 ##::::::::..... ##::..... ##:
 ##::: ##:'##::: ##:'##::: ##:
. ######::. ######::. ######::
:......::::......::::......:::
-->
<style scoped>
  .reply-enter-active {
    /* 动画过渡设置 */
    transition: all .3s;
    transform-origin: 50% 50% 0;
  }

  .reply-leave-active {
    /* 动画过渡设置 */
    transform-origin: 50% 50% 0;
  }

  .reply-leave,
  .reply-enter-to {
    /* 终止,动画已完成 */
    transform: scale(1, 1) translateY(0);
    opacity: 1;
  }

  .reply-leave-to,
  .reply-enter {
    /* 起始,动画刚开始*/
    opacity: 0.3;
    transform: scale(1, 0.8) translateY(60%);
  }

  h1,
  h2 {
    font-weight: normal;
    font-size: 25px;
    text-align: center;
  }

  .hello {
    padding: 10px;
  }


  .grid-content {
    border: 1px solid #ddd;
  }


  .title {
    font-weight: bold;
    line-height: 38px;
  }

  .detail-row {
    margin-top: 10px;
  }

  .right-detail {
    box-sizing: border-box;
    border: 1px solid #ddd;
    border-radius: 5px;
    padding: 8px;
    background-color: #eee;
    display: block;
    width: 100%;
  }

  .ask-time {
    font-size: 13px;
    color: #909399;
  }

</style>

<style>
  .right-panel .el-input.is-disabled .el-input__inner,
  .right-panel .el-textarea.is-disabled .el-textarea__inner {
    color: #5e6167;
  }

  .el-table--striped .el-table__body tr.el-table__row--striped.current-row td,
  .el-table__body tr.current-row>td,
  .el-table__body tr.hover-row.current-row>td,
  .el-table__body tr.hover-row.el-table__row--striped.current-row>td,
  .el-table__body tr.hover-row.el-table__row--striped>td,
  .el-table__body tr.hover-row>td {
    background-color: #f5f7fa;
  }

  .el-table .cell {
    line-height: normal;
  }

</style>
