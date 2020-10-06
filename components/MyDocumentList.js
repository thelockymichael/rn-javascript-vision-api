import React, {useContext, useEffect} from 'react'
import {FlatList, View} from 'react-native'
import MyDocumentItem from './MyDocumentItem'
import PropTypes from 'prop-types'
import {useLoadMedia} from '../hooks/APIhooks'
import {AuthContext} from '../contexts/AuthContext'
import {
  Spinner,
  Text,
} from 'native-base'
import Colors from '../constants/Colors'

const MyDocumentList = ({navigation, all}) => {
  const {user} = useContext(AuthContext)

  const {mediaArray, loadMedia, isRefreshing} = useLoadMedia(
    'EDITABLE',
    user.user_id,
  )

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => loadMedia())

    return unsubscribe
  }, [navigation])


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
          Start creating documents!
        </Text>
      </View>
    )
  }

  return (
    <>
      {isRefreshing ? (
        <View style={{flex: 1}}>
          <Spinner
            color={Colors.accentColor}
          />
        </View>
      ) : (
          <FlatList
            numColumns={3}
            data={mediaArray}
            onRefresh={loadMedia}
            refreshing={isRefreshing}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <MyDocumentItem
                singleMedia={item}
                navigation={navigation}
              />
            )}
          />
        )}
    </>
  )
}

MyDocumentList.propTypes = {
  navigation: PropTypes.object,
  all: PropTypes.bool,
}

export default MyDocumentList
