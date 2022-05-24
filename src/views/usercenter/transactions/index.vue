<template>
  <div class="app-container">
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-select
          v-model="query.accountId"
          style="width: 200px"
          placeholder="选择角色"
        >
          <el-option
            v-for="item in accountList"
            :key="item.id"
            :label="item.characterName"
            :value="item.id"
          />
        </el-select>

        <el-input
          v-model="query.blurry"
          clearable
          placeholder="输入物品名称，位置，角色名搜索"
          style="width: 250px;margin-left: 10px"
          class="filter-item"
          @keyup.enter.native="crud.toQuery"
        />
        <date-range-picker v-model="query.createTime" class="date-item" />
        <el-select
          v-model="query.isBuy"
          style="width: 100px"
          clearable
          placeholder="订单类型"
        >
          <el-option
            :key="1"
            :label="'卖单'"
            :value="false"
          />
          <el-option
            :key="2"
            :label="'收单'"
            :value="true"
          />
        </el-select>
        <rr-operation />
      </div>
      <crud-operation :permission="permission">
        <template slot="left">
          <el-button
            class="filter-item"
            size="mini"
            type="primary"
            icon="el-icon-refresh"
            v-auth="'transactions:refresh'"
            :loading="refreshMarketTransactionsLoading"
            @click="refreshMarketTransactions()"
          >
            同步数据
          </el-button>
        </template>
      </crud-operation>
    </div>

    <el-table
      ref="table"
      v-loading="crud.loading"
      :data="crud.data"
      @selection-change="crud.selectionChangeHandler"
    >
      <el-table-column
        prop="title"
        label="所属角色"
        min-width="120"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <img
            style="vertical-align: middle"
            :src="`https://images.evetech.net/characters/${scope.row.characterId}/portrait?size=32`"
            alt=""
          />
          <span style="margin-left: 10px">{{ scope.row.characterName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="title"
        label="客户"
        min-width="120"
        show-overflow-tooltip
      >
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
          <img
            style="vertical-align: middle"
            :src="`https://images.evetech.net/types/${scope.row.typeId}/icon?size=32`"
            alt=""
          />
          <span style="margin-left: 10px">{{ scope.row.typeName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="单价">
        <template slot-scope="scope">
          {{ toThousands(scope.row.unitPrice || 0) + ' ISK' }}
        </template>
      </el-table-column>

      <el-table-column
        prop="name"
        label="数量"
        show-overflow-tooltip
        min-width="80"
      >
        <template slot-scope="scope">
          {{ toThousands(scope.row.quantity || 0) }}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="类型" width="80">
        <template slot-scope="scope">
          <el-tag type="success" effect="dark">
            {{ scope.row.isBuy ? '收单' : '卖单' }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        prop="locationName"
        label="位置"
        min-width="200"
        show-overflow-tooltip
      />
      <el-table-column prop="date" label="交易时间" width="150" />
      <el-table-column prop="createTime" label="更新时间" width="150" />
    </el-table>
    <pagination />
  </div>
</template>

<script>
import DateRangePicker from '@/components/DateRangePicker'
  import CRUD, { presenter, header, form, crud } from '@/components/Crud/crud'
  import CrudOperation from '@/components/Crud/CRUD.operation'
  import RrOperation from '@/components/Crud/RR.operation'
  import Pagination from '@/components/Crud/Pagination'
  import { toThousands } from '../../../utils/common'
  import { doGet } from '../../../api/crud/crud'
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
      DateRangePicker,
      Pagination,
    },
    cruds() {
      return CRUD({
        title: 'SDE',
        url: 'walletTransactions',
        sort: ['date,desc'],
      })
    },
    mixins: [presenter(), header(), form(defaultForm), crud()],
    data() {
      return {
        accountList:[],
        refreshMarketTransactionsLoading: false,
        permission: {
          add: ['none'],
          edit: ['none'],
          del: ['none'],
        },
      }
    },
    created() {
      this.crud.optShow.download = false
      doGet('/account/listLoginAccount').then((res) => {
        this.accountList = res.data
      })
    },
    methods: {
      refreshMarketTransactions() {
        this.refreshMarketTransactionsLoading = true
        this.$baseNotify('正在刷新中,请耐心等待...', '提示', 'success')
        doGet('/account/refreshMarketTransactions')
          .then((res) => {
            this.refreshMarketTransactionsLoading = false
            this.$baseMessage('数据同步完成', 'success')
            this.crud.toQuery()
          })
          .catch((res) => (this.refreshMarketTransactionsLoading = false))
      },
      toThousands(num) {
        return toThousands(num)
      },
    },
  }
</script>
