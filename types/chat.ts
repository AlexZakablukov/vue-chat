export interface IFriend {
  id: string
  name: string
}

export interface IMessage {
  id: string
  text: string
}

// export interface IConversations {
//   [key: string]: {
//     messages: IMessage[]
//     unreadMessagesCount: number
//   }
// }

export interface IConversation {
  id: string
  messages: IMessage[]
  unreadMessagesCount: number
}

export interface IChat {
  messages: IMessage[]
  page: number
  size: number
  hasNextPage: boolean
  direction: 'top' | 'bottom'
  isMessagesLoading: boolean
  lastLoadedMessageId: string
  unreadMessagesCount: number
}
