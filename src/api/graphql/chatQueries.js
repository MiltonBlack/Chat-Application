import { gql } from '@apollo/client';

export const GET_USER_CHATS = gql`
query ChatList {
  chatList {
    _id
    lastMessage {
      text
      createdAt
    }
    user1 {
      phoneNumber
      _id
    }
    user2 {
      phoneNumber
      _id
    }
    noOfUnreadMessage
  }
}
`

export const SEND_MESSAGE = gql`
  mutation SendMessage($chatRoomId: ID!, $sender: ID!, $message: String!) {
    sendMessage(chatRoomId: $chatRoomId, sender: $sender, message: $message) {
      _id
      text
      createdAt
      status
    }
  }
`;

export const CREATE_NEW_CHATROOM  = gql`
mutation CreateNewChatRoom($otherUserPhoneNumber: String!) {
  createNewChatRoom(otherUserPhoneNumber: $otherUserPhoneNumber) {
    _id
    user1 {
      phoneNumber
      _id
    }
    user2 {
      _id
      phoneNumber
    }
    lastMessage {
      text
    }
    noOfUnreadMessage
  }
}`
export const GET_CHAT_MESSAGES = gql`
query GetChatMessages($chatroomId: ID!) {
  getChatMessages(chatroomId: $chatroomId) {
    _id
    text
    createdAt
    status
    user {
      phoneNumber
      countryCode
      _id
    }
  }
}
`;

export const MESSAGE_SUBSCRIPTION = gql`
  subscription MessageAdded {
    messageAdded {
      id
      text
      user
      createdAt
    }
  }
`;

export const SET_TYPING_STATUS = gql`
mutation SetTypingStatus($isTyping: Boolean!, $chatRoomId: ID, $phoneNumber: String!) {
  setTypingStatus(isTyping: $isTyping, chatRoomId: $chatRoomId, phoneNumber: $phoneNumber) {
    isTyping
  }
}
`;

export const GET_USER_PRESENCE = gql`
query GetUserPresence($phoneNumber: String!) {
  getUserPresence(phoneNumber: $phoneNumber) {
    isOnline
    phoneNumber
  }
}
`;

export const USER_PRESENCE_SUBSCRIPTION = gql`
subscription UserPresence($phoneNumber: String!) {
  userPresence(phoneNumber: $phoneNumber) {
    _id
    phoneNumber
    isOnline
  }
}`

export const USER_TYPING_SUBSCRIPTION = gql`
subscription UserTyping($chatRoomId: ID!, $phoneNumber: String!) {
  userTyping(chatRoomId: $chatRoomId, phoneNumber: $phoneNumber) {
    phoneNumber
    success
    isTyping
  }
}
`;