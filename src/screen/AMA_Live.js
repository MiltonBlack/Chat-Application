import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Pressable,
  TextInput,
  Button,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useMutation, useQuery} from '@apollo/client';
import {Formik} from 'formik';
import Toast from 'react-native-toast-message';
import * as Yup from 'yup';

import Container from '../component/Container';
import MainHeader from '../component/MainHeader';
import {COLORS, FONTS, HP_WP, IMAGES, SIZE} from '../component/theme';
import AMA_LiveHeader from '../component/AMA_LiveHeader';
import {GET_AMA_LIVES, CREATE_AMA_LIVE} from '../api/graphql/AMALiveQueries';

const AMA_Live = ({navigation}) => {
  const [visible, setVisible] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);

  // const [title, setTitle] = useState('');
  // const [description, setDescription] = useState('');
  // const [hostName, sethostName] = useState('');
  // const [topic, settopic] = useState('');
  const [category, setCategory] = useState('');
  const [UserId, setUserId] = useState( async () => await AsyncStorage.getItem('userID'))
  const [AmaLives, setAmaLives] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState([1, 2, 3, 4, 5, 6]);
  const [createAMALives, {loading: loading1, error}] = useMutation(CREATE_AMA_LIVE);
  const {
    loading,
    error: error1,
    data: data1,
    refetch,
  } = useQuery(GET_AMA_LIVES);

  const validationSchema = Yup.object().shape({
    hostName: Yup.string().required(),
    title: Yup.string().required(),
    topic: Yup.string().required(),
    description: Yup.string().required(),
  });

  useEffect(() => {
    refetch().then((res, d) => {
      console.log('AMA FOR', res);
      setAmaLives(
        res.data.getAllAmaLive
          .slice()
          .sort((a, b) => b.createdAt - a.createdAt),
      );
    });

    return () => {
      clearInterval();
    };
  }, [refetch]);

  useEffect( async () => {
    let User_ID = await AsyncStorage.getItem('userID')
    setUserId(User_ID)
  }, [])
  
  const [categorys, setCategorys] = useState([
    {id: 1, title: 'Technology'},
  ]);

  const toggleSearchBox = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const Modalclose = () => setVisible(false);
  const Modalopen = () => setVisible(true);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleSubmit = async ({ 
    title,
    description,
    topic,
    hostName,}) => {

    //  return console.log('YES');
    console.log('Title:', title);
    console.log('Description:', description);
    console.log('Category:', category);
    try {

      const { data } = await createAMALives({
        variables: { 
          title,
          description,
          topic,
          hostName,
          amaCategoryId: '652ccb5d9c079110aa69cf3f'
         },
      });

      if (data) {
        console.log('CREATE LIVE', data);
        onResponse(data.createAmaLive)
        
      } else if (error) {
        console.log(error);
        onError(error);
      }
    } catch (error) {
      onError(error);
    }
  };

  
  const onResponse = async (data) => {
    navigation.navigate('LiveScreen', { live:live, hostId: data.host, hostName: data.hostName})
        toggleModal();
  };

  const onError = e => {
    console.warn(e);
    Toast.show({
      position: 'top',
      type: 'error',
      text1: e.message,
    });
  };
  
  const live = 'Go Live';

  const modalItem = [
    {title: 'New group'},
    {title: 'New Broadcast'},
    {title: 'Payouts'},
    {title: 'Linked devices'},
    {title: 'Starred messages'},
    {title: 'Settings'},
  ];

  const deleteItem = index => {
    const newData = [...data];
    newData.splice(index, 1);
    setData(newData);
  };

  const ModalData = () => {
    return (
      <FlatList
        style={styles.options}
        data={modalItem}
        renderItem={({item}) => {
          return (
            <TouchableOpacity style={{paddingVertical: 3}}>
              <Text style={styles.modalInnarText}>{item.title}</Text>
            </TouchableOpacity>
          );
        }}
      />
    );
  };

  return (
    <Container>
      <Pressable
        onPress={() => setOpenCategory(false)}
        style={styles.mainContainer}>
        <MainHeader
          onPressSearch={toggleSearchBox}
          onPressDots={() => Modalopen()}
        />

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
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 30}}> 
          <AMA_LiveHeader
            // onPressGoLive={() => null}
            // navigation.navigate('LiveScreen', {live})

            // Navigate to Live Screen instead of opening a Modal!!

            onPressGoLive={() => toggleModal()}
            onPressCategory={() => setOpenCategory(true)}
          />

          {AmaLives && AmaLives.length < 1 ? (
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{paddingTop: '50%'}}>No AMA live to display</Text>
            </View>
          ) : (
            AmaLives.map((item, index, next) => {
              if(item.host == UserId){
                next();
              }
              return (
                <View style={styles.cardContainer}>
                  <Image style={styles.img} />
                  <View style={styles.liveContainer}>
                    <Text style={styles.liveText}>LIVE</Text>
                  </View>
                  <View style={styles.cardInnarRightContainer}>
                    <Text style={styles.benefitText}>{item.title}</Text>
                    <Text style={styles.nameText}>
                      Topic name: <Text>{item.topic}</Text>
                    </Text>
                    <Text style={styles.nameText}>
                      Host name: <Text>{item.hostName}</Text>
                    </Text>
                    <View style={styles.buttonContainer}>
                      <TouchableOpacity
                        onPress={() => {
                          if(item.host == UserId){
                            navigation.navigate('LiveScreen', {live: 'live', hostId: item.host, hostName: item.hostName})
                          } else navigation.navigate('LiveScreen', {id: 'Id', hostId: item.host, hostName: item.hostName})
                        }
                        }
                        style={styles.joinButton}>
                        <Text style={styles.buttonText}>Join</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => deleteItem(index)}
                        style={styles.ignoreButton}>
                        <Text
                          style={[styles.buttonText, {color: COLORS.darkRed}]}>
                          Ignore
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>
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
        <Spinner
          color={COLORS.darkRed}
          visible={loading || loading1}
          size="large"
          overlayColor="rgba(0,0,0,0.5)"
        />

        {openCategory == true && (
          <View style={styles.categoryMainContainer}>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={categorys}
              renderItem={({item}) => (
                <Pressable onPress={() => setOpenCategory(false)}>
                  <Text style={[styles.modalInnarText, {marginBottom: 5}]}>
                    {item.title}
                  </Text>
                </Pressable>
              )}
            />
          </View>
        )}

        {isModalVisible == true && (
          <Formik
          initialValues={{hostName: '', topic: '', description: '', title: ''}}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
          <View>
            <Modal isVisible={isModalVisible}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    backgroundColor: 'white',
                    padding: 20,
                    borderRadius: 10,
                    width: 300,
                  }}>
                    <Icon
              name="times"
              size={20}
              color="black"
              style={{ position: 'absolute', top: 10, right: 10, zIndex: 1 }}
              onPress={toggleModal}
            />
                  <Text style={{color: 'gray'}}>Title:</Text>
                  <TextInput
                    style={[
                      {borderColor: errors.title && 'red'},
                      {borderWidth: 1,
                      borderColor: 'gray',
                      marginBottom: 10,
                      color: 'gray'}
                    ]}
                    value={values.title}
                    onChangeText={handleChange('title')}
                  />
                  <Text style={{color: 'gray'}}>Topic:</Text>
                  <TextInput
                    style={[
                      {borderColor: errors.topic && 'red'},
                      {borderWidth: 1,
                      borderColor: 'gray',
                      marginBottom: 10,
                      color: 'gray'}
                    ]}
                    value={values.topic}
                    onChangeText={handleChange('topic')}
                  />
                  <Text style={{color: 'gray'}}>Host Name:</Text>
                  <TextInput
                    style={[
                      {borderColor: errors.hostName && 'red'},
                     { borderWidth: 1,
                      borderColor: 'gray',
                      marginBottom: 10,
                      color: 'gray'}
                    ]}
                    value={values.hostName}
                    onChangeText={handleChange('hostName')}
                  />
                  <Text style={{color: 'gray'}}>Description:</Text>
                  <TextInput
                    style={[
                      {borderColor: errors.description && 'red'},
                      {borderWidth: 1,
                      borderColor: 'gray',
                      marginBottom: 10,
                      color: 'gray'}
                    ]}
                    value={values.description}
                    onChangeText={handleChange('description')}
                  />
                  {/* <Text>Category:</Text> */}
                  {/* <Picker
                    selectedValue={category}
                    onValueChange={itemValue => setCategory(itemValue)}>
                    <Picker.Item label="Select Category" value="" />
                    <Picker.Item label="Category 1" value="Category 1" />
                    <Picker.Item label="Category 2" value="Category 2" />
                    <Picker.Item label="Category 3" value="Category 3" />
                  </Picker> */}
                  <Button title="Start Live Session" color={COLORS.darkRed} onPress={handleSubmit} />
                  {/* <Button title="Close" color={COLORS.darkRed} onPress={toggleModal} /> */}
                </View>
              </View>
            </Modal>
          </View>)}
        </Formik>
        )}
      </Pressable>
    </Container>
  );
};

