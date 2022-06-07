<template>
  <div class="app-container">
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
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

        <rr-operation />
      </div>
      <crud-operation :permission="permission"></crud-operation>
    </div>

    <el-table
      ref="table"
      v-loading="crud.loading"
      :data="crud.data"
      @sort-change="crud.toSort"
      @selection-change="crud.selectionChangeHandler"
    >
      <el-table-column
        prop="content"
        label="交易内容"
        show-overflow-tooltip
        min-width="300"
      />
      <el-table-column prop="isBuyOrder" sortable label="类型" width="80">
        <template slot-scope="scope">
          <el-tag type="success" effect="dark">
            {{ scope.row.isBuyOrder ? '收单' : '卖单' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="content"
        label="地点"
        show-overflow-tooltip
        min-width="150"
      />
      <el-table-column
        prop="content"
        label="价格"
        show-overflow-tooltip
        min-width="150"
      />
      <el-table-column
        prop="content"
        label="创建时间"
        show-overflow-tooltip
        min-width="150"
      />

      <el-table-column label="交流" width="80">
        <template slot-scope="scope">
          <el-button
            icon="el-icon-search"
            type="primary"
            size="mini"
            @click="openWindow(scope.row.id)"
          ></el-button>
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
      width="520px"
    >
      <el-form
        ref="form"
        :inline="true"
        :model="form"
        :rules="rules"
        size="small"
        label-width="80px"
      >
        <el-form-item label="订单类型" prop="isBuyOrder">
          <el-radio-group v-model="form.isBuyOrder" style="width: 140px">
            <el-radio label="1">收单</el-radio>
            <el-radio label="0">卖单</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="角色ID" prop="characterName">
          <el-input v-model="form.characterName" style="width: 380px" />
        </el-form-item>
        <el-form-item label="货物位置" prop="location">
          <el-input v-model="form.location" style="width: 380px" />
        </el-form-item>
        <el-form-item label="价格方式" prop="price">
          <el-input v-model="form.price" style="width: 380px" />
        </el-form-item>
        <el-form-item label="货物内容" prop="content">
          <el-input
            v-model="form.content"
            style="width: 380px"
            rows="5"
            type="textarea"
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
  import DateRangePicker from '@/components/DateRangePicker'
  import CRUD, { presenter, header, form, crud } from '@/components/Crud/crud'
  import CrudOperation from '@/components/Crud/CRUD.operation'
  import RrOperation from '@/components/Crud/RR.operation'
  import Pagination from '@/components/Crud/Pagination'
  import { toThousands } from '@/utils/common'
  import crudOrder from '@/api/order/order'
  let defaultForm = {
    isBuyOrder: false,
    content: null,
    location: null,
    name: null,
    price: null,
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
        title: '订单',
        url: 'order',
        crudMethod: crudOrder,
      })
    },
    mixins: [presenter(), header(), form(defaultForm), crud()],
    data() {
      return {
        say: false,
        sid: 0,
        allJita: true,
        accountList: [],
        priceProposalLoading: false,
        refreshAccountOrderLoading: false,
        permission: {
          add: ['transactions:refresh'],
          edit: ['none'],
          del: ['none'],
        },
        rules: {},
      }
    },
    created() {
      this.crud.optShow.download = false
    },
    methods: {
      openWindow(id) {
        this.$router.push({
          path: '/comment/details',
          query: {
            id: id,
          },
        })
      },
      toThousands(num) {
        return toThousands(num)
      },
    },
  }
</script>
