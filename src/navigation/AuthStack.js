import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WellcomeScreen from '../screen/WellcomeScreen';
import CreateAccount from '../screen/CreateAccount';
import Login from '../screen/Login';
import InfoScreen from '../screen/InfoScreen';
import OtpScreen from '../screen/OtpScreen';
import SplashScreen from '../screen/SplashScreen';
import InviteScreen from '../screen/InviteScreen';
import NewChatScreen from '../screen/NewChatScreen';
import AllChateScreen from '../screen/AllChatScreen';
import MainStack from './MainStack';
import ChatScreen from '../screen/ChatScreen';
import StatusScreen from '../screen/StatusScreen';
import ViewStatusScreen from '../screen/viewStatusScreen';
import UploadStatusScreen from '../screen/uploadStatusScreen';
import LiveScreen from '../screen/LiveScreen';
import VoiceCall from '../screen/VoiceCall/index';
import VideoCall from '../screen/VideoCall';
import CallingScreen from '../screen/callingNotificationScreen';
import useAppData from '../service/AppData';
import NavStack from './NavStack';
import Status from '../screen/Status/Status'

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  const [{ phoneNumber }] = useAppData();

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      // initialRouteName='NavStack'
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="InfoScreen" component={InfoScreen} />
      <Stack.Screen name="WellcomeScreen" component={WellcomeScreen} />
      <Stack.Screen name="CreateAccount" component={CreateAccount} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="OtpScreen" component={OtpScreen} />
      <Stack.Screen name="InviteScreen" component={InviteScreen} />
      <Stack.Screen name="NewChatScreen" component={NewChatScreen} />
      {/* <Stack.Screen name="MainStack" component={MainStack} /> */}
      <Stack.Screen name="NavStack" component={NavStack} />
      <Stack.Screen name="AllChateScreen" component={AllChateScreen} />
      <Stack.Screen name="Status" component={Status} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
      <Stack.Screen name="LiveScreen" component={LiveScreen} />
      <Stack.Screen name="StatusScreen" component={StatusScreen} />
      <Stack.Screen name="ViewStatusScreen" component={ViewStatusScreen} />
      <Stack.Screen name="UploadStatusScreen" component={UploadStatusScreen} />
      <Stack.Screen name="CallingScreen" component={CallingScreen} />
      <Stack.Screen name="VideoCall" component={VideoCall} />
      <Stack.Screen name="VoiceCall" component={VoiceCall} />
    </Stack.Navigator>
  );
};
export default AuthStack;