export default AMA_Live;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    marginHorizontal: 20,
    marginBottom: HP_WP.hp(7.6),
  },
  cardContainer: {
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightWhite,
    borderRadius: 5,
    padding: 6,
  },
  img: {
    width: HP_WP.wp(35),
    height: HP_WP.hp(13),
    borderRadius: 5,
  },
  liveContainer: {
    backgroundColor: COLORS.darkRed,
    borderRadius: 3,
    paddingVertical: 2,
    paddingHorizontal: 5,
    position: 'absolute',
    top: 10,
    left: 10,
  },
  liveText: {
    color: COLORS.white,
    fontSize: SIZE.S,
    fontFamily: FONTS.regular,
    lineHeight: 14,
  },
  cardInnarRightContainer: {
    flex: 1,
    marginLeft: 10,
  },
  benefitText: {
    flex: 1,
    color: COLORS.darkBlack,
    fontSize: SIZE.N,
    fontFamily: FONTS.mediam,
  },
  nameText: {
    flex: 1,
    color: COLORS.darkBlack,
    fontSize: SIZE.S,
    fontFamily: FONTS.light,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  joinButton: {
    width: HP_WP.wp(20),
    height: HP_WP.hp(3),
    backgroundColor: COLORS.green,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: COLORS.darkBlack,
    fontSize: SIZE.S,
    fontFamily: FONTS.light,
  },
  ignoreButton: {
    width: HP_WP.wp(20),
    height: HP_WP.hp(3),
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    borderWidth: 1,
    borderColor: COLORS.darkRed,
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
  categoryMainContainer: {
    position: 'absolute',
    width: HP_WP.wp(38),
    padding: 10,
    top: 110,
    right: 0,
    alignSelf: 'flex-end',
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 5,
    backgroundColor: COLORS.white,
    height: HP_WP.wp(38),
  },
});
