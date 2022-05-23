<template>
  <div class="index-container">
    <div id="container"></div>
  </div>
</template>

<script>
  import { Chart } from '@antv/g2'
  import { doGet } from '../../api/crud/crud'

  function findMaxMin(data) {
    let maxValue = 0
    let minValue = 50000
    let maxObj = null
    let minObj = null
    for (const d of data) {
      if (d.Close > maxValue) {
        maxValue = d.Close
        maxObj = d
      }
      if (d.Close < minValue) {
        minValue = d.Close
        minObj = d
      }
    }
    return { max: maxObj, min: minObj }
  }
  export default {
    components: {},
    data() {
      return {}
    },
    mounted() {
      doGet('/walletTransactions/dailySales', {}).then((res) => {
        const chart = new Chart({
          container: 'container',
          autoFit: true,
          height: 500,
          padding: [30, 20, 70, 30]
        })
        chart.data(res.data);
        chart.scale({
          nlp: {
            min: 0,
            max: 100
          },
          price: {
            min: 0,
            max: 100
          }
        });

        chart.axis('nlp', false);

        chart.legend({
          custom: true,
          items: [
            { name: 'price', value: 'price', marker: { symbol: 'line', style: { stroke: '#1890ff', lineWidth: 2 } } },
          ],
        });

        chart.line().position('price').color('#2fc25b');

        chart.render();
      })
    },
  }
</script>
