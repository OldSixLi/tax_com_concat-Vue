<!-- 页面描述:企业列表 -->
<template>
</template>
<script>
    // import { mapGetters } from 'vuex';
    export default {
        name: "ComList",
        //对外获取的数据
        props: {},
        data() {
            return {}
        },
        methods: {
            //页面中用到的方法
        },
        created() {
            // 创建组件实例时钩子函数
        },
        mounted() {
            // 挂载到dom后的钩子函数
        },
        watch: {
            //实时监控数据变化
            // data(newValue, oldValue) {
            // }
        },
        beforeRouteEnter(to, from, next) {
            next(vm => {
                // 每次进入页面之前进行的操作
            });
        },
        //实时计算
        computed: {
            // ...mapGetters([
            //     'departmentId'
            // ])
        },
    }
</script>
<style scoped>
</style>