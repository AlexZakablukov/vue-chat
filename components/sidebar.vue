<template>
  <aside class="sidebar">
    <h3 class="sidebar-title">Conversations list</h3>
    <ul v-if="conversations.length" class="sidebar-list">
      <li
        v-for="conversation in conversations"
        :key="conversation.id"
        class="sidebar-item"
        @click="() => clickHandler(conversation.id)"
      >
        <Friend
          :friend="friends.find((friend) => friend.id === conversation.id)"
          :active="activeConversation === conversation.id"
        />
        <div v-if="conversation.unreadMessagesCount" class="unreads">
          {{ conversation.unreadMessagesCount }}
        </div>
        <button @click.stop="() => addMessageToConversation(conversation.id)">
          Add Message
        </button>
      </li>
    </ul>
  </aside>
</template>

<script>
import { mapState } from 'vuex'
import Friend from '~/components/friend.vue'
import { createMessage } from '@/utils/chat'

export default {
  name: 'SidebarChat',
  components: {
    Friend,
  },
  computed: {
    ...mapState('chat', ['friends', 'activeConversation', 'conversations']),
  },
  methods: {
    async clickHandler(id) {
      if (id === this.activeConversation) {
        return
      }
      await this.$store.dispatch('chat/setActiveConversation', id)
    },
    addMessageToConversation(conversationId) {
      const message = createMessage('New message')
      this.$store.dispatch('chat/addMessage', {
        conversationId,
        message,
      })
    },
  },
}
</script>

<style lang="css">
.sidebar {
  padding: 16px;
  background: #cccccc;
}
.sidebar-title {
  margin-bottom: 16px;
}
.sidebar-list {
  list-style: none;
  margin: 0;
  padding: 0;
}
.sidebar-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: 0.2s ease-in-out;
  padding-right: 8px;
  cursor: pointer;
}
.sidebar-item:hover {
  background-color: lightslategray;
}
.unreads {
  background: white;
  border-radius: 50%;
  padding: 4px;
  min-width: 24px;
  min-height: 24px;
  text-align: center;
  font-size: 12px;
}
</style>
