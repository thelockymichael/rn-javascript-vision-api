import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Container,
  Content,
  Form,
  Spinner,
  Text,
  Accordion,
} from "native-base";
import FormTextInput from "../components/FormTextInput";
import { Image, View, Alert, StyleSheet, SafeAreaView } from "react-native";
import useUploadForm from "../hooks/UploadHooks";
import * as ImagePicker from "expo-image-picker";
import Colors from "../constants/Colors";
// eslint-disable-next-line no-unused-vars
import { upload, postTag } from "../hooks/APIhooks";
import AsyncStorage from "@react-native-community/async-storage";
import { Video } from "expo-av";
import { API_KEY, appIdentifier } from "../config/environment";
import symbolicateStackTrace from "react-native/Libraries/Core/Devtools/symbolicateStackTrace";
import {
  FlatList,
  ScrollView,
  TouchableOpacity,
} from "react-native-gesture-handler";

const Upload = ({ navigation, route }) => {
  const [detectedText, setDetectedText] = useState();
  const newImage = route.params.newImage;

  const [pickedImage, setPickedImage] = useState(newImage);
  const [isLoading, setIsLoading] = useState(false);
  const [fileType, setFileType] = useState("image");

  const doUpload = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      // lisätään tekstikentät formDataan
      formData.append("title", inputs.title);

      const moreData = {
        description: "This is the actual description",
        detectedText,
      };

      formData.append("description", JSON.stringify(moreData));

      // lisätään tiedosto formDataan
      const filename = pickedImage.uri.split("/").pop();
      const match = /\.(\w+)$/.exec(filename);
      let type = match ? `${fileType}/${match[1]}` : fileType;
      if (type === "image/jpg") type = "image/jpeg";

      formData.append("file", { uri: pickedImage.uri, name: filename, type });
      const userToken = await AsyncStorage.getItem("userToken");
      const resp = await upload(formData, userToken);
      console.log("File uploaded: ", resp);

      const postTagResponse = await postTag(
        {
          file_id: resp.file_id,
          tag: appIdentifier,
        },
        userToken
      );
      console.log("posting tag:", postTagResponse);

      // wait for 2 secs
      setTimeout(() => {
        doReset();
        navigation.popToTop("MyFiles");
        setIsLoading(false);
      }, 2000);
    } catch (e) {
      console.log("upload error:", e.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const detectImageText = async () => {
      try {
        const body = JSON.stringify({
          requests: [
            {
              features: [{ type: "TEXT_DETECTION", maxResults: 1 }],
              image: {
                content: pickedImage.base64,
              },
            },
          ],
        });
        const response = await fetch(
          "https://vision.googleapis.com/v1/images:annotate?key=" + API_KEY,
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            method: "POST",
            body: body,
          }
        );
        const responseJson = await response.json();
        console.log("responseJson", responseJson);

        const isMyObjectEmpty = !Object.keys(responseJson.responses[0]).length;

        handleInputChange();

        if (isMyObjectEmpty) {
          Alert.alert(
            "No text detected in image!",
            "Please upload an image that contains text.",
            [{ text: "Okay" }]
          );

          return;
        }

        console.log(
          "resepos",
          responseJson.responses[0].textAnnotations[0].description
        );

        setDetectedText(
          responseJson.responses[0].textAnnotations[0].description
        );
      } catch (error) {
        throw new Error(error);
      }
    };
    detectImageText();
  }, [pickedImage]);

  const { handleInputChange, reset, uploadErrors, inputs } = useUploadForm();

  const doReset = () => {
    reset();
    // pickedImage(null)
  };

  const validateForm = () => {
    if (uploadErrors.title !== null || pickedImage === null) {
      return true;
    }

    return false;
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
        base64: true,
      });
      if (!result.cancelled) {
        // setImage(result.uri)

        return result;
      }

      console.log("Home image", result);
    } catch (err) {
      throw new Error(err);
    }
  };

  const takeImageHandler = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.5,
        base64: true,
      });
      if (!result.cancelled) {
        return result;
      }

      console.log("TAKEN IMAGE", result);
    } catch (err) {
      throw new Error(err);
    }
  };

  const dataArray = [{ title: "Converted Text", content: detectedText }];

  useEffect(() => {
    navigation.setOptions({ headerTitle: "New Document" });
  }, [navigation, route]);

  return (
    <Container>
      <ScrollView>
        <Form>
          <FormTextInput
            autoCapitalize="none"
            inputLabel="Title"
            value={inputs.title}
            onChangeText={(txt) => handleInputChange("title", txt)}
            error={uploadErrors.title}
          />
        </Form>
        {pickedImage && (
          <>
            <Image
              source={{ uri: pickedImage.uri }}
              style={styles.pickedImage}
            />
          </>
        )}
        {isLoading && <Spinner color={Colors.primaryColor} />}

        <Accordion dataArray={dataArray}></Accordion>
      </ScrollView>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-evenly",
          marginBottom: 20,
        }}
      >
        <Button
          style={styles.newPhotoButton}
          onPress={async () => setPickedImage(await pickImage())}
        >
          <Text style={{ marginLeft: 4 }}>Choose New Photo</Text>
        </Button>
        <Button
          style={styles.newPhotoButtonPrimary}
          onPress={async () => setPickedImage(await takeImageHandler())}
        >
          <Text style={{ marginLeft: 14 }}>Take New Photo</Text>
        </Button>
      </View>
      <Button
        style={styles.uploadButton}
        disabled={validateForm()}
        onPress={doUpload}
      >
        <Text style={{ marginLeft: 20 }}>Upload</Text>
      </Button>
    </Container>
  );
};

const styles = StyleSheet.create({
  pickedImage: {
    height: 400,
    width: null,
    flex: 1,
    resizeMode: "contain",
  },
  newPhotoButton: {
    alignSelf: "flex-start",
    textAlign: "center",
    backgroundColor: Colors.accentColor,
    borderRadius: 20,
    width: 180,
  },
  newPhotoButtonPrimary: {
    alignSelf: "flex-start",
    textAlign: "center",
    backgroundColor: Colors.primaryColor,
    borderRadius: 20,
    width: 180,
  },
  uploadButton: {
    alignSelf: "center",
    textAlign: "center",
    borderRadius: 20,
    width: 130,
    marginBottom: 20,
  },
});
export default Upload;
