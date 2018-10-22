<template>
  <div class="router-block">
    <mt-header fixed title="">
      <mt-button icon="back" @click="topBack" slot="left">设置{{roleName||"角色"}}</mt-button>
      <mt-button slot="right" @click="setUser">保存</mt-button>
    </mt-header>
    <div class="page-content">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
  import {
    mapGetters
  } from 'vuex';

  export default {
    name: "Role",
    data() {
      //组件内数据部分
      return {
        departList: [],
        departObj: [],
        activeId: 1,
        activeArr: []
      }
    },
    computed: {
      ...mapGetters([
        'departmentId',
        'checkValue',
        'roleId',
        'roleName'
      ])
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {});
    },
    created() {
      this.getDepartment();
    },
    methods: {
      /**
       * 为角色设置员工 
       * @returns 
       */
      setUser() {
        if (!this.checkValue) {
          this.$tip("您还未选择员工");
        } else {
          // this.$tip(this.checkValue);
          let roleId = this.roleId;
          let userId = this.checkValue;
          this.$get(`/self/saveOrUpdateUserRole`, {
            userId,
            roleId
          }).then(data => {
            if (data.success) {
              this.$tip("设置成功");
              this.$to("/system/role");
            } else {
              this.$alert(data.message);
            }
          })
        }
      },
      /**
       * 返回 
       * @returns 
       */
      topBack() {
        this.$to("/system/role");
      },
      /**
       * 扁平部门数组转树形结构 
       * @returns 
       */
      filterArray(data, id) {
        var fa = function (parentid) {
          var _array = [];
          for (var i = 0; i < data.length; i++) {
            var n = data[i];
            if (n.parentid === parentid) {
              n.children = fa(n.id);
              _array.push(n);
            }
          }
          return _array;
        }
        return fa(id);
      },
      /**
       * 获取当前架构 
       * @returns 
       */
      getDepartment() {
        this.$get("/self/getDepartments").then(
          data => {
            if (data.success) {
              data.bean.departments.sort((a, b) => {
                return a.id - b.id;
              });
              let tree = this.filterArray(data.bean.departments, 0)
              this.departList = data.bean.departments;
              this.departObj = tree;
              this.$store.commit("setComTree", tree);
              this.$store.commit("setwxComTree", data.bean.departments)
            }
          }
        )
      },
      /**
       * 获取某个部门的父级 
       * @returns 
       */
      getParents(id) {
        if (id == 0) {
          return false;
        }
        for (var i = 0; i < this.departList.length; i++) {
          let element = this.departList[i];
          if (element.id == id) {
            this.activeArr.push(id);
            return this.getParents(element.parentid);
          }
        }
      }
    },
    watch: {
      departmentId() {
        this.activeArr = [];
        this.getParents(this.departmentId);
      }
    },
  }

</script>
<style>
  .page-content {
    background-color: #fff;
  }

</style>
