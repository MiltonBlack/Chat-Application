// import React, { useState, useEffect } from "react";
// import { ScrollView, View, TouchableOpacity, Image } from "react-native";
// import styles from "./styles";
// // import { connect } from "react-redux";
// import { withNavigation } from "react-navigation";
// import { signoutAction } from "../../store/actions/auth.action";
// import MyAvatarWithStory from "./MyAvatarWithStory/MyAvatarWithStory";
// import HrWithText from "./HrWithText";
// import AvatarWithStory from "./AvatarWithStory/AvatarWithStory";
// import { dateIsWithIin24Hours, dateFormatter } from "./Helper";

// function StoriesPage(props) {
//   const [user, setUser] = useState({});
//   const [allUsers, setAllUsers] = useState([]);
//   const [filterUsers, setFilterUsers] = useState([]);

//   useEffect(() => {
//     const { userId } = props;

//     // Fetch user and allUsers data from your API or database

//     // You can use Cloudinary to store and retrieve user avatars
//     // Example for Cloudinary URL: `cloudinary://cloud_name/image/public_id`
//     // Replace 'cloud_name', 'image', and 'public_id' with your Cloudinary credentials

//     // Set user and allUsers state
//     setUser(userData);
//     // setAllUsers(allUsersData);

//     // Filter users with Cloudinary avatars
//     // const filteredUsers = allUsersData.filter(user =>
//     //   dateIsWithIin24Hours(user.updatedAt)
//     // );

//     // setFilterUsers(filteredUsers);
//   }, []);

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <View style={styles.containerWithPadding}>
//         {Object.entries(user).length !== 0 && (
//           <MyAvatarWithStory
//             hasStories={dateIsWithIin24Hours(user.updatedAt)}
//             user={{ ...user, time: dateFormatter(user.updatedAt) }}
//             allUsers={allUsers}
//           />
//         )}
//       </View>
//       <HrWithText text={`Other Users (${filterUsers.length})`} />
//       <View style={styles.containerWithPadding}>
//         {filterUsers &&
//           filterUsers.map(user => (
//             <TouchableOpacity
//               key={user._id}
//               onPress={() =>
//                 props.navigation.navigate("StoryScreen", {
//                   uid: user._id,
//                   user
//                 })
//               }
//             >
//               <AvatarWithStory
//                 user={{ ...user, time: dateFormatter(user.updatedAt) }}
//               />
//               {/* Display user avatar using Cloudinary URL */}
//               <Image
//                 source={{ uri: `cloudinary://cloud_name/image/public_id` }}
//                 style={{ width: 50, height: 50 }}
//               />
//             </TouchableOpacity>
//           ))}
//       </View>
//     </ScrollView>
//   );
// }

// const mapStateToProps = (state, ownProps) => {
//   console.log("TCL: mapStateToProps -> state", state);
//   return {
//     userId: state.authReducer.userId
//   };
// };

// const mapDispatchToProps = dispatch => {
//   return {
//     signout: () => dispatch(signoutAction({ userStatus: false }))
//   };
// };

// // export const Stories = connect(
// //   mapStateToProps,
// //   mapDispatchToProps
// // )(withNavigation(StoriesPage));
