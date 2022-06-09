<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input
          v-model="query.blurry"
          clearable
          size="small"
          placeholder="输入商品名称、类型搜索"
          style="width: 200px"
          class="filter-item"
          @keyup.enter.native="crud.toQuery"
        />
        <rrOperation />
      </div>

      <crudOperation :permission="permission"></crudOperation>
    </div>
    <!--表单组件-->
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :before-close="crud.cancelCU"
      :visible.sync="crud.status.cu > 0"
      :title="crud.status.title"
      width="500px"
    >
      <el-form
        ref="form"
        :inline="false"
        :rules="rules"
        :model="form"
        size="small"
        label-width="80px"
      >
        <el-form-item label="任务分组" prop="groupName">
          <el-input v-model="form.groupName" />
        </el-form-item>
        <el-form-item label="任务名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>

        <el-form-item label="CORN" prop="cron">
          <el-input v-model="form.cron" />
        </el-form-item>
        <el-form-item label="任务类" prop="clazz">
          <el-input v-model="form.clazz" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="crud.cancelCU">取消</el-button>
        <el-button
          :loading="crud.status.cu === 2"
          type="primary"
          @click="crud.submitCU"
        >
          确认
        </el-button>
      </div>
    </el-dialog>
    <!--表格渲染-->
    <el-table
      ref="table"
      v-loading="crud.loading"
      :data="crud.data"
      row-key="id"
      class="rounded-head"
      @sort-change="crud.toSort"
      @select="crud.selectChange"
      @select-all="crud.selectAllChange"
      @selection-change="crud.selectionChangeHandler"
    >
      <el-table-column prop="groupName" label="任务分组" width="120" />
      <el-table-column
        prop="name"
        label="任务名称"
        width="350"
        sortable="custom"
      />
      <el-table-column prop="cron" label="CRON" width="120" sortable="num" />
      <el-table-column prop="clazz" label="任务执行类" />
      <el-table-column prop="status" label="状态" width="120">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 'NORMAL'" type="success">
            正常
          </el-tag>
          <el-tag v-if="scope.row.status === 'PAUSED'" type="warning">
            暂停
          </el-tag>
          <el-tag v-if="scope.row.status === 'COMPLETE'" type="success">
            完成
          </el-tag>

          <el-tag v-if="scope.row.status === 'ERROR'" type="danger">
            错误
          </el-tag>
          <el-tag v-if="scope.row.status === 'BLOCKED'" type="danger">
            堵塞
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip label="操作" width="115">
        <template slot-scope="scope">
          <udOperation :data="scope.row" :permission="permission">
            <template slot="left">
              <el-button
                type="primary"
                icon="el-icon-video-play"
                size="mini"
                @click="runJob(scope.row)"
              ></el-button>
            </template>
          </udOperation>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import crudQuartz from '@/api/database/quartz'
  import CRUD, { presenter, header, form, crud } from '@/components/Crud/crud'
  import CrudOperation from '@/components/Crud/CRUD.operation'
  import RrOperation from '@/components/Crud/RR.operation'
  import Pagination from '@/components/Crud/Pagination'
  import UdOperation from '@/components/Crud/UD.operation'

  const defaultForm = { clazz: null, cron: null, name: null, groupName: null }
  export default {
    name: 'Dept',
    components: { CrudOperation, RrOperation, UdOperation, Pagination },
    cruds() {
      return CRUD({
        title: '定时任务',
        url: 'quartz',
        crudMethod: { ...crudQuartz },
      })
    },
    mixins: [presenter(), header(), form(defaultForm), crud()],
    // 设置数据字典
    data() {
      return {
        rules: {
          clazz: [
            { required: true, message: '请输入任务执行类', trigger: 'blur' },
          ],
          cron: [
            { required: true, message: '请输入CRON表达式', trigger: 'blur' },
          ],
          name: [
            { required: true, message: '请输入任务名称', trigger: 'blur' },
          ],
          groupName: [
            { required: true, message: '请输入任务分组', trigger: 'blur' },
          ],
        },
        permission: {
          add: ['user:add'],
          edit: ['none'],
          del: ['user:del'],
        },
      }
    },
    created() {
      this.crud.delObj = true
    },
    methods: {
      runJob(row) {
        this.$confirm('您确定要执行此任务吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          crudQuartz.runJob(row.groupName, row.name).then((res) => {
            this.$baseMessage('任务开始执行', 'success')
          })
        })
      },
    },
  }
</script>
