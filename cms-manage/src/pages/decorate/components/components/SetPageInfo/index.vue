<template>
  <div>
    <ComTitle title="页面设置" />

    <!-- 页面名称 -->
    <ComGroup title="页面名称" name-black content-block>
      <el-input
        v-model.lazy="name"
        class="input-name"
        placeholder="请输入页面名称"
      />
    </ComGroup>

    <!-- 页面描述 -->
    <ComGroup title="微信分享文案" name-black content-block>
      <el-input
        v-model.lazy="shareDesc"
        class="input-name"
        maxlength="28"
        placeholder="用户通过微信分享给朋友时显示，最多28个汉字"
      />
    </ComGroup>

    <!-- 微信分享卡片 -->
    <ComGroup
      title="微信分享卡片"
      tips="图片建议长宽比为5:4"
      name-black
      content-block
    >
      <el-button type="text" class="mr-15" @click="shareImage = ''">
        重置
      </el-button>
      <UpLoadBox v-model:img-url="shareImage" @editImg="showDialogImage('shareImage')" />
    </ComGroup>

    <!-- 分割线 -->
    <ComDivider />

    <!-- 颜色配置 -->
    <ComGroup title="背景颜色">
      <el-button type="text" class="mr-15" @click="backgroundColor = initBgColor">
        重置
      </el-button>
      <el-color-picker v-model="backgroundColor" size="small" />
    </ComGroup>

    <!-- 背景图片 -->
    <ComGroup title="背景图片">
      <el-button type="text" class="mr-15" @click="backgroundImage = ''">
        重置
      </el-button>
      <UpLoadBox v-model:img-url="backgroundImage" @editImg="showDialogImage('backgroundImage')" />
    </ComGroup>

    <!-- 背景图片位置 -->
    <ComGroup v-if="backgroundImage" title="背景图片位置">
      <el-radio v-model="backgroundPosition" label="top">
        居上
      </el-radio>
      <el-radio v-model="backgroundPosition" label="bottom">
        居底
      </el-radio>
    </ComGroup>
  </div>
</template>

<script>
import { useEditorStore } from '@/store/index.js'

import ComTitle from '@/components/BasicUi/ComTitle.vue'
import ComGroup from '@/components/BasicUi/ComGroup.vue'
import ComDivider from '@/components/BasicUi/ComDivider.vue'
import UpLoadBox from '@/components/BasicUi/UpLoadBox.vue'

export default {
  name: 'SetPageInfo',
  components: { ComTitle, ComGroup, ComDivider, UpLoadBox },
  data() {
    return {
      // 初始背景颜色
      initBgColor: ''
    }
  },
  computed: {
    // 页面名称
    name: {
      get: function() {
        return useEditorStore().pageData.name
      },
      set: function(val) {
        this.updatePageInfo({ name: val })
      }
    },
    // 微信分享文案
    shareDesc: {
      get: function() {
        return useEditorStore().pageData.shareDesc
      },
      set: function(val) {
        this.updatePageInfo({ shareDesc: val })
      }
    },
    // 微信分享卡片
    shareImage: {
      get: function() {
        return useEditorStore().pageData.shareImage
      },
      set: function(val) {
        this.updatePageInfo({ shareImage: val })
      }
    },
    // 背景颜色
    backgroundColor: {
      get: function() {
        return useEditorStore().pageData.backgroundColor
      },
      set: function(val) {
        this.updatePageInfo({ backgroundColor: val })
      }
    },
    // 背景图片
    backgroundImage: {
      get: function() {
        return useEditorStore().pageData.backgroundImage
      },
      set: function(val) {
        this.updatePageInfo({ backgroundImage: val })
      }
    },
    // 背景图片位置
    backgroundPosition: {
      get: function() {
        return useEditorStore().pageData.backgroundPosition
      },
      set: function(val) {
        this.updatePageInfo({ backgroundPosition: val })
      }
    }
  },
  methods: {
    // 上传图片
    showDialogImage(key) {
      // useEditorStore().SET_UPIMAGE_VISIBLE(true)
      // useEditorStore().SET_UPIMAGE_FUC(this.upLoadImgSuccess)
      this.uploadKey = key
    },
    // 图片上传成功
    upLoadImgSuccess(imgUrl) {
      // 修改图片
      this[this.uploadKey] = imgUrl
    },
    // 更改配置数据
    updatePageInfo(value) {
      useEditorStore().SET_PAGE_CONFIG(value)
    }
  }
}
</script>
