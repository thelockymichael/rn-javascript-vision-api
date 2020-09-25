import {StatusBar} from 'expo-status-bar';
import React from 'react';
import {StyleSheet, Image, Text, View} from 'react-native';

const GOOGLE_APPLICATION_API_KEY = "/Users/mickeylock/Documents/25.08.2020-WBMA/rn-vision-api-javascript/ServiceAccountToken.json"
import {API_KEY} from "./config/environment"

const App = () => {

  console.log(API_KEY);
  /* 
    fetch("https://artful-fragment-287918.firebaseio.com/images.json", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
        
      )
    }) */

  const submitToGoogle = async () => {
    try {
      //this.setState({uploading: true});
      let image = "https://i.stack.imgur.com/H7zmz.png"
      let body = JSON.stringify({
        requests: [
          {
            features: [
              //{type: "LABEL_DETECTION", maxResults: 10},
              //              {type: "LANDMARK_DETECTION", maxResults: 5},
              //            {type: "FACE_DETECTION", maxResults: 5},
              //              {type: "LOGO_DETECTION", maxResults: 5}, */
              {type: "TEXT_DETECTION", maxResults: 1},
              //{type: "DOCUMENT_TEXT_DETECTION", maxResults: 5},
              /*               {type: "SAFE_SEARCH_DETECTION", maxResults: 5},
                            {type: "IMAGE_PROPERTIES", maxResults: 5},
                            {type: "CROP_HINTS", maxResults: 5},
                            {type: "WEB_DETECTION", maxResults: 5} */
            ],
            image: {
              source: {
                imageUri: image
              }
            }
          }
        ]
      });
      let response = await fetch(
        "https://vision.googleapis.com/v1/images:annotate?key=" +
        API_KEY,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          method: "POST",
          body: body
        }
      );
      let responseJson = await response.json();
      console.log("response", responseJson.responses[0].textAnnotations[0].description);
      //console.log("response", responseJson);

      /*       
console.log(responseJson);
      this.setState({
        googleResponse: responseJson,
        uploading: false
      });
 */    } catch (error) {
      console.log(error);
    }
  };

  submitToGoogle()

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <Image source={require('./images/image1.jpg')} />
      <StatusBar style="auto" />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
})
export default App

/*   /* const submit = async () => {

    console.log("testus", require("./images/image1.jpg"));
    try {
      let body = JSON.stringify({
        requests: [
          {
            features: [
              {type: "LABEL_DETECTION", maxResults: 10},
              {type: "LANDMARK_DETECTION", maxResults: 5},
              {type: "FACE_DETECTION", maxResults: 5},
              {type: "LOGO_DETECTION", maxResults: 5},
              {type: "TEXT_DETECTION", maxResults: 5},
              {type: "DOCUMENT_TEXT_DETECTION", maxResults: 5},
              {type: "SAFE_SEARCH_DETECTION", maxResults: 5},
              {type: "IMAGE_PROPERTIES", maxResults: 5},
              {type: "CROP_HINTS", maxResults: 5},
              {type: "WEB_DETECTION", maxResults: 5}
            ],
            image: {
              source: {
                imageUri: require("./images/image1.jpg")
              }
            }
          }
        ]
      });
      let response = await fetch(
        "https://vision.googleapis.com/v1/images:annotate?key=" +
        GOOGLE_APPLICATION_API_KEY,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          method: "POST",
          body: body
        }
      );
      let responseJson = await response.json();
      console.log("res json", responseJson);
      /*       this.setState({
              googleResponse: responseJson,
              uploading: false
            }); */
