import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {RFPercentage} from 'react-native-responsive-fontsize';

export const HP_WP = {wp, hp};

export const IMAGES = { 
  logo: require('../assest/images/logo.png'),
  dotIcon: require('../assest/icon/dot.png'),
  profile: require('../assest/icon/profile.png'),
  profile1: require('../assest/icon/profile.png'),
  active: require('../assest/images/active.png'),
  inactive: require('../assest/images/inactive.png'),
  headerImage: require('../assest/images/headerImg.png'),
  plusbtn: require('../assest/images/plusbtn.png'),
  hand: require('../assest/images/hand.png'),
  // butterfly: require('../assest/images/butterfly.png'),
  // liveImg: require('../assest/icon/liveImg.png'),
  backGroundImage: require('../assest/images/voiceCall.png'),
  videoCall: require('../assest/images/videoCall.png'),
  imageIcon: require('../assest/images/imageIcon.png'),
  pattern_bg_2: require('../assest/images/imageIcon.png'),
  pattern_bg: require("../assest/images/blip.png"),

};

export const FONTS = {
  blackBold: 'Poppins-Black',
  bold: 'Poppins-Bold',
  extraBold: 'Poppins-ExtraBold',
  extraLight: 'Poppins-ExtraLight',
  light: 'Poppins-Light',
  medium: 'Poppins-Medium',
  regular: 'Poppins-Regular',
  thin: 'Poppins-Thin',
  semiBold: 'Poppins-SemiBold',
};

export const SIZE = {
  VS: RFPercentage(1), //8
  S: RFPercentage(1.3), //10
  M: RFPercentage(1.6), //12
  N: RFPercentage(1.8), //14
  NL: RFPercentage(2), //15
  L: RFPercentage(2.1), //16
  XL: RFPercentage(2.3), //18
  XXL: RFPercentage(2.6), //20
  XXXL: RFPercentage(2.8), //22
  XT: RFPercentage(3), //24
};

export const COLORS = {
  orange: '#E54F39',
  backGround: '#FFFDFE',
  darkWhite: '#F9F9F9',
  secondWhite: '#FFFAFD',
  lightWhite: '#FBF6FF',
  white: '#fff',
  normalBlack: '#484649',
  black: '#000',
  lightBlack: '#594F55',
  darkBlack: '#2B2629',
  darkRed: '#A0015D',
  gray: '#ABA6A9',
  lightGray: '#D2D2D2',
  darkGray: '#69676A',
  lightGreen: '#2DE03E',
  green: '#25B888',
  lowestGreen: '#E1F5EE',
};
