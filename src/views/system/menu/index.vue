<template>
  <div class="app-container">
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input
          v-model="query.blurry"
          clearable
          size="small"
          placeholder="模糊搜索"
          style="width: 200px"
          class="filter-item"
          @keyup.enter.native="crud.toQuery"
        />
        <date-range-picker
          v-model="query.createTime"
          class="date-item"
        />
        <rr-operation />
      </div>
      <crud-operation :permission="permission" />
    </div>
    <!--表格渲染-->
    <el-table
      ref="table"
      v-loading="crud.loading"
      lazy
      :load="getMenus"
      :data="crud.data"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      row-key="id"
      @select="crud.selectChange"
      @select-all="crud.selectAllChange"
      @selection-change="crud.selectionChangeHandler"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column
        :show-overflow-tooltip="true"
        label="菜单标题"
        width="125px"
        prop="title"
      />
      <el-table-column prop="icon" label="图标" align="center" width="60px">
        <template slot-scope="scope">
          <vab-remix-icon
            :icon-class="scope.row.icon ? scope.row.icon : ''"
            class="vab-remix-icon"
          />
        </template>
      </el-table-column>
      <el-table-column prop="sort" align="center" label="排序">
        <template slot-scope="scope">
          {{ scope.row.sort }}
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="permissionStr"
        label="权限标识"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="component"
        label="组件路径"
      />
      <el-table-column prop="isLink" label="外链" width="75px">
        <template slot-scope="scope">
          <span v-if="scope.row.isLink">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column prop="cache" label="缓存" width="75px">
        <template slot-scope="scope">
          <span v-if="scope.row.cache">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column prop="hidden" label="可见" width="75px">
        <template slot-scope="scope">
          <span v-if="scope.row.hidden">否</span>
          <span v-else>是</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建日期" width="150px" />
      <el-table-column label="操作" width="130px" align="center" fixed="right">
        <template slot-scope="scope">
          <udOperation
            :data="scope.row"
            :permission="permission"
            msg="确定删除吗,如果存在下级节点则一并删除，此操作不能撤销！"
          />
        </template>
      </el-table-column>
    </el-table>
    <!--表单渲染-->
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :before-close="crud.cancelCU"
      :visible.sync="crud.status.cu > 0"
      :title="crud.status.title"
      width="580px"
    >
      <el-form
        ref="form"
        :inline="true"
        :model="form"
        :rules="rules"
        size="small"
        label-width="80px"
      >
        <el-form-item label="菜单类型" prop="type">
          <el-radio-group v-model="form.type" size="mini" style="width: 178px">
            <el-radio-button label="0">目录</el-radio-button>
            <el-radio-button label="1">菜单</el-radio-button>
            <el-radio-button label="2">按钮</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-show="form.type.toString() !== '2'"
          label="菜单图标"
          prop="icon"
        >
          <el-popover
            placement="bottom-start"
            width="450"
            trigger="click"
            @show="$refs['iconSelect'].reset()"
          >
            <IconSelect ref="iconSelect" @selected="selected" />
            <el-input
              slot="reference"
              v-model="form.icon"
              style="width: 450px"
              placeholder="点击选择图标"
              readonly
            >
              <vab-remix-icon
                v-if="form.icon"
                slot="prefix"
                :icon-class="form.icon"
                class="vab-remix-icon"
                style="width: 16px; height: 30px"
              />
            </el-input>
          </el-popover>
        </el-form-item>
        <el-form-item
          v-show="form.type.toString() !== '2'"
          label="外链菜单"
          prop="isLink"
        >
          <el-radio-group v-model="form.isLink" size="mini">
            <el-radio-button label="true">是</el-radio-button>
            <el-radio-button label="false">否</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-show="form.type.toString() === '1'"
          label="菜单缓存"
          prop="cache"
        >
          <el-radio-group v-model="form.cache" size="mini">
            <el-radio-button label="true">是</el-radio-button>
            <el-radio-button label="false">否</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-show="form.type.toString() !== '2'"
          label="菜单可见"
          prop="hidden"
        >
          <el-radio-group v-model="form.hidden" size="mini">
            <el-radio-button label="false">是</el-radio-button>
            <el-radio-button label="true">否</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="form.type.toString() !== '2'"
          label="菜单标题"
          prop="title"
        >
          <el-input
            v-model="form.title"
            :style="
              form.type.toString() === '0' ? 'width: 450px' : 'width: 178px'
            "
            placeholder="菜单标题"
          />
        </el-form-item>
        <el-form-item
          v-if="form.type.toString() === '2'"
          label="按钮名称"
          prop="title"
        >
          <el-input
            v-model="form.title"
            placeholder="按钮名称"
            style="width: 178px"
          />
        </el-form-item>
        <el-form-item
          v-show="form.type.toString() !== '0'"
          label="权限标识"
          prop="permission"
        >
          <el-input
            v-model="form.permissionStr"
            :disabled="form.isLink.toString() === 'true'"
            placeholder="权限标识"
            style="width: 178px"
          />
        </el-form-item>
        <el-form-item
          v-if="form.type.toString() !== '2'"
          label="路由地址"
          prop="path"
        >
          <el-input
            v-model="form.path"
            placeholder="路由地址"
            style="width: 178px"
          />
        </el-form-item>
        <el-form-item label="菜单排序" prop="menuSort">
          <el-input-number
            v-model.number="form.sort"
            :min="0"
            :max="999"
            controls-position="right"
            style="width: 178px"
          />
        </el-form-item>
        <el-form-item
          v-show="
            form.isLink.toString() !== 'true' && form.type.toString() === '1'
          "
          label="组件名称"
          prop="name"
        >
          <el-input
            v-model="form.name"
            style="width: 178px"
            placeholder="匹配组件内Name字段"
          />
        </el-form-item>
        <el-form-item
          v-show="
            form.isLink.toString() !== 'true' && form.type.toString() === '1'
          "
          label="组件路径"
          prop="component"
        >
          <el-input
            v-model="form.component"
            style="width: 178px"
            placeholder="组件路径"
          />
        </el-form-item>
        <el-form-item label="上级类目" prop="pid">
          <treeselect
            v-model="form.pid"
            :options="menus"
            :load-options="loadMenus"
            style="width: 450px"
            placeholder="选择上级类目"
          />
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
  import CRUD, { presenter, header, form, crud } from '@/components/Crud/crud'
  import crudMenu from '@/api/system/menu'
  import CrudOperation from '@/components/Crud/CRUD.operation'
  import RrOperation from '@/components/Crud/RR.operation'
  import Treeselect from '@riophae/vue-treeselect'
  import IconSelect from '@/components/IconSelect'
  import UdOperation from '@/components/Crud/UD.operation'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  import { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
  import DateRangePicker from '@/components/DateRangePicker'
  import { doGet } from '@/api/crud/crud'
  const defaultForm = {
    id: null,
    title: null,
    sort: 999,
    path: null,
    component: null,
    name: null,
    isLink: false,
    roles: [],
    pid: 0,
    icon: null,
    cache: false,
    hidden: false,
    type: 0,
    permissionStr: null,
  }
  export default {
    name: 'Menu',
    cruds() {
      return CRUD({ title: '菜单', url: 'menu', crudMethod: crudMenu })
    },
    mixins: [presenter(), header(), form(defaultForm), crud()],
    components: {
      RrOperation,
      CrudOperation,
      UdOperation,
      DateRangePicker,
      Treeselect,
      IconSelect,
    },
    data() {
      return {
        permission: {
          add: 'menu:add',
          edit: 'menu:edit',
          del: 'menu:del',
        },
        rules: {},
        menus: [],
      }
    },
    methods: {
      // 新增与编辑前做的操作
      [CRUD.HOOK.afterToCU](crud, form) {
        this.menus = []
        if (form.id != null) {
          if (form.pid === null) {
            form.pid = 0
          }
          this.queryMenuTree(form.id)
        } else {
          this.menus.push({ id: 0, label: '顶级类目', children: null })
        }
      },
      queryMenuTree(id) {
        doGet('/menu/queryMenuTree', { id: id }).then((res) => {
          const date = res.data
          this.buildMenu(date)
          this.menus = [{ id: 0, label: '顶级类目', children: date }]
        })
      },
      buildMenu(depts) {
        depts.forEach((data) => {
          data.label = data.title
          data.isLeaf = data.hasChildren
          if (data.children) {
            this.buildMenu(data.children)
          }
          if (data.hasChildrenData && !data.children) {
            data.children = null
          }
        })
      },
      loadMenus({ action, parentNode, callback }) {
        if (action === LOAD_CHILDREN_OPTIONS) {
          doGet('/menu', { pid: parentNode.id }).then((res) => {
            parentNode.children = res.data.content.map(function (obj) {
              obj.label = obj.title
              if (obj.hasChildren) {
                obj.children = null
              }
              return obj
            })
            setTimeout(() => {
              callback()
            }, 100)
          })
        }
      },
      getMenus(tree, treeNode, resolve) {
        const params = { pid: tree.id }
        setTimeout(() => {
          doGet('/menu', params).then((res) => {
            resolve(res.data.content)
          })
        }, 100)
      },
      // 选中图标
      selected(name) {
        this.form.icon = name
      },
    },
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  ::v-deep .el-input-number .el-input__inner {
    text-align: left;
  }
  ::v-deep .vue-treeselect__control,
  ::v-deep .vue-treeselect__placeholder,
  ::v-deep .vue-treeselect__single-value {
    height: 30px;
    line-height: 30px;
  }
</style>
