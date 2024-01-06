import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import { useNetInfo } from '@react-native-community/netinfo';
import { StyleSheet, Linking } from 'react-native';
import {
  split,
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloProvider,
} from '@apollo/client';
import { loadErrorMessages, loadDevMessages } from '@apollo/client/dev';
import { setContext } from '@apollo/client/link/context';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { PermissionsAndroid, Platform } from 'react-native';
import Contacts from 'react-native-contacts';
import { request, requestMultiple, PERMISSIONS, } from 'react-native-permissions';

import { createClient } from 'graphql-ws';

import { FONTS } from './src/component/theme';
import ConectionModal from './src/component/ConectionModal';
import { useStore } from './src/service/AppData';
import { getAuthToken } from './src/service/LocalStore';
import { AuthProvider } from './src/providers/AuthContext';
import AuthStack from './src/navigation/AuthStack';
import { requestGalleryPermission, requestPermissions } from './src/service/permissions'

const toastConfig = {
  success: props => (
    <BaseToast
      {...props}
      style={styles.baseToastContainer}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={styles.baseToastText}
    />
  ),
  error: props => (
    <ErrorToast
      {...props}
      text1Style={{
        fontSize: 17,
      }}
      text2Style={styles.baseToastText}
    />
  ),
};

const App = () => {
  const netInfo = useNetInfo();
  const { setContact } = useStore();
  const [isVisible, setVisible] = useState(false);
  const [isContactAccepted, setisVisible] = useState(false)
  if (__DEV__) {
    // Adds messages only in a dev environment
    loadDevMessages();
    loadErrorMessages();
  }
  const serverUrl = 'https://valueverdict.com/graphql';

  const httpLink = new HttpLink({
    uri: serverUrl,
  });

  const authLink = setContext(async (_, { headers }) => {
    const token = await getAuthToken();
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      },
    };
  });

  const wsLink = new GraphQLWsLink(
    createClient({
      url: 'wss://valueverdict.com/graphql',
    }),
  );

  const link = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    wsLink,
    authLink.concat(httpLink),
  );

  const client = new ApolloClient({
    link: link,
    cache: new InMemoryCache(),
  });

  useEffect(() => {
    setTimeout(() => {
      if (!netInfo.isConnected) {
        setVisible(true);
      }
    }, 1000);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      ConnectPermission();
    }, 6600);
    requestPermissions();
    requestGalleryPermission();
  }, []);

  // useEffect(() => {
  //   ConnectPermission();
  // }, []);


  const ConnectPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_CONTACTS);
      if (!granted) {
        const requestResult = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
          {
            title: 'Access Contacts',
            message: 'App wants to view your Phone Contacts.',
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

          openAppSettings();
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

  const openAppSettings = () => {
    Linking.openSettings();
  };

  const accessContacts = async () => {
    Contacts.getAll()?.then(contactsData => { 
      const arrangedContacts = contactsData?.sort((first, second) => first.givenName?.toLowerCase() < second.givenName?.toLowerCase() ? -1 : 1);
      setContact(arrangedContacts);
      // console.log(arrangedContacts.length);
    })
  };

  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <NavigationContainer>
          <AuthStack />
          {/* {!netInfo.isConnected && <ConectionModal isVisible={isVisible} />} */}
          {<ConectionModal isVisible={isContactAccepted} />}
          <Toast config={toastConfig} />
        </NavigationContainer>
      </AuthProvider>
    </ApolloProvider>
  );
};

export default App;
const styles = StyleSheet.create({
  baseToastText: {
    fontSize: 15,
    fontFamily: FONTS.regular,
  },
  baseToastContainer: {
    borderLeftColor: 'green',
  },
});
