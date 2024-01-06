import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import { ZegoUIKitPrebuiltCall, ONE_ON_ONE_VIDEO_CALL_CONFIG } from '@zegocloud/zego-uikit-prebuilt-call-rn';
import { COLORS, FONTS, HP_WP, SIZE } from '../../component/theme';



export default function VideoCallScreen({ route, navigation }) {
  //Zego
  const appID = '1394133535';
  const appSign = '9cb1cffa6a1a2288e375ebf47ca318fe34fafec187d72b0018897f72e8a56e71';

  const preBuiltRef = useRef();
  const userName = 'zego' + Math.floor(Math.random() * 200);
  const userID = channel;
  const channel = `${route?.params?.chatRoomUsers[0]}${route?.params?.chatRoomUsers[1]}`;
  const callID = "rn" + Math.floor(Math.random() * 200000);
  console.log("UserName" + userName);
  console.log("UserID" + userID);
  console.log("CallID" + callID);
  console.log("Channel" + channel);
  return (
    <View style={styles.container}>
      <ZegoUIKitPrebuiltCall
        ref={preBuiltRef}
        appID={appID}
        appSign={appSign}
        userID={userID}
        userName={userName}
        callID={callID}
        config={{
          ...ONE_ON_ONE_VIDEO_CALL_CONFIG
        }}
      />
    </View>
  );
}

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ddeeff',
  },
  smallImage: {
    borderRadius: 5,
    width: HP_WP.wp(30),
    height: HP_WP.hp(20),
    position: 'absolute',
    top: 60,
    right: 10,
  },
  name: {
    color: COLORS.white,
    fontSize: SIZE.XXL,
    fontFamily: FONTS.bold,
    textAlign: 'center',
  },
  time: {
    color: COLORS.white,
    fontSize: SIZE.M,
    fontFamily: FONTS.regular,
    textAlign: 'center',
  },
});