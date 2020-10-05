import React from 'react'
import {
  FlatList,
  View,
  Alert,
} from 'react-native'
import ListItem from './ListItem'
import PropTypes from 'prop-types'
import {
  Spinner, Text,
} from 'native-base'
import Colors from '../constants/Colors'

const List = ({navigation, isRefreshing, mediaArray, loadMedia}) => {
  if (mediaArray.length === 0) {
    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}
      >
        <Text style={{
          color: Colors.primaryColor,
        }}>
          Start adding new favourites!
        </Text>
      </View>
    )
  }


  return (
    <>
      {isRefreshing ?
        <View
          style={{flex: 1}}
        >
          <Spinner
            color={Colors.accentColor}
          />
        </View> :
        <FlatList
          data={mediaArray}
          onRefresh={loadMedia}
          refreshing={isRefreshing}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) =>
            <ListItem
              singleMedia={item}
              navigation={navigation}
            />
          }
        />
      }
    </>
  )
}

List.propTypes = {
  navigation: PropTypes.object,
}

export default List
