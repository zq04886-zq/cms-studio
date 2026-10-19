import { useEditorStore } from '../store/index.js'
class Postmessage {
  constructor() {
    this.targetOrigin = import.meta.env.PROD ? window.location.origin : 'http://127.0.0.1:3011'
    this.postMessageType = {
      pageHeightChange: 'pageHeightChange',
      pageChange: 'pageChange',
      setActive: 'setActive'
    }
  }
  postMessage(type, json) {
    let message = {
        type: this.postMessageType[type],
        value: JSON.parse(JSON.stringify(json))
    }
    window.parent.postMessage(message, this.targetOrigin)
  }
  listenMessage() {
    window.addEventListener('message', (event) => {
      if (event.origin === this.targetOrigin) {
        switch (event.data.type) {
          case 'pageChange':
            useEditorStore().changeComponent(event.data.value)
            break
          case 'setPreview':
            useEditorStore().setPreview(event.data.value)
            break
          case 'deletePreview':
            useEditorStore().deletePreview(event.data.value)
            break
          case 'setActive':
            useEditorStore().setActiveId(event.data.value)
            break
          default:
        }
      }
    }, false)
  }
}
export default new Postmessage()
