import { gql } from '@apollo/client';

export const SEND_INVITATION_REQUEST = gql`
mutation SendInvitationRequest($recipientPhoneNumbers: [recipientDetails]) {
  sendInvitationRequest(recipientPhoneNumbers: $recipientPhoneNumbers) {
    message
    success
    createdInviteRequests {
      createdAt
      sender {
        phoneNumber
      }
      recipient {
        displayName
        phoneNumber
        recordID
      }
      _id
      status
    }
  }
}
`;

export const ACCEPT_OR_REJECT_INVITATION = gql`
mutation AcceptOrRejectInvitation($inviteRequestId: String!, $newInviteStatus: String!) {
  acceptOrRejectInvitation(inviteRequestId: $inviteRequestId, newInviteStatus: $newInviteStatus) {
    success
    message
    chatRoom {
      _id
      user1 {
        phoneNumber
        _id
      }
      user2 {
        phoneNumber
        _id
      }
      lastMessage {
        text
        createdAt
      }
      noOfUnreadMessage
    }
  }
}
`

export const GET_INVITE_REQUESTS = gql`
query GetInviteRequests {
  getInviteRequests {
    inviteRequests {
      status
      createdAt
      recipient {
        phoneNumber
      }
      sender {
        phoneNumber
      }
      _id
    }
  }
}
`