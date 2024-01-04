import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {COLORS, FONTS, HP_WP, IMAGES, SIZE} from '../component/theme';
import {Image} from 'react-native';

const ChatModal = ({phoneNumber, isTyping, isOnline, onPressLeft, onPressPhone, onPressVideo, onPressDots}) => {
  return (
    <View>
      <View style={styles.ContainerBox}>
        <TouchableOpacity onPress={onPressLeft}>
          <AntDesign name="left" size={15} color={COLORS.darkBlack} />
        </TouchableOpacity>
        {/* <Image source={IMAGES.profile} style={styles.image} /> */}
        <View>
          <Image source={IMAGES.profile} style={styles.image} />
          <Image source={isOnline ? IMAGES.active : IMAGES.inactive} style={styles.activeImg} />
        </View>
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{phoneNumber}</Text>
          { !isTyping && isOnline ? <Text style={styles.lastSeen}>Online</Text> : null}
          {isOnline && isTyping && <Text style={styles.lastSeen}>Typing...</Text>}
        </View>
        <TouchableOpacity onPress={onPressPhone}>
          <FontAwesome name="phone" size={20} color={COLORS.darkBlack} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onPressVideo} style={styles.video}>
          <FontAwesome name="video-camera" size={20} color={COLORS.darkBlack} />
        </TouchableOpacity>
        {/* <TouchableOpacity onPress={onPressDots}>
          <MaterialCommunityIcons
            name="dots-vertical"
            size={23}
            color={COLORS.white}
          />
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

export default ChatModal;

const styles = StyleSheet.create({
  ContainerBox: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    alignSelf: 'center',
    marginTop: HP_WP.hp(2),
    flexDirection: 'row',
    alignItems: 'center',
    width: HP_WP.wp(90),
    elevation: 15,
    backgroundColor: COLORS.secondWhite,
    borderRadius: 4,
  },
  image: {
    width: HP_WP.wp(10),
    height: HP_WP.hp(5),
    borderRadius: 50,
    resizeMode: 'contain',
    marginHorizontal: 7,
  },
  activeImg: {
    position: 'absolute',
    borderRadius: 50,
    width: HP_WP.wp(3),
    height: HP_WP.hp(1.5),
    resizeMode: 'contain',
    right:8,
    bottom: -2
  },
  nameContainer: {
    flex: 1,
    marginRight: 7,
  },
  name: {
    fontSize: SIZE.N,
    color: COLORS.darkBlack,
    fontFamily:FONTS.mediam,
    lineHeight:20
  },
  lastSeen: {
    fontSize: SIZE.S,
    color: COLORS.darkGray,
    fontFamily:FONTS.regular,
    lineHeight:14
  },
  video: {
    marginRight: 4,
    marginLeft: 10,
  },
});
