<template>
  <div style="overflow-x:hidden;overflow-y:hidden;height: 100%;">
    <!-- 头部 -->
    <header class="topbar">
      <div>
        <!-- 顶部-左侧条 -->
        <div class="topbar-left text-center" :class="{active:showFullWidth}">
          <!-- 公司名称 -->
          <span class="company-name" v-show="showFullWidth">税企通客户管理平台</span>
          <!-- 收缩图标 -->
          <div id="spanicon">
            <input type="checkbox" id="menu36" :checked="!showFullWidth" />
            <label for="menu36" @click="changeSlideState">
                  <div></div>
                  <div></div>
                  <div></div>
                </label>
          </div>
        </div>

        <div class="exit-block" style="">
          <div style="border-radius:50%;border:2px solid #fff;float: left;overflow: hidden;height: 26px;width:26px;">
          <img  class="exit-img" :src="userIcon" alt="退出" title="用户头像"></div>
          <span class="username" style="vertical-align:top;margin-right:10px;">{{userName||""}}</span>
          <img @click="exitClick" class="exit-img" :src="require('@/assets/img/quit.png')" alt="退出" title="退出">
        </div>
        </div>
        <!-- 最近使用开关 -->
        <!-- <div class="topbar-right">
          <span @click="showFullWidth&&(hideTopSlide=!hideTopSlide)">
            <i class="el-icon-rank left-top-icon" style=""></i></span>
        </div> -->
    </header>

    <!-- 左侧菜单 -->
    <aside class="slide" :class="{slidein:showFullWidth,slideout:!showFullWidth}">
      <div class="fix-slide " :class="{active:!hideTopSlide}">
        <el-row :gutter="10">
          <el-col :span="8">
            <div>
              <el-tooltip class="item" effect="light" content="客户管理" placement="top" :enterable="false">
                <i class="el-icon-edit"></i>
              </el-tooltip>
            </div>
          </el-col>
          <el-col :span="8">
            <div>
              <el-tooltip class="item" effect="light" content="系统设置" placement="top" :enterable="false">
                <i class="el-icon-share"></i>
              </el-tooltip>
            </div>
          </el-col>
          <el-col :span="8">
            <div>
              <el-tooltip class="item" effect="light" content="系统设置" placement="top" :openDelay="0" :enterable="false">
                <i class="el-icon-delete"></i>
              </el-tooltip>
            </div>
          </el-col>
          <el-col :span="8">
            <el-tooltip class="item" effect="light" content="系统设置" placement="top" :enterable="false">
              <div>
                <i class="el-icon-edit"></i>
              </div>
            </el-tooltip>
          </el-col>
          <el-col :span="8">
            <el-tooltip class="item" effect="light" content="系统设置" placement="top" :enterable="false">
              <div>
                <i class="el-icon-share"></i>
              </div>
            </el-tooltip>
          </el-col>
          <el-col :span="8">
            <el-tooltip class="item" effect="light" content="系统设置" placement="top" :enterable="false">
              <div>
                <i class="el-icon-delete"></i>
              </div>
            </el-tooltip>
          </el-col>
        </el-row>
      </div>
      <div class="ullist">
        <template v-for="x in menuList">
          <div class="li" :class="{'slide-small':showFullWidth}">
            <!-- 父级 -->
            <a class="title-menu" :class="{active:currentParentId==x.parentId}" @click="parentClick(x.parentId,$event)">
              <span class="icon">
                <i :class="x.icon"></i>
              </span>
              <span class="text" v-show="showFullWidth">{{x.name}}</span>
              <span class="caret"><i class="el-icon-arrow-right"></i></span>
            </a>
            <!-- 子级 -->
            <ul class="child-menu" :class="{active:currentParentId==x.parentId,normal:currentParentId!=x.parentId}">
              <li v-for="y in x.childList" @click="setActiveChild(y.pointName)" :class="{active:currentChildPoint==y.pointName}"
                v-if="y.name">
                <router-link :to="y.action||'/'">{{y.name}}</router-link>
              </li>
            </ul>
          </div>
        </template>
      </div>
    </aside>
    <!-- 页面 -->
    <section class="cont" style="padding:8px;" :class="{'content-small':showFullWidth,'content-large':!showFullWidth}">
      <!-- 导航 -->
      <el-breadcrumb class="app-breadcrumb" separator="/">
        <transition-group name="breadcrumb">
          <el-breadcrumb-item v-for="(item,index) in levelList" v-if="item.meta&&item.meta.title" :key="item.path">
            <span v-if="item.redirect===&quot;noredirect&quot;||index==levelList.length-1" class="no-redirect" :class="{parent:item.redirect===&quot;noredirect&quot;}">{{
              generateTitle(item.meta.title)
              }}
            </span>
            <router-link v-else :to="item.redirect||item.path">{{ generateTitle(item.meta.title) }}</router-link>
          </el-breadcrumb-item>
        </transition-group>
      </el-breadcrumb>
      <!-- 路由 -->
      <transition name="routers">
        <router-view />
      </transition>
    </section>

  </div>
