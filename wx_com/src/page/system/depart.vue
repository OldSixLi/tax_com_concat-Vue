<template>
  <div class="router-block" style="padding-top:0.5rem;">
    <child :departId="departId"></child>
    <template v-if="userlist.length>0">
      <mt-radio name="users" align="right" class="page-part" title="部门员工" v-model="userVal" :options="userlist">
      </mt-radio>
    </template>
    <template v-if="userlist.length==0">
      <p class="text-center">
        <span v-if="loading">加载中...</span>
        <span v-if="!loading">该部门下没有成员</span>
      </p>
    </template>
  </div>
</template>
<script>
  import child from "@/components/child.vue";
  import {
    mapGetters
  } from 'vuex';

  export default {
    name: "Role",
    components: {
      child
    },
    computed: {
      ...mapGetters([
        'departmentId',
        'checkValue',
        'roleId'
      ])
    },
    data() {
      //组件内数据部分
      return {
        departId: "",
        userlist: [],
        userVal: "",
        loading: true
      }
    },
    mounted() {
      let param = this.$param(this);
      this.departId = param.departId || "1";
      this.getUsers();
    }, 
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.departId = to.params.departId;
        vm.userlist = [];
        vm.loading = true;
        if (vm.checkValue) {
          vm.userVal = vm.checkValue;
        }
        vm.getUsers();
      });
    },
    beforeRouteUpdate(to, from, next) {
      //在ID改变时重新获取一次用户信息
      if (to.params.departId && this.departId != to.params.departId) {
        this.departId = to.params.departId;
        next();
        this.userlist = [];
        this.loading = true;
        if (this.checkValue) {
          this.userVal = this.checkValue;
        }
        this.getUsers();
      }
    },
    methods: {
      topBack() {
        this.$to("/");
      },
      toUser() {
        this.$to("/system/user")
      },

      /**
       * 隐藏手机号中间几位
       *
       * @returns
       */
      resolvePhone(phone) {
        let x = phone.toString().split('');
        x.splice(3, 4, '****');
        return x.join('');
      },
      getUsers() {
        this.$get(`/self/getEmployee`, {
          departmentId: this.departId
        }).
        then(data => {
            let dataArr = [];
            if (data.success) {
              if (data.bean && data.bean.employee && data.bean.employee.length) {
                data.bean.employee.forEach(x => {
                  let obj = {
                    label: `${x.name.length==2?x.name+'　':x.name}  ${x.mobile?this.resolvePhone(x.mobile):""}`,
                    value: x.userid
                  }
                  dataArr.push(obj)
                });
                dataArr.sort((a, b) => {
                  return a.label.localeCompare(b.label, 'zh')
                })
              }
            }
            this.userlist = dataArr;
            this.loading = false;
          },
          err => {
            this.loading = false;
          })
      }
    },
    watch: {
      userVal(newValue, oldValue) {
        if (this.userVal) {
          this.$store.commit("changeCheckValue", this.userVal);
        }
      },
      checkValue() {
        if (this.checkValue != this.userVal && this.userVal) {
          this.userVal = "";
        }
        if (this.checkValue == "") {
          this.userVal = "";
        }
      }
    },
  }
</script>
