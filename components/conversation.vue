<template>
  <div class="conversation">
    <header class="conversation-header">
      <Friend v-if="friend" :friend="friend" />
    </header>
    <div
      ref="conversationContainer"
      class="conversation-container"
      :class="{ 'is-reversed': currentChat.direction === 'top' }"
      @scroll="scrollHandler"
    >
      <div ref="conversationContent" class="conversation-content">
        <template v-for="(message, index) in currentChat.messages">
          <div
            v-if="currentChat.messages.length - unreadMessagesCount === index"
            :key="`unread-separator-${index}`"
            class="unreadSeparator"
          >
            Unread messages
          </div>
          <Message
            :id="message.id"
            :key="message.id"
            :message="message"
            :class="{
              'is-unread':
                currentChat.messages.length - unreadMessagesCount <= index,
            }"
          />
        </template>
      </div>
      <InfiniteScroll
        class="conversation-scroll"
        :options="options"
        @intersect="handleIntersect"
      >
        <template #placeholder> Loading messages </template>
      </InfiniteScroll>
    </div>
    <footer class="conversation-footer">
      <form class="conversation-bar" @submit="handleSubmit">
        <input v-model="text" type="text" name="text" />
        <button type="submit">Send</button>
      </form>
    </footer>
    <button
      v-if="unreadMessagesCount"
      class="unreadButton"
      @click="readAllHandler"
    >
      {{ unreadMessagesCount }}
    </button>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Friend from '~/components/friend.vue'
import Message from '~/components/message.vue'
import InfiniteScroll from '@/components/infiniteScroll'
import { createMessage } from '@/utils/chat'

export default {
  name: 'ConversationChat',
  components: {
    Friend,
    Message,
    InfiniteScroll,
  },
  data() {
    return {
      preventScrollOffset: 50,
      text: '',
    }
  },
  computed: {
    ...mapState('chat', [
      'friends',
      'activeConversation',
      'conversations',
      'currentChat',
    ]),
    friend() {
      return this.friends.find((f) => f.id === this.activeConversation)
    },
    options() {
      return {
        threshold: 0,
        rootMargin: '100px 0px 0px 0px',
        root: this.$refs.conversationContainer,
      }
    },
    unreadMessagesCount() {
      return (
        this.conversations.find(
          (conversation) => conversation.id === this.activeConversation,
        )?.unreadMessagesCount || 0
      )
    },
  },
  watch: {
    'currentChat.lastLoadedMessageId'(id) {
      if (id && !this.currentChat.isScrollOver) {
        this.scrollToLastLoadedMessage()
      }
    },
  },
  mounted() {},
  beforeDestroy() {
    this.$store.commit('chat/resetCurrentChat')
  },
  methods: {
    scrollToLastLoadedMessage() {
      if (this.currentChat.lastLoadedMessageId) {
        this.$nextTick(() => {
          const lastLoadedMessage = document.getElementById(
            this.currentChat.lastLoadedMessageId,
          )
          if (!lastLoadedMessage) {
            return
          }
          lastLoadedMessage.scrollIntoView({
            block: this.currentChat.direction === 'bottom' ? 'end' : 'start',
            behavior: 'auto',
          })
        })
      }
    },
    async loadMore() {
      await this.$store.dispatch('chat/loadMessages')
    },
    async handleIntersect({ loaded, complete }) {
      if (this.currentChat.hasNextPage && !this.currentChat.isMessagesLoading) {
        await this.loadMore()
        this.scrollToLastLoadedMessage()
        loaded()
      } else {
        complete()
      }
    },
    scrollHandler() {
      if (!this.$refs.conversationContainer) return

      const container = this.$refs.conversationContainer

      const scrollHeight = container.scrollHeight - this.preventScrollOffset
      const scrolled = container.scrollTop + container.clientHeight

      if (scrollHeight > scrolled) {
        if (!this.currentChat.isScrollOver)
          this.$store.commit('chat/setCurrentChat', {
            isScrollOver: true,
          })
        return
      }

      if (this.currentChat.isScrollOver) {
        this.$store.commit('chat/setCurrentChat', {
          isScrollOver: false,
        })
        this.$store.commit('chat/resetUnreadMessages', this.activeConversation)
      }
    },
    handleSubmit(event) {
      event.preventDefault()

      if (!this.text.trim()) {
        return
      }

      this.$store.dispatch('chat/addMessage', {
        conversationId: this.activeConversation,
        message: createMessage(this.text),
      })

      this.text = ''
    },
    readAllHandler() {
      this.$store.commit('chat/setCurrentChat', {
        lastLoadedMessageId:
          this.currentChat.messages[this.currentChat.messages.length - 1].id,
      })
      this.scrollToLastLoadedMessage()
    },
  },
}
</script>

<style lang="css">
.conversation {
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
}
.conversation-container {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: 16px;
  overflow-y: auto;
  position: relative;
}
.conversation-container.is-reversed .conversation-scroll {
  order: -1;
}
.conversation-header,
.conversation-footer {
  background: lightslategray;
  padding: 4px;
}
.conversation-footer {
  padding: 12px;
}
.unreadSeparator {
  background-color: grey;
  text-align: center;
  margin: 8px -16px;
  padding: 8px 0;
  color: white;
}
.unreadButton {
  position: absolute;
  bottom: 16px;
  right: 16px;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  background-color: darkgrey;
}
</style>
