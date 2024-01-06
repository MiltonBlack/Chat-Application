import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import NewChat from '../screen/NewChatScreen';
import AMA_Live from '../screen/AMA_Live';
import CallListScreen from '../screen/CallListScreen';
import AllChateScreen from '../screen/AllChatScreen';
import StatusScreen from '../screen/StatusScreen';
import Status from '../screen/Status/Status';

const Tab = createBottomTabNavigator();

const CustomTabBar = ({ state, descriptors, navigation }) => {
    return (
        <View style={{ flexDirection: 'row', backgroundColor: 'white' }}>
            {state.routes.map((route, index) => {
                const { option } = descriptors[route.key];
                const isFocused = state.index === index;
                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    })
                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                return (
                    <TouchableOpacity
                        key={index}
                        activeOpacity={0.7}
                        onPress={onPress}
                        style={{ flex: 1, alignItems: 'center', padding: 12 }}>
                        <MaterialCommunityIcons
                            name={'chat'}
                            size={24}
                            color={isFocused ? 'red' : 'grey'}
                        />
                        <Text style={{ color: isFocused ? 'red' : 'grey' }}>
                            {route.name}
                        </Text>
                    </TouchableOpacity>
                )
            })}
        </View>
    )
}

const screenOptions = {
    tabBarShowLabel: false,
    headerShown: false,
    tabBarStyle: {
        position: "absolute",
        bottom: 0,
        right: 0,
        left: 0,
        elevation: 0,
        height: 60,
        background: "#fff"
    }
}

const NavStack = () => {

    return (
        <Tab.Navigator
            screenOptions={screenOptions}
        >
            <Tab.Screen
                name="AllChateScreen"
                component={AllChateScreen}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            <View style={{ alignItems: "center", justifyContent: "center" }}>
                                <MaterialCommunityIcons
                                    name={'chat-outline'}
                                    size={24}
                                    color={focused ? '#A0015D' : 'grey'}
                                />
                                <Text style={{ fontSize: 12, color: 'grey' }}>Chat</Text>
                            </View>
                        )
                    }
                }}
            />
            <Tab.Screen name="StatusScreen" component={StatusScreen} 
            options={{
                tabBarIcon: ({ focused }) => {
                    return (
                        <View style={{ alignItems: "center", justifyContent: "center" }}>
                            <MaterialCommunityIcons
                                name={'circle'}
                                size={24}
                                color={focused ? '#A0015D' : 'grey'}
                            />
                            <Text style={{ fontSize: 12, color: 'grey' }}>Status</Text>
                        </View>
                    )
                }
            }} />
            <Tab.Screen name='NewChatScreen' component={NewChat} 
            options={{
                tabBarIcon: () => {
                    return(
                        <View style={{
                            top: Platform.OS === "ios" ? -10 : -20,
                            width: Platform.OS === "ios" ? 50 : 60,
                            height: Platform.OS === "ios" ? 50 : 60,
                            borderRadius: Platform.OS === "ios" ? 25 : 30,
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "#A0015D"
                        }}>
                            <MaterialCommunityIcons
                                    name={'plus'}
                                    size={24}
                                    color={'white'}
                                />
                        </View>
                    )
                }
            }}/>
            <Tab.Screen name="AMA_Live" component={AMA_Live} options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            <View style={{ alignItems: "center", justifyContent: "center" }}>
                                <MaterialCommunityIcons
                                    name={'television-classic'}
                                    size={24}
                                    color={focused ? '#A0015D' : 'grey'}
                                />
                                <Text style={{ fontSize: 12, color: 'grey' }}>AMA Live</Text>
                            </View>
                        )
                    }
                }} />
            <Tab.Screen name="Call" component={CallListScreen} options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            <View style={{ alignItems: "center", justifyContent: "center" }}>
                                <MaterialCommunityIcons
                                    name={'phone'}
                                    size={24}
                                    color={focused ? '#A0015D' : 'grey'}
                                />
                                <Text style={{ fontSize: 12, color: 'grey' }}>Call</Text>
                            </View>
                        )
                    }
                }}/>
        </Tab.Navigator>
    )
}

export default NavStack;

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        width: '100%',
        height: 75,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        bottom: 0,
        left: 0,
        right: 0,
    },
    focusedIcon: {
        width: 22,
        height: 22,
        resizeMode: 'contain',
    },
    unfocusedIcon: {
        width: 22,
        height: 22,
        resizeMode: 'contain',
    },
    button: (index = false) => ({
        position: index === 2 ? 'absolute' : null,
        top: index === 2 ? -50 : 0,
        backgroundColor: index === 2 ? '#A0015D' : '',
        padding: index === 2 ? 10 : 0,
        alignSelf: index === 2 ? 'center' : 'auto',
        borderRadius: index === 2 ? 50 : 0,
        left: index === 2 ? 17 : 0,
    }),
    text: (index = false) => ({
        width: '100%',
        textAlign: 'center',
        fontSize: index == 2 ? 15 : 13,
        color: '#ABA6A9',
        fontWeight: 500,
        left: index === 2 ? 4 : 0,
    }),
    activeText: (index = false) => ({
        width: '100%',
        textAlign: 'center',
        fontSize: index == 2 ? 15 : 13,
        color: '#A0015D',
        fontWeight: 500,
        left: index === 2 ? 4 : 0,
    }),
});