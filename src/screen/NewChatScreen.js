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
  const [contacts, setContacts] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [userPhoneNumber, setUserphoneNumber] = useState(async () => await AsyncStorage.getItem('authUserPhoneNumber'));
  const [UserInviteCode, setUserInviteCode] = useState('');
  const [userId, setuserId] = useState('');
  const [sendInvitationRequest, { loading, error, data }] = useMutation(SEND_INVITATION_REQUEST);
  const [createNewChatRoom, { loading: loading2, }] = useMutation(CREATE_NEW_CHATROOM);
  const { loading: loading1, error: error1, data: data1, refetch: refetch1 } = useQuery(GET_USER_CHATS);
  const [isVisible, setisVisible] = useState(false);
  const [filteredContacts, setFilteredContacts] = useState([]);

  useEffect(() => {
    accessContacts()
  }, [contacts])

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
        await setInviteCodeeee()
      }
    }
    fetch();
    console.log("useEffect 1 " + contacts?.length);
  }, []);


  const accessContacts = async () => {
    await Contacts.getAll()?.then(contactsData => {
      setContacts(contactsData);
    })
    await getContect;
  };
  const setInviteCodeeee = async () => {
    const inviteCode = await AsyncStorage.getItem('inviteRequestCode');
    console.log('inviteCode', inviteCode);
    setUserInviteCode(inviteCode)
  }

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
              ? `Deselect all(${contacts?.length})`
              : `Select all(${contacts?.length})`}
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