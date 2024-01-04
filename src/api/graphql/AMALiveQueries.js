import { gql } from '@apollo/client';

export const CREATE_AMA_LIVE = gql`
mutation CreateAmaLive($title: String!, $amaCategoryId: ID!, $description: String, $topic: String!, $hostName: String!) {
    createAmaLive(title: $title, amaCategoryId: $amaCategoryId, description: $description, topic: $topic, hostName: $hostName) {
      _id
      host
      title
      viewers
      isLive
      createdAt
      hostName
    }
  }
`

export const GET_AMA_LIVES = gql`
query GetAllAmaLive {
    getAllAmaLive {
      _id
      host
      hostName
      title
      viewers
      isLive
      createdAt
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