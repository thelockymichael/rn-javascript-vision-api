import {StatusBar} from 'expo-status-bar'
import PropTypes from 'prop-types'
import React, {useEffect} from 'react'
import {
  SafeAreaView, StyleSheet,
} from 'react-native'
import List from '../components/List'


const Search = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
      <List navigation={navigation} all />
      <StatusBar style="auto" />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
})

Search.propTypes = {
  navigation: PropTypes.object,
}


export default Search
