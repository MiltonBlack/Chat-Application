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
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Toast from 'react-native-toast-message';

import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation, useQuery } from '@apollo/client';
import { useRoute } from '@react-navigation/native';
import Container from '../component/Container';
import {COLORS, FONTS, HP_WP, IMAGES, SIZE} from '../component/theme';
import SimpleHeader from '../component/SimpleHeader';
import GlobalButton from '../component/GlobalButton';
import {inviteFriend} from '../service/API';
import useAppData from '../service/AppData';
import { SEND_INVITATION_REQUEST } from '../api/graphql/inviteQueries'; 
import { GET_USER_CHATS } from '../api/graphql/chatQueries';
import Contacts from 'react-native-contacts';

const InviteScreen = ({route, navigation}) => {
  const [{getContect}] = useAppData();
  const [contacts, setContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [selectedContactsMain, setSelectedContactsMain] = useState([]);
  const [search, setSearch] = useState('');
  const [userInviteCode, setuserInviteCode] = useState(async () => await AsyncStorage.getItem('inviteRequestCode'));
  const [chatRooms, setchatRooms] = useState([]);
  const [userId, setuserId] = useState('');
  const [sendInvitationRequest, { loading, error, data }] = useMutation(SEND_INVITATION_REQUEST);
  const { loading: loading1, error: error1, data: data1, refetch: refetch1 } = useQuery(GET_USER_CHATS);

  const shareContent = async content => {
    try {
      await Share.share({
        message: userInviteCode,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    setContacts(getContect);
  }, []);

  useEffect(() => {
    console.log('FETCHING');
    refetch1().then((chats, d) => {
      console.log('CHATS', chats.data.chatList)
      setchatRooms(chats.data.chatList)
    });
  }, [refetch1]);

  const handleContactSelection = contact => {
    setSelectedContacts(prevSelectedContacts => {
      if (prevSelectedContacts.includes(contact.recordID)) {
        // Contact already selected, remove it from the selection
        return prevSelectedContacts.filter(id => id !== contact.recordID);
      } else {
        // Contact not selected, add it to the selection
        console.log("PhoneNumbers", [contact.phoneNumbers]);
        console.log("SELECTING", [...prevSelectedContacts, contact.recordID]);
        return [...prevSelectedContacts, contact.recordID];
      }
    })

    setSelectedContactsMain(prevSelectedContacts => {
      if (prevSelectedContacts.some((item) => item.recordID === contact.recordID)) {
        // Contact already selected, remove it from the selection
        return prevSelectedContacts.filter((item) => item.recordID !== contact.recordID);
      } else {
        // Contact not selected, add it to the selection
        console.log("SELECTING B", [...prevSelectedContacts, { recordID: contact.recordID, phoneNumber: contact.phoneNumbers[0].number.split(' ').join(''), displayName: contact.givenName }]);
        return [...prevSelectedContacts, { recordID: contact.recordID, phoneNumber: contact.phoneNumbers[0].number.split(' ').join(''), displayName: contact.givenName }];

      }
    })
  };

  const onSendInvite = async () => {
    // navigation.navigate('MainStack');
    console.log('sending invite')
    try {
    console.log('sending invite2')

      const { data } = await sendInvitationRequest({
        variables: { 
          recipientPhoneNumbers: selectedContactsMain,
         },
      });
    console.log('sending invite3')


      if (data) {
        onResponse(data)
      }

    } catch (error) {
      onError(error);
    }
  };

  const onResponse = async (res) => {
    console.log('Response:', res);
    setSelectedContactsMain([]);
    setSelectedContacts([]);
    Toast.show({
      position: 'top',
      type: 'success',
      text1: res?.sendInvitationRequest?.message,
    });

    if (chatRooms.length >= 1) {
     navigation.navigate('NavStack');
      
    }
  };

  const onError = (e) => {
    console.warn(e);
    Toast.show({
      position: 'top',
      type: 'error',
      text1: e.message,
    });
  };

  const filteredContacts = contacts.filter((contact) =>
    contact.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container>
      <View style={styles.mainContainer}>
        <SimpleHeader title={'Request for an Invite'} />
        <View style={styles.searchMainContainer}>
          <View style={styles.searchContainer}>
            <AntDesign name="search1" size={16} color={COLORS.darkBlack} />
            <TextInput
              value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
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
        { selectedContacts.length >= 1 ? <GlobalButton
        buttonTitle={'Send Invite Request >>'}
        buttonStyle={styles.buttonStyle2}
        onPress={() => onSendInvite()}
      /> : null}
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
          style={{paddingBottom: 20}}
          data={filteredContacts}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.recordID?.toString()}
          renderItem={({item}) => {
            return (
              <>
                {Platform.OS === 'ios' && (
                  <View
                    style={[
                      styles.searchMainContainer,
                      {marginTop: HP_WP.hp(3)},
                    ]}>
                    <Image
                      source={
                        item.hasThumbnail
                          ? {uri: item.thumbnailPath}
                          : IMAGES.profile
                      }
                      style={styles.profileImage}
                    />
                    <View style={styles.profileMainContainer}>
                      <Text style={styles.name}>{`${item.givenName}`}</Text>
                      <Text
                        style={
                          styles.number
                        }>{`${item?.phoneNumbers[0]?.number}`}</Text>
                    </View>

                    <TouchableOpacity
                      style={[
                        styles.checkbox,
                        {
                          backgroundColor: selectedContacts.includes(item.recordID)
                            ? COLORS.darkRed
                            : COLORS.white,
                          borderWidth: selectedContacts.includes(item.recordID) ? 0 : 1,
                        },
                      ]}
                      onPress={() => handleContactSelection(item)}
                    >
                      {selectedContacts.includes(item.recordID) && (
                        <Image
                          source={require('../assest/images/check.png')}
                          style={styles.checkedStyle}
                        />
                      )}
                    </TouchableOpacity>
                  </View>
                )}

                {item?.phoneNumbers[0]?.number && (
                  <View
                    style={[
                      styles.searchMainContainer,
                      {marginTop: HP_WP.hp(3)},
                    ]}>
                    <Image
                      source={
                        item.hasThumbnail
                          ? {uri: item.thumbnailPath}
                          : IMAGES.profile
                      }
                      style={styles.profileImage}
                    />
                    <View style={styles.profileMainContainer}>
                      <Text style={styles.name}>{`${item.givenName}`}</Text>
                      <Text
                        style={
                          styles.number
                        }>{`${item?.phoneNumbers[0]?.number}`}</Text>
                    </View>
                    <TouchableOpacity
                      style={[
                        styles.checkbox,
                        {
                          backgroundColor: selectedContacts.includes(item.recordID)
                            ? COLORS.darkRed
                            : COLORS.white,
                          borderWidth: selectedContacts.includes(item.recordID) ? 0 : 1,
                        },
                      ]}
                      onPress={() => handleContactSelection(item)}>
                      {selectedContacts.includes(item.recordID) &&  
                        <Image
                          source={require('../assest/images/check.png')}
                          style={styles.checkedStyle}
                        />
                      }
                    </TouchableOpacity>
                  </View>
                )}
              </>
            );
          }}
        />
      </View>
      {/* { previousScreenName == "OtpScreen" ? <GlobalButton
        buttonTitle={'Send Invite Request >>'}
        buttonStyle={styles.buttonStyle1}
        onPress={() => onSendInvite()}
      /> : null} */}
      <Spinner
        color={COLORS.darkRed}
        visible={loading}
        size="large"
        overlayColor="rgba(0,0,0,0.5)"
      />
    </Container>
  );
};

export default InviteScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    marginHorizontal: 20,
  },
  searchMainContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: HP_WP.hp(4),
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: HP_WP.wp(70),
    borderRadius: 8,
    backgroundColor: COLORS.lightWhite,
    elevation: 1,
    height: HP_WP.hp(6),
    paddingHorizontal: 10,
  },
  input: {
    marginLeft: 10,
    flex: 1,
    fontSize: SIZE.N,
    color: COLORS.gray,
    fontFamily: FONTS.light,
  },
  shareContainer: {
    backgroundColor: COLORS.lightWhite,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    elevation: 1,
    height: HP_WP.hp(6),
    width: HP_WP.wp(17),
  },
  fromContactsText: {
    fontSize: SIZE.XL,
    color: COLORS.darkBlack,
    fontFamily: FONTS.regular,
  },
  DeselectText: {
    fontSize: SIZE.M,
    color: COLORS.lightBlack,
    fontFamily: FONTS.light,
  },
  profileMainContainer: {
    flex: 1,
    marginHorizontal: 15,
  },
  profileImage: {
    height: HP_WP.hp(5.7),
    width: HP_WP.wp(12),
    resizeMode: 'contain',
    borderRadius: 50,
  },
  name: {
    fontSize: SIZE.L,
    color: COLORS.darkBlack,
    fontFamily: FONTS.regular,
  },
  number: {
    fontSize: SIZE.N,
    color: COLORS.lightBlack,
    fontFamily: FONTS.light,
  },
  buttonStyle1: {
    bottom: 10,
  },
  buttonStyle2: {
    top: 10,
  },
  checkbox: {
    height: 18,
    width: 18,
    borderRadius: 2,
    borderColor: COLORS.darkGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedStyle: {
    height: 12,
    width: 12,
    resizeMode: 'contain',
    tintColor: COLORS.white,
  },
});


// import { StyleSheet, Text, View } from 'react-native'
// import React from 'react'

// const InviteScreen = () => {
//   return (
//     <View>
//       <Text>InviteScreen</Text>
//     </View>
//   )
// }

// export default InviteScreen

// const styles = StyleSheet.create({})
