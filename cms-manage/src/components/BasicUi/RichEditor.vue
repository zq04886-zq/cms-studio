<template><div><div ref="editor" /></div></template>
<script>
import { markRaw } from 'vue'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
export default {
 props: { modelValue: { type: String, default: '' }, options: Object },
 emits: ['update:modelValue'],
 mounted() {
  this.quill = markRaw(new Quill(this.$refs.editor, { theme: 'snow', ...this.options }))
  this.quill.clipboard.dangerouslyPasteHTML(this.modelValue || '')
  this.onChange = () => this.$emit('update:modelValue', this.quill.root.innerHTML)
  this.quill.on('text-change', this.onChange)
 },
 watch: { modelValue(value) { if (this.quill && value !== this.quill.root.innerHTML) this.quill.clipboard.dangerouslyPasteHTML(value || '') } },
 beforeUnmount() { this.quill?.off('text-change', this.onChange) }
}
</script>
