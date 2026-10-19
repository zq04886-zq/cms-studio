
import { defineStore } from 'pinia'
import Postmessage from '@/utils/Postmessage.js'



/** 图文导航-测试数据--start */
const base = {
  text: '乐吧乐吧乐吧乐吧乐吧乐吧乐吧乐吧阿水大大大大是大',
  src: 'https://yun.duiba.com.cn/saas/images/decoration-icons/single.png',
  link: 'http://www.baidu.com'
}

const mini = {
  text: '乐吧乐',
  src: 'https://yun.duiba.com.cn/saas/images/decoration-icons/single.png',
  link: ''
}

const list8 = new Array(10).fill(null).map((item, index) => {
  const current = parseInt(Math.random(0, 1) * 2)
  const text = current === 0 ? base.text : mini.text
  const link = current === 0 ? `${base.link}/${index}?t=${index}` : mini.link
  return Object.assign({}, base, {text: text + (index + 1), link})
})

/** 测试数据--end */

export const useEditorStore = defineStore('editor', {
  state: () => ({
    pageData: {
      componentList: [
      ]
    },
    previewId: null, // 当前选中的组件id
    previewHeight: 0,
    componentsTopList: []
  }),
  actions: {
    addComponent(com) {
      this.pageData.componentList.push(com)
      this.postPageChange()
    },
    deleteComponent(id) {
      const index = this.pageData.componentList.findIndex(item => item.id === id)
      this.pageData.componentList.splice(index, 1)
      this.postPageChange()
    },
    changeSelected(id) {
      this.previewId = id
      Postmessage.postMessage('setActive', id)
    },
    // 从后台接收数据，更新crs页面数据
    changeComponent({ disabledRestHeight, value }) {
      this.pageData = value;
      if (disabledRestHeight) return
      this.getComponentsTop()
    },
    changeComponentPosition(data) {
      this.postPageChange()
    },
    // 像后台发送页面数据变更事件
    postPageChange() {
      Postmessage.postMessage('pageChange', this.pageData)
      this.getComponentsTop()
    },
    setComponent(data) {
      this.pageData.componentList = data
    },
    // 添加预添加组件
    setPreview(index) {
      this.deletePreview()
      const previewComponent = {
        data: {
          component: 'blank'
        }
      }
      this.pageData.componentList.splice(index, 0, previewComponent)
    },
    // 删除预添加组件
    deletePreview() {
      this.pageData.componentList = this.pageData.componentList.filter(item => item.data.component != "blank")
    },
    setActiveId(id) {
      this.previewId = id
    },
    getComponentsTop() {
      setTimeout(() => {
        let elements = document.getElementsByClassName('components')
        this.componentsTopList = []
        for (let i = 0; i < elements.length; i++) {
          this.componentsTopList.push(elements[i].offsetTop + elements[i].offsetHeight)
        }
        this.previewHeight = document.getElementById('wrap').offsetHeight
        Postmessage.postMessage('pageHeightChange', {
          height: this.previewHeight,
          componentsTopList: this.componentsTopList
        })
      })
    }
  }
})
