<template>
  <!-- <p>进入首页中</p> -->
</template>
<script>
  import { mapGetters } from 'vuex';
  import { redirectUrl } from '@/_config/index.js';
  import { Indicator } from 'mint-ui';
  let storage = window.localStorage;
  export default {
    name: "First",
    data() {
      return {
        auth: redirectUrl,
        path: ""
      }
    },
    computed: {
      ...mapGetters([
        'companyId', 'comUserId'
      ])
    },
    mounted: function () {
      Indicator.open();
    },
    methods: {
      toSetAuth() {
        window.location.href =
          `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxa059996e5d72516b&redirect_uri=${encodeURIComponent(this.auth)}&response_type=code&scope=snsapi_base&agentid=1000009&state=STATE#${to.query.path}`;
      }
    },
    created() {
      let param = this.$param(this);
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        try {
          storage.setItem('isTokenFail', '0')
          if (to.query && to.query.path) {
            vm.path = to.query.path;
            window.location.href =
              `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxa059996e5d72516b&redirect_uri=${encodeURIComponent(vm.auth)}&response_type=code&scope=snsapi_base&agentid=1000009&state=${to.query.path}`;
          } else {
            window.location.href =
              `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxa059996e5d72516b&redirect_uri=${encodeURIComponent(vm.auth)}&response_type=code&scope=snsapi_base&agentid=1000009`;
          }
        } catch (error) {
          // alert(error);
        }
      });
    }
  }
</script>
