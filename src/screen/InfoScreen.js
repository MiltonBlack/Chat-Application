import {StyleSheet, Text, View, Image, ScrollView} from 'react-native';
import React, { useState } from 'react';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import Toast from 'react-native-toast-message';

import Container from '../component/Container';
import {COLORS, FONTS, HP_WP, IMAGES, SIZE} from '../component/theme';
import GlobalButton from '../component/GlobalButton';

const InfoScreen = ({navigation}) => {
  const [loading, setLoading] = useState(false);

  const data = ["Send & Receive Messages", "Stay in touch with family and friends via voice calls and video calls", "Join Live AMAs from your favorite celebs and experts in various fields.", "Stay connected to cherished moments with Commune Spaces."];
  return (
    <Container>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.mainContainer}>
        <Image source={IMAGES.logo} style={styles.imageStyle} />
        <Text style={styles.topDetails}>
        The Invite-Only Instant messaging app that lets you express yourself, while also maintaining your privacy.
        </Text>

        {data.map((item, index) => {
          return (
            <View style={styles.bottomDetailsContainer}>
              <Image style={styles.dotIcon} source={IMAGES.dotIcon} />
              <Text style={[styles.topDetails, {flex: 1}]}>
               {item}
              </Text>
            </View>
          );
        })}
      </ScrollView>
      <GlobalButton
        buttonTitle={'Start'}
        buttonStyle={styles.buttonStyle}
        onPress={() => navigation.navigate('WellcomeScreen')}
      />
      <Spinner
        color={COLORS.darkRed}
        visible={loading}
        size="large"
        overlayColor="rgba(0,0,0,0.5)"
      />
    </Container>
  );
};

export default InfoScreen;

const styles = StyleSheet.create({
  mainContainer: {
    paddingHorizontal: 20,
  },
  imageStyle: {
    width: HP_WP.wp(50),
    height: HP_WP.hp(26),
    resizeMode: 'contain',
    alignSelf: 'center',
    marginVertical: HP_WP.hp(5),
  },
  topDetails: {
    fontSize: SIZE.L,
    color: COLORS.darkBlack,
    fontFamily:FONTS.regular
  },
  bottomDetailsContainer: {
    marginTop: HP_WP.hp(2.5),
    flexDirection: 'row',
  },
  dotIcon: {
    resizeMode: 'contain',
    height: HP_WP.hp(4),
    width: HP_WP.wp(8),
  },
  buttonStyle: {
    bottom: 20,
  },
});
