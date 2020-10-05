import {StatusBar} from 'expo-status-bar'
import PropTypes from 'prop-types'
import React, {useEffect} from 'react'
import {useLoadMedia} from '../hooks/APIhooks'
import {
  SafeAreaView, StyleSheet,
} from 'react-native'
import List from '../components/List'

const Favourites = ({navigation}) => {
  const {
    mediaArray,
    loadMedia,
    isRefreshing,
  } = useLoadMedia('FAVOURITES')

  return (
    <SafeAreaView style={styles.container}>
      <List
        navigation={navigation}
        mediaArray={mediaArray}
        loadMedia={loadMedia}
        isRefreshing={isRefreshing}
      />
      <StatusBar style="auto" />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
})

Favourites.propTypes = {
  navigation: PropTypes.object,
}


export default Favourites
