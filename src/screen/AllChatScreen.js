import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  PermissionsAndroid,
  Platform
} from 'react-native';
import React, { useState, useEffect } from 'react';
import Modal from 'react-native-modal';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import Toast from 'react-native-toast-message';
import Contacts from 'react-native-contacts';
import ImageCropPicker from 'react-native-image-crop-picker';
import { useMutation, useQuery, gql } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';
import { GET_USER_CHATS } from '../api/graphql/chatQueries';
import { GET_INVITE_REQUESTS } from '../api/graphql/inviteQueries';
import Container from '../component/Container';
import MainHeader from '../component/MainHeader';
import { COLORS, FONTS, HP_WP, IMAGES, SIZE } from '../component/theme';
import { checkAuthentication, getAuthUserPhoneNumber, setUserID } from '../service/LocalStore';
import { ACCEPT_OR_REJECT_INVITATION } from '../api/graphql/inviteQueries';
import useAppData from '../service/AppData';

const AllChateScreen = ({ navigation }) => {
  const [{ getContect }] = useAppData();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [userPhoneNumber, setUserphoneNumber] = useState(async () => await AsyncStorage.getItem('authUserPhoneNumber'));
  const toggleSearchBox = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const performSearch = () => {
  };

  function shortenText(text, maxWords) {
    const words = text.split(' ');

    if (words.length <= maxWords) {
      return text;
    }

    const shortenedText = words.slice(0, maxWords).join(' ');
    return `${shortenedText}...`;
  }

  const [openModal, setOpenModal] = useState(false);
  const [image, setImage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loggedInUserId, setuserId] = useState('');
  const [active, setActive] = useState('Private');
  const [chatRooms, setchatRooms] = useState([]);
  const [InviteRequests, setInviteRequests] = useState([]);
  const [visible, setVisible] = useState(false);
  const [userContacts, setContacts] = useState({});

  const [acceptOrRejectInvitation, { loading, error, data }] = useMutation(ACCEPT_OR_REJECT_INVITATION);

  const { subscribeToMore, loading: loading1, error: error1, data: data1, refetch: refetch1 } = useQuery(GET_USER_CHATS);

  const { loading: loading2, error: error2, data: data2, refetch: refetch2 } = useQuery(GET_INVITE_REQUESTS);
  const [{ phoneNumber }] = useAppData();

  useEffect(() => {
    const updateChatList = async () => {
      refetch1().then((chats, d) => {
        setchatRooms(chats?.data?.chatList)
        if (chats?.data?.chatList?.length < 1) {
          navigation.navigate('WellcomeScreen')
        }
      });
    }

    const interval = setInterval(updateChatList, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [refetch1]);

  useEffect(() => {
    // console.log('SELECTEDA', userContacts);
    findNumber();
    checkAuthentication(navigation);
    getToken();
  }, [])

  useEffect(() => {
    refetch2().then((requests, d) => {
      setInviteRequests(requests.data.getInviteRequests.inviteRequests)
    });
  }, [refetch2])

  // useEffect(() => {

  //   subscribeToMore({
  //     document: CHATROOM_SUBSCRIPTION,
  //     updateQuery: (prev, { subscriptionData }) => {
  //       if (!subscriptionData.data) return prev;
  //       const newChatRoom = subscriptionData.data.chatRoomAdded; // Assuming the subscription returns the new message data
  //       const exists = chatRooms.some(({ _id }) => _id === newChatRoom._id);
  //       if (exists) return prev;
  //       return setchatRooms((previousChatRooms) =>
  //        [previousChatRooms, newChatRoom]
  //       );
  //   }})

  // }, [subscribeToMore])

  const getToken = async function () {
    let authToken = await AsyncStorage.getItem('authToken')
    let User_ID = await AsyncStorage.getItem('userID')
    let User_PhoneNumber = await AsyncStorage.getItem('authUserPhoneNumber')
    setUserphoneNumber(User_PhoneNumber)
    setuserId(User_ID)
  }

  const getTime = (timestamp) => {
    const date = new Date(timestamp);
    const currentDate = new Date();
    const timeDifference = currentDate - date;
    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;

    if (timeDifference < minute) {
      return "Just now";
    } else if (timeDifference < hour) {
      const minutesAgo = Math.floor(timeDifference / minute);
      return `${minutesAgo} minutes ago`;
    } else if (timeDifference < day) {
      const hoursAgo = Math.floor(timeDifference / hour);
      return `${hoursAgo} hours ago`;
    } else {

      const options = { year: "numeric", month: "short", day: "numeric" };
      const formattedDate = date.toLocaleDateString(undefined, options);
      return formattedDate;
    }

  }

  const Modalclose = () => setVisible(false);
  const Modalopen = () => setVisible(true);


  const onResponse = async (inviteRequestId, newInviteStatus, res) => {

    Toast.show({
      position: 'top',
      type: 'success',
      text1: res?.acceptOrRejectInvitation?.message,
    });
    if (newInviteStatus == "accepted") {
      await setchatRooms(prevChatRooms => {
        return [...prevChatRooms, res?.acceptOrRejectInvitation?.chatRoom];
      })
    }
    setInviteRequests(prevInviteRequests => {
      return prevInviteRequests.filter((item) => item._id !== inviteRequestId);
    })
    await setActive('Private');
  };

  const onError = e => {
    console.warn(e);
    Toast.show({
      position: 'top',
      type: 'error',
      text1: e.message,
    });
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

  const openCamera = () => {
    ImageCropPicker.openCamera({
      width: 250,
      height: 280,
      cropping: true,
    }).then(img => {
      setImage(img.path);
      setOpenModal(false);
    });
  };

  const openGallery = () => {
    ImageCropPicker.openPicker({
      width: 250,
      height: 280,
      cropping: true,
    }).then(img => {
      setImage(img.path);
      setOpenModal(false);
    });
  };

  const changeStatusOfInvite = async (inviteRequestId, newInviteStatus) => {

    try {

      const { data } = await acceptOrRejectInvitation({
        variables: {
          inviteRequestId,
          newInviteStatus
        },
      });

      if (data) {
        onResponse(inviteRequestId, newInviteStatus, data);
      } else if (error) {
        console.log(error);
        onError(error);
      }
    } catch (error) {
      onError(error);
    }
  };

  const CameraModalData = () => {
    return (
      <View style={styles.cameraModalContainer}>
        <TouchableOpacity
          style={styles.cameraModalInnarContainer}
          onPress={() => openGallery()}>
          <Text style={styles.cameraModalText}>gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cameraModalInnarContainer}
          onPress={() => openCamera()}>
          <Text style={styles.cameraModalText}>camera</Text>
        </TouchableOpacity>
      </View>
    );
  };
  const [name, setName] = useState('');
  let findName;
  function findNumber() {
    // findName = getContect.find(item => item.phoneNumbers[0]?.number === chatRooms?.user2?.phoneNumber);
    // const filteredItems = getContect?.filter((user) => user?.phoneNumbers[0]?.includes(chatRooms.user2.phoneNumber));
    // console.log(filteredItems);
  }
  console.log(chatRooms);
  console.log(getContect.length);

  return (
    <Container>
      <View style={styles.mainContainer}>
        <MainHeader
          camera
          onPressSearch={toggleSearchBox}
          onPressCamera={() => setOpenModal(true)}
          onPressDots={() => Modalopen()}
        />

        <ScrollView
          contentContainerStyle={{ paddingBottom: 30 }}
          showsVerticalScrollIndicator={false}>
          {isSearchOpen && (
            <TextInput
              style={{
                borderRadius: 12,
                paddingHorizontal: 15,
                height: HP_WP.hp(5.5),
                fontSize: SIZE.M,
                color: COLORS.darkBlack,
                fontFamily: FONTS.regular,
                backgroundColor: COLORS.lightWhite,
                marginTop: 20,
                borderWidth: 0.5,
              }}
              placeholder="Search"
              onChangeText={text => setSearchTerm(text)}
            />
          )}
          <View style={styles.chatMainContainer}>
            <TouchableOpacity
              onPress={() => setActive('Private')}
              style={[
                styles.chatContainer,
                { borderBottomWidth: active === 'Private' ? 3 : 0 },
              ]}>
              <Text style={active === 'Private' ? styles.name : styles.detail}>
                Private chat {chatRooms && chatRooms.length >= 1 && <View style={styles.timeBottomContainer}>
                  <Text style={styles.timeBottomText}>{chatRooms.length}</Text>
                </View>}
              </Text>

            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActive('Group')}
              style={[
                styles.chatContainer,
                { borderBottomWidth: active === 'Group' ? 3 : 0 },
              ]}>
              <Text style={active === 'Group' ? styles.name : styles.detail}>
                Group chats
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActive('Invites')}
              style={[
                styles.chatContainer,
                { borderBottomWidth: active === 'Invites' ? 3 : 0 },
              ]}>
              <Text style={active === 'Invites' ? styles.name : styles.detail}>
                Invite Requests {InviteRequests && InviteRequests.length >= 1 && <View style={styles.timeBottomContainer}>
                  <Text style={styles.timeBottomText}>{InviteRequests.length}</Text>
                </View>}
              </Text>
            </TouchableOpacity>
          </View>

          {active === 'Private' ? (<>
            {/* <TouchableOpacity
              style={styles.searchMainContainer}
              onPress={() => navigation.navigate('ChatScreen')}>
              <View>
                <Image
                  source={IMAGES.headerImage}
                  style={styles.profileImage}
                />
                <Image source={IMAGES.active} style={styles.activeImg} />
              </View>
              <View style={styles.profileMainContainer}>
                <View style={styles.directionContainer}>
                  <Text style={styles.name}>Commune</Text>
                  <Text style={styles.time}>05.30 PM</Text>
                </View>
                <View style={styles.directionContainer}>
                  <Text style={styles.detail}>Welcome onboard :)</Text>
                  <View style={styles.timeBottomContainer}>
                    <Text style={styles.timeBottomText}>1</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity> */}
            {chatRooms && chatRooms.length >= 1 ? (<FlatList
              showsVerticalScrollIndicator={false}
              data={chatRooms}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.searchMainContainer}
                  onPress={() => navigation.navigate('ChatScreen', { phoneNumber: userPhoneNumber != item.user2.phoneNumber ? item.user2.phoneNumber : item.user1.phoneNumber, chatRoom: item._id, users: [item.user1._id, item.user2._id, loggedInUserId], authUserPhoneNumber: userPhoneNumber })}>
                  <View>
                    <Image
                      source={IMAGES.profile}
                      style={styles.profileImage}
                    />
                    {/* <Image source={IMAGES.inactive} style={styles.activeImg} /> */}
                  </View>
                  <View style={styles.profileMainContainer}>
                    <View style={styles.directionContainer}>
                      <Text
                        style={styles.name}>
                        {findName?.givenName !== undefined || null ? 
                        findName = getContect?.find(names => chatRooms.user2.phoneNumber === names?.phoneNumbers[0]?.number) : 
                        userPhoneNumber !== item.user2.phoneNumber ? (userContacts.hasOwnProperty(item.user2.phoneNumber) ? userContacts[item.user2.phoneNumber] : item.user2.phoneNumber) : ((userContacts.hasOwnProperty(item.user1.phoneNumber) ? userContacts[item.user1.phoneNumber] : item.user1.phoneNumber))}
                      </Text>
                      <Text style={styles.time}>{getTime(item.lastMessage.createdAt)}</Text>
                    </View>
                    <View style={styles.directionContainer}>
                      <Text style={styles.detail}>{shortenText(item.lastMessage.text, 5)}</Text>
                      <View style={styles.timeBottomContainer}>
                        <Text style={styles.timeBottomText}>{item.noOfUnreadMessage}</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            />) : (<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ paddingTop: '50%', }}>No chats to display</Text>
            </View>)}
          </>
          ) : active === 'Group' ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ paddingTop: '50%', }}>No groups to display</Text>
            </View>
          ) : (InviteRequests.length >= 1 ? (InviteRequests && <FlatList
            showsVerticalScrollIndicator={false}
            data={InviteRequests}
            renderItem={({ item }) => (
              <View
                style={styles.searchMainContainer}>
                <View>
                  <Image
                    source={IMAGES.profile}
                    style={styles.profileImage}
                  />
                  {/* <Image source={IMAGES.inactive} style={styles.activeImg} /> */}
                </View>
                <View style={styles.profileMainContainer}>
                  <View style={styles.directionContainer}>
                    <Text style={styles.name}>{userContacts.hasOwnProperty(item.sender.phoneNumber) ? userContacts[item.sender.phoneNumber] : item.sender.phoneNumber}</Text>
                    <Text style={styles.time}>{getTime(item.createdAt)}</Text>
                  </View>
                  <View>
                    <Text style={styles.detail}>Please invite me to Commune</Text>

                  </View>
                  <View style={styles.directionContainer}>
                    <TouchableOpacity style={styles.inviteAcceptButton} onPress={() => changeStatusOfInvite(item._id, 'accepted')} >
                      <Text style={styles.actionBottomText}>Invite</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.inviteRejectButton} onPress={() => changeStatusOfInvite(item._id, 'rejected')}>
                      <Text style={styles.actionBottomText}>Reject</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          />) : <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ paddingTop: '50%', }}>No Invite Request to display</Text>
          </View>)}
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
        </ScrollView>
      </View>
      <Spinner
        color={COLORS.darkRed}
        visible={loading || loading1}
        size="large"
        overlayColor="rgba(0,0,0,0.5)"
      />
      <Modal
        backdropColor="rgba(0,0,0,0.5)"
        backdropOpacity={1}
        animationIn="zoomInDown"
        animationOut="zoomOutUp"
        animationInTiming={1500}
        animationOutTiming={1500}
        backdropTransitionInTiming={600}
        backdropTransitionOutTiming={600}
        onBackButtonPress={() => setOpenModal(false)}
        onBackdropPress={() => setOpenModal(false)}
        isVisible={openModal}>
        <CameraModalData />
      </Modal>
    </Container>
  );
};

