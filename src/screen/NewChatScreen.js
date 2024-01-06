import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
  Share,
  Button,
  Linking,
  PermissionsAndroid,
  SafeAreaView
} from 'react-native';
import React, { useState, useEffect } from 'react';
import Toast from 'react-native-toast-message';

import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation, useQuery } from '@apollo/client';
import { useRoute } from '@react-navigation/native';
import Container from '../component/Container';
import { COLORS, FONTS, HP_WP, IMAGES, SIZE } from '../component/theme';
import SimpleHeader from '../component/SimpleHeader';
import { inviteFriend } from '../service/API';
import useAppData from '../service/AppData';
import { useStore } from '../service/AppData';
import { SEND_INVITATION_REQUEST } from '../api/graphql/inviteQueries';
import { GET_USER_CHATS, CREATE_NEW_CHATROOM } from '../api/graphql/chatQueries';
import Contacts from 'react-native-contacts';
import Modal from 'react-native-modal';
import { ActivityIndicator } from 'react-native';
import Contacted from './Contacted'
import styles from '../styles/contactStyles';

const InviteScreen = ({ route, navigation }) => {
  const [{ getContect }] = useAppData();
  const { setContact } = useStore();
  const [contacts, setContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [userPhoneNumber, setUserphoneNumber] = useState(async () => await AsyncStorage.getItem('authUserPhoneNumber'));
  const [selectedContactsMain, setSelectedContactsMain] = useState([]);
  const [search, setSearch] = useState('');
  const [UserInviteCode, setUserInviteCode] = useState('');
  const [userId, setuserId] = useState('');
  const [sendInvitationRequest, { loading, error, data }] = useMutation(SEND_INVITATION_REQUEST);
  const [createNewChatRoom, { loading: loading2, }] = useMutation(CREATE_NEW_CHATROOM);
  const { loading: loading1, error: error1, data: data1, refetch: refetch1 } = useQuery(GET_USER_CHATS);
  const [isVisible, setisVisible] = useState(false);
  const [filteredContacts, setFilteredContacts] = useState(contacts);

  const shareContent = async content => {
    try {
      await Share.share({
        message: `Hi. Commune is an invite only app. Access commune using my invitation code: ${UserInviteCode}`,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    async function fetch() {
      await getToken();
      if (userPhoneNumber) {
        await ConnectPermission();
        await setInviteCodeeee()
      }
      setContacts(getContect);
    }
    fetch();
    console.log("useEffect 1 " + contacts.length);
  }, []);

  useEffect(()=> {
    accessContacts()
  },[])

  const setInviteCodeeee = async () => {
    const inviteCode = await AsyncStorage.getItem('inviteRequestCode');
    console.log('inviteCode', inviteCode);
    setUserInviteCode(inviteCode)
  }

  const ConnectPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_CONTACTS);
      if (!granted) {
        const requestResult = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
          {
            title: 'Access Contacts',
            message: 'Commune needs to view your Phone Contacts inorder to function well. Please grant it access.',
          }
        );
        if (requestResult === 'never_ask_again') {
          // Handle the case where the user denied the permission and selected "Never ask again"
          // You can navigate the user to app settings in this case.
          setisVisible(true);
          setTimeout(() => {
            setisVisible(false);
            openAppSettings();
          }, 2000);
        } else if (requestResult === 'denied') {
          // Handle the case where the user denied the permission without selecting "Never ask again"
          // You can provide additional information or instructions to the user here.
          setisVisible(true);
          setTimeout(() => {
            setisVisible(false);
            openAppSettings().then(() => {
              navigation.navigate('Splash');
            });
          }, 2000);

        } else {
          // Permission granted or granted after asking.
          await accessContacts();
        }
      } else {
        await accessContacts();
      }
    } else if (Platform.OS === 'ios') {
      const statusCONTACTS = await request(PERMISSIONS.IOS.CONTACTS);
      console.warn('CONTACTS Permission Status:', statusCONTACTS);

      if (statusCONTACTS === 'denied' || statusCONTACTS === 'blocked' || statusCONTACTS === 'unavailable') {
        // Handle the case where the user denied the permission or blocked it.
        // You can navigate the user to app settings or provide instructions for changing the permission.
        setisVisible(true);
        setTimeout(() => {
          setisVisible(false);

          openAppSettings().then(() => {
            navigation.navigate('Splash');
          });
        }, 2000);
      } else if (statusCONTACTS === 'granted') {
        // Permission is granted.
        const status = await requestMultiple([PERMISSIONS.IOS.CONTACTS]);
        const allPermissionsGranted = Object.values(status).every(
          (status) => status === 'granted'
        );
        if (allPermissionsGranted) {
          await accessContacts();
        } else {
          // Handle the case where not all permissions are granted.
          // You can provide additional information or instructions to the user here. 
        }
      }
    }
  };

  const accessContacts = async () => {
    await Contacts.getAll()?.then(contactsData => {
      // const filteredItems = arrangedContacts?.filter((user) => user?.givenName?.toLowerCase().includes(searchQuery.toLowerCase()));
      setFilteredContacts(contactsData);
      // setFilteredContacts(getContect);
      // setContacts(arrangedContacts);
      setContacts(contactsData);
    })
    await getContect;
  };
  console.log(getContect.length);
  // console.log(getContect);

  // Fully Functional "Do Not Modify Code!!!" 
  function searchContacts(text) {
    setSearchQuery(text);
    const filteredItems = contacts?.filter((user) => user?.givenName?.toLowerCase().includes(text.toLowerCase()));
    // return contacts?.filter((user) => user?.givenName?.toLowerCase().includes(text.toLowerCase()));
    setFilteredContacts(filteredItems);
    console.log("Query " + searchQuery);
  };

  const openAppSettings = () => {
    Linking.openSettings();
  };

  const getToken = async function () {
    let User_PhoneNumber = await AsyncStorage.getItem('authUserPhoneNumber')
    setUserphoneNumber(User_PhoneNumber)
  }

  const addNewChatRoom = async (phoneNumber) => {
    const phoneNumberWithoutSpace = phoneNumber.replace(/\s/g, '');
    console.log('PHONE', phoneNumber)
    console.log('PHONE', phoneNumberWithoutSpace)
    try {
      const { data } = await createNewChatRoom({
        variables: {
          otherUserPhoneNumber: phoneNumberWithoutSpace,
        },
      });

      if (data) {
        console.log('data', data)
        navigation.navigate('ChatScreen', { phoneNumber: phoneNumberWithoutSpace, chatRoom: data.createNewChatRoom._id, users: [data.createNewChatRoom.user1._id, data.createNewChatRoom.user2._id, data.createNewChatRoom.user1._id], authUserPhoneNumber: userPhoneNumber })
      }
    } catch (error) {
      onError(error);
    }
  }

  const onError = (e) => {
    console.warn(e);
    Toast.show({
      position: 'top',
      type: 'error',
      text1: e.message,
    });
  };

  const keyExtractor = (item, idx) => {
    return item?.recordID?.toString() || idx.toString();
  };

  const renderItem = ({ item, index }) => {
    return <Contacted item={item} addNewChatRoom={addNewChatRoom} />;
  };

  if (!contacts) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
        <Text style={{ color: 'black', textAlign: 'center' }}>Loading Your Contacts...</Text>
      </SafeAreaView>
    )
  }

  return (
    <Container>
      <View style={styles.mainContainer}>
        <SimpleHeader title={'Add New Chat'} />
        <View style={styles.searchMainContainer}>
          <View style={styles.searchContainer}>
            <AntDesign name="search1" size={16} color={COLORS.darkBlack}
            />
            <TextInput
              value={searchQuery}
              onChangeText={(text) => searchContacts(text)}
              style={styles.input}
              placeholder="Search for friends"
              placeholderTextColor={COLORS.gray}
            />
          </View>
          <TouchableOpacity
            onPress={shareContent}
            style={styles.shareContainer}>
            <Entypo name="share" size={20} color={COLORS.darkBlack} />
          </TouchableOpacity>
        </View>
        <View style={styles.searchMainContainer}>
          <Text style={styles.fromContactsText}>From Contacts</Text>
          <Text
            style={styles.DeselectText}>
            {contacts
              ? `Deselect all(${contacts.length})`
              : `Select all(${contacts.length})`}
          </Text>
        </View>
        <FlatList
          style={{ paddingBottom: 20, flex: 1 }}
          showsVerticalScrollIndicator={false}
          data={searchQuery === "" ? contacts : filteredContacts}
          keyExtractor={keyExtractor}
          maxToRenderPerBatch={10}
          renderItem={renderItem}
          refreshing={true}
        />
      </View>
      {/* { previousScreenName == "OtpScreen" ? <GlobalButton
        buttonTitle={'Send Invite Request >>'}
        buttonStyle={styles.buttonStyle1}
        onPress={() => onSendInvite()}
      /> : null} */}
      <Spinner
        color={COLORS.darkRed}
        visible={loading || loading2}
        size="large"
        overlayColor="rgba(0,0,0,0.5)"
      />
      <Modal
        style={{ margin: 0 }}
        backdropColor="rgba(0,0,0,0.8)"
        backdropOpacity={1}
        animationIn="zoomInDown"
        animationOut="zoomOutUp"
        animationInTiming={1500}
        animationOutTiming={1500}
        backdropTransitionInTiming={600}
        backdropTransitionOutTiming={600}
        isVisible={isVisible}>
        <View style={styles.modalcontainer}>
          <Text style={styles.modalheading}>Contacts Permission</Text>
          <Text style={styles.modaltxt}>Please grant Commune App access to your contacts to get the best experience</Text>
        </View>
      </Modal>
    </Container>
  );
};

export default InviteScreen;