<template><i v-if="icon" :class="'iconfont icon-' + icon"/><span v-if="title">{{ title }}</span></template>
<script>export default { props: { icon: String, title: String } }</script>
