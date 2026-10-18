<template>
  <div class="noticeBar">
    <van-notice-bar
      left-icon="volume-o"
      :background="styleModel.backgroundColor"
      :scrollable="noticeList.length > 1"
    >
      <template v-if="iconUrl" #left-icon>
        <img class="icon-img" :src="iconUrl" alt="">
      </template>
      <template #default>
        <div v-for="(item,index) in noticeList" :key="index" class="noticeItem"
             @click="jumpLink(item.link)"
        >
          <span :style="{...styleModel}">{{ item.text }}</span>
        </div>
      </template>
    </van-notice-bar>
  </div>
</template>

<script>
import JumpLink from '@/mixin/jumpLink'

export default {
  name: 'Notice',
  mixins: [JumpLink],
  props: {
    property: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      formModel: {}
    }
  },
  computed: {
    styleModel() {
      return {
        backgroundColor: this.formModel.backgroundColor,
        color: this.formModel.textColor
      }
    },
    noticeList() {
      return this.formModel.noticelist || []
    },
    iconUrl() {
      return this.formModel.imageUrl
    }
  },
  watch: {
    property (val) {
      if (val) {
        this.setStyle(val)
      }
    }
  },
  mounted() {
    this.formModel = this.property
  },
  methods: {
    setStyle(val) {
      this.formModel = val
    }
  }
}
</script>
<style scoped lang='less'>
.noticeBar{
  /deep/ .van-notice-bar__content{
    display: flex !important;
  }
  .noticeItem{
    margin-right: 20px;
  }
  .icon-img{
    width:16px;
    height:16px;
    margin-right:8px
  }
}
</style>
