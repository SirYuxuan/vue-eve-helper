<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :xs="9" :sm="6" :md="5" :lg="4" :xl="4">
        <div class="head-container">
          <el-input
            v-model="blurry"
            clearable
            size="small"
            placeholder="输入部门名称搜索"
            prefix-icon="el-icon-search"
            class="filter-item"
            @input="getDeptData"
          />
        </div>
        <el-tree
          :data="deptData"
          :load="getDeptData"
          :props="defaultProps"
          :expand-on-click-node="false"
          lazy
          @node-click="handleNodeClick"
        />
      </el-col>
      <el-col :xs="15" :sm="18" :md="19" :lg="20" :xl="20">
        <div class="head-container">
          <div v-if="crud.props.searchToggle">
            <!-- 搜索 -->
            <el-input
              v-model="query.blurry"
              clearable
              size="mini"
              placeholder="输入名称或者邮箱搜索"
              style="width: 200px"
              class="filter-item"
              @keyup.enter.native="crud.toQuery"
            />
            <rr-operation />
          </div>
          <crud-operation :permission="permission"/>
        </div>

        <el-table
          ref="table"
          v-loading="crud.loading"
          :data="crud.data"
          @selection-change="crud.selectionChangeHandler"
        >
          <el-table-column show-overflow-tooltip type="selection" />
          <el-table-column
            show-overflow-tooltip
            prop="username"
            label="用户名"
          />
          <el-table-column show-overflow-tooltip prop="nickname" label="昵称" />
          <el-table-column show-overflow-tooltip prop="sex" label="性别">
            <template slot-scope="scope">
              <span v-if="scope.row.sex === 0">女</span>
              <span v-else-if="scope.row.sex === 1">男</span>
              <span v-else>未知</span>
            </template>
          </el-table-column>

          <el-table-column show-overflow-tooltip prop="phone" label="手机号" />
          <el-table-column show-overflow-tooltip prop="email" label="邮箱" />
          <el-table-column prop="dept" label="部门">
            <template slot-scope="scope">
              <div>{{ scope.row.dept.name || '' }}</div>
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center" prop="enabled">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.enabled"
                @change="changeEnabled(scope.row, scope.row.enabled)"
              />
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label="操作" width="115">
            <template slot-scope="scope">
              <udOperation :data="scope.row" :permission="permission" />
            </template>
          </el-table-column>
        </el-table>
        <pagination />
      </el-col>
    </el-row>
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :before-close="crud.cancelCU"
      :visible.sync="crud.status.cu > 0"
      :title="crud.status.title"
      width="590px"
    >
      <el-form
        ref="form"
        :inline="true"
        :model="form"
        :rules="rules"
        size="small"
        style="padding-right: 0"
        label-width="65px"
        label-position="right"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" />
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model.number="form.phone" />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="form.nickname" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" />
        </el-form-item>
        <el-form-item label="部门" prop="deptId">
          <treeselect
            v-model="form.deptId"
            :options="depts"
            :load-options="loadDepts"
            style="width: 200px"
            placeholder="选择部门"
          />
        </el-form-item>
        <el-form-item label="岗位" prop="jobs">
          <el-select
            v-model="form.post"
            style="width: 200px"
            multiple
            disabled
            placeholder="暂不开放"
          ></el-select>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="form.sex" style="width: 200px">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.enabled">
            <el-radio :key="1" :label="true">启用</el-radio>
            <el-radio :key="2" :label="false">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item style="margin-bottom: 0" label="角色" prop="roles">
          <el-select
            v-model="roleDatas"
            style="width: 465px"
            multiple
            placeholder="请选择"
            @remove-tag="deleteTag"
            @change="changeRole"
          >
            <el-option
              v-for="item in roles"
              :key="item.name"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
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
  </div>
</template>

