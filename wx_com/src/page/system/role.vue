<template>
  <div class="router-block">
    <mt-header fixed title="">
      <mt-button icon="back" @click="topBack" slot="left">{{"角色管理"}}</mt-button>
    </mt-header>
    <div class="page-content">
      <mt-cell v-for="x in roleList" :key="x.id" :title="x.roleName" is-link class="cell-li" @click.native="toUser(x.roleId,x.userId,x.userName,x.roleName)">
        <span style="color: #2b86c7">{{x.userName||"未设置"}}</span>
      </mt-cell>
    </div>
  </div>
</template>
<script>
  export default {
    name: "Role",
    data() {
      return {
        roleList: []
      }
    }, 
    methods: {
      topBack() {
        this.$to("/");
      },
      /**
       * 获取角色对应的UserId 
       * @returns 
       */
      getUserRoles() {
        this.$get(`/self/getRoleUser`).then(data => {
          if (data.success) {
            this.roleList = data.bean;
          } 
        })
      },
      toUser(roleId, userId, name, roleName) {
        this.$store.commit("changeCheckValue", userId);
        this.$store.commit("changeCurrentSelectRole", roleId);
        this.$store.commit("changeRoleName", roleName);
        this.$to(`/system/user/depart/1`);
      }
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.getUserRoles();
      })
    }
  }
</script>
<style>
</style>
