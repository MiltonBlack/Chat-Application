import { ImageBackground, StatusBar, View } from "react-native";
import CardSafeAreaWrap from "../SafeAreaWrap/cardSafeArea";
import Colors from "../constants/Colors";
import styled from "styled-components/native";
import Chat from "./ChatScreen3";
// import KeyboardShift from "./SafeAreaWrap/KeyboardAvoidView";

const ChatContainer = styled.View`
  height: 100%;
  width: 100%;
  border-top-left-radius: 30px;
  border-top-right-radius: 30px;
  padding-left: 20px;
  padding-right: 20px;
`;

const ChatDetail = ({ messages, authUserId, onSend }) => {
  console.log('authUserId', messages)
  return (
        <ChatContainer>
          <Chat messages={messages} authUserId={authUserId} onSend={onSend}/>
        </ChatContainer>
  );
};

export default ChatDetail;