<script>
  import { doGet } from '@/api/crud/crud'
  import CRUD, { presenter, header, form, crud } from '@/components/Crud/crud'
  import CrudOperation from '@/components/Crud/CRUD.operation'
  import RrOperation from '@/components/Crud/RR.operation'
  import Pagination from '@/components/Crud/Pagination'
  import UdOperation from '@/components/Crud/UD.operation'
  import { isEmail, isPhone } from '@/utils/validate'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  import Treeselect from '@riophae/vue-treeselect'
  import { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
  import crudUser from '@/api/system/user'
  let defaultForm = {
    sex: 1,
    enabled: true,
    id: null,
    username: null,
    phone: null,
    nickname: null,
    email: null,
    deptId: null,
  }
  let userRoles = []
  export default {
    name: 'UserManagement',
    components: {
      Treeselect,
      RrOperation,
      CrudOperation,
      Pagination,
      UdOperation,
    },
    cruds() {
      return CRUD({ title: '用户', url: 'user', crudMethod: crudUser })
    },
    mixins: [presenter(), header(), form(defaultForm), crud()],
    data() {
      const valid = (callback, field, value, msg) => {
        doGet('/user/checkExist', {
          field: field,
          data: value,
          type: this.form.id ? 'edit' : 'add',
        })
          .then((res) => {
            if (res.data) {
              callback(new Error(msg))
            } else {
              callback()
            }
          })
          .catch((res) => {
            callback(new Error('服务器异常,请稍后重试'))
          })
      }
      const validPhone = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入电话号码'))
        } else if (!isPhone(value)) {
          callback(new Error('请输入正确的11位手机号码'))
        } else {
          valid(callback, 'phone', value, '手机号已被使用')
        }
      }
      const validUsername = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入用户名'))
        } else {
          valid(callback, 'username', value, '用户名已被使用')
        }
      }
      const validEmail = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入邮箱'))
        } else if (!isEmail(value)) {
          callback(new Error('请输入正确的邮箱'))
        } else {
          valid(callback, 'email', value, '邮箱已被使用')
        }
      }
      return {
        rules: {
          deptId: [
            {
              required: true,
              trigger: 'blur',
              validator: (rule, value, callback) => {
                if (!this.form.deptId) {
                  callback(new Error('请选择所在部门'))
                } else {
                  callback()
                }
              },
            },
          ],
          roles: [
            {
              required: true,
              trigger: 'blur',
              validator: (rule, value, callback) => {
                if (this.roleDatas.length === 0) {
                  callback(new Error('请选择所属角色'))
                } else {
                  callback()
                }
              },
            },
          ],
          username: [
            { required: true, trigger: 'blur', validator: validUsername },
          ],
          nickname: [
            { required: true, message: '请输入用户昵称', trigger: 'blur' },
            {
              min: 2,
              max: 20,
              message: '长度在 2 到 20 个字符',
              trigger: 'blur',
            },
          ],
          email: [
            {
              required: true,
              trigger: 'blur',
              validator: validEmail,
            },
          ],
          phone: [{ required: true, trigger: 'blur', validator: validPhone }],
        },
        permission: {
          add: ['user:add'],
          edit: ['user:edit'],
          del: ['user:del'],
        },
        blurry: '',
        roles: [],
        depts: [],
        deptData: [],
        roleDatas: [],
        defaultProps: {
          children: 'children',
          label: 'name',
          isLeaf: 'isLeaf',
        },
      }
    },
    created() {
      this.crud.msg.add = '新增成功，默认密码：手机号后6位'
    },
    methods: {
      getRoles() {
        doGet('/role/queryAllRole', {}).then((res) => {
          this.roles = res.data
        })
      },
      [CRUD.HOOK.afterValidateCU](crud) {
        crud.form.roles = userRoles
        return true
      },
      [CRUD.HOOK.beforeToAdd]() {
        this.roleDatas = []
      },
      // 新增与编辑前做的操作
      [CRUD.HOOK.afterToCU](crud, form) {
        if (form.id == null) {
          this.getDepts()
        } else {
          this.queryDeptTree(form.deptId)
        }
        this.getRoles()
      },
      [CRUD.HOOK.beforeToEdit](crud, form) {
        this.roleDatas = []
        userRoles = []
        const _this = this
        form.roles.forEach(function (role, index) {
          _this.roleDatas.push(role.id)
          const rol = { id: role.id }
          userRoles.push(rol)
        })
      },
      queryDeptTree(id) {
        doGet('/dept/queryDeptTree', { id: id }).then((res) => {
          const date = res.data
          this.buildDepts(date)
          this.depts = date
        })
      },
      buildDepts(depts) {
        depts.forEach((data) => {
          data.label = data.name
          data.isLeaf = data.hasChildren
          if (data.children) {
            this.buildDepts(data.children)
          }
          if (data.hasChildrenData && !data.children) {
            data.children = null
          }
        })
      },
      getDepts() {
        doGet('/dept/queryDeptList', { enabled: true, pid: 0 }).then((res) => {
          this.depts = res.data.map(function (obj) {
            obj.label = obj.name
            obj.isLeaf = obj.hasChildren
            if (obj.hasChildren) {
              obj.children = null
            }
            return obj
          })
        })
      },
      loadDepts({ action, parentNode, callback }) {
        if (action === LOAD_CHILDREN_OPTIONS) {
          doGet('/dept/queryDeptList', {
            enabled: true,
            pid: parentNode.id,
          }).then((res) => {
            parentNode.children = res.data.map(function (obj) {
              obj.label = obj.name
              if (obj.hasChildren) {
                obj.children = null
              }
              return obj
            })
            setTimeout(() => {
              callback()
            }, 200)
          })
        }
      },
      changeEnabled(data, val) {
        this.$confirm(
          '此操作将' + (val ? '启用' : '停用') + '用户,是否继续？',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
        )
          .then(() => {
            crudUser
              .edit(data)
              .then((res) => {
                this.$baseNotify(
                  (val ? '启用' : '停用') + '成功','操作提示',
                  CRUD.NOTIFICATION_TYPE.SUCCESS
                )
              })
              .catch(() => {
                data.enabled = !data.enabled
              })
          })
          .catch(() => {
            data.enabled = !data.enabled
          })
      },
      getDeptData(node, resolve) {
        let pid = 0
        if (typeof node === 'object') {
          pid = node.data.id || 0
        }
        let param = {
          pid: pid,
          blurry: this.blurry,
        }
        if (typeof node !== 'object') {
          if (this.blurry !== '') {
            delete param.pid
          }
        }
        doGet('/dept/queryDeptList', param).then((res) => {
          if (pid === 0) {
            this.deptData = res.data
          } else {
            resolve(res.data)
          }
        })
      },
      handleNodeClick(data) {
        this.query.deptId = data.id
        this.crud.toQuery()
      },
      deleteTag(value) {
        userRoles.forEach(function (data, index) {
          if (data.id === value) {
            userRoles.splice(index, value)
          }
        })
      },
      changeRole(value) {
        userRoles = []
        value.forEach(function (data, index) {
          const role = { id: data }
          userRoles.push(role)
        })
      },
    },
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  ::v-deep .vue-treeselect__control,
  ::v-deep .vue-treeselect__placeholder,
  ::v-deep .vue-treeselect__single-value {
    height: 30px;
    line-height: 30px;
  }
</style>
