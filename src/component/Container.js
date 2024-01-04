import {
  StyleSheet,
  Platform,
  SafeAreaView,
  KeyboardAvoidingView,
  StatusBar,
  Pressable,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import React from 'react';
import {COLORS} from './theme';

const Container = ({mainContainer, isLight, translucent, children}) => {
  return (
    <SafeAreaView style={[styles.container, mainContainer]}>
      <StatusBar
        animated={true}
        backgroundColor={COLORS.backGround}
        barStyle={isLight ? 'light-content' : 'dark-content'}
        translucent={translucent}
      />
      {/* <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'height' : 'padding'}> */}
        <Pressable style={{flex: 1}} onPress={() => Keyboard.dismiss()}>
          {children}
        </Pressable>
      {/* </KeyboardAvoidingView> */}
    </SafeAreaView>
  );
};

export default Container;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.darkWhite,
  },
});
