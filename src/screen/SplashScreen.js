import {StatusBar, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import Video from 'react-native-video';
import { checkAuthentication } from "../service/LocalStore";

const SplashScreen = ({navigation}) => {
  useEffect(() => {
    checkAuthentication(navigation);
  }, []);
  return (
    <View style={{flex: 1}}>
      <StatusBar
        barStyle={'light-content'}
        backgroundColor="hsl(170, 70%, 40%)"
      />
      <Video
        source={require('../assest/image/splash.mp4')}
        style={styles.backgroundVideo}
        resizeMode="cover"
      />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  backgroundVideo: {
    width: '100%',
    height: '100%',
  },
});
