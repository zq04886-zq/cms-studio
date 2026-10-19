<template>
  <div class="home">
    <!-- 搭建框架 -->
    <PageHead />
    <PageLeft />
    <PageView />
    <PageRight />

    <!-- 组件的公共配置内容 -->
    <!-- 上传图片组件 -->
    <UpLoadImg v-model:dialog-image-visible="dialogImageVisible" @upLoadImgSuccess="upLoadImgSuccess" />
  </div>
</template>
<script>
import { useEditorStore } from '@/store/index.js'

// 结构组件
import PageHead from './components/PageHead.vue'
import PageLeft from './components/PageLeft.vue'
import PageView from './components/PageView.vue'
import PageRight from './components/PageRight.vue'
import { createRandomId } from '@/utils/index.js'
// 公共配置组件
import UpLoadImg from '@/components/BasicConfig/UpLoadImg.vue'
// 获取页面数据
import { getCmsPageById } from '@/api/activity/index.js'
export default {
  name: 'App',
  components: {
    PageHead,
    PageLeft,
    PageView,
    PageRight,
    UpLoadImg
  },
  data() {
    return {

    }
  },
  computed: {
    // 上传图片模态框是否显示
    dialogImageVisible: {
      get: function() {
        return useEditorStore().dialogImageVisible
      },
      set: function(val) {
        useEditorStore().SET_UPIMAGE_VISIBLE(val)
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.getData()
    },
    getData() {
      let pageId = this.$route.query.id
      if (pageId) {
        getCmsPageById(pageId).then(({data}) => {
          this.postDataToH5(data)
        })
      }
    },
    postDataToH5(data) {
      if (data && data.componentList) {
        data.componentList.forEach((item) => {
          if (item.data.validTime && typeof item.data.validTime === 'string') {
            item.data.validTime = JSON.parse(item.data.validTime)
          }
          // 获取的组件数据无id则手动设置随机id
          if (!item.id) {
            const id = createRandomId()
            item.id = item.data.component + '-' + id
          }
        })
        useEditorStore().UPDATE_COMPONENT({data})
        useEditorStore().VIEW_UPDATE()
      }
    },
    // 上传图片成功回调事件
    upLoadImgSuccess(imgUrl) {
      let fuc = useEditorStore().upLoadImgSuccess
      if (fuc) fuc(imgUrl)
    }
  }
}
</script>