export default AllChateScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    marginHorizontal: 20,
    marginBottom: HP_WP.hp(7.6),
  },
  chatMainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    borderBottomWidth: 3,
    borderBottomColor: COLORS.lightGray,
  },
  chatContainer: {
    marginRight: 25,
    paddingBottom: 10,
    borderBottomColor: COLORS.darkRed,
    bottom: -3,
  },
  searchMainContainer: {
    flexDirection: 'row',
    marginTop: HP_WP.hp(2.5),
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: COLORS.lightGray,
    paddingTop: 15,
  },
  profileImage: {
    height: HP_WP.hp(7.7),
    width: HP_WP.wp(14),
    resizeMode: 'contain',
    borderRadius: 50,
  },
  activeImg: {
    position: 'absolute',
    borderRadius: 50,
    width: HP_WP.wp(3),
    height: HP_WP.hp(1.5),
    resizeMode: 'contain',
    right: 0,
    bottom: 0,
  },
  profileMainContainer: {
    flex: 1,
    marginHorizontal: 15,
  },
  directionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: SIZE.L,
    color: COLORS.darkBlack,
    fontFamily: FONTS.regular,
  },
  time: {
    fontSize: SIZE.S,
    color: COLORS.lightBlack,
    fontFamily: FONTS.light,
  },
  detail: {
    fontSize: SIZE.N,
    color: COLORS.lightBlack,
    fontFamily: FONTS.light,
  },
  timeBottomContainer: {
    backgroundColor: COLORS.darkRed,
    borderRadius: 50,
    width: 10,
    height: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inviteAcceptButton: {
    backgroundColor: COLORS.green,
    borderRadius: 50,
    width: 100,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inviteRejectButton: {
    backgroundColor: COLORS.darkRed,
    borderRadius: 50,
    width: 100,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeBottomText: {
    color: COLORS.white,
    fontSize: SIZE.VS,
    fontFamily: FONTS.regular,
  },
  actionBottomText: {
    color: COLORS.white,
    fontSize: SIZE.M,
    fontFamily: FONTS.regular,
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
  cameraModalContainer: {
    flexDirection: 'row',
    paddingVertical: HP_WP.wp(8),
    borderRadius: 10,
    margin: HP_WP.wp(10),
    borderWidth: 0.4,
    backgroundColor: COLORS.white,
  },
  cameraModalInnarContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraModalText: {
    fontSize: SIZE.N,
    color: COLORS.darkBlack,
    textAlign: 'center',
  },
});