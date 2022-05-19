<template>
  <Loader v-if="conversationLoading" />
  <NotFound v-else-if="!activeConversation" />
  <Conversation v-else />
</template>

<script>
import Vue from 'vue'
import { mapState } from 'vuex'
import Conversation from '~/components/conversation.vue'
import NotFound from '~/components/notFound.vue'
import Loader from '@/components/loader'

export default Vue.extend({
  name: 'IndexPage',
  components: {
    Conversation,
    NotFound,
    Loader,
  },
  layout: 'chat',
  computed: {
    ...mapState('chat', ['activeConversation', 'conversationLoading']),
  },
})
</script>
