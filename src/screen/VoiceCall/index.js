import React from 'react';
import {  StyleSheet, View } from 'react-native';
import { ZegoUIKitPrebuiltCall, ONE_ON_ONE_VOICE_CALL_CONFIG } from '@zegocloud/zego-uikit-prebuilt-call-rn'
import { COLORS, FONTS, HP_WP, SIZE } from '../../component/theme';


const VoiceCallScreen = ({ route, navigation }) => {
  //Zego
  const appID = '1394133535';
  const appSign = '9cb1cffa6a1a2288e375ebf47ca318fe34fafec187d72b0018897f72e8a56e71';
  const userName = 'zego' + Math.floor(Math.random() * 200);
  const userID = channel;
  const channel = `${route?.params?.chatRoomUsers[0]}${route?.params?.chatRoomUsers[1]}`;
  const callID = "rn" + Math.floor(Math.random() * 200000);
  return (
    <View style={styles.container}>
      <ZegoUIKitPrebuiltCall
        appID={appID}
        appSign={appSign}
        userID={userID}
        userName={userName}
        callID={callID} 
        config={{
          ...ONE_ON_ONE_VOICE_CALL_CONFIG
        }}
        />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ddeeff',
  },
  name: {
    color: COLORS.darkBlack,
    fontSize: SIZE.XXL,
    fontFamily: FONTS.bold,
    textAlign: 'center',
    marginTop: HP_WP.hp(7),
  },
  time: {
    color: COLORS.lightBlack,
    fontSize: SIZE.M,
    fontFamily: FONTS.regular,
    textAlign: 'center',
    marginTop: HP_WP.hp(1),
  },
  profileImage: {
    width: HP_WP.wp(28),
    height: HP_WP.hp(13.2),
    borderRadius: 50,
    alignSelf: 'center',
    marginTop: HP_WP.hp(6),
    resizeMode: 'contain',
  },
});

export default VoiceCallScreen;
