import React from "react";
import { 
  Keyboard, 
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View, } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import styled from "styled-components/native";
import Colors from "../constants/Colors";
import Fonts from "../constants/Fonts";
import CustomText from "../CustomText";
import {COLORS, FONTS, HP_WP, SIZE, IMAGES} from '../../component/theme';

const bubbleDawta = [
  {
    text: "Hey! How have you been?",
    iAmSender: false,
    time: "12:15 PM",
  },
  {
    text: "Wanna catch up for a beer?",
    iAmSender: false,
    time: "12:15 PM",
  },
  {
    text: "Awesome! Let’s meet up",
    iAmSender: true,
    time: "12:20 PM",
  },
  {
    text: "Can I also get my cousin along? Will that be okay?",
    iAmSender: true,
    time: "12:20 PM",
  },
  {
    text: "Yeah sure! get him too.",
    iAmSender: false,
    time: "12:22 PM",
  },
  {
    text: "Alright! See you soon!",
    iAmSender: true,
    time: "12:25 PM",
  },
  {
    text: "Remember to bring the thing",
    iAmSender: false,
    time: "12:26 PM",
  },
  {
    text: "Okay sure!",
    iAmSender: true,
    time: "12:28 PM",
  },
];

const InputWrap = styled.View`
  height: 64px;
  width: 100%;
  border: 1px solid ${Colors?.input_border};
  border-radius: 164px;
  padding: 14px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const InputText = styled.TextInput`
  height: 33px;
  border-right-width: 1px;
  border-right-color: ${Colors?.input_border};
  font-family: ${Fonts?.InterRegular};
  font-size: 14px;
  font-weight: 400;
  width:70%;
  margin-right: 14px;
  margin-left: 12px;
`;

const ChatContainer = styled.View`
  height: 90%;
  width: 100%;
  justify-content: flex-end;
`;

const BubbleContainer = styled.Pressable`
  align-items: ${({ iAmSender }) => (iAmSender ? "flex-end" : "flex-start")};
`;

const BubbleWrap = styled.View`
  padding-vertical: 10px;
  padding-horizontal: 20px;
  border-radius: 100px;
  background-color: ${({ iAmSender }) =>
    iAmSender ? COLORS?.darkRed : Colors?.grey_border};
  color: ${({ iAmSender }) =>
  iAmSender ? COLORS?.white : Colors?.black};
  max-width: 80%;
  margin-bottom: 6px;
`;
const isSenderSame = ({
  currentMessage,
  prevMessage,
}) => {
  return currentMessage.createdAt === (prevMessage?.createdAt || "");
};

const isNextSenderSame = ({
  currentMessage,
  nextMessage,
}) => {
  return currentMessage.createdAt === (nextMessage?.createdAt || "");
};



const Chat = ({ messages: bubbleData, authUserId, onSend }) => {

  const renderItem = ({ item, index }) => {
    const iAmSender = item?.user?._id == authUserId;
  
    const previousTimeIsSame = isSenderSame({
      currentMessage: item,
      prevMessage: bubbleData[index - 1],
    });
  
    const nextTimeIsSame = isNextSenderSame({
      currentMessage: item,
      nextMessage: bubbleData[index + 1],
    });
  
    return (
      <BubbleContainer iAmSender={iAmSender}>
        <BubbleWrap iAmSender={iAmSender}>
          <CustomText
            align={iAmSender ? "right" : "left"}
            fontFamily={Fonts?.InterRegular}
            fontSize={15}
            style={{ lineHeight: 20 }}
            fontWeight="400"
          >
            {item?.text}
          </CustomText>
        </BubbleWrap>
  
        {previousTimeIsSame && (
          <CustomText
            align={iAmSender ? "right" : "left"}
            fontFamily={Fonts?.InterRegular}
            fontSize={12}
            top={10}
            bottom={5}
            color={Colors?.timeColor}
            fontWeight="400"
          >
            {item?.createdAt}
          </CustomText>
        )}
  
        {!previousTimeIsSame && !nextTimeIsSame && (
          <CustomText
            align={iAmSender ? "right" : "left"}
            fontFamily={Fonts?.InterRegular}
            fontSize={12}
            top={10}
            bottom={5}
            color={Colors?.timeColor}
            fontWeight="400"
          >
            {item?.createdAt}
          </CustomText>
        )}
      </BubbleContainer>
    );
  };
  return (
    <>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={bubbleData}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${index} + ${Date.now()}`}
      />
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Type a  message"
                    placeholderTextColor={COLORS.darkBlack}
                  />
                  <TouchableOpacity
                    onPress={async () => {
                      Keyboard.dismiss();
                      await onSend([{"__typename": "Message", "_id": "652cf597e2ff12e3111dbe53", "createdAt": "1697445271267", "status": "delivered", "text": "Testing chat", "user": {"__typename": "User", "_id": "652235b9081d8ace8cd2f2d6", "countryCode": "+234", "phoneNumber": "+2348100856320"}}])
                    }}>
                    <Ionicons
                      name="ios-send-sharp"
                      size={20}
                      color={COLORS.darkBlack}
                    />
                  </TouchableOpacity>
                </View>
                {/* 
                <TouchableOpacity style={styles.micContainer}>
                  <FontAwesome5
                    name="microphone-alt"
                    size={20}
                    color={COLORS.white}
                  />
                </TouchableOpacity>*/}
      
    </>
  );
};

export default Chat;

const styles = StyleSheet.create({
  mainContainer: {
    marginHorizontal: 20,
  },
  giftedChatContainer: {
    flex: 1,
    marginBottom: 20,
  },
  bottomMainContainer: {
    flexDirection: 'row',
    marginHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputContainer: {
    width: HP_WP.wp(80),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    elevation: 2,
    backgroundColor: COLORS.secondWhite,
    borderRadius: 10,
    height: HP_WP.hp(8.5),
  },
  input: {
    fontSize: SIZE.N,
    fontFamily: FONTS.light,
    color: COLORS.darkBlack,
    flex: 1,
    marginHorizontal: 8,
  },
  middleLineContainer: {
    borderRightWidth: 1,
    borderColor: COLORS.gray,
    height: HP_WP.hp(3.5),
    marginHorizontal: 10,
  },
  micContainer: {
    width: HP_WP.wp(12),
    backgroundColor: COLORS.darkRed,
    height: HP_WP.hp(5.5),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  options: {
    backgroundColor: COLORS.white,
    padding: HP_WP.wp(4),
    borderRadius: 4,
    alignSelf: 'flex-end',
    width: HP_WP.wp(40),
    position: 'absolute',
    top: 35,
    right: 10,
  },
  modalInnarText: {
    fontSize: SIZE.N,
    color: COLORS.darkBlack,
    fontFamily: FONTS.light,
  },

  camera: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  modalContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bottomSheet: {
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 20,
  },
  bottomSheetInnarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconContainer: {
    height: HP_WP.hp(8),
    width: HP_WP.wp(17),
    borderRadius: 50,
    backgroundColor: COLORS.gray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSheetText: {
    fontSize: SIZE.N,
    color: COLORS.lightBlack,
    fontFamily: FONTS.regular,
  },
});
