<template>
  <div>
    <!-- 部门名称 -->
    <li @click="liItemClick(x.id)" class="li-header">
      <span v-if="includeId(activeArr)">↓</span>
      <span v-if="!includeId(activeArr)">+</span>
      {{""+x.name}}  
    </li>
    <template>
        <ul class="userList" v-show="isShowUser">
          <mt-radio name="users" align="right" class="page-part" title="部门员工" v-model="userVal" :options="userList">
          </mt-radio>
        </ul>
      </template>
    <!-- 子部门列表 -->
    <template v-if="x.children">
      <ul :class="{'active':includeId(activeArr)}" class="showChildList">
        <d-item v-for="(y,$index) in x.children" :x="y" :activeArr="activeArr" :key="$index"></d-item>
      </ul>
    </template>
    
  </div>
</template>
<script>
  import {
    mapGetters
  } from 'vuex';
  const NAMES = ['Aaron', 'Alden']
  export default {
    name: "DepartItem",
    props: {
      x: Object,
      activeArr: Array
    },
    computed: {
      ...mapGetters([
        'departmentId',
        'checkValue'
      ]),
      isShowUser() {
        return this.includeId(this.activeArr) && this.activeArr.indexOf(this.x.id) == 0;
      }
    },
    data: function () {
      return {
        isClicked: false,
        userList: [],
        alphabet: [],
        userVal:""
      }
    },
    mounted: function () {},
    created() {
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(initial => {
        let cells = NAMES.filter(name => name[0] === initial);
        this.alphabet.push({
          initial,
          cells
        });
      });
    },
    watch: {
      userVal(newValue, oldValue) {
        if(this.userVal){
          this.$store.commit("changeCheckValue",this.userVal);
        }
      },
      checkValue(){
        if(this.checkValue!=this.userVal&&this.userVal){
          this.userVal="";
        }
        if(this.checkValue==""){
          this.userVal="";
        }
      }
    },
    methods: {
      includeId(arr) {
        return arr.indexOf(this.x.id) > -1;
      },
      liItemClick(id) {
        let index = this.activeArr.indexOf(id);
        if (index > -1) {
          this.$store.commit('changeActiveDepartId', this.activeArr[index + 1])
        } else {
          this.$store.commit('changeActiveDepartId', id);
          if (!this.isClicked) {
            this.$get(`/api/userlist/${id}`).
            then(data => {
              data.userlist.forEach(element => {
                element.label = element.name;
                element.value = element.userid;
              });
              this.userList = data.userlist;

            })
            this.isClicked = true;
          }
        }

        // if(!this.isClicked){

        // this.isClicked=true;
        // }
      }
    }
  }
</script>
<style scoped>
  .showChildList {
    display: none;
  }

  .showChildList.active {
    display: block;
  }

  li {
    list-style: none;
  }
  .li-header{
    line-height: 3rem;
    font-size: 1.4rem;
    border:1px solid #ddd;
  }
  ul{
    margin:0 0 0 0.5rem;
    padding: 0;
  }
</style>