<!-- 页面描述:问卷列表 -->
<template>
  <div>
    <el-popover placement="top" width="160" v-model="isShowPop" ref="delPop">
      <p class="text-center">确认删除此问卷吗?</p>
      <div style="text-align: right; margin: 0">
        <el-button size="mini" type="text" @click="cancelPop">取消</el-button>
        <el-button type="primary" size="mini" @click="confirmDelete" :loading="deleteLoading">确定</el-button>
      </div>
      <span slot="reference"></span>
    </el-popover>
    <h2 class="text-center">问卷管理</h2>
    <el-row style="margin-top: 15px;">
      <el-col :span="22" :offset="1">
        <div class="text-right">
          <el-button type="primary" class="btn btn-primary addQuestion" @click="toAdd" icon="el-icon-plus">新增问卷</el-button>
        </div>
        <p class="table-title">
          问卷管理
        </p>
        <el-table ref="tableSet" border :data="list" style="min-width: 100%;" :maxHeight="availHeight()"
          :row-class-name="tableRowClassName">
          <el-table-column type="index" width="50" fixed align="center">
          </el-table-column>
          <template>
            <el-table-column label="问卷标题" width="200">
              <template slot-scope="scope">
                <!-- prop="TITLE" -->
                <!-- <el-button type="text" @click="detailClick(scope.row)">{{scope.row.TITLE}}</el-button> -->
                <a class="title-a" @click="detailClick(scope.row)">{{scope.row.TITLE}}</a>
              </template>

            </el-table-column>
          </template>
          <template>
            <el-table-column prop="CONTENT" label="宣传文案" minWidth="300">
            </el-table-column>
          </template>
          <template>
            <el-table-column prop="CREATE_USER_ID" label="创建者" align="center" width="100">
            </el-table-column>
          </template>
          <template>
            <el-table-column label="创建时间" align="center" width="200">
              <template slot-scope="scope">
                {{scope.row.CREATE_TIME|toTime}}
              </template>
            </el-table-column>
          </template>
          <template>
            <el-table-column label="精准推送" align="center">
              <template slot-scope="scope">
                {{scope.row.ROLE_ID?"是":"否"}}
              </template>
            </el-table-column>
          </template>
          <el-table-column label="问卷状态" align="center" width="80">
            <template slot-scope="scope">
              {{scope.row.STATE|toStateName}}
            </template>
          </el-table-column>
          <el-table-column label="问卷开启/结束" width="120" align="center" fixed="right">
            <template slot-scope="scope">
              <!-- 未开启 -->
              <el-switch v-model="scope.row.isOpen" v-if="scope.row.STATE=='1'" @change="openQuan(scope.row)" :disabled="scope.row.switchDisable"></el-switch>
              <!-- 已开启 -->
              <el-switch v-model="scope.row.isOpen" v-if="scope.row.STATE>'1'" @change="closeQuan(scope.row)" :disabled="scope.row.switchDisable"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" minWidth="150" align="left" fixed="right">
            <template slot-scope="scope">
              <!-- 问卷详情 -->
              <icon-btn :circle="true" @clicks="detailClick(scope.row)" :src="require('@/assets/img/detail.png')" word="问卷详情"></icon-btn>
              <!-- 调查结果 -->
              <icon-btn style="margin-left:10px;" slot="reference" :circle="true" @clicks="toAnsList($event,scope.row)"
                :src="require('@/assets/img/results.png')" word="调查结果" v-if="scope.row.STATE!='1'"></icon-btn>
              <!-- 编辑问卷 -->
              <icon-btn style="margin-left:10px;" slot="reference" :circle="true" @clicks="EditClick($event,scope.row)"
                :src="require('@/assets/img/reply.png')" word="编辑问卷" v-if="scope.row.STATE=='1'"></icon-btn>
              <!-- 删除问卷 -->
              <icon-btn style="margin-left:10px;" slot="reference" :circle="true" @clicks="deleteClick($event,scope.row)"
                :src="require('@/assets/img/delete.png')" word="删除问卷" v-if="scope.row.STATE=='1'"></icon-btn>
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
        isShowPop: false,
        deleteLoading: false,
        currentPage1: 1, //列表的当前页
        totalPage: 0, //列表的总页数,
        totalNum: 0, //总记录条数
      }
    },
    methods: {
      toAnsList(event, row) {
        let qnaId = row.ID;
        if (!qnaId) {
          return;
        }
        this.$to(`/quan/list/ansList/${qnaId}`);
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
      openQuan(row) {
        let qnaId = row.ID;
        if (!qnaId) {
          return;
        }
        this.$msgbox({
          title: '提示',
          message: '是否确认开启此问卷并发送微信通知？',
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = '开启中';
              this.$post(`/tax/question/qnaStart`, {
                qnaId,
                userId: 1
              }).then(data => {
                if (data.success) {
                  this.getTable();
                  this.$message({
                    type: 'success',
                    message: '问卷开启成功,您设置的可见人员将会收到此问卷通知！'
                  });
                } else {
                  this.$message({
                    type: 'error',
                    message: data.message || '开启失败,请重试！'
                  });
                  row.isOpen = false;
                }
              }).finally(x => {
                done();
                instance.confirmButtonLoading = false;
              });
            } else {
              done();
              row.isOpen = false;
            }
          }
        });
      },
      closeQuan(row) {

        let qnaId = row.ID;
        if (!qnaId) {
          return;
        }


        this.$msgbox({
          title: '提示',
          message: '确认结束此问卷调查吗？',
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = '确定';
              this.$post(`/tax/question/qnaEnd`, {
                qnaId,
                userId: 1
              }).then(data => {
                if (data.success) {
                  this.getTable();
                  this.$message({
                    type: 'success',
                    message: '问卷已结束调查！'
                  });
                } else {
                  this.$message({
                    type: 'error',
                    message: data.message || '操作失败,请重试！'
                  });
                  row.isOpen = true;
                }
              }).finally(x => {
                done();
                instance.confirmButtonLoading = false;
              });
            } else {
              done();
              row.isOpen = true;
            }
          }
        });

      },
      /**
       * 弹出框中进行确认按钮点击 
       * @returns 
       */
      confirmDelete() {
        let qnaId = this.currentDeleteId;
        if (!qnaId) {
          return;
        }
        this.deleteLoading = true;
        this.$post(`/tax/question/deleteQna`, {
          userId: 1,
          qnaId
        }).then(data => {
          if (data.success) {
            this.currentDeleteId = "";
            this.$message({
              message: '作废问卷成功！',
              type: 'success',
            });
            this.isShowPop = false;
            this.getTable(this.currentPage1);
          } else {
            this.$message.error(data.message);
          }
        });
      },
      cancelPop() {
        this.isShowPop = false;
      },
      /**
       * 当前页码改变时 重新请求列表 
       * @returns 
       */
      handleCurrentChange(x) {
        this.getTable(this.currentPage1)
      },

      EditClick(event, row) {
        this.$to('/quan/list/add?detailId=' + row.ID);
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
      detailClick(row) {
        if (row.ID) {
          this.$to("/quan/list/detail?detailId=" + row.ID)
        }
      },
      //页面中用到的方法
      toAdd() {
        this.$to("/quan/list/add");
      },
      getTable() {
        this.$get(`/tax/question/qnaList`, {
          currentPage: this.currentPage1 || 1
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

      /**
       * 获取屏幕可用高度 
       * @returns 
       */
      availHeight() {
        return getWindowHeight() - 100;
      }
    },
    created() {
      // 创建组件实例时钩子函数
      // this.getTable()
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        // 每次进入页面之前进行的操作
        vm.getTable()
      });
    },
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
        // 1-未开启 2-已开启 3-已结束 4-已作废 5-已发送 
        switch (val) {
          // case "0":
          //   str = "未开启";
          //   break;
          case "1":
            str = "未开启";
            break;
          case "2":
            str = "已开启";
            break;
          case "3":
            str = "已结束";
            break;
          case "4":
            str = "已作废";
            break;
          case "5":
            str = "已发送";
            break;
          default:
            str = "";
            break;
        }
        return str;
      }
    }
  }
</script>
<style>
  .el-switch.is-disabled {
    opacity: 0.3;
  }

</style>
