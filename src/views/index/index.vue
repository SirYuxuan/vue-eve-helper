<template>
  <div class="index-container">
    <el-row :gutter="10">
      <el-col :span="12">
        <el-card class="box-card" shadow="hover">
          <div slot="header" class="clearfix">
            <span>每日销售额</span>
            <el-select
              v-model="accountId"
              style="float: right; width: 200px"
              placeholder="选择角色"
              @change="renderDailySalesChart"
            >
              <el-option
                v-for="item in accountList"
                :key="item.id"
                :label="item.characterName"
                :value="item.id"
              />
            </el-select>
          </div>
          <div id="dailySales"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card" shadow="hover">
          <div slot="header" class="clearfix">
            <span>市场余量</span>
            <el-select
              v-model="marketMarginAccountId"
              style="float: right; width: 200px"
              placeholder="选择角色"
              @change="renderMarketMarginChart"
            >
              <el-option
                v-for="item in accountList"
                :key="item.id"
                :label="item.characterName"
                :value="item.id"
              />
            </el-select>
          </div>
          <div id="marketMargin"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { Chart } from '@antv/g2'
  import { doGet } from '../../api/crud/crud'
  import { toThousands } from '../../utils/common'
  export default {
    components: {},
    data() {
      return {
        accountId: null,
        marketMarginAccountId: null,
        accountList: [],
        dailySalesChart: null,
        marketMarginChart: null,
      }
    },
    created() {
      doGet('/account/listLoginAccount').then((res) => {
        this.accountList = res.data
        if (this.accountList.length > 0) {
          this.accountId = this.accountList[0].id
          this.marketMarginAccountId = this.accountList[0].id
          this.renderDailySalesChart()
          this.renderMarketMarginChart()
        }
      })
    },
    mounted() {
      this.createDailySalesChart()
      this.createMarketMarginChart()
    },
    methods: {
      renderDailySalesChart() {
        doGet('/walletTransactions/dailySales', {
          accountId: this.accountId,
        }).then((res) => {
          this.dailySalesChart.data(res.data)
          this.dailySalesChart.render()
        })
      },
      renderMarketMarginChart() {
        doGet('/accountOrder/marketMargin', {
          accountId: this.marketMarginAccountId,
        }).then((res) => {
          this.marketMarginChart.data(res.data)
          this.marketMarginChart.render()
        })
      },
      createMarketMarginChart() {
        this.marketMarginChart = new Chart({
          container: 'marketMargin',
          autoFit: true,
          height: 550,
          padding: [50, 100, 20, 100],
        })
        this.marketMarginChart.scale({
          buy: {
            alias: '订单类型:',
            formatter(buy) {
              return buy ? '收单' : '卖单'
            },
          },
          price: {
            formatter(val) {
              return toThousands(parseFloat(val) / 1000000) + ' M ISK'
            },
          },
        })
        this.marketMarginChart.legend(false)
        this.marketMarginChart.coordinate('rect').transpose()
        this.marketMarginChart
          .interval()
          .adjust('stack')
          .position('region*price')
          .color('buy', (buy) => {
            if (!buy) {
              return '#1890ff'
            } else {
              return '#2fc25b'
            }
          })
          .size(26)
          .label('buy*price', (buy, val) => {
            return {
              content: toThousands(parseFloat(val) / 1000000000) + 'B',
            }
          })
      },
      createDailySalesChart() {
        this.dailySalesChart = new Chart({
          container: 'dailySales',
          autoFit: true,
          height: 550,
          padding: [50, 100, 20, 100],
        })

        this.dailySalesChart.scale({
          date: {
            range: [0, 1],
          },
          price: {
            min: 0,
            nice: true,
            alias: '销售额',
            formatter(val) {
              return toThousands(parseFloat(val) / 1000000) + ' M ISK'
            },
          },
        })

        this.dailySalesChart.tooltip({
          showCrosshairs: true,
          shared: true,
          title: (title, datum) => {
            return title + ' 销售额'
          },
        })

        this.dailySalesChart
          .line()
          .position('date*price')
          .label('price', (val) => {
            return {
              content: toThousands(parseFloat(val) / 1000000000) + 'B',
            }
          })
        this.dailySalesChart.point().position('date*price')
      },
    },
  }
</script>
