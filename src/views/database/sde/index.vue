<template>
  <div class="app-container">
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input
          v-model="query.blurry"
          clearable
          size="mini"
          placeholder="输入标题搜索"
          style="width: 200px"
          class="filter-item"
          @keyup.enter.native="crud.toQuery"
        />
        <rr-operation />
      </div>
      <crud-operation :permission="permission" />
    </div>

    <el-table
      ref="table"
      v-loading="crud.loading"
      :data="crud.data"
      @selection-change="crud.selectionChangeHandler"
    >
      <el-table-column
        show-overflow-tooltip
        :selectable="checkboxT"
        type="selection"
      />
      <el-table-column show-overflow-tooltip prop="title" label="标题" />
      <el-table-column show-overflow-tooltip prop="url" label="下载地址" />

      <el-table-column
        show-overflow-tooltip
        prop="localPath"
        label="本地地址"
      />
      <el-table-column show-overflow-tooltip prop="isUse" label="是否使用">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isUse"
            :disabled="scope.row.isUse"
            active-color="#409EFF"
            inactive-color="#F56C6C"
            @change="changeEnabled(scope.row, scope.row.enabled)"
          />
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip label="操作" width="115">
        <template slot-scope="scope">
          <udOperation
            :data="scope.row"
            :permission="permission"
            :disabled-del="scope.row.isUse"
          >
            <template slot="left">
              <el-button
                icon="el-icon-search"
                type="primary"
                size="mini"
                @click="showSde(scope.row)"
              />
            </template>
          </udOperation>
        </template>
      </el-table-column>
    </el-table>
    <pagination />

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
        inline
        :model="form"
        :rules="rules"
        size="small"
        label-width="80px"
      >
        <el-form-item label="SDE标题" prop="title">
          <el-input v-model="form.title" style="width: 370px" />
        </el-form-item>
        <el-form-item label="SDE文件" prop="url">
          <el-upload
            ref="upload"
            :multiple="false"
            accept=".zip"
            name="attach"
            :limit="1"
            :on-progress="progress"
            :on-exceed="exceed"
            :action="baseURL + 'sde/upload'"
            :file-list="fileList"
            :on-success="uploadSuccess"
            :auto-upload="false"
          >
            <el-button slot="trigger" size="small" type="primary">
              选取文件
            </el-button>
            <el-button
              style="margin-left: 10px"
              :loading="uploadLoading"
              size="small"
              type="success"
              @click="submitUpload"
            >
              上传到服务器
            </el-button>
            <div slot="tip" class="el-upload__tip">
              只能上传zip文件，且不超过200MB
              <br />
              下载地址:
              <a
                target="_blank"
                href="https://developers.eveonline.com/resource"
              >
                https://developers.eveonline.com/resource
              </a>
            </div>
          </el-upload>
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

    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :visible.sync="sdeDialog"
      :title="sdeDialogTitle"
      width="1000px"
    >
      <el-row>
        <el-col :span="8">
          <file-tree :id="sdeId" :node-click="nodeClick" />
        </el-col>
        <el-col :span="16">
          <yaml-edit :value="ymlVal" height="485px" />
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<style>
  .CodeMirror-wrap {
    overflow: hidden !important;
  }
</style>
<script>
  import CRUD, { presenter, header, form, crud } from '@/components/Crud/crud'
  import CrudOperation from '@/components/Crud/CRUD.operation'
  import RrOperation from '@/components/Crud/RR.operation'
  import Pagination from '@/components/Crud/Pagination'
  import UdOperation from '@/components/Crud/UD.operation'
  import crudSde, { startSde } from '@/api/database/sde'
  import { baseURL } from '@/config/setting.config'
  import FileTree from '@/components/YxFileTree'
  import YamlEdit from '@/components/YamlEdit'
  import { doGet } from '@/api/crud/crud'
  import Vue from 'vue'
  let defaultForm = {
    title: null,
    url: null,
    localPath: null,
  }

  export default {
    name: 'SDE',
    components: {
      YamlEdit,
      FileTree,
      RrOperation,
      CrudOperation,
      Pagination,
      UdOperation,
    },
    cruds() {
      return CRUD({ title: 'SDE', url: 'sde', crudMethod: crudSde })
    },
    mixins: [presenter(), header(), form(defaultForm), crud()],
    data() {
      return {
        sdeId: null,
        sdeDialogTitle: null,
        sdeDialog: false,
        ymlVal: '',
        uploadLoading: false,
        baseURL: baseURL,
        fileList: [],
        rules: {
          title: [
            { required: true, message: '请输入SDE标题', trigger: 'blur' },
          ],
          url: [{ required: true, message: '请上传SDE文件', trigger: 'blur' }],
        },
        permission: {
          add: ['sde:add'],
          edit: ['none'],
          del: ['sde:del'],
        },
      }
    },
    created() {
      this.crud.optShow.edit = false
      this.crud.optShow.download = false
    },
    methods: {
      checkboxT(row) {
        return !row.isUse
      },
      changeEnabled(data, val) {
        this.$confirm(
          '此操作将会重新清洗系统内缓存的SDE数据,是否确定？',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
        )
          .then(() => {
            let LoadIndex = Vue.prototype.$baseLoading(6)
            startSde(data.id)
              .then((res) => {
                LoadIndex.close()
                this.$baseMessage('SDE启动成功', 'success')
              })
              .catch((e) => {
                data.isUse = !data.isUse
                LoadIndex.close()
              })
          })
          .catch(() => {
            data.isUse = !data.isUse
          })
      },
      nodeClick(data, node) {
        if (data.isFile) {
          let path = node.data.title
          let parent = node.parent
          while (parent && parent.data) {
            path = parent.data.title + '/' + path
            parent = parent.parent
          }
          let LoadIndex = Vue.prototype.$baseLoading(6)
          doGet('sde/getFileContent', { id: this.sdeId, catalogue: path })
            .then((res) => {
              this.ymlVal = res.data
              LoadIndex.close()
            })
            .catch((ex) => {
              LoadIndex.close()
            })
        }
      },
      showSde(row) {
        this.sdeId = row.id
        this.sdeDialogTitle = row.title
        this.sdeDialog = true
      },
      [CRUD.HOOK.afterAddCancel](crud, form) {
        form.url = null
        form.localPath = null
        this.$refs.upload.clearFiles()
      },
      progress(event, file, fileList) {},
      uploadSuccess(resp) {
        this.uploadLoading = false
        if (resp.code !== 200) {
          this.$baseMessage('上传失败：' + resp.msg, 'error')
          this.$refs.upload.clearFiles()
          this.form.url = null
          this.form.localPath = null
          return
        }
        this.form.url = resp.data.url
        this.form.localPath = resp.data.localPath
        console.log(this.form)
      },
      exceed() {
        this.$baseMessage(
          '最多只能上传一个文件,如需修改文件请先移除当前文件',
          'error'
        )
      },
      submitUpload() {
        this.$refs.upload.submit()
      },
    },
  }
</script>
