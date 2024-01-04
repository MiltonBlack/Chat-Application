/* eslint-disable react-native/no-inline-styles */
import { View, SafeAreaView, ViewStyle } from "react-native";
import React from "react";
import Colors from "../constants/Colors";

const SafeAreaWrap = ({
  children,
  style,
  bg = Colors.white,
  height = "100%",
  width = "100%",
  safeAreaBg = Colors.white,
})=> {
  return (
    <SafeAreaView
      style={{
        backgroundColor: safeAreaBg,
        flex: 1,
      }}
    >
      <View
        style={{
          backgroundColor: bg,
          height,
          width,
          ...style,
        }}
      >
        {children}
      </View>
    </SafeAreaView>
  );
};

export default SafeAreaWrap;
