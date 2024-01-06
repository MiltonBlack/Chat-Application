import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import ZegoUIKitPrebuiltLiveStreaming, { HOST_DEFAULT_CONFIG } from '@zegocloud/zego-uikit-prebuilt-live-streaming-rn'
import { COLORS, SIZE } from '../component/theme';

const appID = '1394133535';
const appSign = '9cb1cffa6a1a2288e375ebf47ca318fe34fafec187d72b0018897f72e8a56e71';

const LiveScreen = ({ route, navigation }) => {
  let liveID = route?.params?.live;
  let viewrLive = route?.params?.id;

  const Header = (props) => {
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
        </View>
      </View>
    );
  };

  const userName = 'zego' + Math.floor(Math.random() * 200);
  const userID = channel;
  const channel = `${route?.params?.chatRoomUsers[0]}${route?.params?.chatRoomUsers[1]}`;
  return (
    <SafeAreaView style={styles.main}>
      <ZegoUIKitPrebuiltLiveStreaming
        appID={appID}
        appSign={appSign}
        userID={userID}
        userName={userName}
        liveID={liveID}
        config={{
          ...HOST_DEFAULT_CONFIG,
          onLeaveLiveStreaming: () => {
            navigation.navigate('AllChateScreen');
          }
        }}
      />
      <Header />
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
});

export default LiveScreen;
