<template>
  <fc-table-search
    ref="table"
    v-model="tableData"
    class-name="searchListPage"
    :form-items="formItems"
    :table-columns="tableColumns"
    :form-config="{'label-width': '100px'}"
    @requestMethod="getTableData"
  >
    <!-- 搜索按钮区域 -->
    <template slot="isCompSearch">
      <!-- <fc-button :loading="exportDetailLoading" debounce @click="exportDetailExcel">导出</fc-button> -->
    </template>
    <!-- 操作表格区域 -->
    <template #handleDetail="{ row }">
      <el-button
        type="text"
        size="mini"
        @click="onEdit(row.id)"
      >
        编辑
      </el-button>
      <el-button
        size="mini"
        type="text"
        @click="onToggleActivity(row)"
      >
        {{ row.isAbled === 0 ? '上线' : '下线' }}
      </el-button>
      <el-button
        size="mini"
        type="text"
        @click="onPreview(row.id, row.title)"
      >
        预览
      </el-button>
      <el-button size="mini" type="text" @click="onDelete(row.id)">
        删除
      </el-button>
    </template>
    <template slot="handleLeft">
      <el-button type="primary" @click="onAdd">
        <i class="el-icon-plus" />新增页面
      </el-button>
    </template>
  </fc-table-search>
</template>

<script>
// import { checkBatchPageList } from '@/api/accountCheck/recordQuery'
// import { isEmpty } from '@/utils/index'
import {
  getCmsPageList,
  updateStatus,
  deletePage
} from '@/api/activity'
import { forEach } from 'lodash-es'
// import TableFlexHeight from '@/mixins/tableFlexHeight'
// import { activityStatus } from '@/config/activity'
export default {
  components: {},
  data () {
    return {
      tableData: { } // 收集查询
    }
  },
  computed: {
    // 搜索表单定义
    formItems () {
      return [
        { comp: 'input', prop: 'name', label: '页面标题', clearable: true },
        { comp: 'select',
          prop: 'isAbled',
          label: '页面状态',
          options: [{
            value: 0,
            label: '下线'
          }, {
            value: 1,
            label: '上线'
          }],
          includeAll: false }
      ]
    },
    // 表格定义
    tableColumns() {
      return [
        { prop: 'id', label: '页面ID' },
        { prop: 'name', label: '页面标题' },
        { prop: 'status',
          label: '页面状态'
          // width: 80
        },
        { prop: 'create_time',
          label: '创建时间'
          // width: 120
        },
        { prop: 'update_time',
          label: '更新时间'
          // width: 120
        },
        {
          label: '操作',
          fixed: 'right',
          // width: 220,
          slotName: 'handleDetail'
          // render: (h, {row}) => {
          //   return <div>
          //     <el-button size="mini" type="text" onClick="onEdit(row.id)">编辑</el-button>
          //     <el-button size="mini" type="text" onClick="onToggleActivity(row)">{ row.isAbled === 0 ? '上线' : '下线' }</el-button>
          //     <el-button size="mini" type="text" onClick="onPreview(row.id, row.title)">预览</el-button>
          //     <el-button size="mini" type="text" onClick="onDelete(row.id)">删除</el-button>

          //   </div>
          // }
        }
      ]
    }
  },
  created() { },

  methods: {
    // 请求数据
    async getTableData ({ current, size, total, ...tableData }, fn) {
      try {
        let { ...params } = tableData
        params.pageNum = current
        params.pageSize = size
        let res = await getCmsPageList(params)
        let { list, total } = res.data

        this.tableData.total = total
        this.tableData.list = list || []
        forEach(list, item => {
          item.status = item.is_abled ? '上线' : '下线'
        })
        this.formatData()
        fn({
          data: list,
          total: total
        })
      } catch (error) {
        fn({message: error.message})
      }
    },

    formatData() {
      this.tableData.list.forEach((item) => {
        item.isAbled = item.is_abled
      })
    },
    // 编辑
    onEdit(id) {
      console.log(this.$router, 'router')
      this.$router.open({path: '/decorate', query: { id }})
    },

    // 上下线活动
    onToggleActivity(row) {
      if (row.isAbled === 0) {
        this.online(row, 1)
      } else {
        this.offline(row, 0)
      }
    },
    offline(row, isAbled) {
      this.$confirm(`是否确定下线活动【${row.name}】?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        updateStatus({id: row.id, isAbled})
          .then(() => {
            this.$message.success('下线成功')
            this.$refs.table.onRefresh(true)
          })
          .catch(err => {
            this.$message.warning(`操作失败: ${err.message}`, 'warning')
          })
      }).catch(() => {})
    },
    online(row, isAbled) {
      this.$set(row, 'loading', true)
      updateStatus({id: row.id, isAbled})
        .then(() => {
          this.$message.success('上线成功')
          this.$refs.table.onRefresh(true)
        })
        .catch(err => {
          this.$message.warning(`操作失败: ${err.message}`, 'warning')
        }).finally(() => {
          this.$set(row, 'loading', false)
        })
    },
    // 删除活动
    onDelete(id) {
      this.$confirm('是否确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      })
        .then(() => {
          deletePage({ id })
            .then(() => {
              this.$message.success('删除成功')
              this.$refs.table.onRefresh(true)
            })
            .catch(err => {
              this.$message.warning(`删除失败：${err.message}`, 'warning')
            })
        })
        .catch(() => {})
    },

    // 新增活动页
    onAdd() {
      this.$store.commit('SET_INIT_PAGE_DATA')
      this.$router.open('/decorate')
    },
    // 活动预览
    onPreview(id) {
      let url = this.$router.resolve({ path: `/preview`, query: { id, data: this.$store.state.wxParams } })
      window.open(url.href, '_blank')
    }
  }
}
</script>
