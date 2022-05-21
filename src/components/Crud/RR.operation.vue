<!--搜索与重置-->
<template>
  <span class="rr-operation">
    <el-button
      class="filter-item"
      size="mini"
      type="success"
      icon="el-icon-search"
      @click="crud.toQuery"
    >
      搜索
    </el-button>
    <el-button
      v-if="crud.optShow.reset"
      class="filter-item"
      size="mini"
      type="warning"
      icon="el-icon-refresh-left"
      @click="crud.resetQuery()"
    >
      重置
    </el-button>
  </span>
</template>
<script>
  import { crud } from './crud'
  export default {
    name: 'RrOperation',
    mixins: [crud()],
    props: {
      itemClass: {
        type: String,
        required: false,
        default: '',
      },
    },
  }
</script>
<style scoped>
.rr-operation{
  margin-left: 10px;
}
</style>
