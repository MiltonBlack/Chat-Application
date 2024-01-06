import React, {useState, useEffect} from 'react';
import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  AppState,
  PermissionsAndroid,
  Linking
} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import AllChateScreen from '../screen/AllChatScreen';
import StatusScreen from '../screen/StatusScreen';
import InviteScreen from '../screen/InviteScreen';
import NewChatScreen from '../screen/NewChatScreen';
import AMA_Live from '../screen/AMA_Live';
import {useNetInfo} from '@react-native-community/netinfo';
import {useMutation, useQuery} from '@apollo/client';
import CallListScreen from '../screen/CallListScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {UPDATE_USER_PRESENCE} from '../api/graphql/userQueries';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SlowConectionModal from '../component/SlowConectionModal';
import {request, requestMultiple, PERMISSIONS,} from 'react-native-permissions';
import {useStore} from '../service/AppData';
import { INCOMING_CALL_SUBBSCRIPTION, GET_CALL_LOGS } from '../api/graphql/callQueries';
import Contacts from 'react-native-contacts';
import Modal from 'react-native-modal';
import Status from '../screen/Status/Status';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const CustomTabBar = ({state, descriptors, navigation}) => {
  return (
    <ImageBackground
      resizeMode="stretch"
      source={require('../assest/image/tab/bottamBG.png')}
      style={styles.container}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        let icon = null;
        if (index === 0) {
          icon = require('../assest/image/tab/chat.png');
        } else if (index === 1) {
          icon = require('../assest/image/tab/status.png');
        } else if (index === 2) {
          icon = require('../assest/image/tab/add.png');
        } else if (index === 3) {
          icon = require('../assest/image/tab/live.png');
        } else if (index === 4) {
          icon = require('../assest/image/tab/call.png');
        }
        let title = null;
        if (index === 0) {
          title = 'Chat';
        } else if (index === 1) {
          title = 'Status';
        } else if (index === 2) {
          title = 'New Chat';
        } else if (index === 3) {
          title = 'AMA Live';
        } else if (index === 4) {
          title = 'Call';
        }

        const isFocused = state.index === index;
        const onPress = () => {
          const event = navigation.navigate({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate({name: route.name, merge: true});
          }
        };

        return (
          <TouchableOpacity
            accessibilityLabel={options.tabBarAccessibilityLabel}
            accessibilityRole="button"
            testID={options.tabBarTestID}
            accessibilityState={isFocused ? {selected: true} : {}}
            activeOpacity={0.5}
            onPress={onPress}
            style={{alignItems: 'center'}}>
            <View style={styles.button(index)}>
              {isFocused ? (
                <Image
                  style={[
                    styles.focusedIcon,
                    {tintColor: index === 2 ? '#fff' : '#A0015D'},
                  ]}
                  source={icon}
                />
              ) : (
                <>
                  <Image style={styles.unfocusedIcon} source={icon} />
                </>
              )}
            </View>
            {isFocused ? (
              <Text style={[styles.activeText(index)]}>{title}</Text>
            ) : (
              <Text style={[styles.text(index)]}>{title}</Text>
            )}
          </TouchableOpacity>
        );
      })}
    </ImageBackground>
  );
};

const MyTab = () => {
  return (
    <Tab.Navigator 
      tabBarOptions={{
        showLabel: false,
      }}
      screenOptions={{headerShown: false}}
      tabBar={props => <CustomTabBar {...props} />}>
      <Tab.Screen name="Chats" component={AllChateScreen} />
      <Tab.Screen name="Status" component={Status} />
      <Tab.Screen name="NewChatScreen" component={NewChatScreen} />
      <Tab.Screen name="AMA_Live" component={AMA_Live} />
      <Tab.Screen name="Call" component={CallListScreen} />
    </Tab.Navigator>
  );
};

