<template>
 <aside class="studio-sidebar">
  <router-link to="/home" class="sidebar-brand" aria-label="Studio 首页"><span class="studio-glyph">／</span><strong>Studio</strong></router-link>
  <button class="sidebar-create" @click="createPage"><i class="el-icon-edit-outline"/><span>新建页面</span><kbd>＋</kbd></button>
  <nav aria-label="主导航"><router-link to="/home"><i class="el-icon-house"/><span>工作台</span></router-link><router-link to="/activity"><i class="el-icon-folder-opened"/><span>我的页面</span></router-link></nav>
  <div class="sidebar-foot"><span class="account-avatar">{{(username || 'S').slice(0,1).toUpperCase()}}</span><div><strong>{{username || '管理员'}}</strong><small>个人工作空间</small></div></div>
 </aside>
</template>
<script>
import { useEditorStore } from '@/store/index.js'

export default {name:'Sidebar',data:()=>({username:localStorage.getItem('username')}),methods:{createPage(){useEditorStore().SET_INIT_PAGE_DATA();this.$router.push('/decorate')}}}
</script>
