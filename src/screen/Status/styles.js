import { StyleSheet, Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");

/**
|--------------------------------------------------
| One N Only CSS... oops, js style file 😃 Add your own desired styles
|--------------------------------------------------
*/

export default StyleSheet.create({
  containerWithPadding: {
    padding: 10
  },
  container: {
    padding: 10,
    paddingHorizontal: 20,
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row"
  },
  backContainer: {},
  center: {
    flexGrow: 1
  },
  avatarImage: {
    width: width * 0.12,
    height: width * 0.12,
    maxWidth: 50,
    maxHeight: 50
  },
  avatarTitle: {
    fontSize: width * 0.045,
    color: "#fff"
  },
  avatarTime: {
    fontSize: width * 0.035,
    color: "#fff"
  },
  moreOption: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  }
});
