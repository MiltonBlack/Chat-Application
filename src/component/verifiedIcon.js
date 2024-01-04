import React from 'react';
import { View, Text } from 'react-native';
import { Icon, Badge } from 'react-native-elements';
import { MaterialIcons } from 'react-native-vector-icons';


export default VerifiedIcon = () => {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Badge
          value={
            <Icon
              name="check"
              type="material"
              color="white"
              size={16}
            />
          }
          containerStyle={{
            backgroundColor: 'blue',
            padding: 8,
            borderRadius: 50,
            marginRight: 5,
          }}
        />
        <MaterialIcons name="verified" color="blue" size={16} />
      </View>
    );
  };
  