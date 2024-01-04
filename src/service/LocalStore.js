import AsyncStorage from '@react-native-async-storage/async-storage';

export const setAuthToken = async function (isToken) {
  try {
    await AsyncStorage.setItem('authToken', isToken);
    console.log('Data stored successfully');
  } catch (error) {
    console.error('Error storing data:', error);
  }
};

const getAuthToken = async function () {
  try {
    const data = await AsyncStorage.getItem('authToken');
    if (data !== null) {
      return data;
    } else {
      console.log('Data not found in AsyncStorage');
    }
  } catch (error) {
    console.error('AsyncStorage Error:', error);
  }
};

const isAuth = async function () {
  console.log('Token', AsyncStorage.getItem('authToken'));
  if(AsyncStorage.getItem('authToken')) {
    return true;
  }
};

export const checkAuthentication = async (navigation) => {
  try {
    const authToken = await AsyncStorage.getItem('authToken');

    if (authToken) {
      navigation.navigate('NavStack');
    } else if(!authToken){
      setTimeout(() => {
        navigation.navigate('InfoScreen');
      }, 6000);
    }
  } catch (error) {
    console.error('Error checking authentication:', error);
  }
};

const setUserID = async function (userID) {
  await AsyncStorage.setItem('userID', userID);
};

const setAuthInviteRequestCode = async function (inviteRequestCode) {
  await AsyncStorage.setItem('inviteRequestCode', inviteRequestCode);
};

const setAuthUserPhoneNumber = async function (phoneNumber) {
  await AsyncStorage.setItem('authUserPhoneNumber', phoneNumber);
};

const getAuthUserPhoneNumber = async function () {
  return await AsyncStorage.getItem('authUserPhoneNumber', );
};

const getUserID = async function () {
  return await AsyncStorage.getItem('userID');
};

export { getAuthToken, setUserID, getUserID, setAuthUserPhoneNumber, getAuthUserPhoneNumber, setAuthInviteRequestCode };
