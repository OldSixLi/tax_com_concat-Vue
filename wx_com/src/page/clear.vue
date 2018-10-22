<template>
  <mt-button @click="clear"> 清除数据</mt-button>
</template>
<script>
    export default {
        name: "Clear",
        methods:{
            clear(){
                localStorage.clear();
            }
        } 
    }
</script>
<style scoped> 

</style>