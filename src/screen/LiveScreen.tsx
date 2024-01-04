import React, { useRef, useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {
  ClientRoleType,
  createAgoraRtcEngine,
  IRtcEngine,
  RtcSurfaceView,
  ChannelProfileType,
} from 'react-native-agora';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import { useNavigation, RouteProp, NavigationProp } from '@react-navigation/native';

import { COLORS, SIZE } from '../component/theme';

const appId = 'dda9ea21eb7847f6bd3e17e35dd0e1be';
const uid = 0;

interface Routing {
  route: RouteProp<any, any>,
  navigation: NavigationProp<any, any>
}

const LiveScreen = ({ route, navigation }: Routing) => {
  let hostLive = route?.params?.live;
  let viewrLive = route?.params?.id;
  let channelName = `${route?.params?.hostId}_${route?.params?.hostName}`;
  const surfaceViewRef = useRef(null);
  const agoraEngineRef = useRef<IRtcEngine>();
  const [isJoined, setIsJoined] = useState(false);
  const [isHost, setIsHost] = useState(true);
  const [remoteUid, setRemoteUid] = useState(0);
  const [liveUsers, setliveUsers] = useState(1)
  const [message, setMessage] = useState('');
  const [isMuted, setIsMuted] = useState(false); // Indicates if the local user is muted
  const [isVideoEnabled, setIsVideoEnabled] = useState(true); // Indicates if the local user's video is enabled
  const [isFrontCamera, setIsFrontCamera] = useState(true); // Indicates if the front camera is being used

  useEffect(() => {
    setupVideoSDKEngine();
    setTimeout(() => {
      _isCheck();
    }, 10);
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      e.preventDefault();
    });
    return unsubscribe;
  }, [navigation]);

  const _isCheck = async () => {
    try {
      console.log('channelName', channelName)
      axios.get(`http://13.56.194.200:4000/access_token`, {
        params: {
          channelName,
        },
      }).then((res) => {
        console.log('res', res.data.token)
        const token = res.data.token;
        console.log('token', token);
        if (hostLive) {
          setIsHost(true);
          join(token);
        }
        if (viewrLive) {
          setIsHost(false);
          join(token);
        }
      });

    } catch (error) {
      console.error('Failed to retrieve or use the token:', error);
    }
  };

  const setupVideoSDKEngine = async () => {
    try {
      if (Platform.OS === 'android') {
        await getPermission();
      }
      agoraEngineRef.current = createAgoraRtcEngine();
      const agoraEngine = agoraEngineRef.current;
      agoraEngine.registerEventHandler({
        onJoinChannelSuccess: () => {
          setIsJoined(true);
          console.log("I Joined")
        },
        onUserJoined: (_connection, Uid) => {
          console.log("U Joined")

          setRemoteUid(Uid);
        },
        onUserOffline: (_connection, Uid) => {
          setRemoteUid(0);
        },
      });
      agoraEngine.initialize({
        appId: appId,
        channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
      });
      agoraEngine.enableVideo();
    } catch (e) {
      console.log(e);
    }
  };

  const getPermission = async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        PermissionsAndroid.PERMISSIONS.CAMERA,
      ]);
    }
  };

  const join = async (token: string) => {
    if (isJoined) {
      return;
    }
    try {
      agoraEngineRef.current?.setChannelProfile(
        ChannelProfileType.ChannelProfileLiveBroadcasting,
      );
      if (isHost) {
        agoraEngineRef.current?.startPreview();
        agoraEngineRef.current?.joinChannel(token, channelName, uid, {
          clientRoleType: ClientRoleType.ClientRoleBroadcaster,
        });
      } else {
        agoraEngineRef.current?.joinChannel(token, channelName, uid, {
          clientRoleType: ClientRoleType.ClientRoleAudience,
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  const leave = () => {
    try {
      agoraEngineRef.current?.leaveChannel();
      setRemoteUid(0);
      setIsJoined(false);
      navigation.navigate('AMA_Live');
    } catch (e) {
      console.log(e);
    }
  };

  const Header = () => {
    return (
      <View style={styles.header}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
            alignSelf: 'flex-end',
          }}>
          {viewrLive && (
            <Text
              style={{
                color: COLORS.white,
                alignItems: 'flex-start',
                flex: 1,
                fontSize: SIZE.L,
              }}>
              Women health
            </Text>
          )}
          <View style={styles.liveView}>
            <Text style={{ color: COLORS.white }}>LIVE</Text>
          </View>
          <View style={styles.countView}>
            <Ionicons name="eye-outline" size={18} color={COLORS.white} />
            <Text style={{ color: COLORS.white, marginLeft: 5 }}>{liveUsers}</Text>
          </View>
          <TouchableOpacity style={{ marginLeft: 15 }} onPress={leave}>
            <Entypo name="cross" size={30} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        {hostLive && (
          <View style={{ marginTop: 20, alignItems: 'flex-end' }}>
            <TouchableOpacity onPress={toggleCamera}>
              <MaterialCommunityIcons
                name="camera-outline"
                // camera-off-outline
                size={25}
                color={COLORS.white}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={toggleMicrophone}
              style={{ marginTop: 20 }}>
              <MaterialCommunityIcons
                name="microphone"
                // microphone-off
                size={25}
                color={COLORS.white}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleCamera} style={{ marginTop: 20 }}>
              <Feather
                name="refresh-cw"
                // refresh-ccw
                size={25}
                color={COLORS.white}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const toggleCamera = () => {
    setIsFrontCamera(prev => !prev);
    agoraEngineRef.current?.switchCamera();
  };

  const toggleMicrophone = () => {
    setIsMuted(prev => !prev);
    agoraEngineRef.current?.muteLocalAudioStream(!isMuted);
  };

  return (
    <SafeAreaView style={styles.main}>
      {isJoined && isHost && (
        <React.Fragment key={0}>
          <RtcSurfaceView canvas={{ uid: 0 }} style={styles.videoView} />
          <Header />
        </React.Fragment>
      )}
      {isJoined && !isHost && remoteUid !== 0 && (
        <React.Fragment key={remoteUid}>
          <RtcSurfaceView canvas={{ uid: remoteUid }} style={styles.videoView} />
          <Header />
        </React.Fragment>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  main: { flex: 1, flexGrow: 1 },
  videoView: { width: '100%', height: '100%' },
  header: {
    position: 'absolute',
    top: 20,
    right: 20,
    left: 20,
  },
  liveView: {
    backgroundColor: COLORS.darkRed,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 2,
    marginLeft: 10,
  },
  countView: {
    flexDirection: 'row',
    marginLeft: 10,
    backgroundColor: COLORS.lightBlack,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 2,
    alignItems: 'center',
  },
});

export default LiveScreen;