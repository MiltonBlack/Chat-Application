import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Alert,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import { GiftedChat, Bubble, MessageText, InputToolbar } from 'react-native-gifted-chat';
import Modal from 'react-native-modal';
import Pusher from 'pusher-js/react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useSubscription, useMutation, useQuery, gql } from '@apollo/client';
import axios from 'axios'

import Container from '../component/Container';
import ChatModal from '../component/ChatModal';
import Chat from "./Chat/ChatScreen2";
import { COLORS, FONTS, HP_WP, SIZE, IMAGES } from '../component/theme';
import AudioRecorder from './AudioRecorder/AudioRecorder';
import DocumentPicker from 'react-native-document-picker';
import ImageCropPicker from 'react-native-image-crop-picker';
import { SEND_MESSAGE, GET_CHAT_MESSAGES, SET_TYPING_STATUS, USER_PRESENCE_SUBSCRIPTION, GET_USER_PRESENCE, USER_TYPING_SUBSCRIPTION } from '../api/graphql/chatQueries';
import { CREATE_CALL_LOG } from '../api/graphql/callQueries';

const MESSAGE_SUBSCRIPTION = gql`
  subscription MessageAdded {
    messageAdded {
      _id
      text
      user {
        _id
      }
      createdAt
    }
  }
`;

