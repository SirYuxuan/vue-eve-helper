<template>
  <div style="padding: 10px">
    <markdown-it-vue class="md-body" :content="content" />
  </div>
</template>

<script>
  import MarkdownItVue from 'markdown-it-vue'
  import 'markdown-it-vue/dist/markdown-it-vue.css'
  export default {
    name: 'Index',
    components: {
      MarkdownItVue,
    },
    data() {
      return {
        content:
          'QQ交流群：850293205\n' +
          '\n' +
          '### 系统开源\n' +
          '\n' +
          '后端 [https://github.com/SirYuxuan/eve-helper](https://github.com/SirYuxuan/eve-helper)\n' +
          '\n' +
          '前端 [https://github.com/SirYuxuan/vue-eve-helper](https://github.com/SirYuxuan/vue-eve-helper)\n' +
          '\n' +
          '麻烦小伙伴们动动你们的小手给点个Star吧\n' +
          '\n' +
          '### 功能列表\n' +
          '- [x] ESI授权\n' +
          '- [x] 首页每日销售图标\n' +
          '- [x] 首页市场余量图表\n' +
          '- [x] 市场交易管理（可以直观的看到市场的每一笔订单）\n' +
          '- [x] 市场订单管理（可以看到自己在售和在收购中的订单，并提供价格建议来查看是否被压单）\n' +
          '- [x] 资产管理功能（游戏内附带的非常不好用，本资产管理提供按分类搜索,多角色合并搜索,舰船内物品搜索等）\n' +
          '- [ ] 钱包流水（在线查看钱包流水，搜索等，后续报表等）\n' +
          '- [ ] 合同管理（在线合同查看，合同估价等，后续新合同提醒等）\n' +
          '- [ ] 市场监控功能（监控指定市场物品是否售空等）\n' +
          '- [ ] 市场销量排行（查看指定市场每日或多日的销售排行，可定时发放报表到邮箱） \n' +
          '- [ ] 资产管理（可以点击容器类资产查看内部资产）\n' +
          '- [ ] 资产管理（可以设置游戏内导航到达资产地点）\n' +
          '\n如果您对小助手的开发有什么建议欢迎入群讨论。\n' +
          ' ![Snake animation](https://raw.githubusercontent.com/SirYuxuan/SirYuxuan/a4ef17e580b2713028ad64b0b497d96455369861/github-contribution-grid-snake.svg)',
      }
    },
  }
</script>

<style scoped></style>
