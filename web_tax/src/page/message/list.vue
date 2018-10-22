<template>
  <div class="hello">
    <el-row style="margin-top: 10px;">
      <el-popover placement="top" width="160" v-model="isShowPop" ref="delPop">
        <p class="text-center">确认删除此消息吗?</p>
        <div style="text-align: right; margin: 0">
          <el-button size="mini" type="text" @click="cancelPop">取消</el-button>
          <el-button type="primary" size="mini" @click="confirmDelete" :loading="deleteLoading">确定</el-button>
        </div>
        <span slot="reference"></span>
      </el-popover>

      <el-col :span="22" :offset="1">
        <h2>消息管理</h2>
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
              <el-form-item label="消息标题" label-width="100px" style="margin-bottom: 0;">
                <el-input v-model.trim="keyWord" clearable placeholder="请输入关键字"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="创建时间" label-width="100px" style="margin-bottom: 0;">
                <el-date-picker v-model="dateValue" type="daterange" style="width:100%" align="right" unlink-panels
                  range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions2">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-row>
          <p class="text-right">
            <el-button type="primary" icon="el-icon-search" @click="searchList">查询</el-button>
            <el-button type="primary" icon="el-icon-bell" @click="addNew">新建消息</el-button>
          </p>
          <p class="table-title">
            消息管理
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
          <el-table ref="tableSet" border :data="tableData" style="min-width: 100%;" :maxHeight="availHeight()"
            :row-class-name="tableRowClassName">
            <el-table-column type="index" width="50" fixed align="center">
            </el-table-column>
            <template>
              <el-table-column prop="TITLE" label="消息标题" width="200">
              </el-table-column>
            </template>
            <template>
              <el-table-column prop="CONTENT" label="消息内容" minWidth="400">
              </el-table-column>
            </template> <template>
              <el-table-column prop="CREATE_USER_ID" label="创建者" align="center" width="100">
              </el-table-column>
            </template>
            <template v-if="colData.indexOf('姓名')>-1">
              <el-table-column label="创建时间" align="center" width="200">
                <template slot-scope="scope">
                  {{scope.row.CREATE_TIME|toTime}}
                </template>
              </el-table-column>
              <el-table-column label="消息状态" align="center" width="80">
                <template slot-scope="scope">
                  {{scope.row.STATE|toStateName}}
                </template>
              </el-table-column>
            </template>
            <template v-if="colData.indexOf('地址')>-1">
              <el-table-column label="是否回执" align="center" width="100">
                <template slot-scope="scope">
                  <i :class="[scope.row.TYPE=='1'?'el-icon-minus':'el-icon-check']" v-if="scope.row.TYPE=='1'"></i>
                  <a style="cursor:pointer;" class="title-a" @click="toReadList(scope.row)" title="查看回执"> <span v-if="scope.row.TYPE=='0'">查看回执</span> </a>

                  <!-- <i :class="[scope.row.TYPE=='0'?'el-icon-check':'el-icon-check']" ></i> -->
                </template>
              </el-table-column>
            </template>
            <el-table-column fixed="right" label="操作" width="150" align="left">
              <template slot-scope="scope">
                <icon-btn :circle="true" @clicks="detailClick(scope.row)" :src="require('@/assets/img/detail.png')"
                  word="问题详情"></icon-btn>
                <icon-btn :circle="true" @clicks="sendMsg(scope.row)" :src="require('@/assets/img/sendMsg.png')" word="发送消息"
                  v-show="scope.row.STATE=='0'"></icon-btn>
                <icon-btn style="margin-left:10px;" slot="reference" :circle="true" @clicks="deleteClick($event,scope.row)"
                  :src="require('@/assets/img/delete.png')" word="删除问题"></icon-btn>
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
              <el-col :span="6" class="text-right title">消息标题</el-col>
              <el-col :span="14" class="right-panel">
                <el-input v-model="detailInfo.TITLE" :disabled="true"></el-input>
              </el-col>
            </el-row>
            <el-row :gutter="20" class="detail-row">
              <el-col :span="6" class="text-right title">消息内容</el-col>
              <el-col :span="14" class="right-panel">
                <el-input type="textarea" autosize :rows="5" v-model="detailInfo.CONTENT" :disabled="true"></el-input>
              </el-col>
            </el-row>
            <el-row :gutter="20" class="detail-row">
              <el-col :span="6" class="text-right title">发送者</el-col>
              <el-col :span="14" class="right-panel">
                <el-input :value="detailInfo.CREATE_USER_ID" :disabled="true"></el-input>
              </el-col>
            </el-row>
            <el-row :gutter="20" class="detail-row">
              <el-col :span="6" class="text-right title">发送时间</el-col>
              <el-col :span="14" class="right-panel">
                <el-input :value="detailInfo.CREATE_TIME|toTime" :disabled="true"></el-input>
              </el-col>
            </el-row>
            <!-- 未回复 -->
            <el-row :gutter="20" class="detail-row">
              <el-col :span="6" class="text-right title">是否回执</el-col>
              <el-col :span="14" class="right-panel">
                <el-tag :type="detailInfo.TYPE=='1'?'info':''">{{detailInfo.TYPE=='0'?'需要':'不需要'}}</el-tag>

                <el-button type="text" v-if="detailInfo.TYPE=='0'" @click="toReadList(detailInfo)">查看回执</el-button>
              </el-col>
            </el-row>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="showInfoModal = false">关 闭</el-button>
          </div>
        </el-dialog>

        <!--
          :::'###::::'########::'########::'##::::'##::'#######::'########:::::'###::::'##:::::::
          ::'## ##::: ##.... ##: ##.... ##: ###::'###:'##.... ##: ##.... ##:::'## ##::: ##:::::::
          :'##:. ##:: ##:::: ##: ##:::: ##: ####'####: ##:::: ##: ##:::: ##::'##:. ##:: ##:::::::
          '##:::. ##: ##:::: ##: ##:::: ##: ## ### ##: ##:::: ##: ##:::: ##:'##:::. ##: ##:::::::
           #########: ##:::: ##: ##:::: ##: ##. #: ##: ##:::: ##: ##:::: ##: #########: ##:::::::
           ##.... ##: ##:::: ##: ##:::: ##: ##:.:: ##: ##:::: ##: ##:::: ##: ##.... ##: ##:::::::
           ##:::: ##: ##--######:: ########:: ##:::: ##:. #######:: ########:: ##:::: ##: ########:
          ..:::::..::........:::........:::..:::::..:::.......:::........:::..:::::..::........::
          -->
        <el-dialog title="新建消息" :visible.sync="addModal" :modal-append-to-body='false'>
          <div>
            <el-row :gutter="20" class="detail-row">
              <el-col :span="6" class="text-right title">消息标题</el-col>
              <el-col :span="14" class="right-panel">
                <el-input v-model="detailInfo.TITLE" placeholder="请输入消息标题"></el-input>
              </el-col>
            </el-row>
            <el-row :gutter="20" class="detail-row">
              <el-col :span="6" class="text-right title">消息内容</el-col>
              <el-col :span="14" class="right-panel">
                <el-input :rows="5" type="textarea" autosize v-model="detailInfo.CONTENT" placeholder="请输入消息内容" ></el-input>
              </el-col>
            </el-row>

            <el-row :gutter="20" class="detail-row">
              <el-col :span="6" class="text-right title">
                <el-popover placement="top" title="精准推送" width="200" trigger="click" content="消息设置为精准推送后,仅企业中选择的特殊角色员工可接收到此消息。">
                  <span slot="reference" style="cursor:pointer;"> <i class="el-icon-question"></i></span>
                </el-popover>
                精准推送
              </el-col>
              <el-col :span="14" class="right-panel" style="line-height:38px;">
                <el-switch v-model="isAccuratePush" active-text="是" inactive-text="否">
                </el-switch>
              </el-col>
            </el-row>
            <transition name="el-zoom-in-top">
              <div v-show="isAccuratePush">
                <el-row :gutter="20" class="detail-row">
                  <el-col :span="6" class="text-right title">
                    选择角色
                  </el-col>
                  <el-col :span="18" class="right-panel" style="line-height:38px;">
                    <el-checkbox-group v-model="checkedRoles">
                      <el-checkbox v-for="city in roleList" :label="city.id" :key="city.id">{{city.name}}</el-checkbox>
                    </el-checkbox-group>
                  </el-col>
                </el-row>
                <el-row :gutter="20" class="detail-row">
                  <el-col :span="6" class="text-right title">是否回执</el-col>
                  <el-col :span="14" class="right-panel" style="line-height:38px;">
                    <el-switch v-model="isNeedBack" active-text="需要" inactive-text="不需要" :disabled="!isAccuratePush">
                    </el-switch>
                  </el-col>
                </el-row>
              </div>
            </transition>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" icon="el-icon-upload" @click="saveAndSend" :loading="currentLoad=='saveAndSend'">保存并发送</el-button>
            <el-button type="primary" icon="el-icon-circle-check-outline" @click="saveNews" :loading="currentLoad=='save'">保存</el-button>
            <el-button @click="addModal = false">取消</el-button>
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
        addModal: false,
        isNeedBack: false, //是否需要回执
        isAccuratePush: false, //是否需要回执
        currentLoad: "",
        checkedRoles: [],
        isShowPop: false,
        roleList: [{
          name: "管理员",
          id: 1
        }, {
          name: "企业法人",
          id: 2
        }, {
          name: "公司经理",
          id: 3
        }, {
          name: "财务总监",
          id: 4
        }, {
          name: "公司董事",
          id: 5
        }, ],
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
        keyWord: '',
        dateValue: '',
