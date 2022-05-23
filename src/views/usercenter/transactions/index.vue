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
      <el-table-column prop="title" label="所属角色" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          <img
            style="vertical-align: middle"
            :src="`https://images.evetech.net/characters/${scope.row.characterId}/portrait?size=32`"
            alt=""
          />
          <span style="margin-left: 10px">{{ scope.row.characterName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="客户" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          <img
            v-if="scope.row.clientType === 'character'"
            style="vertical-align: middle"
            :src="`https://images.evetech.net/characters/${scope.row.clientId}/portrait?size=32`"
            alt=""
          />
          <img
            v-if="scope.row.clientType === 'corporation'"
            style="vertical-align: middle"
            :src="`https://images.evetech.net/corporations/${scope.row.clientId}/logo?size=32`"
            alt=""
          />
          <span style="margin-left: 10px">{{ scope.row.clientName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="物品名称"
        show-overflow-tooltip
        min-width="150"
      >
        <template slot-scope="scope">
          <img style="vertical-align: middle;" :src="`https://images.evetech.net/types/${scope.row.typeId}/icon?size=32`" alt="">
          <span style="margin-left: 10px">{{ scope.row.typeName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="单价">
        <template slot-scope="scope">
          {{ toThousands(scope.row.unitPrice || 0) + ' ISK' }}
        </template>
      </el-table-column>

      <el-table-column prop="name" label="数量" show-overflow-tooltip min-width="80">
        <template slot-scope="scope">
          {{ toThousands(scope.row.quantity || 0) }}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="类型" width="80">
        <template slot-scope="scope">
          <el-tag
            type="success"
            effect="dark"
          >
            {{ scope.row.isBuy?"收单":"卖单" }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="locationName" label="位置" min-width="200" show-overflow-tooltip/>
      <el-table-column prop="date" label="交易时间" width="150"/>
      <el-table-column prop="createTime" label="更新时间" width="150"/>
    </el-table>
    <pagination />
  </div>
</template>

<script>
  import CRUD, { presenter, header, form, crud } from '@/components/Crud/crud'
  import CrudOperation from '@/components/Crud/CRUD.operation'
  import RrOperation from '@/components/Crud/RR.operation'
  import Pagination from '@/components/Crud/Pagination'
  import UdOperation from '@/components/Crud/UD.operation'
  import crudSde, { startSde } from '@/api/database/sde'
  import { baseURL } from '@/config/setting.config'
  import { doGet } from '@/api/crud/crud'
  import Vue from 'vue'
  import { toThousands } from "../../../utils/common";
  let defaultForm = {
    title: null,
    url: null,
    localPath: null,
  }

  export default {
    name: 'SDE',
    components: {
      RrOperation,
      CrudOperation,
      Pagination,
    },
    cruds() {
      return CRUD({ title: 'SDE', url: 'walletTransactions', crudMethod: crudSde ,sort:['date,desc']})
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
      toThousands(num) {
        return toThousands(num)
      },
    },
  }
</script>
