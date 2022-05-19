import { ChatState } from './types'
import { ActionsArguments } from '~/types/store'
import { delay } from '~/utils/global'
import { IMessage } from '~/types/chat'

export default {
  setActiveConversation({ commit }: ActionsArguments<ChatState>, id: string) {
    commit('setConversationLoading', true)
    return delay(100).then(() => {
      commit('setActiveConversation', id)
      commit('setConversationLoading', false)
    })
  },
  loadMessages({ state, commit }: ActionsArguments<ChatState>) {
    commit('setCurrentChat', { isMessagesLoading: true })
    const allMessages =
      state.conversations.find(
        (conversation) => conversation.id === state.activeConversation,
      )?.messages ?? []

    const { messages, page, size, hasNextPage, direction } = state.currentChat
    if (!hasNextPage) {
      return
    }

    let from: number
    let to: number

    switch (direction) {
      // from bottom to top
      case 'top':
        from = Math.max(allMessages?.length - size * page, 0)
        to = Math.max(allMessages?.length - size * (page - 1), 0)
        break
      // from top to bottom
      default:
        from = size * (page - 1)
        to = page * size
        break
    }

    const newMessages = allMessages?.slice(from, to)

    if (!newMessages?.length) {
      commit('setCurrentChat', {
        hasNextPage: false,
        isMessagesLoading: false,
      })
      return
    }

    return delay(500).then(() => {
      commit('setCurrentChat', {
        messages:
          direction === 'top'
            ? [...newMessages, ...messages]
            : [...messages, ...newMessages],
        page: page + 1,
        isMessagesLoading: false,
        lastLoadedMessageId:
          direction === 'top'
            ? newMessages[newMessages.length - 1].id
            : newMessages[0].id,
      })
    })
  },
  addMessage(
    { state, commit }: ActionsArguments<ChatState>,
    { conversationId, message }: { conversationId: string; message: IMessage },
  ) {
    commit('addMessageToConversation', {
      conversationId,
      message,
    })
    if (conversationId === state.activeConversation) {
      commit('setCurrentChat', {
        messages: [...state.currentChat.messages, message],
        lastLoadedMessageId: message.id,
      })
    }
  },
}
