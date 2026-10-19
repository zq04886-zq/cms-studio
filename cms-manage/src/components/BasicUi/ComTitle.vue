<template>
  <div class="component-title">
    {{ title }}
  </div>
</template>
<script>
export default { props: ['title'] }
</script>

<style lang="less" scoped>
// 组件编辑标题
.component-title {
  margin-bottom: 14px;
  padding: 20px 16px;
  border-bottom: 1px solid #f2f4f6;
  font-size: 18px;
  font-weight: 600;
  line-height: 24px;
  color: #323233;
}
</style>
