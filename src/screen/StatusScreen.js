import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  TextInput,
  ActivityIndicator,
  Button
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import Modal from 'react-native-modal';
import ImageCropPicker from 'react-native-image-crop-picker';
import { CREATE_STATUS, GET_STATUS_LIST, GET_AUTHUSER_STATUS_LIST, USER_STATUS_SUBSCRIPTION } from '../api/graphql/statusQueries'
import MainHeader from '../component/MainHeader';
import { COLORS, FONTS, HP_WP, IMAGES, SIZE } from '../component/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import axios from 'axios';

const StatusScreen = ({ navigation }) => {
  const [image, setImage] = useState('');
  const [visible, setVisible] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [userPhoneNumber, setUserphoneNumber] = useState(async () => await AsyncStorage.getItem('authUserPhoneNumber'));
  const [StatusList, setStatusList] = useState([])
  const [authUserStatusList, setauthUserStatusList] = useState([])
  const [hasStatus, sethasStatus] = useState(false)
  const Modalclose = () => setVisible(false);
  const Modalopen = () => setVisible(true);
  const [isStatusLoading, setisStatusLoading] = useState(false);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [addStatus] = useMutation(CREATE_STATUS);

  const { loading, error: error1, data: data1, refetch, subscribeToMore } = useQuery(GET_STATUS_LIST);
  const { loading: loading1, data: data2, refetch: refetch1, subscribeToMore: subscribeToMoree } = useQuery(GET_AUTHUSER_STATUS_LIST);

  useEffect(() => {
    subscribeToMoree({
      document: USER_STATUS_SUBSCRIPTION,
      variables: {
        phoneNumber: userPhoneNumber,
      },
      updateQuery: async (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          console.log('NOOOOOOOOO')
        }
        setauthUserStatusList((previousUserAuthStatus) => [...previousUserAuthStatus, subscriptionData.data.statusAdded])
        console.log('KK', subscriptionData.data.statusAdded);
      }
    })

  }, [subscribeToMoree])


  useEffect(() => {
    runStorage();

    if (data1) {
      console.log('data1', data1)

      // setStatusList(data1.statusList.slice().sort((a, b) => b.createdAt - a.createdAt).map((item) => {
      //   item.createdAt = Date(item.createdAt);
      //   return item;
      // }));

      const groupedStatuses = data1.statusList.reduce((result, status) => {
        const phoneNumber = status.user.phoneNumber;

        // Check if the phoneNumber already exists in the result
        const existingGroup = result.find(group => group.phoneNumber === phoneNumber);

        if (existingGroup) {
          // If the phoneNumber exists, add the status to its statuses array
          existingGroup.statuses.push(status);
          // Add the mediaUrl to the mediaUrls array
          existingGroup.mediaUrls.push(status.mediaUrl);
        } else {
          // If the phoneNumber does not exist, create a new group for it
          result.push({
            phoneNumber,
            statuses: [status],
            mediaUrls: [status.mediaUrl], // Initialize the mediaUrls array
          });
        }

        return result;
      }, []);

      console.log(groupedStatuses);

      console.log('GROUPPPP', groupedStatuses)
      setStatusList(groupedStatuses);
      // sethasStatus(data1.statusList.some(obj => {
      //   return obj.phoneNumber === userPhoneNumber;
      // }));
    }
  }, [])

  useEffect(() => {
    const updateStatusList = async () => {
      refetch().then((statusList, d) => {
        console.log('statusList', statusList.data.statusList)

        const groupedStatuses = statusList.data.statusList.reduce((result, status) => {
          const phoneNumber = status.user.phoneNumber;

          // Check if the phoneNumber already exists in the result
          const existingGroup = result.find(group => group.phoneNumber === phoneNumber);

          if (existingGroup) {
            // If the phoneNumber exists, add the status to its statuses array
            existingGroup.statuses.push(status);
            // Add the mediaUrl to the mediaUrls array
            existingGroup.mediaUrls.push(status.mediaUrl);
          } else {
            // If the phoneNumber does not exist, create a new group for it
            result.push({
              phoneNumber,
              statuses: [status],
              mediaUrls: [status.mediaUrl], // Initialize the mediaUrls array
            });
          }

          return result;
        }, []);
        setStatusList(groupedStatuses);
        // sethasStatus(statusList.data.statusList.some(obj => {
        //   return obj.phoneNumber === userPhoneNumber;
        // }));
      });
    }
    const interval = setInterval(updateStatusList, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [refetch]);


  useEffect(() => {
    refetch1().then((statusList, d) => {
      console.log('AUTHstatusList', statusList.data.authUserStatusList)
      if (statusList.data.authUserStatusList.length >= 1) {
        setauthUserStatusList(statusList.data.authUserStatusList);
        sethasStatus(true);
      }
    });
  }, [refetch1])

  const runStorage = async () => {
    let User_PhoneNumber = await AsyncStorage.getItem('authUserPhoneNumber')
    console.log('User_PhoneNumber,', User_PhoneNumber)
    setUserphoneNumber(User_PhoneNumber)
  }

  const openAuthUserStatus = async () => {
    const groupedUserStatuses = authUserStatusList.reduce((result, status) => {
      const phoneNumber = status.user.phoneNumber;

      // Check if the phoneNumber already exists in the result
      const existingGroup = result.find(group => group.phoneNumber === phoneNumber);

      if (existingGroup) {
        // If the phoneNumber exists, add the status to its statuses array
        existingGroup.statuses.push(status);
        // Add the mediaUrl to the mediaUrls array
        existingGroup.mediaUrls.push(status.mediaUrl);
      } else {
        // If the phoneNumber does not exist, create a new group for it
        result.push({
          phoneNumber,
          statuses: [status],
          mediaUrls: [status.mediaUrl], // Initialize the mediaUrls array
        });
      }

      return result;
    }, []);

    navigation.navigate('ViewStatusScreen', { phoneNumber: groupedUserStatuses[0].phoneNumber, status: groupedUserStatuses[0].mediaUrls })

  }

  const toggleSearchBox = () => {
    setIsSearchOpen(!isSearchOpen);
  };
  const modalItem = [
    { title: 'New group' },
    { title: 'New Broadcast' },
    { title: 'Payouts' },
    { title: 'Linked devices' },
    { title: 'Starred messages' },
    { title: 'Settings' },
  ];

  const ModalData = () => {
    return (
      <FlatList
        style={styles.options}
        data={modalItem}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity style={{ paddingVertical: 3 }}>
              <Text style={styles.modalInnarText}>{item.title}</Text>
            </TouchableOpacity>
          );
        }}
      />
    );
  };

  const openCamera = () => {
    ImageCropPicker.openCamera({
      width: 250,
      height: 280,
      cropping: true,
    }).then(img => {
      setImage(img.path);
      setOpenModal(false);
    });
  };

  const openGallery = () => {
    // navigation.navigate('ViewStatusScreen')
    console.log('jnjn')
    ImageCropPicker.openPicker({
      width: 250,
      height: 280,
      cropping: true,
    }).then(img => {
      setImage(img.path);
      uploadStatusToCloudinary(img, '.')
      setOpenModal(false);
      setisStatusLoading(true)
    });
  };

  const CameraModalData = () => {
    return (
      <View style={styles.cameraModalContainer}>
        <TouchableOpacity
          style={styles.cameraModalInnarContainer}
          onPress={() => openGallery()}>
          <Text style={styles.cameraModalText}>gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cameraModalInnarContainer}
          onPress={() => openCamera()}>
          <Text style={styles.cameraModalText}>camera</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Function to upload media to Cloudinary with a caption
  const uploadStatusToCloudinary = async (image, caption) => {

    console.log('image', image)
    const formData = new FormData();
    formData.append('file', {
      uri: image.path,
      type: image.mime,
      name: 'download.png',
    });
    formData.append('upload_preset', 'ysfcygwz'); // Create an upload preset in your Cloudinary dashboard

    try {
      console.log('formData', formData)

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dr0rfaedk/image/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log('Image uploaded to Cloudinary:', response.data.secure_url);
      const { data } = await addStatus({
        variables: { mediaUrl: response.data.secure_url, },
      });

      if (data) {
        console.log(data)
        setisStatusLoading(false)
      }
    } catch (error) {
      setisStatusLoading(false)
      console.error('Image upload failed:', error);
      if (error.response) {
        console.log('Detailed response error:', error.response.data);
      }
    }

  };

  return (
    <SafeAreaView style={{ flex: 1, flexGrow: 1, backgroundColor: COLORS.darkWhite }}>
      <MainHeader
        camera
        onPressSearch={toggleSearchBox}
        onPressCamera={() => setOpenModal(true)}
        onPressDots={() => Modalopen()}
        style={{ paddingHorizontal: 15 }}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.mainContainer}>
        {isSearchOpen && (
          <TextInput
            style={{
              borderRadius: 12,
              paddingHorizontal: 15,
              height: HP_WP.hp(5.5),
              fontSize: SIZE.M,
              color: COLORS.darkBlack,
              fontFamily: FONTS.regular,
              backgroundColor: COLORS.lightWhite,
              marginTop: 20,
              borderWidth: 0.5,
            }}
            placeholder="Search"
            onChangeText={text => setSearchTerm(text)}
          />
        )}
        <TouchableOpacity style={styles.topBoxContainer} onPress={
          !hasStatus ? 
          () => openGallery()
           : 
           () => openAuthUserStatus()
        }>
          <View style={hasStatus ? styles.myStatusContainer : null}>
            {isStatusLoading ? ( // Show loading circle while loading is true
              <ActivityIndicator size="large" color={COLORS.darkRed} />
            ) : (
              <Image source={IMAGES.profile1} style={{ ...styles.profileImage }} />
            )}
            <View style={styles.addBtn}>
              <AntDesign name="plus" size={10} color={COLORS.white} />
            </View>
          </View>
          <View style={styles.statusTextContainer}>
            <Text style={styles.statusStyle}>My status</Text>
            {hasStatus == true ? <Text style={styles.addStatus}>...</Text> : <Text style={styles.addStatus}>Tap to add status update</Text>}
          </View>
          <TouchableOpacity>
            <Button title="Upload" color={COLORS.darkRed} onPress={() => openGallery()} />
          </TouchableOpacity>
        </TouchableOpacity>

        <Text style={[styles.statusStyle, { marginTop: HP_WP.hp(2) }]}>
          New status
        </Text>

        {StatusList && StatusList.length >= 1 ? StatusList.map((statusListt, index) => {
          console.log('IRE,', statusListt)
          return (
            <>
              <View key={index} style={styles.newStatusMainContainer}>
                <View style={[styles.directionContainer, { flex: 1 }]}>
                  <Image source={IMAGES.profile} style={styles.profileImage} />
                  <View style={styles.nameContainer}>
                    <Text style={styles.statusStyle}>{statusListt.phoneNumber}</Text>
                    <View style={styles.directionContainer}>
                      <Ionicons
                        name="ios-time-outline"
                        size={16}
                        color={COLORS.lightBlack}
                      />
                      <Text style={[styles.timeText, { marginLeft: 4 }]}>
                        {statusListt.createdAt}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.directionContainer}>
                  <Ionicons
                    name="ios-eye-outline"
                    size={14}
                    color={COLORS.lightBlack}
                  />
                  <Text style={[styles.timeText, { marginRight: HP_WP.hp(1.5) }]}>
                    {' '}

                  </Text>
                  {/* <Image source={IMAGES.hand} style={styles.imagehand} /> */}
                  <Text style={styles.timeText}> </Text>
                </View>
              </View>
              <FlatList
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                data={statusListt.statuses}
                renderItem={({ item, index }) => (
                  console.log('item', item),

                  <TouchableOpacity key={index} onPress={() => navigation.navigate('ViewStatusScreen', { phoneNumber: statusListt.phoneNumber, status: statusListt.mediaUrls })} style={styles.imgContainer} index>
                    <FastImage source={{ uri: item.mediaUrl, priority: FastImage.priority.high }} style={styles.imgStyle} />
                  </TouchableOpacity>
                )}
              />
            </>
          );
        }) : (<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ paddingTop: '50%', }}>No status to display</Text>
        </View>)}
        <Modal
          backdropColor="rgba(0,0,0,0.5)"
          backdropOpacity={1}
          animationIn="zoomInDown"
          animationOut="zoomOutUp"
          animationInTiming={1500}
          animationOutTiming={1500}
          backdropTransitionInTiming={600}
          backdropTransitionOutTiming={600}
          onBackButtonPress={Modalclose}
          onBackdropPress={Modalclose}
          isVisible={visible}>
          <ModalData />
        </Modal>
        <Modal
          backdropColor="rgba(0,0,0,0.5)"
          backdropOpacity={1}
          animationIn="zoomInDown"
          animationOut="zoomOutUp"
          animationInTiming={1500}
          animationOutTiming={1500}
          backdropTransitionInTiming={600}
          backdropTransitionOutTiming={600}
          onBackButtonPress={() => setOpenModal(false)}
          onBackdropPress={() => setOpenModal(false)}
          isVisible={openModal}>
          <CameraModalData />
        </Modal>
        <Spinner
          color={COLORS.darkRed}
          visible={loading}
          size="large"
          overlayColor="rgba(0,0,0,0.5)"
        />
      </ScrollView>

    </SafeAreaView>
  );
};

