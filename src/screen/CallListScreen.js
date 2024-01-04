import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Modal from 'react-native-modal';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import Toast from 'react-native-toast-message';
import { useQuery } from '@apollo/client';

import Container from '../component/Container';
import MainHeader from '../component/MainHeader';
import {COLORS, FONTS, HP_WP, IMAGES, SIZE} from '../component/theme';
import { GET_CALL_LOGS } from '../api/graphql/callQueries';

const CallListScreen = ({navigation}) => {
  const [active, setActive] = useState('All');
  const [visible, setVisible] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const {loading, refetch } = useQuery(GET_CALL_LOGS);
  const [callLogs, setcallLogs] = useState([]);

  useEffect(() => {
    refetch().then((res, d) => {
      console.log('Call Logs', res);
      console.log('Call Logs', res.data.getCallLogs);
      setcallLogs(res.data.getCallLogs);
    });
  }, []);

  const toggleSearchBox = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const Modalclose = () => setVisible(false);
  const Modalopen = () => setVisible(true);

  const data = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const Data = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const modalItem = [
    {title: 'New group'},
    {title: 'New Broadcast'},
    {title: 'Payouts'},
    {title: 'Linked devices'},
    {title: 'Starred messages'},
    {title: 'Settings'},
  ];

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

  const formatTimestampToHumanDate = (timestamp) => {
    const date = new Date(timestamp);
  
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
  
    return date.toLocaleDateString('en-US', options) + ' ' + date.toLocaleTimeString('en-US', options);
  }
  return (
    <Container>
      <View style={styles.mainContainer}>
        <MainHeader
          onPressSearch={toggleSearchBox}
          onPressDots={() => Modalopen()}
        />
        <ScrollView
          contentContainerStyle={{paddingBottom: 40}}
          showsVerticalScrollIndicator={false}>
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
                borderWidth:0.5
              }}
              placeholder="Search"
              onChangeText={text => setSearchTerm(text)}
            />
          )}
          <View style={styles.chatMainContainer}>
            <TouchableOpacity
              onPress={() => setActive('All')}
              style={[
                styles.chatContainer,
                {borderBottomWidth: active === 'All' ? 3 : 0},
              ]}>
              <Text style={active === 'All' ? styles.name : styles.detail}>
                All
              </Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
              onPress={() => setActive('Missed')}
              style={[
                styles.chatContainer,
                {borderBottomWidth: active === 'Missed' ? 3 : 0},
              ]}>
              <Text style={active === 'Missed' ? styles.name : styles.detail}>
                Missed
              </Text>
            </TouchableOpacity> */}
          </View>
          {active === 'All' ? (
            callLogs && callLogs.length >= 1 ? <FlatList
              showsVerticalScrollIndicator={false}
              data={callLogs}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.searchMainContainer}
                  onPress={() => navigation.navigate('ChatScreen')}>
                  <Image source={IMAGES.profile} style={styles.profileImage} />
                  <View style={styles.profileMainContainer}>
                    <Text style={styles.name}>{item.caller}</Text>
                    <View style={styles.directionContainer}>
                      <MaterialIcons
                        name="call-made"
                        size={20}
                        color={COLORS.lightGreen}
                      />
                      <Text style={[styles.detail, {marginHorizontal: 3}]}>
                        (1)
                      </Text>
                      <Text style={styles.detail}>{formatTimestampToHumanDate(item.startTime)}</Text>
                    </View>
                  </View>
                  <FontAwesome
                    name={item.type == 'voice' ? "phone" : "video-camera"}
                    size={20}
                    color={COLORS.darkBlack}
                  />
                </TouchableOpacity>
              )}
            />
            : <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ paddingTop: '50%',}}>No Call log to display</Text>
          </View>
           
          ) : (
            // <FlatList
            //   showsVerticalScrollIndicator={false}
            //   data={Data}
            //   renderItem={({item}) => (
            //     <TouchableOpacity
            //       style={styles.searchMainContainer}
            //       onPress={() => navigation.navigate('ChatScreen')}>
            //       <Image source={IMAGES.profile1} style={styles.profileImage} />
            //       <View style={styles.profileMainContainer}>
            //         <Text style={styles.name}>Family member</Text>
            //         <View style={styles.directionContainer}>
            //           <MaterialIcons
            //             name="call-missed"
            //             size={20}
            //             color={COLORS.darkRed}
            //           />
            //           <Text style={[styles.detail, {marginHorizontal: 3}]}>
            //             (5)
            //           </Text>
            //           <Text style={styles.detail}>10 minutes ago</Text>
            //         </View>
            //       </View>
            //       <FontAwesome
            //         name="video-camera"
            //         size={20}
            //         color={COLORS.darkBlack}
            //       />
            //     </TouchableOpacity>
            //   )}
            // />
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ paddingTop: '50%',}}>No Missed call to display</Text>
          </View>
          )}
          <Modal
            style={{}}
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
            visible={loading}
            size="large"
            overlayColor="rgba(0,0,0,0.5)"
          />
        </ScrollView>
      </View>
    </Container>
  );
};

export default CallListScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    marginHorizontal: 20,
    marginBottom: HP_WP.hp(7.6),
  },
  chatMainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    borderBottomWidth: 3,
    borderBottomColor: COLORS.lightGray,
  },
  chatContainer: {
    marginRight: 25,
    paddingBottom: 10,
    borderBottomColor: COLORS.darkRed,
    bottom: -3,
    width: HP_WP.wp(25),
  },
  searchMainContainer: {
    flexDirection: 'row',
    marginTop: HP_WP.hp(2.5),
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: COLORS.lightGray,
    paddingTop: 15,
  },
  profileImage: {
    height: HP_WP.hp(5.7),
    width: HP_WP.wp(12),
    resizeMode: 'contain',
    borderRadius: 50,
  },
  profileMainContainer: {
    flex: 1,
    marginHorizontal: 15,
  },
  directionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: SIZE.L,
    color: COLORS.darkBlack,
    fontFamily: FONTS.regular,
  },
  detail: {
    fontSize: SIZE.N,
    color: COLORS.lightBlack,
    fontFamily: FONTS.light,
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
    lineHeight: 18,
  },
});
