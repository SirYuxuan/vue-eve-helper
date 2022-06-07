<template>
  <div class="app-container">
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-select
          v-model="query.accountId"
          style="width: 200px"
          clearable
          placeholder="选择角色"
        >
          <el-option
            v-for="item in accountList"
            :key="item.id"
            :label="item.characterName"
            :value="item.id"
          />
        </el-select>
        <rr-operation />
      </div>
      <crud-operation :permission="permission">
        <template slot="left">
          <el-button
            v-auth="'transactions:refresh'"
            class="filter-item"
            size="mini"
            type="primary"
            v-show="false"
            icon="el-icon-refresh"
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
      class="rounded-head"
      @sort-change="crud.toSort"
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
      <el-table-column prop="accountName"  label="所属账号" />
      <el-table-column prop="solarSystemName" sortable label="所在星系" />

      <el-table-column prop="planetType" sortable label="行星类型" />
      <el-table-column prop="produce" sortable label="产出物" />
      <el-table-column prop="numPins" sortable label="设施数量" />
      <el-table-column prop="upgradeLevel" sortable label="基地等级" />
      <el-table-column prop="lastUpdate" sortable label="更新时间" />
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
        url: '/accountPi',
        sort: ['createTime,desc'],
      })
    },
    mixins: [presenter(), header(), form(defaultForm), crud()],
    data() {
      return {
        accountList: [],
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
