<template>
    <router-link v-bind="$attrs" :to="to">
      <el-link :type="type" :underline="underline" :disabled="disabled">
        <slot></slot>
      </el-link>
    </router-link>
  </template>
  
  <script>
  export default {
    name: 'RouterElLink',
    props: {
      to: {
        type: [String, Object],
        required: true
      },
      type: {
        type: String,
        default: ''
      },
      underline: {
        type: Boolean,
        default: true
      },
      disabled: {
        type: Boolean,
        default: false
      }
    }
  }
  </script>
  
  <style scoped>
  /* 可以在这里添加一些自定义样式 */
  </style>