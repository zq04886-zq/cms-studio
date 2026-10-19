<template>
 <section class="studio-pages">
  <header class="pages-heading"><div><h1>我的页面</h1><p>你的想法，正在这里成形。</p></div><el-button type="primary" icon="el-icon-plus" @click="createPage">新建页面</el-button></header>
  <form class="pages-toolbar" @submit.prevent="search"><el-input v-model="query.name" placeholder="搜索页面名称" prefix-icon="el-icon-search" clearable @clear="search"/><el-select v-model="query.isAbled" placeholder="所有状态" clearable @change="search"><el-option label="草稿" :value="0"/><el-option label="已发布" :value="1"/></el-select><el-button native-type="submit">搜索</el-button></form>
  <div class="pages-table-wrap">
   <el-table v-loading="loading" :data="pages" empty-text="还没有页面，点击右上角新建" class="pages-table">
    <el-table-column label="页面名称" min-width="220"><template slot-scope="scope"><router-link class="page-title-link" :to="{path:'/decorate',query:{id:scope.row.id}}"><i class="el-icon-document"/>{{scope.row.name}}</router-link><small class="page-id">#{{scope.row.id}}</small></template></el-table-column>
    <el-table-column label="状态" width="110"><template slot-scope="scope"><span class="page-state" :class="{published:scope.row.is_abled}"><i/>{{scope.row.is_abled?'已发布':'草稿'}}</span></template></el-table-column>
    <el-table-column label="更新时间" prop="update_time" min-width="170"/>
    <el-table-column label="操作" width="250"><template slot-scope="scope"><div class="page-actions"><el-button type="text" @click="editPage(scope.row.id)">编辑</el-button><el-button type="text" :loading="busy===scope.row.id" @click="toggle(scope.row)">{{scope.row.is_abled?'下线':'上线'}}</el-button><el-button type="text" @click="preview(scope.row.id)">预览</el-button><el-button type="text" @click="remove(scope.row)">删除</el-button></div></template></el-table-column>
   </el-table>
  </div>
  <footer class="pages-pagination"><span>{{total}} 个页面</span><el-pagination :current-page="pageNum" :page-size="10" :total="total" layout="prev, pager, next" @current-change="changePage"/></footer>
 </section>
</template>
<script>
import {getCmsPageList,updateStatus,deletePage} from '@/api/activity'
export default {
 name:'Pages',data:()=>({query:{name:'',isAbled:''},pageNum:1,pages:[],total:0,loading:false,busy:null}),
 created(){this.load()},
 methods:{
  async load(){this.loading=true;try{const r=await getCmsPageList({...this.query,pageNum:this.pageNum,pageSize:10});this.pages=r.data.list;this.total=r.data.total}catch(e){}finally{this.loading=false}},
  search(){this.pageNum=1;this.load()},changePage(page){this.pageNum=page;this.load()},
  createPage(){this.$store.commit('SET_INIT_PAGE_DATA');this.$router.push('/decorate')},
  editPage(id){this.$router.push({path:'/decorate',query:{id}})},
  preview(id){const url=this.$router.resolve({path:'/preview',query:{id}});window.open(url.href,'_blank','noopener')},
  async toggle(page){
   if(page.is_abled){try{await this.$confirm(`下线“${page.name}”后，公开链接将无法访问。`,'下线页面',{confirmButtonText:'下线',cancelButtonText:'取消',type:'warning'})}catch(e){return}}
   this.busy=page.id;try{await updateStatus({id:page.id,isAbled:page.is_abled?0:1});this.$message.success(page.is_abled?'下线成功':'上线成功');await this.load()}catch(e){}finally{this.busy=null}
  },
  async remove(page){
   try{await this.$confirm(`确定删除“${page.name}”？此操作不可撤销。`,'删除页面',{confirmButtonText:'删除',cancelButtonText:'取消',type:'warning'})}catch(e){return}
   try{await deletePage({id:page.id});this.$message.success('删除成功');if(this.pages.length===1&&this.pageNum>1)this.pageNum--;await this.load()}catch(e){}
  }
 }
}
</script>