searchData:{
  page:1,
  word:"",
  start:"",
  end:""
}
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
            str = "未发送";
            break;
          case "1":
            str = "已发送";
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
        this.searchData.page=1;
        this.searchData.word=this.keyWord;
        if (this.dateValue&&this.dateValue.length > 0) {
          let startTime = this.dateValue[0] ? toNormalTime(toTimestamp(this.dateValue[0]) ): "";
          let endTime = this.dateValue[1] ? toNormalTime(toTimestamp(this.dateValue[1])) : "";
          this.searchData.start=startTime;
          this.searchData.end=endTime;
        }else{
          this.searchData.start="";
          this.searchData.end="";
        }
        this.getTable();
      },
      toReadList(row) {
        this.$to(`/message/list/${row.ID}/readlist`)
      },

      cancelPop() {
        this.isShowPop = false;
      },
      sendMsg(row) {
        let messageId = row.ID;
        this.$post(`/tax/message/sendMessageOrQuestion`, {
          userId: 1,
          messageId
        }).then(
          data => {
            if (data.success) {
              this.$message({
                message: '发送消息成功!',
                type: 'success',
              });
              this.addModal = false;
              this.getTable(this.currentPage1);
            } else {
              this.$message.error(data.message);
            }
          }
        )
      },
      saveAndSend() {
        this.currentLoad = "saveAndSend";
        this.$post(`/tax/message/saveAndSend`, {
          type: this.isNeedBack ? "0" : "1",
          title: this.detailInfo.TITLE,
          content: this.detailInfo.CONTENT,
          userId: 1,
          roleId: this.checkedRoles.join(',')
        }).then(x => {
          if (x.success) {
            this.$message({
              message: '发送消息成功!',
              type: 'success',
            });
            this.addModal = false;
            this.getTable(this.currentPage1);
          } else {
            this.$message.error(x.message);
          }
        }).finally(
          x => {
            this.currentLoad = "";
          }
        );
      },
      saveNews() {
        this.currentLoad = "save";
        this.$post(`/tax/message/saveMessage`, {
          type: this.isNeedBack ? "0" : "1",
          title: this.detailInfo.TITLE,
          content: this.detailInfo.CONTENT,
          userId: 1,
          roleId: this.checkedRoles.join(',')
        }).then(x => {
          if (x.success) {
            this.$message({
              message: '添加消息成功!',
              type: 'success',
            });
            this.addModal = false;
            this.getTable(this.currentPage1);
          } else {
            this.$message.error(x.message);
          }
        }).finally(
          x => {
            this.currentLoad = "";
          }
        );
      },
      addNew() {
        this.addModal = true;
        this.detailInfo = {
          CONTENT: "",
          MSGTYPE: "",
          TITLE: "",
          TYPE: "1",
        };
      },

      /**
       * 关闭modal时进行的事件 
       * @returns 
       */
      modalClose() {
        this.currentState = "";
        this.userReply = '';
        this.replyLoad = false;
        this.currentLoad = "";
        this.isAccuratePush = false;
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

        let id = row.ID; //删除的问题ID
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
        let messageId = this.currentDeleteId;
        if (!messageId) {
          return;
        }
        this.deleteLoading = true;
        this.$post(`/tax/message/deleteMessage`, {
          userId: 1,
          messageId
        }).then(data => {
          if (data.success) {
            this.currentDeleteId = "";
            this.$message({
              message: '删除消息成功！',
              type: 'success',
            });
            this.isShowPop = false;
            this.getTable(this.currentPage1);

          } else {
            this.$message.error(data.message);
          }
        });
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
      
      //  vm.searchData.page,
      //     vm.searchData.word,
      //     vm.searchData.start,
      //     vm.searchData.end
          
      getTable(
        currentPage = this.searchData.page, 
        keywords = this.searchData.word, 
        startTime = this.searchData.start, 
        endTime = this.searchData.end) {
        this.$get('/tax/message/messageList', {
            currentPage,
            keywords,
            startTime,
            endTime,
            scope:"title"
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
       * 获取屏幕可用高度 
       * @returns 
       */
      availHeight() {
        return getWindowHeight() - 100;
      }
    }, 
    beforeRouteEnter(to, from, next) {
      next(vm => {
        // 每次进入页面之前进行的操作
        vm.currentPage1 = 1;
        vm.getTable();
      });
    },
    watch: {
      isAccuratePush(newValue, oldValue) {
        if (!newValue) {
          this.checkedRoles = [];
          this.isNeedBack = false;
        }
      },
      addModal(newValue) {
        if (!newValue) {
          this.isAccuratePush = false;
        }

      }
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

  .table-title {
    border: 1px solid #ddd;
    border-bottom: none;
    margin-bottom: 0;
    padding: 10px;
    color: #909399;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    background-color: #f9f7f7;
    position: relative;
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

  .right-panel .el-checkbox+.el-checkbox {
    margin-left: 15px;
  }

  .right-panel .el-checkbox__label {
    padding-left: 5px;
  }
  .right-panel.el-col.el-col-14 .el-textarea textarea{
min-height: 60px;
  }
</style>
