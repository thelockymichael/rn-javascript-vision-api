import AsyncStorage from '@react-native-community/async-storage';
import {Button, Container, Content, Icon, Text, Title, View} from 'native-base';
import {
  StyleSheet,
  SafeAreaView,
  Image,
  Platform,
} from 'react-native';
import PropTypes from 'prop-types';
import React, {useContext, useEffect, useState} from 'react';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import {AuthContext} from '../contexts/AuthContext';
import {checkToken} from '../hooks/APIhooks';

const Login = ({navigation}) => { // props is needed for navigation
  const {setIsLoggedIn, setUser, user} = useContext(AuthContext);
  const [showRegistration, setShowRegistration] = useState(true);

  const getToken = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    console.log('token', userToken);
    if (userToken) {
      try {
        const userData = await checkToken(userToken);
        console.log('token valid', userData);
        setIsLoggedIn(true);
        setUser(userData);
      } catch (e) {
        console.log('token check failed', e.message);
      }
      // navigation.navigate('Home');
    }
  };
  useEffect(() => {
    getToken();
  }, []);

  console.log('Login.js', user);

  return (
    <Container style={styles.container}>
      <Content padder >
        {showRegistration ?
          <LoginForm navigation={navigation} /> :
          <RegisterForm navigation={navigation} />
        }
        <View style={{alignItems: 'center'}}>
          <Text onPress={() => {
            setShowRegistration(!showRegistration);
          }}>{showRegistration ? 'or switch to sign up' : 'back to sign in'}</Text>
        </View>
        <Button block onPress={() => {
          setShowRegistration(!showRegistration);
        }}>
          <Text>{showRegistration ? 'Register' : 'Login'}</Text>
        </Button>
      </Content>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    margin: 60,
    borderRadius: 30,
    shadowColor: "#000",
    elevation: 6
  },
});

Login.propTypes = {
  navigation: PropTypes.object,
};

export default Login;
