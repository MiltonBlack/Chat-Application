import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Modal from 'react-native-modal';

import { COLORS, FONTS, HP_WP, SIZE } from './theme';

const ConectionModal = ({isVisible}) => {

  return (
    <Modal
      style={{margin: 0}}
      backdropColor="rgba(0,0,0,0.8)"
      backdropOpacity={1}
      animationIn="zoomInDown"
      animationOut="zoomOutUp"
      animationInTiming={1500}
      animationOutTiming={1500}
      backdropTransitionInTiming={600}
      backdropTransitionOutTiming={600}
      isVisible={isVisible}>
      <View style={styles.container}>
        <Text style={styles.heading}>Contacts Permission</Text>
        <Text style={styles.txt}>Please grant Commune App access to your contacts to get the best experience</Text>
      </View>
    </Modal>
  );
};

export default ConectionModal;

const styles = StyleSheet.create({
  container: {
    width:HP_WP.wp(80),
    paddingVertical: 10,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 20,
  },
  heading: {
    fontSize: SIZE.XXL,
    color: COLORS.orange,
    fontFamily: FONTS.mediam,
  },
  txt: {
    fontSize: SIZE.L,
    color: COLORS.darkRed,
    fontFamily: FONTS.regular,
    marginTop: 8,
    textAlign: 'center',
  },
});
