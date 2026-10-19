<template>
  <ComGroup title="生效时间">
    <el-date-picker v-model="dateArray"
                    size="small"
                    type="daterange"
                    format="YYYY-MM-DD"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
    />
  </ComGroup>
</template>
<script>
import ComGroup from '@/components/BasicUi/ComGroup.vue'
export default {
  components: {ComGroup},
  props: {
    modelValue: {
      type: Array, default: null
    }
  },
  computed: {
    dateArray: {
      get() {
        return this.modelValue
      },
      set(v) {
        let newDate = v ? [v[0].getTime(), v[1].getTime()] : []
        this.$emit('update:modelValue', newDate)
      }
    }
  }
}
</script>
<style scoped lang="less">
    :deep(.el-date-editor) {
        width: 100% !important;
    }
</style>
