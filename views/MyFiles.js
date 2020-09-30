import {StatusBar} from 'expo-status-bar'
import React, {useState} from 'react'
import {
  StyleSheet,
  SafeAreaView,
  Platform,
} from 'react-native'
import List from '../components/List'
import PropTypes from 'prop-types'

import AddDocumentFab from '../components/AddDocumentFab'

const MyFiles = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
      <List navigation={navigation} all={false} />
      <AddDocumentFab navigation={navigation} />
      <StatusBar style="auto" />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
  },
})

MyFiles.propTypes = {
  navigation: PropTypes.object,
}


export default MyFiles
