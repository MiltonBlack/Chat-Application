// React and React Native Imports
import { View, Text, StyleSheet, Image, ScrollView, FlatList } from 'react-native'
import React from 'react'

// Icon Imports
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Images } from '../../component/Pics'

const Status = () => {

  const renderItem = () => {
    return <Image source={Images.StatusProfile} style={{ marginRight: 10, borderRadius: 8, height: 65, width: 65 }} />
  }

  return (
    <View style={style.container}>
      <View style={style.statusHeader}>
        <View style={{ alignItems: 'center', display: 'flex', flexDirection: 'row' }}>
          <Image source={Images.StatusLogoIcon} style={style.statusHeaderLeft} />
          <Text style={{ color: 'black', fontSize: 20, marginLeft: 5 }}>Commune</Text>
        </View>
        <View style={style.statusHeaderRight}>
          <Image source={Images.StatusCameraIcon} />
          <MaterialCommunityIcons
            name={'search-web'}
            size={25}
            color={'black'}
          />
          <Image source={Images.StatusOptionIcon} />
        </View>
      </View>
      <View style={{ padding: 10, borderRadius: 8, elevation: 4 }}>
        <View style={{ borderRadius: 24, marginRight: 15, padding: 6, paddingBottom: 14, flexDirection: 'row' }}>
          <View style={{ position: 'relative', height: 56, width: 56, marginRight: 20 }}>
            <Image source={Images.StatusProfile} style={{ height: 60, width: 60, borderRadius: 30, margin: 3 }} />
            <View style={{ height: 28, width: 28, borderRadius: 14, position: 'absolute', bottom: -10, right: -8, backgroundColor: '#A0015D', alignItems: 'center', display: 'flex', justifyContent: 'center', borderWidth: 2, borderColor: 'white' }}>
              <MaterialCommunityIcons
                name='plus'
                size={22}
                color='white'
              />
            </View>
          </View>
          <View style={{ justifyContent: 'space-between' }}>
            <Text style={{ color: 'black', fontSize: 20 }}>My Status</Text>
            <Text style={{ color: 'gray' }}>Tap to Add Status Update</Text>
          </View>
        </View>
      </View>
      <View style={{ marginTop: 30 }}>
        <Text style={{ fontWeight: '700', color: 'black', fontSize: 20 }}>New Status</Text>
        <View style={{ paddingVertical: 15 }}>

          {/* Single User Status Update */}
          <View style={{ display: 'flex', alignItems: "flex-start", justifyContent: 'space-between', flexDirection: 'row', paddingVertical: 10, paddingBottom: 20 }}>
            <View style={{ flexDirection: 'row' }}>
              <Image source={Images.StatusProfile} style={style.statusProfileImg} />
              <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingLeft: 12, paddingVertical: 4 }}>
                <Text style={{ color: 'black', fontSize: 18 }}>Milton</Text>
                <View style={{ display: 'flex', flexDirection: 'row' }}>
                  <MaterialCommunityIcons
                    name='timeline-clock-outline'
                    color={'gray'}
                    size={16} />
                  <Text style={{ fontWeight: '100', color: 'gray', marginLeft: 5 }}>Today, 11:00</Text>
                </View>
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: '100%', width: '26%', justifyContent: 'space-between' }}>
              <MaterialCommunityIcons
                name='eye'
                color={'gray'}
                size={16} />
              <Text style={{ marginRight: 4, fontWeight: '100', color: 'gray' }}>70</Text>
              <Image source={Images.StatusClicks} />
              <Text style={{ fontWeight: '100', color: 'gray' }}>1,200</Text>
            </View>
          </View>
          
        </View>
      </View>
    </View>
  )
}

export default Status;

const style = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingVertical: 20,
    backgroundColor: "#FFF",
  },
  statusHeader: {
    dislay: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    padding: 5,
    marginBottom: 10,
  },
  statusHeaderLeft: {
    marginRight: 5,
    height: 45,
    width: 45
  },
  statusHeaderRight: {
    width: '25%',
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  statusProfileImg: {
    height: 60,
    width: 60,
    borderRadius: 30,
  }
});