const MainStack = ({navigation}) => {
  const [updateUserPresence] = useMutation(UPDATE_USER_PRESENCE);
  const netInfo = useNetInfo();
  const [userId, setuserId] = useState('');
  const [isConnected, setisConnected] = useState(true);
  const [isVisible, setVisible] = useState(false);
  const [userAcceptedPermission, setuserAcceptedPermission] = useState(false);
  const {loading, refetch, subscribeToMore } = useQuery(GET_CALL_LOGS);
  const {setContact} = useStore();
  const [userPhoneNumber, setUserphoneNumber] = useState('');

  useEffect(() => {
    getToken()
    ContectPermission();
    setTimeout(() => {
      if (!netInfo.isConnected) {
        setVisible(true);
        setisConnected(false)
      } else {
        setVisible(false)
        setisConnected(true)
      }
    }, 3000);
  }, []);

  useEffect(() => {

    const updateOnlineStatus = async () => {
      try {
          const { data } = await updateUserPresence({ variables: { online: isConnected } });
        
          if (data) {
          setVisible(false)

            console.log('Sent online status:', data);
          }
      } catch (error) {
        console.log('Error:', error);
        if (error == "[ApolloError: Network request failed]") {
          setVisible(true)
        }
      }
      console.log('Checking online status');
    };
  
    const interval = setInterval(updateOnlineStatus, 5000);
  
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    console.log('NUMBER', userPhoneNumber)
    subscribeToMore({
      document: INCOMING_CALL_SUBBSCRIPTION,
      variables: {
        phoneNumber: userPhoneNumber,
      },
      updateQuery: async (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        console.log('KK', subscriptionData);
        console.log('KK', subscriptionData.data.incomingCallUpdate);
        const chatRoom = subscriptionData.data.incomingCallUpdate.chatRoom;
        const callLog = subscriptionData.data.incomingCallUpdate.callLog;

      navigation.navigate('CallingScreen', { phoneNumber:callLog.caller, chatRoomUsers: [chatRoom.user1, chatRoom.user2, userId], chatRoom: chatRoom._id, authUserPhoneNumber:userPhoneNumber, callType: callLog.type })
        
    }})
  
  }, [subscribeToMore])

  const getToken = async function () {
    let User_ID = await AsyncStorage.getItem('userID')
    let User_PhoneNumber = await AsyncStorage.getItem('authUserPhoneNumber')
    setUserphoneNumber(User_PhoneNumber)
    setuserId(User_ID)
  }

  const ContectPermission = async () => {
    console.log()
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
          setuserAcceptedPermission(true);
            setTimeout(() => {
            setuserAcceptedPermission(false);

            openAppSettings()
          //   .then(()=>{
          //     navigation.navigate('Splash');
          //   });
          }, 2000);
            
        } else if (requestResult === 'denied') {
          // Handle the case where the user denied the permission without selecting "Never ask again"
          // You can provide additional information or instructions to the user here.
            setuserAcceptedPermission(true);
            setTimeout(() => {
            setuserAcceptedPermission(false);

            openAppSettings()
          //   .then(()=>{
          //     navigation.navigate('Splash');
          //   });
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
        setuserAcceptedPermission(true);
        setTimeout(() => {
         setuserAcceptedPermission(false);

        openAppSettings()
      //   .then(()=>{
      //     navigation.navigate('Splash');
      //   });
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
    Contacts.getAll(async (err, data) => {
      data.sort(
        (a, b) => a?.givenName?.toLowerCase() > b?.givenName?.toLowerCase(),
      );
      if (err === 'denied') {
        Alert.alert('Permission to access contacts was denied');
      } else {
        await setContact(data);
      }
    });
  };

  const openAppSettings = () => {
    console.log('opening linking')
    Linking.openSettings();
  };


  return (
    <>
    {<SlowConectionModal isVisible={userAcceptedPermission} />}

    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="MyTab" component={MyTab} />
    </Stack.Navigator>
    </>
  );
};

export default MainStack;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: 75,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    bottom: 0,
    left: 0,
    right: 0,
  },
  focusedIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
  unfocusedIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
  button: (index = false) => ({
    position: index === 2 ? 'absolute' : null,
    top: index === 2 ? -50 : 0,
    backgroundColor: index === 2 ? '#A0015D' : '',
    padding: index === 2 ? 10 : 0,
    alignSelf: index === 2 ? 'center' : 'auto',
    borderRadius: index === 2 ? 50 : 0,
    left: index === 2 ? 17 : 0,
  }),
  text: (index = false) => ({
    width: '100%',
    textAlign: 'center',
    fontSize: index == 2 ? 15 : 13,
    color: '#ABA6A9',
    fontWeight: 500,
    left: index === 2 ? 4 : 0,
  }),
  activeText: (index = false) => ({
    width: '100%',
    textAlign: 'center',
    fontSize: index == 2 ? 15 : 13,
    color: '#A0015D',
    fontWeight: 500,
    left: index === 2 ? 4 : 0,
  }),
});
