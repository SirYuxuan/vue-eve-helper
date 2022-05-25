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
        <div style="display: inline-block;vertical-align: middle">
          <treeselect
            v-model="query.marketGroupId"
            class="treeMarket"
            :options="marketGroup"
            :load-options="loadMarketGroup"
            style="width: 200px; margin-left: 10px"
            placeholder="选择市场分类"
          />
        </div>
        <el-select
          v-model="query.metaGroupId"
          style="width: 100px; margin-left: 10px"
          clearable
          placeholder="物品等级"
        >
          <el-option
            v-for="item in metaGroup"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <el-input
          v-model="query.blurry"
          clearable
          placeholder="输入物品名称，位置搜索"
          style="width: 250px; margin-left: 10px"
          class="filter-item"
          @keyup.enter.native="crud.toQuery"
        />

        <el-select
          v-model="query.isBlueprintCopy"
          style="width: 100px"
          clearable
          placeholder="蓝图类型"
        >
          <el-option :key="1" :label="'原图'" :value="false" />
          <el-option :key="2" :label="'非原图'" :value="true" />
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
            :loading="refreshAccountAssetsLoading"
            @click="refreshAccountAssets()"
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
      @sort-change="crud.toSort"
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
        prop="volumeTotal"
        sortable
        label="数量"
        show-overflow-tooltip
        min-width="90"
      >
        <template slot-scope="scope">
          {{ toThousands(scope.row.quantity || 0) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="volumeRemain"
        sortable
        label="位置标记"
        show-overflow-tooltip
        min-width="90"
      >
        <template slot-scope="scope">
          <span v-if="'Unlocked' === scope.row.locationFlag">集装箱</span>
          <span v-else-if="'Hangar' === scope.row.locationFlag">机库</span>
          <span v-else-if="'Cargo' === scope.row.locationFlag">船舱</span>
          <span v-else-if="'AssetSafety' === scope.row.locationFlag">
            安全资产
          </span>
          <span v-else-if="'DroneBay' === scope.row.locationFlag">
            无人机仓
          </span>
          <span v-else-if="scope.row.locationFlag.indexOf('Slot') !== -1">
            舰船装备
          </span>
          <span v-else>{{ scope.row.locationFlag }}</span>
        </template>
      </el-table-column>

      <el-table-column
        sortable
        prop="locationName"
        label="所在位置"
        min-width="200"
        show-overflow-tooltip
      />

      <el-table-column
        sortable
        prop="createTime"
        label="更新时间"
        width="150"
      />
    </el-table>
    <pagination />
  </div>
</template>

<script>
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  import Treeselect from '@riophae/vue-treeselect'
  import { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
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
      Treeselect,
      Pagination,
    },
    cruds() {
      return CRUD({
        title: 'SDE',
        url: 'accountAssets',
        sort: ['createTime,desc'],
      })
    },
    mixins: [presenter(), header(), form(defaultForm), crud()],
    data() {
      return {
        marketGroup: [],
        metaGroup: [],
        accountList: [],
        refreshAccountAssetsLoading: false,
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
      doGet('/sde/getMetaGroup').then((res) => {
        this.metaGroup = res.data
      })
      this.getMarketGroup()
    },
    methods: {
      getMarketGroup() {
        doGet('/sde/getMarketGroup', { pid: 0 }).then((res) => {
          this.marketGroup = res.data.map(function (obj) {
            obj.label = obj.name
            obj.isLeaf = obj.hasChildren
            if (obj.hasChildren) {
              obj.children = null
            }
            return obj
          })
        })
      },
      loadMarketGroup({ action, parentNode, callback }) {
        console.log(11)
        if (action === LOAD_CHILDREN_OPTIONS) {
          doGet('/sde/getMarketGroup', {
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
      refreshAccountAssets() {
        this.refreshAccountAssetsLoading = true
        this.$baseNotify('正在刷新中,请耐心等待...', '提示', 'success')
        doGet('/account/refreshAccountAssets')
          .then((res) => {
            this.refreshAccountAssetsLoading = false
            this.$baseMessage('数据同步完成', 'success')
            this.crud.toQuery()
          })
          .catch((res) => (this.refreshAccountAssetsLoading = false))
      },
      toThousands(num) {
        return toThousands(num)
      },
    },
  }
</script>
