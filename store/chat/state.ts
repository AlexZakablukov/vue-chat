import { ChatState } from './types'
import { generateFriends, generateConversations } from '~/utils/chat'

const friends = generateFriends(3)
const conversations = generateConversations(friends, 200)

export const initialCurrentChat = {
  messages: [],
  page: 1,
  size: 30,
  hasNextPage: true,
  direction: 'top' as 'top',
  isMessagesLoading: false,
  lastLoadedMessageId: '',
  isScrollOver: false,
  unreadMessagesCount: 0,
}

const InitialChatState = (): ChatState => ({
  conversationLoading: false,
  activeConversation: '',
  friends,
  conversations,
  currentChat: initialCurrentChat,
})

export default InitialChatState
