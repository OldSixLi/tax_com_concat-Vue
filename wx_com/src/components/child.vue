<template>
  <div>
    <mt-button size="small" icon="back" @click="backParent" v-if="parentName">{{parentName}}</mt-button>
    <p style="padding:0 1rem;font-weight:bold;" v-if="wxComTree[0]&&wxComTree[0].id==departId">{{wxComTree[0].name}}</p>
    <span v-if="childList.length>0" class="mint-radiolist-title" style="margin-bottom:0.2rem;">子部门</span>
    <ul v-if="childList.length>0" style="padding-left:0;margin-top: 0;">
      <li class="li-child" v-for="x in childList" @click="toChild(x.id)">
        <img src="@/assets/img/group-icon.png">{{x.name}}
      </li>
    </ul>
  </div>
</template>
<script>
  import {
    mapGetters
  } from 'vuex';
  export default {
    name: "Child",
    props: {
      departId: ""
    },
    computed: {
      ...mapGetters([
        'companyTree',
        'wxComTree',
        'checkValue'
      ]),

    },
    data: function () {
      //组件内数据部分
      return {
        childList: [],
        parentArr: [],
        parentId: "",
        parentName: ""
      }
    },
    mounted: function () {
      //组件生成时调用
      if (this.departId) {
        this.resolveList();
      }
    },
    methods: {
      backParent() {
        let id = this.parentId || 1;
        this.$to(`/system/user/depart/${id}`);
      },
      toChild(id) {
        if (id) {
          this.$to(`/system/user/depart/${id}`);
        }
      },
      resolveList() {
        let totalArr = this.wxComTree;
        let id = this.departId;
        this.childList = totalArr.filter(element => {
          if (element.id == this.departId) {
            this.parentArr[0] = element; // 获取到了自己的名称
            this.parentId = element.parentid; // 获取到了父级元素ID
          }
          return element.parentid == this.departId;
        });
        this.parentName = this.departId == 1 || this.departId == "1" ? "" : this.parentArr[0] && this.parentArr[0].name;
      },
      getParent() {}
    },
    watch: {
      wxComTree(newValue, oldValue) {
        this.resolveList();
      },
      departId() {
        this.resolveList();
      }
    },

  }
</script>
<style scoped>
  li {
    list-style: none;
    line-height: 4.5rem;
    font-weight: 800;
  }

  .li-child:first-child {
    border-top: 1px solid #ddd;
  }

  .li-child {
    padding: 0 1rem;
    border-bottom: 1px solid #ddd;
  }

  .li-child>img {
    height: 2rem;
    width: 2rem;
    top: 0.4rem;
    position: relative;
    margin-right: 0.5rem;
  }
</style>