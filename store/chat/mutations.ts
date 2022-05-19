import { ChatState } from './types'
import { IChat, IMessage } from '~/types/chat'
import { initialCurrentChat } from '~/store/chat/state'

export default {
  setActiveConversation(state: ChatState, id: string) {
    state.activeConversation = id
  },
  setConversationLoading(state: ChatState, flag: boolean) {
    state.conversationLoading = flag
  },
  setCurrentChat(state: ChatState, currentChat: IChat) {
    state.currentChat = { ...state.currentChat, ...currentChat }
  },
  resetCurrentChat(state: ChatState) {
    state.currentChat = initialCurrentChat
  },
  addMessageToConversation(
    state: ChatState,
    { conversationId, message }: { conversationId: string; message: IMessage },
  ) {
    const conversationIndex = state.conversations.findIndex(
      (conversation) => conversation.id === conversationId,
    )
    const { id, messages, unreadMessagesCount } =
      state.conversations[conversationIndex]

    const updateConversation = {
      id,
      messages: [...messages, message],
      unreadMessagesCount: unreadMessagesCount + 1,
    }

    state.conversations[conversationIndex] = updateConversation
  },
}