export default StatusScreen;

const styles = StyleSheet.create({
  cameraIcon: {
    position: 'absolute', // Position the camera icon absolutely within the container
    elevation: 20,
    bottom: -10, // Adjust the distance from the bottom as needed
    right: 20, // Adjust the distance from the right as needed
    backgroundColor: COLORS.darkRed, // Dark red background for the box
    borderRadius: 50, // Make it a circle by setting border radius to half of width/height
    width: 50, // Adjust the width and height as needed
    height: 50,
    alignItems: 'center', // Center the content horizontally and vertically
    justifyContent: 'center',
  },
  myStatusContainer: {
    width: 40, // Set the width and height as per your design
    height: 40,
    borderRadius: 50, // Make it a circle by setting border radius to half of width/height
    backgroundColor: COLORS.darkRed, // Dark red background
    alignItems: 'center', // Center the content horizontally and vertically
    justifyContent: 'center',
  },
  mainContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  topBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    elevation: 15,
    backgroundColor: COLORS.lightWhite,
    marginTop: HP_WP.hp(4),
    borderRadius: 5,
  },
  profileImage: {
    height: HP_WP.hp(5.7),
    width: HP_WP.wp(12),
    resizeMode: 'contain',
    borderRadius: 50,
  },
  addBtn: {
    width: HP_WP.wp(3.5),
    height: HP_WP.hp(1.7),
    backgroundColor: COLORS.darkRed,
    borderRadius: 50,
    position: 'absolute',
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusTextContainer: {
    flex: 1,
    marginLeft: HP_WP.hp(2),
  },
  statusStyle: {
    color: COLORS.darkBlack,
    fontSize: SIZE.L,
    fontFamily: FONTS.regular,
  },
  addStatus: {
    fontSize: SIZE.N,
    fontFamily: FONTS.light,
    color: COLORS.lightBlack,
  },
  newStatusMainContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: HP_WP.hp(2),
  },
  directionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameContainer: {
    marginHorizontal: 5,
    flex: 1,
  },
  timeText: {
    fontSize: SIZE.M,
    fontFamily: FONTS.light,
    color: COLORS.lightBlack,
  },
  imagehand: {
    resizeMode: 'contain',
    width: 13,
    height: 13,
  },
  imgContainer: {
    marginTop: 20,
  },
  imgStyle: {
    resizeMode: 'contain',
    height: HP_WP.hp(7.8),
    width: HP_WP.wp(17),
    marginRight: 15,
  },
  options: {
    backgroundColor: COLORS.white,
    padding: HP_WP.wp(4),
    borderRadius: 4,
    alignSelf: 'flex-end',
    width: HP_WP.wp(40),
    position: 'absolute',
    top: 35,
    right: 10,
  },
  modalInnarText: {
    fontSize: SIZE.N,
    color: COLORS.darkBlack,
    fontFamily: FONTS.light,
  },
  cameraModalContainer: {
    flexDirection: 'row',
    paddingVertical: HP_WP.wp(8),
    borderRadius: 10,
    margin: HP_WP.wp(10),
    borderWidth: 0.4,
    backgroundColor: COLORS.white,
  },
  cameraModalInnarContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraModalText: {
    fontSize: SIZE.N,
    color: COLORS.darkBlack,
    textAlign: 'center',
  },
});
