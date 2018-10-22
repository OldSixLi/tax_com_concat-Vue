@@ -1,18 +1,17 @@
<template>
  <div class="hello">

    <el-breadcrumb separator="/">
      <!-- <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/note' }">页面说明</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>
    </el-breadcrumb> -->

      <el-row style="margin-top: 10px;">

        <el-col :span="12" :offset="6">

          <h2>表格列表数据</h2>
          <el-row :gutter="10">
            <router-view></router-view>
            <el-col :span="24" :offset="0">
              <!-- <h2>表格列表数据</h2> -->
              <!-- <el-row :gutter="10">
          <el-col :span="10">
            <el-select v-model="sltValue" placeholder="请选择" style="width:100%;">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
@ -25,15 +24,11 @@
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </el-col>

          <el-col :span="4">
            <el-button type="primary" icon="el-icon-search" style="width: 100%;">搜索</el-button>
          </el-col>

        </el-row>

        </el-row> -->
              <el-row style="margin-top: 15px;">

                <p style="" class="table-title">
                  人员管理
                  <el-popover placement="bottom" width="80" v-model="visible2">
                    @ -50,21 +45,41 @@
                  </el-popover>
                </p>

                <el-table border :data="tableData" style="min-width: 100%;" height="400">
                  <el-table :data="tableData" border style="min-width: 100%;" :maxHeight="availHeight()"
                    :row-class-name="tableRowClassName">
                    <el-table-column type="index" width="50" fixed>
                    </el-table-column>
                    <template v-if="colData.indexOf('日期')>-1">
                      <el-table-column prop="date" label="日期" fixed width="100">
                        <el-table-column label="日期" width="100">
                          <span slot-scope="scope">{{scope.row.date}}</span>
                        </el-table-column>
                    </template>
                    <template v-if="colData.indexOf('姓名')>-1">
                      <el-table-column prop="name" label="姓名" width="">
                        <template v-if="colData.indexOf('姓名')>-1">
                          <el-table-column prop="name" label="姓名" min-width="100" align="center">
                          </el-table-column>
                        </template>
                        <template v-if="colData.indexOf('地址')>-1">
                          <el-table-column prop="address" label="地址" align="center" width="600">
                            <el-table-column prop="address" label="地址" align="center" width="300">
                            </el-table-column>
                        </template><template v-if="colData.indexOf('地址')>-1">
                          <el-table-column prop="address" label="地址" align="center" width="300">
                          </el-table-column>
                        </template><template v-if="colData.indexOf('地址')>-1">
                          <el-table-column prop="address" label="地址" align="center" width="300">
                          </el-table-column>
                        </template><template v-if="colData.indexOf('地址')>-1">
                          <el-table-column prop="address" label="地址" align="center" width="300">
                          </el-table-column>
                        </template>

                        <el-table-column fixed="right" label="操作" width="300">
                          <template slot-scope="scope">
                            <el-button @click="handleClick(scope.row)" type="text" size="small">查看啊</el-button>
                            <el-button @click="handleClick(scope.row)" type="text" size="small">查看啊</el-button>
                            <el-button @click="handleClick(scope.row)" type="text" size="small">查看啊</el-button>
                            <el-button @click="handleClick(scope.row)" type="text" size="small">查看啊</el-button>
                            <el-button @click="editClick" type="text" size="small" v-round="true"><i class="el-icon-delete"></i></el-button>
                          </template>
                        </el-table-column>
                  </el-table>
              </el-row>
            </el-col>

            <script>
              import axios from 'axios';
              import {
                getWindowHeight
              } from '@/util/dom.js';
              export default {
                name: 'HelloWorld',
                data() {},

                methods: {
                  tableRowClassName({
                    row,
                    rowIndex
                  }) {
                    row.index = rowIndex;
                  },
                  handleClick(row, index) {
                    // 字符串
                    this.$router.push('/system/add/2');
                  },
                  editClick() {
                    this.$router.push('/system/edit');
                  },
                  getTable() {

                    this.$get('/tax/api/table')
                      .then(
                        data => this.tableData = data,
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
                  // axios.defaults.headers.common['Authorization'] = "666666";
                  this.getTable();
                  this.getOption();
                }
              }

            </script>

            <style scoped>
              h1,
              h2 {
                font-weight: normal;
                font-size: 25px;
                text-align: center;
              }

              .hello {
                padding: 10px;
              }

              ul {
                list-style-type: none;
                padding: 0;
              }

              a {
                color: #42b983;
              }

              .grid-content {
                border: 1px solid #ddd;
              }

              .table-title {
                border: 1px solid #ddd;
                border-bottom: none;
                background-color: #f9f7f7;
                position: relative;
              }

            </style>
