<template>
  <el-dialog title="提示" :visible.sync="dialogVisible">
    <span>{{ msg }}</span>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleClose">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    name: 'ShowResult',
    data() {
      return {
        dialogVisible: true,
        msg: '',
      }
    },
    created() {
      let query = this.$route.query
      this.msg = query.msg
    },
    methods: {
      handleClose() {
        this.dialogVisible = false
        window.opener = null
        window.open('', '_self')
        window.close()
      },
    },
  }
</script>

<style scoped></style>
