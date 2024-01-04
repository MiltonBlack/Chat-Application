import { gql } from '@apollo/client';

export const UPDATE_USER_PRESENCE = gql`
mutation UpdateUserPresence($online: Boolean!) {
  updateUserPresence(online: $online) {
    isOnline
    phoneNumber
  }
}
`;