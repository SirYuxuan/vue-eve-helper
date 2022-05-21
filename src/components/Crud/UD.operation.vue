<template>
  <div>
    <el-button
      :loading="crud.status.cu === 2"
      :disabled="disabledEdit"
      size="mini"
      type="primary"
      icon="el-icon-edit"
      @click="crud.toEdit(data)"
    />
    <el-popover
      v-model="pop"
      placement="top"
      width="180"
      style="margin-left: 2px"
      trigger="manual"
      @show="onPopoverShow"
      @hide="onPopoverHide"
    >
      <p>{{ msg }}</p>
      <div style="margin: 0;text-align: right;">
        <el-button size="mini" type="text" @click="doCancel">取消</el-button>
        <el-button
          :loading="crud.dataStatus[crud.getDataId(data)].delete === 2"
          type="primary"
          size="mini"
          @click="crud.doDelete(data)"
        >
          确定
        </el-button>
      </div>
      <el-button
        slot="reference"
        :disabled="disabledDle"
        type="danger"
        icon="el-icon-delete"
        size="mini"
        @click="toDelete"
      />
    </el-popover>
  </div>
</template>
<script>
  import CRUD, { crud } from './crud'
  export default {
    name: 'UdOperation',
    mixins: [crud()],
    props: {
      data: {
        type: Object,
        required: true,
      },
      permission: {
        type: Object,
        required: true,
      },
      disabledEdit: {
        type: Boolean,
        default: false,
      },
      disabledDle: {
        type: Boolean,
        default: false,
      },
      msg: {
        type: String,
        default: '确定删除本条数据吗？',
      },
    },
    data() {
      return {
        pop: false,
      }
    },
    methods: {
      doCancel() {
        this.pop = false
        this.crud.cancelDelete(this.data)
      },
      toDelete() {
        this.pop = true
      },
      [CRUD.HOOK.afterDelete](crud, data) {
        if (data === this.data) {
          this.pop = false
        }
      },
      onPopoverShow() {
        setTimeout(() => {
          document.addEventListener('click', this.handleDocumentClick)
        }, 0)
      },
      onPopoverHide() {
        document.removeEventListener('click', this.handleDocumentClick)
      },
      handleDocumentClick(event) {
        this.pop = false
      },
    },
  }
</script>
