import {StyleSheet, View} from 'react-native';
import React, { useState, useEffect } from 'react';
import Lottie from 'lottie-react-native';
import Spinner from 'react-native-loading-spinner-overlay/lib';

import GlobalButton from '../component/GlobalButton';
import Container from '../component/Container';
import { COLORS, FONTS, HP_WP, SIZE } from '../component/theme';
import { checkAuthentication } from '../service/LocalStore'
import { Text } from 'react-native-elements';

const WellcomeScreen = ({navigation}) => {
  const [loading, setLoading] = useState(false);

  return (
    <Container>
      <View style={styles.innarContainer}>
        <Lottie
          source={require('../assest/image/chatting.json')}
          autoPlay
          loop
        />
      </View>
      <GlobalButton
        buttonTitle={'Existing User'}
        buttonStyle={styles.buttonStyle}
        onPress={() => navigation.navigate('Login')}
      />
      <Text style={styles.orTextStyle}>
                OR
              </Text>
      <GlobalButton
        buttonTitle={'New User'}
        buttonStyle={styles.buttonStyle}
        onPress={() => navigation.navigate('CreateAccount')}
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

export default WellcomeScreen;

const styles = StyleSheet.create({
  orTextStyle: {
    marginBottom: HP_WP.hp(2),
    // marginTop: HP_WP.hp(2),
    textAlign: 'center'
  },
  buttonStyle: {
    bottom: 10,
  },
  innarContainer: {
    flex: 1,
  },
});
