import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Button, Container, Content, Form, Spinner, Text} from 'native-base';
import FormTextInput from '../components/FormTextInput';
import useUploadForm from '../hooks/UploadHooks';
// eslint-disable-next-line no-unused-vars
import {updateFile} from '../hooks/APIhooks';
import AsyncStorage from '@react-native-community/async-storage';


const Modify = ({navigation, route}) => {
  const {file} = route.params;
  const [isLoading, setIsLoading] = useState(false);

  const doModify = async () => {
    setIsLoading(true);
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const result = await updateFile(file.file_id, inputs, userToken);
      console.log('update file info:', result.message);
    } catch (e) {
      console.log('update error:', e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const {
    handleInputChange,
    reset,
    setInputs,
    uploadErrors,
    inputs,
  } = useUploadForm();

  useEffect(() => {
    setInputs({
      title: file.title,
      description: file.description,
    });
  }, []);

  const doReset = () => {
    reset();
    // console.log(inputs);
  };

  return (
    <Container>
      <Content padder>
        {/* TODO add media player (see single.js) */}
        <Form>
          <FormTextInput
            autoCapitalize="none"
            placeholder="title"
            value={inputs.title}
            onChangeText={(txt) => handleInputChange('title', txt)}
            error={uploadErrors.title}
          />
          <FormTextInput
            autoCapitalize="none"
            placeholder="description"
            value={inputs.description}
            onChangeText={(txt) => handleInputChange('description', txt)}
            error={uploadErrors.description}
          />
        </Form>
        <Button block
          disabled={(uploadErrors.title !== null ||
            uploadErrors.description !== null)}
          onPress={doModify}>
          <Text>Save</Text>
        </Button>
        {isLoading && <Spinner />}
        <Button block onPress={doReset}>
          <Text>Reset</Text>
        </Button>
      </Content>
    </Container>
  );
};

Modify.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};


export default Modify;
