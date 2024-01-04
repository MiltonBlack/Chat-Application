import { gql } from '@apollo/client';

export const SIGN_UP = gql`
  mutation signup($phoneNumber: String!, $countryCode: String!, $referralCode: String!) {
    signup(phoneNumber: $phoneNumber, countryCode: $countryCode, referralCode: $referralCode) {
      otp
      success
      user {
        countryCode
        phoneNumber
      }
    }
  }
`;

export const LOGIN = gql`
  mutation login($phoneNumber: String!, $countryCode: String!) {
    login(phoneNumber: $phoneNumber, countryCode: $countryCode) {
      otp
      success
      user {
        countryCode
        phoneNumber
      }
    }
  }
`;


export const VERIFY_OTP = gql`
  mutation verifyOTP($phoneNumber: String!, $otp: String!) {
    verifyOTP(phoneNumber: $phoneNumber, otp: $otp) {
      token
      success
      message
      user {
        _id
        countryCode
        phoneNumber
        inviteRequestCode
      }
      userChatRooms
    }
  }
`;
