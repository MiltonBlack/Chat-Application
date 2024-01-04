import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {COLORS, FONTS, HP_WP, IMAGES, SIZE} from './theme';

const MainHeader = ({onPressSearch,camera, onPressCamera, onPressDots,style}) => {
  return (
    <View style={[styles.mainContainer,style]}>
      <View style={styles.directionContainer}>
        <Image source={IMAGES.headerImage} style={styles.image} />
        <Text style={styles.headerText}>commune</Text>
      </View>
      <View style={styles.directionContainer}>
        {camera && (
          <TouchableOpacity onPress={onPressCamera}>
            <SimpleLineIcons name="camera" size={23} color={COLORS.darkBlack} />
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={onPressSearch}>
          <AntDesign
            name="search1"
            size={20}
            color={COLORS.darkBlack}
            style={styles.searchIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={onPressDots}>
          <MaterialCommunityIcons
            name="dots-vertical"
            size={23}
            color={COLORS.darkBlack}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MainHeader;

const styles = StyleSheet.create({
  mainContainer: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom:10
  },
  directionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: HP_WP.wp(7),
    height: HP_WP.hp(3.5),
    resizeMode: 'contain',
    top: 3,
  },
  headerText: {
    color: COLORS.darkBlack,
    fontSize: SIZE.XXL,
    marginLeft: 10,
    fontFamily:FONTS.mediam,
    lineHeight:22
  },
  searchIcon: {
    marginRight: 15,
    marginLeft: 20,
  },
});
