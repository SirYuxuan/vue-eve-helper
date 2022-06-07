<template>
  <comment :post-id="sid" />
</template>

<script>
  import comment from '@/components/comment'
  export default {
    name: 'Comment',
    components: {
      comment,
    },
    data() {
      return {
        sid: 0,
      }
    },
    created() {
      this.sid = this.$route.query.id
    },
  }
</script>

<style scoped></style>
