import { gql } from '@apollo/client';

export const GET_CALL_LOGS = gql`
query GetCallLogs {
  getCallLogs {
    _id
    startTime
    type
    caller
    receiver
  }
}
`;

export const CREATE_CALL_LOG = gql`
mutation CreateCallLog($caller: String!, $receiver: String!, $type: String!) {
  createCallLog(caller: $caller, receiver: $receiver, type: $type) {
    callLog {
      receiver
      caller
      startTime
    }
  }
}`

export const INCOMING_CALL_SUBBSCRIPTION = gql`
subscription IncomingCallUpdate($phoneNumber: String!) {
  incomingCallUpdate(phoneNumber: $phoneNumber) {
    callLog {
      receiver
      caller
      type
      startTime
    }
    chatRoom {
      user1
      user2
      _id
    }
  }
}
`