const ChatScreen = ({ route, navigation }) => {

  const [myInterval, setMyInterval] = useState(null);

  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [meTyping, setMeTyping] = useState(false);
  const msgContainerRef = useRef(null);
  const [userIsOnline, setuserIsOnline] = useState(false)
  const [userId, setuserId] = useState(async () => await AsyncStorage.getItem('userID'))
  const [visible, setVisible] = useState(false);
  const [token, setToken] = useState('');
  const Modalclose = () => setVisible(false);
  const Modalopen = () => setVisible(true);
  const [image, setImage] = useState('');
  const [isLoading, setisLoading] = useState(false)
  let phoneNumber = route?.params?.phoneNumber;
  let authUserPhoneNumber = route?.params?.authUserPhoneNumber;
  let chatRoom = route?.params?.chatRoom;
  let chatRoomUsers = route?.params?.users

  const [sendMessage] = useMutation(SEND_MESSAGE);
  const [createCallLog] = useMutation(CREATE_CALL_LOG);
  const [setTypingStatus] = useMutation(SET_TYPING_STATUS);
  const [isTyping, setIsTyping] = useState(false);
  const { data: presenceData, refetch: refetchOnlineStatusData, subscribeToMore: subscribeToMoree } = useQuery(GET_USER_PRESENCE, {
    variables: { phoneNumber }
  });
  const { data: data43, error: erro2 } = useSubscription(USER_TYPING_SUBSCRIPTION, {
    variables: { chatRoomId: chatRoom, phoneNumber },
    onData: ({ subscriptionData }) => {
      console.log('TYPINGGGG!!!!!')

      if (subscriptionData.data) {
        console.log('TYPINGGGG!!!!!')
        // setIsTyping(typingData.isTyping);
        // Update the userTypingStatus state with the latest data for this user
        // setUserTypingStatus();
      }
    },
    // onComplete: () => {
    //   console.log('')
    //   console.log('TYPINGGGG!!!!!')
    // },
    onError: () => {
      console.log('ERROR!!!')
    },
    onSubscriptionComplete: () => {
      console.log('ERROR!!!')

    },
    onSubscriptionData: () => {
      console.log('ERROR!!!')
    }
  });

  const { loading, error: error1, data: data1, refetch, subscribeToMore } = useQuery(GET_CHAT_MESSAGES, {
    variables: { chatroomId: chatRoom }
  });

  const bottomSheetRef = useRef();

  useEffect(() => {

    subscribeToMore({
      document: MESSAGE_SUBSCRIPTION,
      updateQuery: async (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        console.log('KK', userId);
        console.log('KK', subscriptionData.data.messageAdded);
        console.log('KK', subscriptionData.data.messageAdded?.user?._id);

        console.log('running1')
        const newMessage = subscriptionData.data.messageAdded; // Assuming the subscription returns the new message data
        console.log('running3')
        const exists = await messages.some(({ _id }) => _id === newMessage._id);
        if (exists) return prev;
        else return setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, subscriptionData.data.messageAdded)
        );
      }
    })

  }, [subscribeToMore])


  useEffect(() => {
    refetch().then((chatsee, d) => {
      setMessages(chatsee.data.getChatMessages);
      // GiftedChat.append(chats.data.getChatMessages);
    });
  }, [refetch]);

  useEffect(() => {
    refetchOnlineStatusData().then((user, d) => {
      console.log('FETCHERRRRRR11')
      console.log('FETCHERRRRRR', user)
      if (user && user.data.getUserPresence) {
        console.log('FETCHERRRRRR', user.data.getUserPresence.isOnline)

        setuserIsOnline(user.data.getUserPresence.isOnline);
      }
    });
  }, [refetchOnlineStatusData]);

  const openBottomSheet = () => {
    bottomSheetRef.current.open();
  };

  const closeBottomSheet = () => {
    bottomSheetRef.current.close();
  };

  useEffect(() => {

    checkAndSetUserId();

    console.log('JJBHBH', data43)
    console.log('JJBHBH', erro2)
    if (data1) {
      setMessages(data1.getChatMessages);
      GiftedChat.append(data1.getChatMessages);
    }

    // subscribeToUserTyping(chatRoom, phoneNumber);

  }, [])

  useEffect(() => {

    subscribeToMoree({
      document: USER_PRESENCE_SUBSCRIPTION,
      variables: {
        phoneNumber,
      },
      updateQuery: async (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          console.log('NOOOOOOOOO')
        }
        console.log('KK', subscriptionData.data.userPresence);
        setuserIsOnline(subscriptionData.data.userPresence.isOnline)
      }
    })

  }, [subscribeToMoree])


  // const subscribeToUserTyping = (chatRoomId, phoneNumber) => {

  // };

  const handleDocumentPick = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      closeBottomSheet();
      // Handle the selected document
      console.warn('Selected Document:', res);
    } catch (error) {
      closeBottomSheet();
      // Handle error or cancellation
      console.warn('Document picking error:', error);
    }
  };

  const checkAndSetUserId = async () => {
    let User_ID = await AsyncStorage.getItem('userID')
    setuserId(User_ID);
  }

  const handleAudioPick = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.audio],
      });
      closeBottomSheet();
      // Handle the selected document
      console.warn('Selected Document:', res);
    } catch (error) {
      closeBottomSheet();
      // Handle error or cancellation
      console.warn('Document picking error:', error);
    }
  };

  const openCamera = () => {
    ImageCropPicker.openCamera({
      width: 250,
      height: 280,
      cropping: true,
    }).then(img => {
      setImage(img.path);
      // setOpenModal(false);
    });
  };

  const openGallery = () => {
    ImageCropPicker.openPicker({
      mediaType: 'photo',
      width: 250,
      height: 280,
      cropping: true,
    }).then(img => {
      setImage(img.path);
      // setOpenModal(false);
    });
  };

  // useEffect(() => {

  //   setMessages([
  //     {
  //       _id: 1,
  //       text: 'Thank you for inviting me to Commune',
  //       createdAt: new Date(),
  //       user: {
  //         _id: 2,
  //         name: 'React Native',
  //         avatar: 'https://placeimg.com/140/140/any',
  //       },
  //       pending: true

  //     },
  //   ]);
  // }, []);

  const onSend = async (messages = []) => {
    console.log('messages', messages)
    console.log('messages', chatRoom)
    let User_ID = await AsyncStorage.getItem('userID')


    try {
      console.log('sending message2', { message: messages[0].text, chatRoomId: chatRoom, sender: User_ID })

      const { data } = await sendMessage({
        variables: { message: messages[0].text, chatRoomId: chatRoom, sender: User_ID },
      });
      console.log('sending message3')


      if (data) {
        console.log('sending message4', data)
        console.log('sending message5', messages)

        // console.log(data)
        // setMessages(previousMessages =>
        //   GiftedChat.append(previousMessages, data.sendMessage),
        // );
      }

    } catch (error) {
      console.log(error);
    }
  };

  const modalItem = [
    { title: 'New group' },
    { title: 'New Broadcast' },
    { title: 'Payouts' },
    { title: 'Linked devices' },
    { title: 'Starred messages' },
    { title: 'Settings' },
  ];

  const ModalData = () => {
    return (
      <FlatList
        style={styles.options}
        data={modalItem}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity style={{ paddingVertical: 3 }}>
              <Text style={styles.modalInnarText}>{item.title}</Text>
            </TouchableOpacity>
          );
        }}
      />
    );
  };

  const onInputTextChanged = async (text) => {
    console.log('typing1...');

    // When the user starts typing, set the typing status
    if (text && !meTyping) {
      console.log('typing...');
      const { data } = await setTypingStatus({ variables: { isTyping: true, phoneNumber: authUserPhoneNumber, chatRoomId: chatRoom } });
      if (data) {
        console.log('typing result...', data);
      }
      setMeTyping(true);
    } else if (!text && meTyping) {
      console.log('nottyping...');

      // When the user stops typing, clear the typing status
      const { data } = await setTypingStatus({ variables: { isTyping: false, phoneNumber: authUserPhoneNumber, chatRoomId: chatRoom } });

      if (data) {
        console.log('nottyping result...', data);
      }
      setMeTyping(false);
    }
  };

  const voiceCallUser = async () => {
    try {
      setisLoading(true);

      const { data } = await createCallLog({
        variables: { caller: authUserPhoneNumber, receiver: phoneNumber, type: 'voice' },
      });
      if (data) {
        setisLoading(false)
        console.log('DATA', data)

        navigation.navigate('VoiceCall', { phoneNumber, chatRoomUsers, chatRoom, authUserPhoneNumber, from: 'chatScreen' })
      }
    } catch (error) {
      setisLoading(false)
      console.log('ERROR', error)

      navigation.navigate('VoiceCall', { phoneNumber, chatRoomUsers, chatRoom, authUserPhoneNumber, from: 'chatScreen' })
    }
  }

  const fetchToken = async () => {
    await axios.get(`http://13.56.194.200:4000/access_token`, {
        params: {
            channelName,
        },
    }).then(res => {
        setToken(res.data.token);
        console.log('consoleE3', token)
    })
}
  const videoCallUser = async () => {

    try {
      setisLoading(true);
      await fetchToken();

      const { data } = await createCallLog({
        variables: { caller: authUserPhoneNumber, receiver: phoneNumber, type: 'video' },
      });

      if (data) {
        setisLoading(false)
        console.log('DATA1', data) 

        navigation.navigate('VideoCall', { phoneNumber, chatRoomUsers, chatRoom, authUserPhoneNumber, token, from: 'chatScreen' })

      }
    } catch (error) {
      setisLoading(false)

      navigation.navigate('VideoCall', { phoneNumber, chatRoomUsers, chatRoom, authUserPhoneNumber, from: 'chatScreen' })

    }
  }

  return (
    <Container>
      <View style={styles.mainContainer}>
        <ChatModal
          phoneNumber={phoneNumber}
          isTyping={isTyping}
          isOnline={userIsOnline}
          onPressLeft={() => navigation.goBack()}
          onPressDots={() => Modalopen()}
          onPressPhone={() => voiceCallUser()}
          onPressVideo={() => videoCallUser()}
        />
      </View>
      <View style={styles.giftedChatContainer}>
        <GiftedChat
          renderBubble={props => {
            return (
              <Bubble
                {...props}
                wrapperStyle={{
                  left: {
                    // Adjust the left padding as needed
                    marginLeft: -25,
                    marginBottom: 20 // You can change this value to control the left padding
                  },
                  right: {
                    backgroundColor: COLORS.darkRed,
                  },
                }}
              />
            );
          }}
          onInputTextChanged={onInputTextChanged}
          messages={messages}
          onSend={messages => onSend(messages)}
          user={{
            _id: userId,
          }}
          textInputStyle={{
            backgroundColor: '#555',
            color: '#000',
          }}
          textInputProps={{
            placeholder: 'Write a Message...',
            multiline: true,
            style: {
              color: 'black',
              backgroundColor: '#fff',
              width: '85%',
              height: 45,
              borderRadius: 12,
              border: 1,
              marginHorizontal: 3
            }
          }}
          renderMessageText={(props) => (
            <MessageText {...props} textStyle={{ color: '#000' }} />
          )}
        />
        {
          Platform.OS === 'android' && <KeyboardAvoidingView behavior='height' />
        }
      </View>
      <Modal
        backdropColor="rgba(0,0,0,0.5)"
        backdropOpacity={1}
        animationIn="zoomInDown"
        animationOut="zoomOutUp"
        animationInTiming={1500}
        animationOutTiming={1500}
        backdropTransitionInTiming={600}
        backdropTransitionOutTiming={600}
        onBackButtonPress={Modalclose}
        onBackdropPress={Modalclose}
        isVisible={visible}>
        <ModalData />
      </Modal>
      <Spinner
        color={COLORS.darkRed}
        visible={loading || isLoading}
        size="large"
        overlayColor="rgba(0,0,0,0.5)"
      />
      <RBSheet
        ref={bottomSheetRef}
        closeOnDragDown={false}
        closeOnPressMask={true}
        animationType="slide"
        height={200}
        customStyles={{
          wrapper: styles.modalContainer,
          container: styles.bottomSheet,
        }}>
        <View style={styles.bottomSheetInnarContainer}>
          <Pressable
            onPress={handleDocumentPick}
            style={{ alignItems: 'center' }}>
            <View style={styles.iconContainer}>
              <Ionicons name="document-sharp" size={24} color={COLORS.white} />
            </View>
            <Text style={styles.bottomSheetText}>Document</Text>
          </Pressable>
          <Pressable onPress={openCamera} style={{ alignItems: 'center' }}>
            <View
              style={[styles.iconContainer, { backgroundColor: COLORS.darkRed }]}>
              <MaterialIcons
                name="photo-camera"
                size={27}
                color={COLORS.white}
              />
            </View>
            <Text style={styles.bottomSheetText}>Camera</Text>
          </Pressable>
          <Pressable onPress={openGallery} style={{ alignItems: 'center' }}>
            <View
              style={[styles.iconContainer, { backgroundColor: COLORS.green }]}>
              <MaterialIcons name="photo" size={27} color={COLORS.white} />
            </View>
            <Text style={styles.bottomSheetText}>Gallery</Text>
          </Pressable>
          <Pressable onPress={handleAudioPick} style={{ alignItems: 'center' }}>
            <View
              style={[styles.iconContainer, { backgroundColor: COLORS.orange }]}>
              <FontAwesome5 name="music" size={20} color={COLORS.white} />
            </View>
            <Text style={styles.bottomSheetText}>Audio</Text>
          </Pressable>
        </View>
      </RBSheet>
    </Container>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  mainContainer: {
    marginHorizontal: 20,
  },
  giftedChatContainer: {
    flex: 1,
    marginBottom: 10,
    color: 'black'
  },
  bottomMainContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputContainer: {
    width: HP_WP.wp(72),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    elevation: 2,
    backgroundColor: COLORS.secondWhite,
    borderRadius: 10,
    height: HP_WP.hp(5.5),
    color: 'black'
  },
  input: {
    fontSize: SIZE.N,
    fontFamily: FONTS.light,
    color: COLORS.black,
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
