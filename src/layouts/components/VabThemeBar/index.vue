<template>
  <span v-if="themeBar">
    <vab-icon
      title="主题配置"
      :icon="['fas', 'palette']"
      @click="openSetting"
    />
  </span>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'VabThemeBar',
    data() {
      return {}
    },
    computed: {
      ...mapGetters({
        themeBar: 'settings/themeBar',
      }),
      classObj() {
        return {
          mobile: this.device === 'mobile',
        }
      },
    },
    created() {},
    methods: {
      openSetting() {
        this.$emit('openSetting')
      },
    },
  }
</script>
