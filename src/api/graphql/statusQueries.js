import { gql } from '@apollo/client';

export const CREATE_STATUS = gql`
  mutation CreateStatus($mediaUrl: String!) {
    createStatus(mediaUrl: $mediaUrl) {
      id
      mediaUrl
      createdAt
    }
  }
`;

export const GET_STATUS_LIST = gql`
query StatusList {
    statusList {
      id
      caption
      mediaUrl
      createdAt
      user {
        phoneNumber
        _id
      }
    }
  }
`;

export const GET_AUTHUSER_STATUS_LIST = gql`
query AuthUserStatusList {
  authUserStatusList {
    id
    caption
    mediaUrl
    createdAt
    user {
      phoneNumber
      _id
    }
  }
}
`;

export const DELETE_STATUS = gql`
  mutation DeleteStatus($id: ID!) {
    deleteStatus(id: $id)
  }
`;

export const USER_STATUS_SUBSCRIPTION = gql`
subscription StatusAdded($phoneNumber: String!) {
  statusAdded(phoneNumber: $phoneNumber) {
    id
    caption
    mediaUrl
    createdAt
    user {
      phoneNumber
      _id
      countryCode
    }
  }
}

`