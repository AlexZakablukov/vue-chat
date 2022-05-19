<template>
  <div class="message" :style="{ height: height }">
    <div v-if="!editable" class="message-text">{{ message.text }}</div>
    <div v-else>
      <form class="message-edit" @submit="handleSubmit">
        <input v-model="text" type="text" name="text" />
        <button type="submit">Send</button>
        <button type="button" @click="disableEdit">Cancel</button>
      </form>
    </div>
    <div class="message-actions">
      <button @click="enableEdit">Edit</button>
    </div>
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
    editable: {
      type: Boolean,
      default: false,
    },
    enableEdit: {
      type: Function,
      default: () => {},
    },
    disableEdit: {
      type: Function,
      default: () => {},
    },
    updateHandler: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      text: this.message.text,
    }
  },
  computed: {
    height() {
      return getRndInteger(3, 15) * 10 + 'px'
    },
  },
  methods: {
    handleSubmit(event) {
      event.preventDefault()

      if (!this.text.trim()) {
        return
      }

      this.updateHandler({
        ...this.message,
        text: this.text,
      })
    },
  },
}
</script>

<style lang="css">
.message {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
  cursor: pointer;
  border-radius: 4px;
  transition: 0.2s ease-in-out;
}
.message:hover {
  background-color: lightslategray;
}

.message-actions {
  display: none;
  align-items: center;
  justify-content: center;
}

.message-actions button {
  margin: 0 8px;
}

.message:hover .message-actions {
  display: flex;
}
</style>
