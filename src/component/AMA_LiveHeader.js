import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { COLORS, FONTS, HP_WP, SIZE } from '../component/theme';

const AMA_LiveHeader = ({ onPressAmaLive, onPressGoLive, onPressCategory }) => {
  return (
    <View style={styles.mainContainer}>
      <TouchableOpacity
        style={styles.directionContainer}
        onPress={onPressAmaLive}>
        <MaterialCommunityIcons
          name="youtube-tv"
          size={30}
          color={COLORS.darkRed}
        />
        <Text style={styles.amaText}>AMA live</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.goLiveContainer} onPress={onPressGoLive}>
        <Feather name="radio" size={18} color={COLORS.white} />
        <Text style={styles.goLiveText}>Go live</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.directionContainer}
        onPress={onPressCategory}>
        <Text style={styles.categoryText}>Category</Text>
        <AntDesign name="down" size={17} color={COLORS.darkBlack} />
      </TouchableOpacity>
    </View>
  );
};

export default AMA_LiveHeader;

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: HP_WP.hp(3),
  },
  directionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amaText: {
    color: COLORS.darkRed,
    fontSize: SIZE.L,
    fontFamily: FONTS.regular,
    marginLeft: 5,
    lineHeight: 20,
  },
  goLiveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 25,
    backgroundColor: COLORS.darkRed,
    borderRadius: 4,
    paddingHorizontal: 10,
  },
  goLiveText: {
    color: COLORS.white,
    fontSize: SIZE.M,
    fontFamily: FONTS.regular,
    marginLeft: 5,
  },
  categoryText: {
    color: COLORS.darkBlack,
    fontSize: SIZE.L,
    fontFamily: FONTS.regular,
    marginRight: 5,
    lineHeight: 20,
  },
});