</template>
<script>
  //引入组件样式
  import '@/assets/css/index.css';
  import {
    mapGetters
  } from 'vuex';
  import {
    getWindowHeight
  } from '@/util/dom.js';
  import {
    allMenu
  } from '@/router/index'
  //页面JS部分
  export default {
    name: "App",
    data: function () {
      //组件内数据部分
      return {
        levelList: null,
        currentParentId: 0,
        hideTopSlide: true,
        menuList: [],
        currentChildPoint: "",
        userIcon:""
      }
    },

    computed: {
      ...mapGetters([
        'menurouter',
        'showFullWidth',
        "userName"
      ])
    },
    mounted: function () {
      //组件生成时调用
      this.menuList = this.getSideMenu(this.menurouter);
      this.getBreadcrumb();
    },
    watch: {
      $route() {
        this.getBreadcrumb();
      }
    },
    methods: {
      exitClick() {
        this.$confirm('确定退出本系统吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then(action => {
            this.$store.dispatch('logOut');
          });
      },
      getSideMenu(routerArr) {
        let menuArr = [];
        routerArr.forEach((parent, index) => {
          let point = {
            name: parent.name,
            icon: parent.meta.icon,
            parentId: `${parent.meta.title}-${index}`,
            childList: []
          };
          parent.children.forEach(child => {
            point.childList.push({
              name: child.name,
              pointName: child.meta.funPoint,
              action: child.path
            });
          });
          menuArr.push(point);
        });
        return menuArr;
      },
      generateTitle(txt) {
        return txt;
      },
      getBreadcrumb() {
        let matched = this.$route.matched.filter(item => item.meta && item.meta.title);
        this.levelList = matched;
        let route = matched[matched.length - 1];

        // 页面刷新时正确赋予左侧菜单激活状态
        let currentPoint = "";
        if (route && route.meta && route.meta.funPoint) {
          currentPoint = matched[matched.length - 1].meta.funPoint;
        }
        let totalRoute = this.menuList;
        if (currentPoint) {
          totalRoute.forEach(parent => {
            parent.childList.forEach(child => {
              if (child.pointName == currentPoint) {
                this.currentParentId = parent.parentId;
                this.currentChildPoint = currentPoint;
              }
            });
          });
        }
      },
      /**
       * 一级菜单点击 
       * @returns 
       */
      parentClick(id, e) {
        if (this.showFullWidth) {
          this.currentParentId = this.currentParentId == id ? 0 : id;
        }
      },
      setActiveChild(point) {
        this.currentChildPoint = point;
      },
      /**
       * 改变侧边栏状态 
       * @returns 
       */
      changeSlideState(e) {
        e.stopPropagation();
        this.$store.commit('changeSlideState')
      },
      /**
       * 获取屏幕可用高度 
       * @returns 
       */
      availHeight() {
        return getWindowHeight() - 50;
      }
    }
  }
</script>

<style scoped>
  * {
    padding: 0;
    font-family: "Microsoft YaHei";
    box-sizing: border-box;
  }

  .child-menu {}

  .routers-enter-active {
    /* 动画过渡设置 */
    transition: all .3s;
    transform-origin: top;
  }

  .routers-leave-active {
    /* 动画过渡设置 */
    transition: all 0.1s;
    transform-origin: top;
  }

  .routers-leave {
    opacity: 0;
  }

  .routers-enter-to {
    /* 终止,动画已完成 */
    opacity: 1;
  }

  .routers-leave-to {
    height: 0;
  }

  .routers-enter {
    /* 起始,动画刚开始*/
    opacity: 0;
  }

  /*breadcrumb transition*/

  .breadcrumb-enter-active,
  .breadcrumb-leave-active {
    transition: all .5s;
  }

  .breadcrumb-enter,
  .breadcrumb-leave-active {
    opacity: 0;
    transform: translateX(20px);
  }

  .breadcrumb-move {
    transition: all .5s;
  }

  .breadcrumb-leave-active {
    position: absolute;
  }
  .usericon-img{
border-radius: 50%;
/* border: 2px solid #fff; */
box-shadow:0 0 20px 20px rgba(38,38,38,0.1);
  }
</style>
