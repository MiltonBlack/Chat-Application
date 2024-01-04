import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  Alert,
  FlatList,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import {GiftedChat, Bubble} from 'react-native-gifted-chat';
import Modal from 'react-native-modal';
import Pusher from 'pusher-js/react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useSubscription, useMutation, useQuery, gql } from '@apollo/client';

import Container from '../component/Container';
import ChatModal from '../component/ChatModal';
import Chat from "./Chat/ChatScreen2";
import {COLORS, FONTS, HP_WP, SIZE, IMAGES} from '../component/theme';
import AudioRecorder from './AudioRecorder/AudioRecorder';
import DocumentPicker from 'react-native-document-picker';
import ImageCropPicker from 'react-native-image-crop-picker';
import { SEND_MESSAGE, GET_CHAT_MESSAGES, SET_TYPING_STATUS, GET_USER_PRESENCE, USER_TYPING_SUBSCRIPTION } from '../api/graphql/chatQueries';

const MESSAGE_SUBSCRIPTION = gql`
  subscription MessageAdded {
    messageAdded {
      _id
      text
      status
      createdAt
    }
  }
`;

const ChatScreen = ({route, navigation}) => {

const [myInterval, setMyInterval] = useState(null);

  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [meTyping, setMeTyping] = useState(false);
  const msgContainerRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const Modalclose = () => setVisible(false);
  const Modalopen = () => setVisible(true);
  const [image, setImage] = useState('');
  let phoneNumber = route?.params?.phoneNumber;
  let chatRoom = route?.params?.chatRoom;
  let chatRoomUsers = route?.params?.users

  const [sendMessage] = useMutation(SEND_MESSAGE);
  const [setTypingStatus] = useMutation(SET_TYPING_STATUS);
  const { data: typingData } = useSubscription(USER_TYPING_SUBSCRIPTION, {
    variables: { userId: 'currentUserId' }, // Replace 'currentUserId' with the actual user ID
  });
  const { data: presenceData } = useQuery(GET_USER_PRESENCE, {
    variables: { userId: chatRoomUsers[2]}
  });
  
  const {loading, error: error1, data: data1, refetch, subscribeToMore } = useQuery(GET_CHAT_MESSAGES, {
    variables: { chatroomId: chatRoom}
  });

  const bottomSheetRef = useRef();

  useEffect(() => {
  
    subscribeToMore({
      document: MESSAGE_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        console.log('running1')
        const newMessage = subscriptionData.data.messageAdded; // Assuming the subscription returns the new message data
        console.log('running3')
        const exists = messages.some(({ _id }) => _id === newMessage._id);
        if (exists) return prev;
        return setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, subscriptionData.data.messageAdded)
        );
    }})
  
  }, [subscribeToMore])
  
  
  useEffect(() => {
      refetch().then((chats, d) => {
        console.log('CHATS FOR', chats)
        setMessages(chats.data.getChatMessages.slice().sort((a, b) => b.createdAt - a.createdAt));
        GiftedChat.append(chats.data.getChatMessages.slice().sort((a, b) => b.createdAt - a.createdAt));
    });
  }, [refetch]);

  const openBottomSheet = () => {
    bottomSheetRef.current.open();
  };

  const closeBottomSheet = () => {
    bottomSheetRef.current.close();
  };

  useEffect(() => {
    if (data1) {
      console.log('data1', data1)
        setMessages(data1.getChatMessages.slice().sort((a, b) => b.createdAt - a.createdAt).map((item) => {
          console.log('DATE FOR 3', item.createdAt)
          item.createdAt = Date(item.createdAt);
          return item;
        }));
          GiftedChat.append(data1.getChatMessages.slice().sort((a, b) => b.createdAt - a.createdAt).map((item) => {
          console.log('DATE FOR 4', item.createdAt)
            item.createdAt = Date(item.createdAt);
          return item;
        }));
      }
      
      if(presenceData){
        console.log('presenceData', presenceData)
      }

  }, [])

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

  const onSend = useCallback( async (messages = []) => {
    console.log('messages', messages)
    console.log('messages', chatRoom)
    let User_ID = await AsyncStorage.getItem('userID')

    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    );

    try {
      console.log('sending message2', { message: messages[0].text, chatRoomId: chatRoom, sender:User_ID })
  
        const { data } = await sendMessage({
          variables: { message: messages[0].text, chatRoomId: chatRoom, sender:User_ID },
        });
      console.log('sending message3')
  
  
        if (data) {
          console.log(data)
        }
  
      } catch (error) {
        console.log(error);
      }
  }, []);

  const modalItem = [
    {title: 'New group'},
    {title: 'New Broadcast'},
    {title: 'Payouts'},
    {title: 'Linked devices'},
    {title: 'Starred messages'},
    {title: 'Settings'},
  ];

  const ModalData = () => {
    return (
      <FlatList
        style={styles.options}
        data={modalItem}
        renderItem={({item}) => {
          return (
            <TouchableOpacity style={{paddingVertical: 3}}>
              <Text style={styles.modalInnarText}>{item.title}</Text>
            </TouchableOpacity>
          );
        }}
      />
    );
  };

  return (
    <Container>
      <View style={styles.mainContainer}>
        <ChatModal
        phoneNumber={phoneNumber}
        isOnline={presenceData?.userPresence.isOnline}
          onPressLeft={() => navigation.goBack()}
          onPressDots={() => Modalopen()}
          onPressPhone={() => navigation.navigate('VoiceCall', { phoneNumber, chatRoomUsers, chatRoom })}
          onPressVideo={() => navigation.navigate('VideoCall', { phoneNumber, chatRoomUsers, chatRoom })}
        />
      </View>
      <View style={styles.giftedChatContainer}>
      <Chat messages={messages} authUserId={chatRoomUsers[2]} onSend={() => onSend()}/>

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
        visible={loading}
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
            style={{alignItems: 'center'}}>
            <View style={styles.iconContainer}>
              <Ionicons name="document-sharp" size={24} color={COLORS.white} />
            </View>
            <Text style={styles.bottomSheetText}>Document</Text>
          </Pressable>
          <Pressable onPress={openCamera} style={{alignItems: 'center'}}>
            <View
              style={[styles.iconContainer, {backgroundColor: COLORS.darkRed}]}>
              <MaterialIcons
                name="photo-camera"
                size={27}
                color={COLORS.white}
              />
            </View>
            <Text style={styles.bottomSheetText}>Camera</Text>
          </Pressable>
          <Pressable onPress={openGallery} style={{alignItems: 'center'}}>
            <View
              style={[styles.iconContainer, {backgroundColor: COLORS.green}]}>
              <MaterialIcons name="photo" size={27} color={COLORS.white} />
            </View>
            <Text style={styles.bottomSheetText}>Gallery</Text>
          </Pressable>
          <Pressable onPress={handleAudioPick} style={{alignItems: 'center'}}>
            <View
              style={[styles.iconContainer, {backgroundColor: COLORS.orange}]}>
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
    marginBottom: 20,
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
