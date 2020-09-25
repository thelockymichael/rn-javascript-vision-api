import {StatusBar} from 'expo-status-bar';
import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import List from '../components/List';
import PropTypes from 'prop-types';


const Home = ({navigation}) => {
  // const {navigation} = props;
  // const navigation = props.navigation;
  return (
    <SafeAreaView style={styles.container}>
      <List navigation={navigation} all />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
  },
});

Home.propTypes = {
  navigation: PropTypes.object,
};


export default Home;
