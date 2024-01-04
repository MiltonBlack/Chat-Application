import React, {useRef, useState, useEffect} from 'react';
import {
  Image,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  PermissionsAndroid,
  Platform
} from 'react-native';
import {ClientRoleType, createAgoraRtcEngine, IRtcEngine, ChannelProfileType} from 'react-native-agora'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Sound from 'react-native-sound';
import {COLORS, FONTS, HP_WP, IMAGES, SIZE} from '../component/theme';

const CallNotificationScreen = ({ route, navigation }) => {
  
  const agoraEngineRef = useRef(IRtcEngine);
  const [isJoined, setIsJoined] = useState(false);
  const [remoteUid, setRemoteUid] = useState(0);
  const [message, setMessage] = useState('');

  function showMessage(msg){
    setMessage(msg);
  }

  let phoneNumber = route?.params?.phoneNumber;
  let chatRoom = route?.params?.chatRoom;
  let chatRoomUsers = route?.params?.chatRoomUsers;
  let authUserPhoneNumber = route?.params?.authUserPhoneNumber;
  let callType = route?.params?.callType;

  useEffect(() => {
    console.log('...calling')

    // Initialize the ringing sound
    const ringingSound = new Sound('commune_ringing_tone.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('Failed to load the sound', error);
        return;
      }
    console.log('...calling2')
    const startTimeInSeconds = 74;
    ringingSound.setCurrentTime(startTimeInSeconds);
    
      // Loaded successfully, start playing
      ringingSound.play((success) => {
        if (!success) {
          console.log('Sound did not play')
        }
      })
    });

    // Cleanup the sound when the component unmounts
    return () => {
      if (ringingSound.isPlaying()) {
        ringingSound.stop();
      }
      ringingSound.release(); // Release resources
    };
  }, []);

  // Function to stop the ringing sound
  const stopRinging = () => {
    if (ringingSound && ringingSound.isPlaying()) {
      ringingSound.stop();
    }
  };

  const AcceptCall = () => {
    console.log('accepting voice call')
    console.log('callType', callType)

    if(callType == 'voice'){
      console.log('accepting voice call')
      navigation.navigate('VoiceCall', { phoneNumber, chatRoomUsers, chatRoom, authUserPhoneNumber, from:'notify' })

    } else if(callType == 'video'){
      console.log('accepting video call')

      navigation.navigate('VideoCall', { phoneNumber, chatRoomUsers, chatRoom, authUserPhoneNumber, from:'notify' })

    }
  }
  return (
    <>
      {/* {callType === 'audio' ? ( */}
        <View style={styles.mainContainer}>
          <StatusBar
            visible={false}
            barStyle={'dark-content'}
          />
          <ImageBackground
            source={IMAGES.backGroundImage}
            resizeMode="cover"
            style={[styles.mainContainer, { padding: 20 }]}
          >
            <View style={styles.mainContainer}>
              <Text style={styles.name}>{phoneNumber}</Text>
              
               <Text style={styles.time}>Incoming Call</Text>
              <Image source={IMAGES.headerImage} style={styles.profileImage} />
            </View>
            <View style={{ flex: 0.4 }}>
              <View style={styles.bottomContainer}>
                <TouchableOpacity
                  style={[
                    styles.iconContainer,
                    { backgroundColor: COLORS.green },
                  ]}
                  onPress={() => AcceptCall()}
                >
                  <FontAwesome name="phone" size={30} color={COLORS.white} />
                </TouchableOpacity>
               
                
                <TouchableOpacity
                style={[styles.iconContainer, styles.endCall]}
                onPress={() => navigation.goBack()}
              >
                <MaterialIcons name="call-end" size={30} color={COLORS.white} />
              </TouchableOpacity>

              </View>
              <View style={styles.bottomContainer}>
               
              <Text style={{marginTop: HP_WP.hp(1)}}>Accept</Text>

              <Text style={[styles.declineCall]}>Decline</Text>

              </View>

              
            </View>
          </ImageBackground>
        </View>
      {/* ) : (
        <Text> video</Text>
      )} */}
    </>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  addUser: {
    alignSelf: 'flex-end',
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
  bottomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },
  iconContainer: {
    height: HP_WP.hp(8),
    width: HP_WP.wp(17),
    borderRadius: 50,
    backgroundColor: COLORS.lowestGreen,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 15,
  },
  endCall: {
    backgroundColor: COLORS.orange,
    alignSelf: 'center',
    marginLeft: HP_WP.hp(15),
  },
  declineCall: {
    // alignSelf: 'center',
    // marginTop: HP_WP.hp(1),
    marginLeft: HP_WP.hp(20),
  },
});

export default CallNotificationScreen;
