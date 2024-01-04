import React, { useRef, useState, useEffect } from 'react';
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
import {
  ClientRoleType,
  createAgoraRtcEngine,
  IRtcEngine,
  ChannelProfileType,
} from 'react-native-agora';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { request, requestMultiple, PERMISSIONS } from 'react-native-permissions';
import axios from 'axios';
import Sound from 'react-native-sound';

import { COLORS, FONTS, HP_WP, IMAGES, SIZE } from '../../component/theme';

const appId = 'dda9ea21eb7847f6bd3e17e35dd0e1be';
const uid = 0;

const VoiceCallScreen = ({ route, navigation }) => {
  const agoraEngineRef = useRef(IRtcEngine);

  let phoneNumber = route?.params?.phoneNumber;
  let chatRoom = route?.params?.chatRoom;
  let chatRoomUsers = route?.params?.chatRoomUsers;
  let authUserPhoneNumber = route?.params?.authUserPhoneNumber;
  let from = route?.params?.from;
  const channelName = `${route?.params?.chatRoomUsers[0]}_${route?.params?.chatRoomUsers[1]}`;
  
  console.log('channelName', channelName)
  const loopingSoundRef = useRef(null);
  const [isJoined, setIsJoined] = useState(false);
  const [isUser2Joined, setIsUser2Joined] = useState(false);
  const [remoteUid, setRemoteUid] = useState(0);
  const [isMuted, setMuted] = useState(false);
  const [isLoud, setLoud] = useState(false);
  const [callType, setCallType] = useState('audio');
  const [callDuration, setCallDuration] = useState(0);
  // Indicates if the local user's video is enabled

  useEffect(() => {
    setupVoiceSDKEngine();
    console.log('setting up the Voice SDK...')
  });

  useEffect(() => {
    console.log('...calling')

    if (isUser2Joined == false) {
      const ringingSound = new Sound('calling_tone.mp3', Sound.MAIN_BUNDLE, (error) => {
        if (error) {
          console.log('Failed to load the sound', error);
          return;
        }
        console.log('...calling2');
        // ringingSound.setCategory('Playback', true);
        ringingSound.setNumberOfLoops(-1);
        ringingSound.setSpeakerphoneOn(false)
        if (isLoud) {
          ringingSound.setSpeakerphoneOn(true);
        }
        loopingSoundRef.current = ringingSound;
        // Loaded successfully, start playing
        ringingSound.play((success) => {
          if (!success) {
            console.log('Sound did not play')
          }
        })
      });
    } else if (isUser2Joined == true) {
      if (ringingSound.isPlaying()) {
        ringingSound.stop();
      }
      ringingSound.release();
    }

    // Initialize the ringing sound


    // Cleanup the sound when the component unmounts
    return () => {
      if (loopingSoundRef.current && loopingSoundRef.current.isPlaying()) {
        loopingSoundRef.current.stop();
        loopingSoundRef.current.release();
      }
      if (ringingSound.isPlaying()) {
        ringingSound.stop();
      }
      ringingSound.release(); // Release resources
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (isUser2Joined) {
        setCallDuration((prevDuration) => prevDuration + 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isUser2Joined]);

  const toggleLoudspeaker = async () => {
    try {
      await agoraEngineRef.current?.setEnableSpeakerphone(!isLoud);
      setLoud(!isLoud);
    } catch (error) {
      console.warn('--->>>', error);
    }
  };

  const mute = () => {
    setMuted((prev) => !prev);
    agoraEngineRef.current?.muteLocalAudioStream(!isMuted);
  };

  const setupVoiceSDKEngine = async () => {
    await getPermission();
    agoraEngineRef.current = createAgoraRtcEngine();
    const agoraEngine = agoraEngineRef.current;
    await agoraEngine.registerEventHandler({
      onJoinChannelSuccess: () => {
        console.log('joined channel successfully')
        setIsJoined(true);
      },
      onUserJoined: (_connection, Uid) => {
        setRemoteUid(Uid);
        setIsUser2Joined(true)
      },
      onUserOffline: (_connection, Uid) => {
        setRemoteUid(0);
        console.log('left channel...');
        // leave();
      },
    });
    await agoraEngine.initialize({
      appId: appId,
    });
    await join();
    if (callType === 'video') {
      await agoraEngine.enableVideo();
    }
  };

  const getPermission = async () => {
    if (Platform.OS === 'ios') {
      const statusMICROPHONE = await request(PERMISSIONS.IOS.MICROPHONE);
      console.warn('MICROPHONE Permission Status:', statusMICROPHONE);
      const status = await requestMultiple([PERMISSIONS.IOS.MICROPHONE]);
      const allPermissionsGranted = Object.values(status).every(
        (status) => status === 'granted'
      );
      console.warn(allPermissionsGranted);
      return allPermissionsGranted;
    } else if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ]);
    }
  };

  const join = async () => {
    if (isJoined) {
      console.warn('isJoined', isJoined);
      console.log('isJoined channel...', isJoined);
      return;
    }
    axios.get(`http://13.56.194.200:4000/access_token`, {
      params: {
        channelName,
      },
    }).then(async (res) => {

      try {
        const token = res.data.token
        console.log('token updated...', token)
        await agoraEngineRef.current?.setChannelProfile(
          ChannelProfileType.ChannelProfileCommunication
        );

        if (callType === 'video') {
          await agoraEngineRef.current?.startPreview();
          await agoraEngineRef.current?.setClientRole(
            ClientRoleType.ClientRoleBroadcaster
          );
        } else {
          await agoraEngineRef.current?.setClientRole(
            ClientRoleType.ClientRoleAudience
          );
        }

        await agoraEngineRef.current?.joinChannel(token, channelName, uid, {
          clientRoleType: ClientRoleType.ClientRoleBroadcaster,
        });
        console.log('joining finished');
      } catch (e) {
        console.log(e);
      }
    });
  };

  const switchCallType = () => {
    // setCallType((prevType) => (prevType === 'audio' ? 'video' : 'audio'));
    // navigation.navigate('VideoCall');
  };

  const leave = () => {
    agoraEngineRef.current?.leaveChannel();
    setRemoteUid(0);
    setIsJoined(false);
    if (from == 'notify') {
      navigation.navigate('NavStack');
    } else {
      navigation.navigate('ChatScreen', { phoneNumber, chatRoom, users: chatRoomUsers, authUserPhoneNumber });
    }
  };

  return (
    <>
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
              <TouchableOpacity style={styles.addUser}>
                <FontAwesome5
                  name="user-plus"
                  size={18}
                  color={COLORS.lightBlack}
                />
              </TouchableOpacity>
              <Text style={styles.name}>{phoneNumber}</Text>
              {isUser2Joined && <Text style={styles.time}>{`${Math.floor(
                callDuration / 60
              )}:${(callDuration % 60).toString().padStart(2, '0')}`}</Text>}
              {!isUser2Joined && <Text style={styles.time}>Calling...</Text>}
              <Image source={IMAGES.headerImage} style={styles.profileImage} />
            </View>
            <View style={{ flex: 0.4 }}>
              <View style={styles.bottomContainer}>
                <TouchableOpacity
                  onPress={toggleLoudspeaker}
                  style={[
                    styles.iconContainer,
                    { backgroundColor: isLoud ? COLORS.green : COLORS.white },
                  ]}
                >
                  <Ionicons
                    name={isLoud ? 'volume-medium' : 'volume-mute-outline'}
                    size={30}
                    color={isLoud ? COLORS.white : COLORS.black}
                  />
                </TouchableOpacity>
                {/* <TouchableOpacity
                  onPress={switchCallType}
                  style={styles.iconContainer}
                >
                  <Ionicons
                    name="videocam"
                    size={30}
                    color={COLORS.lightBlack}
                  />
                </TouchableOpacity> */}
                <TouchableOpacity
                  onPress={mute}
                  style={[
                    styles.iconContainer,
                    { backgroundColor: isMuted ? COLORS.lowestGreen : 'white' },
                  ]}
                >
                  <Ionicons
                    name={'mic-off-outline'}
                    size={30}
                    color={COLORS.lightBlack}
                  />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={leave}
                style={[styles.iconContainer, styles.endCall]}
              >
                <MaterialIcons name="call-end" size={30} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>
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
    marginTop: HP_WP.hp(5),
  },
});

export default VoiceCallScreen;