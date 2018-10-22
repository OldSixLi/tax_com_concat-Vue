<template>
  <el-button :type="type">
    <slot></slot>
  </el-button>
</template>

<script>
  export default {
    name: 'HtButton',
    props: {
      type: {
        type: String,
        default: 'default'
      },
      size: String,
      icon: {
        type: String,
        default: ''
      },
      loading: Boolean,
      disabled: Boolean,
    },

  }
</script>