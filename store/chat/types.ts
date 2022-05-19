import { IFriend, IConversation, IChat } from '~/types/chat'

export interface ChatState {
  conversationLoading: boolean
  activeConversation: string
  conversations: IConversation[]
  friends: IFriend[]
  currentChat: IChat
}
