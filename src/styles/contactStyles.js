import { StyleSheet } from "react-native";
import { COLORS, FONTS, SIZE, HP_WP } from "../component/theme";

export default styles = StyleSheet.create({
    modalcontainer: {
      width: HP_WP.wp(80),
      paddingVertical: 10,
      backgroundColor: COLORS.white,
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      borderRadius: 20,
    },
    modalheading: {
      fontSize: SIZE.XXL,
      color: COLORS.orange,
      fontFamily: FONTS.medium,
    },
    modaltxt: {
      fontSize: SIZE.L,
      color: COLORS.darkRed,
      fontFamily: FONTS.regular,
      marginTop: 8,
      textAlign: 'center',
    },
    mainContainer: {
      flex: 1,
      marginHorizontal: 20,
    },
    searchMainContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: HP_WP.hp(4),
      alignItems: 'center',
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      width: HP_WP.wp(70),
      borderRadius: 8,
      backgroundColor: COLORS.lightWhite,
      elevation: 1,
      height: HP_WP.hp(6),
      paddingHorizontal: 10,
    },
    input: {
      marginLeft: 10,
      flex: 1,
      fontSize: SIZE.N,
      color: COLORS.gray,
      fontFamily: FONTS.light,
    },
    shareContainer: {
      backgroundColor: COLORS.lightWhite,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 8,
      elevation: 1,
      height: HP_WP.hp(6),
      width: HP_WP.wp(17),
    },
    fromContactsText: {
      fontSize: SIZE.XL,
      color: COLORS.darkBlack,
      fontFamily: FONTS.regular,
    },
    DeselectText: {
      fontSize: SIZE.M,
      color: COLORS.lightBlack,
      fontFamily: FONTS.light,
    },
    profileMainContainer: {
      flex: 1,
      marginHorizontal: 15,
    },
    profileImage: {
      height: HP_WP.hp(5.7),
      width: HP_WP.wp(12),
      resizeMode: 'contain',
      borderRadius: 50,
    },
    name: {
      fontSize: SIZE.L,
      color: COLORS.darkBlack,
      fontFamily: FONTS.regular,
    },
    number: {
      fontSize: SIZE.N,
      color: COLORS.lightBlack,
      fontFamily: FONTS.light,
    },
    buttonStyle1: {
      bottom: 10,
    },
    buttonStyle2: {
      top: 10,
    },
    checkbox: {
      height: 18,
      width: 18,
      borderRadius: 2,
      borderColor: COLORS.darkGray,
      justifyContent: 'center',
      alignItems: 'center',
    },
    checkedStyle: {
      height: 12,
      width: 12,
      resizeMode: 'contain',
      tintColor: COLORS.white,
    },
  });