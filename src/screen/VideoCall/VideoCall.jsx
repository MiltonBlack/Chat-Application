import React, { useEffect, useState } from 'react'
import messaging from '@react-native-firebase/messaging';
import AgoraUIKit from 'agora-rn-uikit'

const AUIKit = ({ route }) => {
    const [videoCall, setVideoCall] = useState(true);

    const getFCMToken = async () => {
        const token = await messaging().getToken();
        console.log('FCM Token:', token);
        return token;
    };

    const fcmToken = getFCMToken();
    // useEffect(()=> {
    // },[])
    
    const connectionData = {
        appId: 'dda9ea21eb7847f6bd3e17e35dd0e1be',
        channel: `${route?.params?.chatRoomUsers[0]}${route?.params?.chatRoomUsers[1]}`,
    };

    const callbacks = {
        EndCall: () => setVideoCall(false),
    };

    return (
        <AgoraUIKit
            connectionData={connectionData}
            rtcCallbacks={callbacks}
        // settings={} 
        />
    )
}

export default AUIKit