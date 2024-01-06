import React from 'react';
import { View, Text, Image, Button, Platform } from 'react-native';
import { COLORS, HP_WP, IMAGES } from '../component/theme';
import styles from '../styles/contactStyles';

const Contacted = ({ item, addNewChatRoom }) => {
    return (
        <>
            {Platform.OS === 'ios' && (
                <View
                    style={[
                        styles.searchMainContainer,
                        { marginTop: HP_WP.hp(3) },
                    ]}>
                    <Image
                        source={
                            item.hasThumbnail
                                ? { uri: item.thumbnailPath }
                                : IMAGES.profile
                        }
                        style={styles.profileImage}
                    />
                    <View style={styles.profileMainContainer}>
                        <Text style={styles.name}>{`${item.givenName}`}</Text>
                        <Text
                            style={
                                styles.number
                            }>{`${item?.phoneNumbers[0]?.number}`}</Text>
                    </View>
                    <Button title="Add Chat" color={COLORS.darkRed} onPress={() => addNewChatRoom(item?.phoneNumbers[0]?.number)} />
                </View>
            )}
            {item?.phoneNumbers[0]?.number && (
                <View
                    style={[
                        styles.searchMainContainer,
                        { marginTop: HP_WP.hp(3) },
                    ]}>
                    <Image
                        source={
                            item.hasThumbnail
                                ? { uri: item.thumbnailPath }
                                : IMAGES.profile
                        }
                        style={styles.profileImage}
                    />
                    <View style={styles.profileMainContainer}>
                        <Text style={styles.name}>{`${item.givenName} ${item?.middleName && item.middleName + " "} ${item?.familyName}`}</Text>
                        <Text
                            style={
                                styles.number
                            }>{`${item?.phoneNumbers[0]?.number}`}</Text>
                    </View>
                    <Button title="Add Chat" color={COLORS.darkRed} onPress={() => addNewChatRoom(item?.phoneNumbers[0]?.number)} />
                </View>
            )}
        </>
    );
};

export default Contacted;

// const styles = StyleSheet.create({
//     contactCon: {
//         flex: 1,
//         flexDirection: 'row',
//         padding: 5,
//         borderBottomWidth: 0.5,
//         borderBottomColor: '#d9d9d9',
//     },
//     imgCon: {},
//     placeholder: {
//         width: 55,
//         height: 55,
//         borderRadius: 30,
//         overflow: 'hidden',
//         backgroundColor: '#d9d9d9',
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     contactDat: {
//         flex: 1,
//         justifyContent: 'center',
//         paddingLeft: 5,
//     },
//     txt: {
//         fontSize: 18,
//     },
//     name: {
//         fontSize: 16,
//     },
//     phoneNumber: {
//         color: '#888',
//     },
// });