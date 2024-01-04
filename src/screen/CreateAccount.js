import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {CountryPicker} from 'react-native-country-codes-picker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import Toast from 'react-native-toast-message';
import Lottie from 'lottie-react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';

import Container from '../component/Container';
import GlobalButton from '../component/GlobalButton';
import {COLORS, FONTS, HP_WP, SIZE} from '../component/theme';
import SimpleHeader from '../component/SimpleHeader';
import {onRegister} from '../service/API';
import {useStore} from '../service/AppData';
import {useMutation} from '@apollo/client';
import {SIGN_UP} from '../api/graphql/authQueries';

const CreateAccount = ({route, navigation}) => {
  const [openCountryPicker, setOpenCountryPicker] = useState(false);
  const [signup, {loading, error, data}] = useMutation(SIGN_UP);
  const isNewUser = route?.params?.isNewUser
  const {setphoneNumber, setcountryCode} = useStore();

  const validationSchema = Yup.object().shape({
    phoneNumber: Yup.string().required().min(5),
    countryCode: Yup.string().required(),
    InviteCode: Yup.string().required(),
  });
  // 300245

  const handleSubmit = async ({phoneNumber, countryCode, InviteCode}) => {
    // navigation.navigate('VideoCall');

    try {
      phoneNumber = countryCode + phoneNumber;
      console.log('Sending...1', {phoneNumber, countryCode, InviteCode});

      const {data} = await signup({
        variables: {
          phoneNumber,
          countryCode,
          referralCode: InviteCode,
        },
      });

      console.log('Sending...2');

      if (data) {
        console.log('OTP sent', data);
        Toast.show({
          position: 'top',
          type: 'success',
          text1: 'OTP sent',
        });
        navigation.navigate('OtpScreen');
      } else if (error) {
        console.log('data', data);
        console.log('error', error);
        Toast.show({
          position: 'top',
          type: 'error',
          text1: error?.message,
        });
        console.error('User creation failed. Data:', error);
      }
    } catch (e) {
      console.error('Error creating user:', e.message);
      console.log(e);
      Toast.show({
        position: 'top',
        type: 'error',
        text1: e?.message,
      });
    }

    await setcountryCode(countryCode);
    await setphoneNumber(phoneNumber);
  };

  const onResponse = res => {
    // setLoading(false);
    Toast.show({
      position: 'top',
      type: 'success',
      text1: res?.message,
    });
    navigation.navigate('OtpScreen');
  };

  const onError = e => {
    // setLoading(false);
    console.log(e);
    Toast.show({
      position: 'top',
      type: 'error',
      text1: e?.data?.message,
    });
  };

  return (
    <Container>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.mainContainer}>
        <Formik
          initialValues={{countryCode: '', phoneNumber: '', InviteCode: ''}}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <>
              <SimpleHeader title={'Get started'} />
              <View style={styles.logoContainer}>
                <Lottie
                  source={require('../assest/image/createAccount.json')}
                  autoPlay
                  loop
                />
              </View>
              <Text style={styles.logoBottomText}>
                Just enter your mobile number and referral code to continue
              </Text>
              <Text style={styles.enterMobileText}>
                Enter your mobile number
              </Text>

              <View style={styles.inputContainer}>
                <View>
                  <TouchableOpacity
                    onPress={() => setOpenCountryPicker(true)}
                    activeOpacity={0.6}
                    style={[
                      styles.countryPickerContainer,
                      {borderColor: errors.countryCode && 'red'},
                    ]}>
                    <Text style={styles.countryCode}>
                      {values.countryCode ? values.countryCode : 'code'}
                    </Text>
                    <AntDesign
                      name="down"
                      size={18}
                      color={COLORS.lightBlack}
                    />
                  </TouchableOpacity>
                </View>

                <View>
                  <TextInput
                    style={[
                      styles.inputStyle,
                      {borderColor: errors.phoneNumber && 'red'},
                    ]}
                    placeholder="Mobile Number"
                    keyboardType="number-pad"
                    onChangeText={handleChange('phoneNumber')}
                    onBlur={handleBlur('phoneNumber')}
                    value={values.phoneNumber}
                    placeholderTextColor={COLORS.gray}
                  />
                </View>
              </View>
              <Text style={styles.enterMobileTextRefferal}>
                Enter Referral Code
              </Text>
              <View>
                <View>
                  <TextInput
                    style={[
                      styles.inputRefferalStyle,
                      {borderColor: errors.InviteCode && 'red'},
                    ]}
                    placeholder="Referral Code"
                    onChangeText={handleChange('InviteCode')}
                    onBlur={handleBlur('InviteCode')}
                    value={values.InviteCode}
                    placeholderTextColor={COLORS.gray}
                  />
                </View>
              </View>
              <GlobalButton
                buttonTitle={'Send'}
                buttonStyle={styles.buttonStyle}
                onPress={handleSubmit}
              />

              <Spinner
                color={COLORS.darkRed}
                visible={loading}
                size="large"
                overlayColor="rgba(0,0,0,0.5)"
              />
              <CountryPicker
                countryCode={values.countryCode}
                style={styles.countryPicker}
                show={openCountryPicker}
                pickerButtonOnPress={countryCode => {
                  handleChange('countryCode')({
                    target: {name: 'countryCode', value: countryCode.dial_code},
                  });
                  setOpenCountryPicker(false);
                }}
                onBackdropPress={() => {
                  setOpenCountryPicker(false);
                }}
              />
            </>
          )}
        </Formik>
      </ScrollView>
    </Container>
  );
};

