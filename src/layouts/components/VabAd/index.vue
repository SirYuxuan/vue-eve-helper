<template>
  <div v-if="showAd" class="vab-ad">
    <el-carousel
      v-if="adList"
      height="30px"
      direction="vertical"
      :autoplay="true"
      :interval="3000"
      indicator-position="none"
    >
      <el-carousel-item v-for="(item, index) in adList" :key="index">
        <el-tag type="warning">Ad</el-tag>
        <a target="_blank" :href="item.url">{{ item.title }}</a>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>
<script>
  import { getList } from '@/api/ad'
  import { showAd } from '@/config'
  export default {
    name: 'VabAd',
    data() {
      return {
        showAd: showAd,
        nodeEnv: process.env.NODE_ENV,
        adList: [],
      }
    },
    created() {
      if (this.showAd) {
        this.fetchData()
      }
    },
    methods: {
      async fetchData() {
        const { data } = await getList()
        this.adList = data
      },
    },
  }
</script>
<style lang="scss" scoped>
  .vab-ad {
    height: 30px;
    padding-right: $base-padding;
    padding-left: $base-padding;
    margin-bottom: -20px;
    line-height: 30px;
    cursor: pointer;

    a {
      color: #999;
    }
  }
</style>
