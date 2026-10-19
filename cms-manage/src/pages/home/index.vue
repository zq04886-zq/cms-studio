<template>
  <main class="studio-home">
    <section class="studio-start">
      <div class="studio-wordmark"><span class="studio-glyph" aria-hidden="true">／</span> Studio</div>
      <h1>今天，搭建什么页面？</h1>
      <form class="studio-compose" @submit.prevent="createPage">
        <label class="sr-only" for="page-name">新页面名称</label>
        <input id="page-name" v-model="pageName" maxlength="128" placeholder="给你的新页面起个名字" autocomplete="off">
        <div class="compose-bottom"><span><i class="el-icon-files" /> 移动端页面</span><button type="submit" aria-label="创建页面"><i class="el-icon-top" /></button></div>
      </form>
      <div class="studio-shortcuts"><button @click="createPage"><i class="el-icon-plus" /> 空白画布</button><router-link to="/activity"><i class="el-icon-folder-opened" /> 我的页面</router-link></div>
      <p class="studio-hint">从一个想法开始，拖入组件，让页面成形。</p>
    </section>
    <section class="studio-recents">
      <div class="recent-heading"><h2>最近编辑</h2><router-link to="/activity">查看全部</router-link></div>
      <p v-if="loading" class="empty-recents">正在读取页面…</p>
      <p v-else-if="!pages.length" class="empty-recents">还没有页面。在上方创建你的第一个作品。</p>
      <router-link v-for="page in pages" :key="page.id" class="recent-row" :to="{path:'/decorate',query:{id:page.id}}"><i class="el-icon-document"/><span>{{page.name}}<small>{{page.update_time}}</small></span><em>{{page.is_abled ? '已发布' : '草稿'}}</em><i class="el-icon-arrow-right"/></router-link>
    </section>
  </main>
</template>
<script>
import { useEditorStore } from '@/store/index.js'

import {getCmsPageList} from '@/api/activity/index.js'
export default {
 name:'StudioHome',data:()=>({pageName:'',pages:[],loading:true}),
 created(){getCmsPageList({pageNum:1,pageSize:4}).then(r=>{this.pages=r.data.list}).catch(()=>{}).finally(()=>{this.loading=false})},
 methods:{createPage(){useEditorStore().SET_INIT_PAGE_DATA();if(this.pageName.trim())useEditorStore().SET_PAGE_CONFIG({name:this.pageName.trim()});this.$router.push('/decorate')}}
}
</script>
