<!-- 页面描述:消息回执查询页面 -->
<template>

  <div>
    <!-- <h2>回执列表</h2>  -->
    <!-- <table></table> -->
    <el-col :span="22" :offset="1">
      <h2>回执列表</h2>
      <el-row style="margin-top: 15px;">
        <p class="table-title text-right">
          <span style="float:left;line-height: 35px;">回执列表</span>
          <el-button type="primary" size="small" @click="backList">返回消息列表</el-button>
        </p>

<!-- 
        entName: "神州浩天科技有限公司"
name: "马少博"
roleName: "普通用户"
time: 1539917622000
userId: 24 -->
        <el-table ref="tableSet" border :data="tableData" style="min-width: 100%;" :maxHeight="availHeight()"
          :row-class-name="tableRowClassName">
          <el-table-column type="index" width="50" fixed align="center">
          </el-table-column>
          <el-table-column prop="name" label="名称">
          </el-table-column>
          <el-table-column prop="entName" label="所属公司">
          </el-table-column>
          <el-table-column prop="roleName" label="身份">
          </el-table-column>
          <el-table-column label="查看时间" align="center">
            <template slot-scope="scope">
              {{scope.row.time|toTime}}
            </template>
          </el-table-column>
        </el-table>
        <div style="margin-top:15px;">
          <el-pagination style="float:right;" @current-change="handleCurrentChange" :current-page.sync="currentPage1"
            layout="total, prev, pager, next" background :page-count="totalPage" :total="totalNum" v-show="totalPage>0">
          </el-pagination>
        </div>
      </el-row>
    </el-col>
  </div>


</template>
<script>
  import {
    getWindowHeight
  } from '@/util/dom.js';
  import {
    toNormalTime,
    toTimestamp
  } from '@/util/helper.js';
  // import { mapGetters } from 'vuex';
  export default {
    name: "ReadBack",
    //对外获取的数据
    props: {},
    data() {
      return {
        msgId: "",
        tableData: [],
        currentPage:1,
        totalPage:0,
        totalNum:0
      }
    },
    methods: {
      //页面中用到的方法
      backList() {
        this.$to('/message/list')
      },
      /**
       * 获取屏幕可用高度 
       * @returns 
       */
      availHeight() {
        return getWindowHeight() - 100;
      },
      getTable(messageId=this.msgId,currentPage = this.currentPage) {
        this.$post(`/tax/message/receiptList`, {
          messageId,
          currentPage
        }).then(data => {
          if (data.success) {
            this.tableData = data.bean.data;
            this.totalPage = data.bean.pageCount;
            this.currentPage = data.bean.pageNum;
            this.totalNum = data.bean.rowCount;
          } else {
            this.tableData = [];
          }
        })
      }
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        // 每次进入页面之前进行的操作
        let param = to.params;
        console.log("■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■");
        console.log(param);
        console.log(param.id);
        console.log("■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■");
        if (param.id) {
          vm.msgId = param.id;
          vm.getTable();
        } else {
          this.$message("缺少必要参数");
          this.$to("/message/list");
        }
      });
    },
    //实时计算
    computed: {
      // ...mapGetters([
      //     'departmentId'
      // ])
    }, filters: {
      /**
       * 转换时间 
       */
      toTime(time) {
        return toNormalTime(time);
      },}
  }
</script>
<style scoped>
</style>