<template>
  <div class="yx-file-tree">
    <el-tree
      style="max-height: 400px"
      :props="defaultProps"
      :load="loadNode"
      lazy
      icon-class="none"
      @node-click="handleNodeClick"
    >
      <span slot-scope="{ node, data }" class="custom-tree-node">
        <span>
          <span v-if="node.data.isFile">
            <vab-remix-icon icon-class="yml" />
          </span>
          <span v-else>
            <vab-remix-icon v-if="node.expanded" icon-class="folder_open" />
            <vab-remix-icon v-if="!node.expanded" icon-class="folder" />
          </span>
          {{ node.label }}
        </span>
      </span>
    </el-tree>
  </div>
</template>
<style>
  .yx-file-tree {
    height: 500px;
    overflow: scroll;
  }
</style>
<script>
  import { doGet } from '@/api/crud/crud'
  export default {
    name: 'FileTree',
    props: {
      id: {
        type: Number,
        required: true,
      },
      nodeClick: {
        type: Function,
        required: true,
      },
    },
    data() {
      return {
        data: [],
        defaultProps: {
          children: 'children',
          label: 'title',
          isLeaf: 'isFile',
        },
      }
    },
    created() {},
    methods: {
      handleNodeClick(data, node) {
        this.nodeClick(data, node)
      },
      loadNode(node, resolve) {
        if (node.level === 0) {
          doGet('sde/listPath', { id: this.id }).then((res) => {
            return resolve(res.data)
          })
          return
        }
        let path = node.data.title
        let parent = node.parent
        while (parent && parent.data) {
          path = parent.data.title + '/' + path
          parent = parent.parent
        }
        doGet('sde/listPath', { id: this.id, path: path }).then((res) => {
          return resolve(res.data)
        })
      },
    },
  }
</script>

<style scoped></style>
