import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {COLORS, FONTS, HP_WP, SIZE} from './theme';

const SimpleHeader = ({
  headerStyle,
  leftIcon,
  onPressLeft,
  title,
  rightIcon,
  onPresright,
  rightImage,
}) => {
  return (
    <View style={[styles.mainContainer, headerStyle]}>
      <View style={{flex: 0.2}}>
        {leftIcon && (
          <TouchableOpacity onPress={onPressLeft}>
            <Ionicons name="arrow-back" size={23} color={COLORS.black} />
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.titles}>{title}</Text>
      <View style={{flex: 0.2}}>
        {rightIcon && (
          <TouchableOpacity
            onPress={onPresright}
            style={{alignSelf: 'flex-end'}}>
            <Image source={rightImage} style={rightIconStyle} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default SimpleHeader;

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: HP_WP.hp(2.5),
    justifyContent: 'space-between',
  },
  titles: {
    fontSize: SIZE.XXXL,
    textAlign: 'center',
    color: COLORS.darkBlack,
    fontFamily:FONTS.mediam,
    flex: 1,
  },
});
