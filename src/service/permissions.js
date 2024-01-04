import {PermissionsAndroid, Platform} from 'react-native';
import Contacts from 'react-native-contacts';
import {request, requestMultiple, PERMISSIONS, PermissionsIOS} from 'react-native-permissions';

export const ContectPermission = async () => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
        title: 'Access Contacts',
        message: 'App Want to View your Phone Contacts.',
      }).then(() => {
        accessContacts();
      });
    } else if (Platform.OS === 'ios') {
      const statusCONTACTS = await request(PERMISSIONS.IOS.CONTACTS);
      console.warn('CONTACTS Permission Status:', statusCONTACTS);
      const status = await requestMultiple([PERMISSIONS.IOS.CONTACTS]);

      const allPermissionsGranted = Object.values(status).every(
        status => status === 'granted',
      );
      accessContacts();
      return allPermissionsGranted;
    }
  };

  const accessContacts = () => {
    Contacts.getAll((err, data) => {
      data.sort(
        (a, b) => a?.givenName?.toLowerCase() > b?.givenName?.toLowerCase(),
      );
      if (err === 'denied') {
        Alert.alert('Permission to access contacts was denied');
      } else {
        setContact(data);
      }
    });
  };


export const requestGalleryPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // Alert.alert('Gallery permission granted');
          // Proceed with accessing the gallery
        } else {
          // Alert.alert('Gallery permission denied');
          // Handle permission denied case
        }
      } catch (error) {
        Alert.alert('Error requesting gallery permission:', error);
        // Handle error case
      }
    } else if (Platform.OS === 'ios') {
      const status = await PermissionsIOS.request(
        PermissionsIOS.PERMISSIONS.CAMERA,
      );
      if (status === PermissionsIOS.RESULTS.GRANTED) {
        Alert.alert('Camera permission granted');
        // Proceed with using the camera
      } else {
        Alert.alert('Camera permission denied');
        // Handle permission denied case
      }
      // iOS permission
      // Use the `request` method from `react-native-permissions` library
    }
  };

  export const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          // PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        ]);
        if (
          granted['android.permission.RECORD_AUDIO'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.WRITE_EXTERNAL_STORAGE'] ===
            PermissionsAndroid.RESULTS.GRANTED && granted['android.permission.READ_CONTACTS'] === PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.log('Permissions granted');
        } else {
          console.log('Permissions denied');
        }
      } catch (error) {
        console.log('Error while requesting permissions:', error);
      }
    } else if (Platform.OS === 'ios') {
      const statusPHOTO_LIBRARY = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
      console.warn('PHOTO_LIBRARY Permission Status:', statusPHOTO_LIBRARY);

      const statusMICROPHONE = await request(PERMISSIONS.IOS.MICROPHONE);
      console.warn('MICROPHONE Permission Status:', statusMICROPHONE);

      // const statusCONTACTS = await request(PERMISSIONS.IOS.CONTACTS)
      // console.warn('CONTACTS Permission Status:', statusCONTACTS);

      const status = await requestMultiple([
        PERMISSIONS.IOS.PHOTO_LIBRARY,
        PERMISSIONS.IOS.MICROPHONE,
        // PERMISSIONS.IOS.CONTACTS
      ]);

      const allPermissionsGranted = Object.values(status).every(
        status => status === 'granted',
      );
      console.warn(allPermissionsGranted);

      return allPermissionsGranted;
    }
  };