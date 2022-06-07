<template>
  <div class="index-container">
    <el-alert
      :closable="false"
      effect="light"
      type="success"
      style="margin-bottom: 10px; border: 1px solid #13ce66"
    >
      您可以通过下面的按钮添加角色授权,弹出授权网站为CPP官方网站,如果无法打开请自行梯子,如果登录发生异常情况,请联系
      QQ:
      <A
        href="tencent://message/?uin=1718018032&amp;Site=军团网站&amp; Menu=yes"
      >
        1718018032
      </A>
    </el-alert>

    <vab-query-form>
      <vab-query-form-left-panel>
        <img
          alt="SSO授权"
          src="data:image/png;base64,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"
          style="display: inline-block; margin-bottom: 20px; cursor: pointer"
          @click="toAuth"
        />
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <el-form ref="form" :inline="true" @submit.native.prevent>
          <el-form-item>
            <el-button
              :loading="load"
              icon="el-icon-search"
              type="primary"
              native-type="submit"
              @click="handleQuery"
            >
              刷新数据
            </el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>
    <el-table
      ref="table"
      class="rounded-head no-border"
      highlight-current-row
      style="width: 100%"
      :data="data"
      @sort-change="toSort"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table
            :data="props.row.accountSkillList"
            border
            style="width: 90%; margin-left: 40px; margin: auto"
          >
            <el-table-column
              prop="skillName"
              label="技能名称"
            ></el-table-column>
            <el-table-column
              prop="startDate"
              label="开始时间"
            ></el-table-column>
            <el-table-column
              prop="finishDate"
              label="完成时间"
            ></el-table-column>
            <el-table-column
              prop="finishedLevel"
              label="完成等级"
            ></el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column
        prop="title"
        label="角色名"
        min-width="100"
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
        prop="legion"
        label="军团"
        show-overflow-tooltip
        min-width="100"
      >
        <template slot-scope="scope">
          <img
            style="vertical-align: middle"
            :src="`https://images.evetech.net/corporations/${scope.row.corpId}/logo?size=32`"
            alt=""
          />
          <span style="margin-left: 10px">
            {{ scope.row.corpName || '暂无军团' }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="union"
        label="所属账号"
        show-overflow-tooltip
        min-width="100"
      >
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.accountName"
            style="border: 0"
            @blur="saveAccount(scope.row)"
            @keyup.enter.native="saveAccount(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="当前技能" show-overflow-tooltip min-width="100">
        <template slot-scope="scope">
          {{ scope.row.skillName }}
        </template>
      </el-table-column>
      <el-table-column
        prop="skillEndTime"
        label="技能队列结束时间"
        show-overflow-tooltip
        min-width="150"
        sortable
      >
        <template slot-scope="scope">
          {{ scope.row.skillEndTime }}
        </template>
      </el-table-column>

      <el-table-column prop="skillNum" label="制造" min-width="90">
        <template slot-scope="scope">{{ scope.row.make }} / ?</template>
      </el-table-column>
      <el-table-column prop="skillNum" label="科研" min-width="90">
        <template slot-scope="scope">
          {{ scope.row.scientificResearch }} / ?
        </template>
      </el-table-column>
      <el-table-column prop="skillNum" label="反应" min-width="90">
        <template slot-scope="scope">{{ scope.row.reaction }} / ?</template>
      </el-table-column>
      <el-table-column prop="dkp" label="主角色">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isMain"
            :disabled="scope.row.isMain"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="setMainAccount(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="esi" label="ESI状态">
        <template slot-scope="scope">
          <el-tag
            v-if="scope.row.accessToken !== ''"
            effect="dark"
            type="success"
          >
            YX FULL ESI
          </el-tag>
          <el-tag
            v-if="scope.row.accessToken === '' || !scope.row.accessToken"
            effect="dark"
            type="danger"
          >
            ESI-ERROR
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="dkp" label="操作" width="80">
        <template slot-scope="scope">
          <el-button
            slot="reference"
            :disabled="scope.row.isMain"
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="onDelete(scope.row.id)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :page-size.sync="page.size"
      :total="page.total"
      :current-page.sync="page.page"
      style="margin-top: 8px"
      layout="total, prev, pager, next, sizes"
      @size-change="query"
      @current-change="query"
    />
  </div>
</template>
<style>
  .no-border .el-input__inner {
    border: 0 !important;
  }
</style>
<script>
  import {  delAccount } from '@/api/userAccount/userAccount'
  import { doGet } from '@/api/crud/crud'
  import { toThousands } from '@/utils/common'
  import { getAccessToken } from '@/utils/accessToken'
  import { baseURL } from '@/config/setting.config'
  export default {
    name: 'Group',
    data() {
      return {
        page: {
          page: 1,
          size: 10,
        },
        delLoading: false,
        pop: false,
        data: [],
        uuid: null,
        load: false,
        orderBy: 'asc',
        order: 'skillEndTime',
      }
    },
    created() {
      this.query()
    },
    mounted() {},
    methods: {
      handleQuery() {
        this.query()
      },
      toSort(od) {
        this.order = od.prop
        if (od.order === 'descending') {
          this.orderBy = 'desc'
        } else {
          this.orderBy = 'asc'
        }
        this.query()
      },
      query() {
        this.load = true
        doGet('/account', {
          page: this.page.page,
          size: this.page.size,
          order: this.orderBy,
          orderBy: this.order,
        }).then((res) => {
          this.data = res.data.content
          this.load = false
          this.page.total = res.data.totalElements
        })
      },
      saveAccount(row) {
        doGet('/account/setAccountName', {
          accountId: row.id,
          accountName: row.accountName,
        }).then((res) => {
          this.$baseMessage('账号保存成功', 'success')
        })
      },
      toAuth() {
        // 授权使用当前的Token
        let token = getAccessToken()
        if (!token) {
          this.$baseMessage('登录状态失效，请刷新后重试', 'error')
          location.reload()
          return
        }
        const Loading = this.$baseColorfullLoading(3, '正在授权中...')
        let win = window.open(
          baseURL + 'esi/auth?token=' + token,
          'q',
          'width=500,height=600'
        )
        let that = this
        let loop = setInterval(function () {
          if (win != null && win.closed) {
            Loading.close()
            that.$baseMessage('操作完成', 'success')
            that.query()
            clearInterval(loop)
          }
        }, 200)
      },
      setMainAccount(row) {
        this.$confirm(`确认设置此角色为主角色吗`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            doGet('/account/setMainAccount',{accountId:row.id}).then((res) => {
              this.$baseMessage('主角色设置成功', 'success')
              this.query()
            })
          })
          .catch((res) => {
            row.isMain = !row.isMain
          })
      },
      onDelete(id) {
        if (this.data.length <= 1) {
          this.$baseMessage(
            '您必须保有一个或以上的角色，如果需要完全退出军团，请联系系统管理员',
            'error'
          )
          return
        }
        this.$confirm(`确认移除此角色的ESI吗，移除后LP信息将无法恢复`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          delAccount(id).then((res) => {
            this.$baseMessage('角色删除成功', 'success')
            this.query()
          })
        })
      },
      toThousands(num) {
        return toThousands(num)
      },
    },
  }
</script>
