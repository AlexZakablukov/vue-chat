import { v4 as uuidv4 } from 'uuid'
import { IFriend, IConversation, IMessage } from '~/types/chat'
import { getRndInteger } from '~/utils/global'

export const generateFriends = (count: number = 1): IFriend[] => {
  const friends: IFriend[] = []

  for (let i = 0; i < count; i++) {
    friends.push({
      id: uuidv4(),
      name: `Friend ${i + 1}`,
    })
  }

  return friends
}

export const createMessage = (text: string) => {
  return {
    id: uuidv4(),
    text,
  }
}

export const generateMessages = (count: number = 1): IMessage[] => {
  const messages: IMessage[] = []

  for (let i = 0; i < count; i++) {
    messages.push(createMessage(`Message ${i + 1}`))
  }

  return messages
}

export const generateConversations = (
  friends: IFriend[],
  count: number = 1,
): IConversation[] => {
  const conversations: IConversation[] = []

  friends.forEach((friend, index) => {
    conversations.push({
      id: friend.id,
      messages: generateMessages(count * (index + 1)),
      unreadMessagesCount: getRndInteger(0, 10),
    })
  })

  return conversations
}
