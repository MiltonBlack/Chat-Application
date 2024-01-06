import {StyleSheet, Text, View, ScrollView} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import { useMutation } from '@apollo/client';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import Toast from 'react-native-toast-message';
import Lottie from 'lottie-react-native';
import CodeInput from 'react-native-confirmation-code-input';

import Container from '../component/Container';
import {COLORS, FONTS, HP_WP, SIZE} from '../component/theme';
// import OTPInputView from '@twotalltotems/react-native-otp-input';
import GlobalButton from '../component/GlobalButton';
import SimpleHeader from '../component/SimpleHeader';
import useAppData, {useStore} from '../service/AppData';
import { setUserID, setAuthToken, setAuthUserPhoneNumber, setAuthInviteRequestCode } from '../service/LocalStore';
import { VERIFY_OTP, SIGN_UP } from '../api/graphql/authQueries'; 

const OtpScreen = ({navigation}) => {
  
  const [minutes, setMinutes] = useState(1);
  const [seconds, setSeconds] = useState(59);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [clearOTP, setClearOTP] = useState(false);
  const OTPRef = useRef(null);
  const [verifyOtp, { loading, error, data }] = useMutation(VERIFY_OTP);
  const [signup] = useMutation(SIGN_UP);

  const { setinviteRequestCode } = useStore();
  const [{ phoneNumber, countryCode }] = useAppData();

  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }

      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(interval);
        } else {
          setSeconds(59);
          setMinutes(minutes - 1);
        }
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  });

const resendOTP = async () => {
    // setOtp('');
    // setClearOTP(true);

    setMinutes(1);
    setSeconds(60);

    try {
      console.log('Sending...1', { phoneNumber, countryCode});

      const { data } = await signup({
        variables: { 
          phoneNumber,
          countryCode,
         },
      });
  
      if (data) {
        console.log('OTP sent', data);
        Toast.show({
          position: 'top',
          type: 'success',
          text1: 'OTP sent',
        });
      } else if(error) {
        console.log("data", data);
        console.error('User creation failed. Data:', error);
      }
    } catch (e) {
      console.error('Error sending OTP:', e.message);
      console.log(e);
    }

  };

  const OtpVerify = async () => {
    if (otp.length < 6) {
      setOtpError(6);
    } else {
      try {
      console.log('Sending...1', { phoneNumber, otp});

        const { data } = await verifyOtp({
          variables: { 
            phoneNumber,
            otp
           },
        });

        if (data) {
          console.log('OTP valid', data);
          onResponse(data);
        } else if (error) {
          console.log(error);
          onError(error);
        }
      } catch (error) {
        onError(error);
      }
    }
  };

  const onResponse = async res => {
    console.log('Response:', res);
    console.log('TOKEN:', res.verifyOTP?.token);

    Toast.show({
      position: 'top',
      type: 'success',
      text1: res?.verifyOTP?.message,
    });
    await setAuthToken(res.verifyOTP?.token);
    await setinviteRequestCode(res.verifyOTP?.user.inviteRequestCode)
    await setAuthInviteRequestCode(res.verifyOTP?.user.inviteRequestCode)
    await setUserID(res.verifyOTP?.user._id.toString())
    await setAuthUserPhoneNumber(phoneNumber)
    if(res.verifyOTP?.userChatRooms >= 1){
      navigation.navigate('NavStack');
    } else {
      navigation.navigate('WellcomeScreen');
    }
  };

  const onError = e => {
    console.warn(e);
    Toast.show({
      position: 'top',
      type: 'error',
      text1: e.message,
    });
  };

  return (
    <Container>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.mainContainer}>
        <SimpleHeader
          title={'OTP Verification'}
          leftIcon
          onPressLeft={() => navigation.goBack()}
        />
        <View style={styles.logoContainer}>
          <Lottie source={require('../assest/image/otp.json')} autoPlay loop />
        </View>
        <Text style={styles.sentSmsText}>
          We just sent you an SMS with 6-digit code. Looks like very soon you
          will be logged in!
        </Text>
        <Text style={styles.enterCode}>Enter the code into field below</Text>
        {/* <OTPInputView
          style={styles.OtpContainer}
          keyboardType={'phone-pad'}
          ref={OTPRef}
          clearInputs={clearOTP}
          onCodeChanged={code => {
            setOtp(code);
            setClearOTP(false);
          }}
          autoFocusOnLoad={false}
          codeInputFieldStyle={[
            styles.otpInput,
            {borderColor: otpError ? 'red' : COLORS.gray},
          ]}
          pinCount={6}
          onCodeFilled={code => {
            setOtp(code);
            setClearOTP(false);
            setOtpError('');
          }}
        /> */}

        <CodeInput
        className="border-b"
        space={8}
        codeLength={6}
        size={40}
        inputPosition="center"
        onFulfill={code => {
        setOtp(code);
        setClearOTP(false);
        setOtpError('');
        }}
        keyboardType='numeric'
        activeColor="blue"
        inactiveColor="gray"
        autoFocus={true}
        />

        {seconds > 0 || minutes > 0 ? (
          <Text style={[styles.ResendOTP, {color: COLORS.normalBlack}]}>
            Resend code in{' '}
            <Text style={styles.ResendOTP}>
              {minutes < 10 ? `0${minutes}` : minutes}:
              {seconds < 10 ? `0${seconds}` : seconds}
            </Text>
          </Text>
        ) : (
          <Text onPress={resendOTP} style={styles.ResendOTP}>
            Resend
          </Text>
        )}
      </ScrollView>
      <GlobalButton
        onPress={OtpVerify}
        buttonStyle={styles.buttonStyle}
        buttonTitle={'Verify'}
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

export default OtpScreen;

const styles = StyleSheet.create({
  mainContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  logoContainer: {
    height: HP_WP.hp(30),
  },
  sentSmsText: {
    fontSize: SIZE.N,
    color: COLORS.darkBlack,
    fontFamily: FONTS.regular,
    textAlign: 'center',
  },
  enterCode: {
    fontSize: SIZE.N,
    color: COLORS.lightBlack,
    marginTop: HP_WP.hp(3.5),
    fontFamily: FONTS.regular,
  },
  OtpContainer: {
    marginTop: HP_WP.hp(1),
    height: HP_WP.hp(6.5),
    width: HP_WP.wp(90),
    alignSelf: 'center',
  },
  otpInput: {
    width: HP_WP.wp(12),
    height: HP_WP.hp(6),
    borderWidth: 1,
    borderRadius: 8,
    color: COLORS.darkBlack,
  },
  buttonStyle: {
    bottom: 20,
  },
  ResendOTP: {
    fontSize: SIZE.N,
    color: COLORS.darkRed,
    fontFamily: FONTS.light,
    textAlign: 'center',
    marginTop: HP_WP.hp(2),
  },
});
