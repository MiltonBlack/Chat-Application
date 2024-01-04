import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {COLORS, FONTS, HP_WP, SIZE} from './theme';

const GlobalButton = ({
  buttonTitle,
  onPress,
  buttonStyle,
  buttonTextStyle,
  disabled,
}) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.Container, buttonStyle]}>
      <Text style={[styles.titel, buttonTextStyle]}>{buttonTitle}</Text>
    </TouchableOpacity>
  );
};

export default GlobalButton;

const styles = StyleSheet.create({
  Container: {
    backgroundColor:COLORS.darkRed,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    height: HP_WP.hp(6.5),
    width: HP_WP.wp(90),
    alignSelf:'center'
  },
  titel: {
    color:COLORS.white,
    fontSize: SIZE.XL,
    fontFamily:FONTS.semiBold,
    lineHeight:24
  },
});
