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

    const isActiveConversation = conversationId === state.activeConversation

    const updatedConversations = [...state.conversations]
    updatedConversations[conversationIndex] = {
      id,
      messages: [...messages, message],
      unreadMessagesCount:
        isActiveConversation && !state.currentChat.isScrollOver
          ? 0
          : unreadMessagesCount + 1,
    }

    state.conversations = updatedConversations
  },
  resetUnreadMessages(state: ChatState, conversationId: string) {
    const conversationIndex = state.conversations.findIndex(
      (conversation) => conversation.id === conversationId,
    )

    const updatedConversations = [...state.conversations]
    updatedConversations[conversationIndex].unreadMessagesCount = 0

    state.conversations = updatedConversations
  },
}
