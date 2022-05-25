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
          style="width: 250px; margin-left: 10px"
          class="filter-item"
          @keyup.enter.native="crud.toQuery"
        />
        <date-range-picker v-model="query.createTime" class="date-item" />
        <el-select
          v-model="query.isBuyOrder"
          style="width: 100px"
          clearable
          placeholder="订单类型"
        >
          <el-option :key="1" :label="'卖单'" :value="false" />
          <el-option :key="2" :label="'收单'" :value="true" />
        </el-select>

        <el-select
          v-model="query.min"
          style="width: 100px; margin-left: 10px"
          clearable
          placeholder="底价"
        >
          <el-option :key="1" :label="'市场最低价'" :value="true" />
          <el-option :key="2" :label="'非最低价'" :value="false" />
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
            icon="el-icon-refresh"
            :loading="refreshAccountOrderLoading"
            @click="refreshAccountOrder()"
          >
            同步数据
          </el-button>
          <el-button
            v-auth="'transactions:refresh'"
            class="filter-item"
            size="mini"
            type="success"
            icon="el-icon-magic-stick"
            :loading="priceProposalLoading"
            @click="refreshPriceProposal()"
          >
            价格建议
          </el-button>
          <el-checkbox v-model="allJita" style="margin-left: 10px">
            非00订单全在吉他
            <el-tooltip
              class="item"
              effect="dark"
              content="如果您的所有非00地区订单全部是吉他的订单请一定勾选。否则查询速度将会很慢。如果确有需要,可以移除此选项"
              placement="top"
            >
              <i class="el-icon-question"></i>
            </el-tooltip>
          </el-checkbox>
        </template>
      </crud-operation>
    </div>

    <el-table
      ref="table"
      @sort-change="crud.toSort"
      v-loading="crud.loading"
      :data="crud.data"
      @selection-change="crud.selectionChangeHandler"
    >
      <el-table-column
        prop="title"
        label="所有者"
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
        prop="typeName"
        label="物品名称"
        show-overflow-tooltip
        min-width="150"
        sortable="custom"
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
      <el-table-column
        prop="price"
        label="价格"
        sortable
        min-width="110"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{ toThousands(scope.row.price || 0) + ' ISK' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="jitaPrice"
        label="市场行情(竞争价/吉他价)"
        show-overflow-tooltip
        min-width="200"
      >
        <template slot-scope="scope">
          <div v-if="!scope.row.jitaPrice">
            <el-tag type="warning" effect="dark">未执行建议</el-tag>
          </div>
          <div
            v-else-if="
              !scope.row.minPrice || parseInt(scope.row.minPrice) === 0
            "
          >
            <el-tag type="success" effect="dark">
              市场最{{ scope.row.isBuyOrder ? '高' : '低' }}价 / {{ toThousands(scope.row.jitaPrice) + ' ISK' }}
            </el-tag>
          </div>
          <el-tag v-else type="danger" effect="dark">
            {{
              toThousands(scope.row.minPrice) +
              ' ISK / ' +
              toThousands(scope.row.jitaPrice) +
              ' ISK'
            }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        prop="volumeTotal"
        sortable
        label="订单数量"
        show-overflow-tooltip
        min-width="90"
      >
        <template slot-scope="scope">
          {{ toThousands(scope.row.volumeTotal || 0) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="volumeRemain"
        sortable
        label="剩余数量"
        show-overflow-tooltip
        min-width="90"
      >
        <template slot-scope="scope">
          {{ toThousands(scope.row.volumeRemain || 0) }}
        </template>
      </el-table-column>
      <el-table-column prop="isBuyOrder" sortable label="类型" width="80">
        <template slot-scope="scope">
          <el-tag type="success" effect="dark">
            {{ scope.row.isBuyOrder ? '收单' : '卖单' }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        sortable
        prop="locationName"
        label="位置"
        min-width="200"
        show-overflow-tooltip
      />
      <el-table-column
        sortable
        prop="regionName"
        label="地区"
        min-width="80"
        show-overflow-tooltip
      />
      <el-table-column sortable prop="issued" label="发布时间" width="150" />
      <el-table-column sortable prop="createTime" label="更新时间" width="150" />
      <el-table-column  label="游戏打开" width="80">
        <template slot-scope="scope">
        <el-button icon="el-icon-search" type="primary" size="mini" @click="openWindow(scope.row.id)"></el-button>
        </template>
      </el-table-column>
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
        url: 'accountOrder',
        sort: ['issued,desc'],
      })
    },
    mixins: [presenter(), header(), form(defaultForm), crud()],
    data() {
      return {
        allJita: true,
        accountList: [],
        priceProposalLoading: false,
        refreshAccountOrderLoading: false,
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
      openWindow(id){
        this.$baseNotify('正在为您打开中', '提示', 'success')
        doGet('/accountOrder/openWindow',{id:id})
          .then((res) => {
            this.$baseMessage('已为您在游戏中打开', 'success')
          })
          .catch((res) => (this.refreshAccountOrderLoading = false))
      },
      refreshAccountOrder() {
        this.refreshAccountOrderLoading = true
        this.$baseNotify('正在刷新中,请耐心等待...', '提示', 'success')
        doGet('/account/refreshAccountOrder')
          .then((res) => {
            this.refreshAccountOrderLoading = false
            this.$baseMessage('数据同步完成', 'success')
            this.crud.toQuery()
          })
          .catch((res) => (this.refreshAccountOrderLoading = false))
      },
      refreshPriceProposal() {
        if (!this.allJita) {
          this.$baseConfirm(
            '您确定拥有非00地区订单,且订单不在吉他吗？此操作比较耗时,请耐心等待!',
            '提示',
            () => {
              this.readRefreshPriceProposal()
            },
            () => (this.allJita = true)
          )
        }else{
          this.readRefreshPriceProposal()
        }
      },
      readRefreshPriceProposal(){
        this.priceProposalLoading = true
        this.$baseNotify('正在刷新中,请耐心等待...', '提示', 'success')
        doGet('/accountOrder/priceProposal?allJita=' + this.allJita)
          .then((res) => {
            this.priceProposalLoading = false
            this.$baseMessage('数据同步完成', 'success')
            this.crud.toQuery()
          })
          .catch((res) => (this.priceProposalLoading = false))
      },
      toThousands(num) {
        return toThousands(num)
      },
    },
  }
</script>