export default CreateAccount;

const styles = StyleSheet.create({
  mainContainer: {
    paddingHorizontal: 20,
  },
  logoContainer: {
    height: HP_WP.hp(35),
  },
  logoBottomText: {
    fontSize: SIZE.N,
    color: COLORS.darkBlack,
    fontFamily: FONTS.regular,
    textAlign: 'center',
  },
  enterMobileText: {
    fontSize: SIZE.N,
    color: COLORS.lightBlack,
    fontFamily: FONTS.regular,
    marginTop: HP_WP.hp(6),
    marginBottom: HP_WP.hp(2),
  },
  enterMobileTextRefferal: {
    fontSize: SIZE.N,
    color: COLORS.lightBlack,
    fontFamily: FONTS.regular,
    marginBottom: HP_WP.hp(2),
    marginTop: HP_WP.hp(2),
  },
  inputContainer: {
    flexDirection: 'row',
  },
  countryPickerContainer: {
    borderWidth: 1,
    height: HP_WP.hp(6.5),
    width: HP_WP.wp(30),
    borderRadius: 6,
    paddingHorizontal: 15,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryCode: {
    color: COLORS.lightBlack,
    fontSize: SIZE.L,
    fontFamily: FONTS.light,
  },
  inputStyle: {
    marginLeft: HP_WP.hp(1),
    borderWidth: 1,
    height: HP_WP.hp(6.5),
    width: HP_WP.wp(58),
    borderRadius: 6,
    paddingHorizontal: 15,
    fontSize: SIZE.L,
    color: COLORS.black,
    fontFamily: FONTS.light,
  },
  inputRefferalStyle: {
    // marginLeft: HP_WP.hp(1),
    borderWidth: 1,
    height: HP_WP.hp(6.5),
    width: HP_WP.wp(90),
    borderRadius: 6,
    paddingHorizontal: 15,
    fontSize: SIZE.L,
    color: COLORS.black,
    fontFamily: FONTS.light,
  },
  buttonStyle: {
    marginTop: HP_WP.hp(7),
  },
  countryPicker: {
    modal: {
      width: '100%',
      // bottom: 0,
      // position: 'absolute',
      height: '95%',
    },
    countryName: {
      color: '#000',
    },
    textInput: {
      color: '#000',
      paddingHorizontal: 10,
    },
    dialCode: {
      color: '#000',
    },
    searchMessageText: {
      color: '#000',
    },
  },
});
