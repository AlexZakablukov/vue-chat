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
    const conversation = state.conversations.find(
      (conversation) => conversation.id === state.activeConversation,
    )

    if (!conversation?.messages) {
      return
    }

    const { messages: allMessages, unreadMessagesCount } = conversation

    const {
      messages,
      page,
      size,
      hasNextPage,
      direction,
      isFirstVisit,
      offset,
    } = state.currentChat

    if (!hasNextPage) {
      return
    }

    let from: number
    let to: number
    let readMessages: IMessage[] = []
    let unreadMessages: IMessage[] = []
    let newOffset: number

    const firstUnreadMessageIndex = allMessages.length - unreadMessagesCount

    if (isFirstVisit) {
      readMessages = allMessages.slice(0, firstUnreadMessageIndex)
      unreadMessages = allMessages.slice(firstUnreadMessageIndex)
      newOffset = -unreadMessagesCount
    } else {
      readMessages = allMessages
    }

    switch (direction) {
      // from bottom to top
      case 'top':
        from = Math.max(readMessages?.length + offset - size * page, 0)
        to = Math.max(readMessages?.length + offset - size * (page - 1), 0)
        break
      // from top to bottom
      default:
        from = size * (page - 1)
        to = page * size
        break
    }

    console.log('from', from)
    console.log('to', to)
    console.log('unreadMessagesCount', unreadMessagesCount)
    console.log('newOffset', offset)

    let newMessages = allMessages?.slice(from, to)

    if (!newMessages?.length) {
      commit('setCurrentChat', {
        hasNextPage: false,
        isMessagesLoading: false,
      })
      return
    }

    if (isFirstVisit && unreadMessages) {
      newMessages = newMessages.concat(unreadMessages)
    }

    const getLastLoadedMessageId = () => {
      if (direction === 'top') {
        if (isFirstVisit) {
          return readMessages[readMessages.length - 1].id
        }
        return newMessages[newMessages.length - 1].id
      } else {
        return newMessages[0].id
      }
    }

    return delay(500).then(() => {
      commit('setCurrentChat', {
        messages:
          direction === 'top'
            ? [...newMessages, ...messages]
            : [...messages, ...newMessages],
        page: page + 1,
        isMessagesLoading: false,
        isFirstVisit: false,
        lastLoadedMessageId: getLastLoadedMessageId(),
        offset: newOffset ?? offset,
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
      const { messages, isScrollOver, lastLoadedMessageId, offset } =
        state.currentChat
      commit('setCurrentChat', {
        messages: [...messages, message],
        lastLoadedMessageId: !isScrollOver ? message.id : lastLoadedMessageId,
        offset: offset - 1,
      })
    }
  },
}
