import { StatusBar } from "expo-status-bar";
import PropTypes from "prop-types";
import React from "react";
import { useEffect } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import List from "../components/List";

const Search = ({ navigation }) => {
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
    backgroundColor: "#fff",
    paddingHorizontal: 10,
  },
});

Search.propTypes = {
  navigation: PropTypes.object,
};

export default Search;
