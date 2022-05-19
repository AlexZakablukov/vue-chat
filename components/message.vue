<template>
  <div class="message" :style="{ height: height }">
    <div class="message-text">{{ message.text }}</div>
  </div>
</template>

<script>
import { getRndInteger } from '@/utils/global'

export default {
  name: 'MessageChat',
  props: {
    message: {
      type: Object,
      required: true,
    },
  },
  computed: {
    height() {
      return getRndInteger(3, 15) * 10 + 'px'
    },
  },
}
</script>

<style lang="css">
.message {
  display: flex;
  align-items: center;
  padding: 8px;
  cursor: pointer;
  border-radius: 4px;
  transition: 0.2s ease-in-out;
}
.message:hover {
  background-color: lightslategray;
}
</style>
