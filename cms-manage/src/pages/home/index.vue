<template>
<main class="studio-home">
 <header class="studio-welcome"><span class="studio-mark">／</span><span>CMS Studio</span><span class="studio-user">{{ username }} · 管理员</span></header>
 <section class="studio-hero"><p class="studio-kicker">从一个想法，到一个页面。</p><h1>让内容<br>自由成形。</h1><p class="studio-description">拖入组件，调整内容，即时预览。<br>在同一工作台里，完成移动端活动页面的搭建。</p><router-link class="studio-cta" to="/activity">进入活动管理 <span>↗</span></router-link><router-link class="studio-secondary" to="/decorate">创建新页面</router-link></section>
 <section class="studio-features"><article><i class="el-icon-rank"/><h2>拖拽编排</h2><p>组合图片、轮播与商品组件，搭建页面结构。</p></article><article><i class="el-icon-edit-outline"/><h2>精细配置</h2><p>集中调整内容、跳转链接和组件展示属性。</p></article><article><i class="el-icon-mobile-phone"/><h2>移动端预览</h2><p>查看 H5 渲染效果，再保存页面配置。</p></article></section>
 <footer class="studio-footer">CMS Studio <span>内容，由你定义。</span></footer>
</main></template>

<script>
// import { mapGetters } from 'vuex'
export default {
  name: 'About',
  data() {
    return {
      username: localStorage.getItem('username')
    }
  }
}
</script>

<style lang="less" scoped>
.card {
  width: 329px;
  // height: 183px;
  // overflow: hidden;
  display: flex;
  align-items: center;
  .avatar {
    float: left;
    margin-right: 15px;
    width: 70px;
    height: 70px;
  }
  .name {
    color: #409eff;
    font-size: 20px;
    height: 28px;
    line-height: 28px;
    margin-top: 10px;
    font-weight: 500;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .phone {
    font-size: 13px;
    height: 24px;
    line-height: 24px;
    color: #333;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .line {
    width: 100%;
    height: 1px;
    background-color: #eee;
    margin: 15px 0 8px;
  }
}
.flex {
  display: flex;
  align-items: center;
}
.content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.content-desc {
  margin-right: 10px;
  .sub-title {
    font-size: 30px;
    line-height: 42px;
    color: #333;
  }
  .title {
    width: 420px;
    font-size: 33px;
    line-height: 62px;
    color: #409eff;
  }
  .desc {
    font-size: 14px;
    color: #999;
  }
}
</style>
