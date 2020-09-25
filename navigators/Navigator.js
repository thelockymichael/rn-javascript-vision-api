import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Octicons} from '@expo/vector-icons';
import {AntDesign} from '@expo/vector-icons';
import React, {useContext} from 'react';
import {AuthContext} from '../contexts/AuthContext';
import Login from '../views/Login';
import Modify from '../views/Modify';
import Profile from '../views/Profile';
import MyFiles from '../views/MyFiles';
import Search from '../views/Search';
import Single from '../views/Single';
import Upload from '../views/Upload';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabScreen = () => {
  return (
    <Tab.Navigator
      initialRouteName='My documents'
      tabBarOptions={{
        safeAreaInsets: {bottom: 10}
      }}>
      <Tab.Screen name='Search' component={Search} options={{
        tabBarIcon: ({color, size}) => (
          <Octicons name="search" size={size} color={color} />
        )
      }} />
      <Tab.Screen name='Profile' component={Profile} />
      <Tab.Screen name='My documents' component={MyFiles} options={{
        tabBarIcon: ({color, size}) => (
          <AntDesign name="copy1" size={size} color={color} />
        )
      }} />
      <Tab.Screen name='Upload' component={Upload} />
    </Tab.Navigator>
  );
};
const StackScreen = () => {
  const {isLoggedIn} = useContext(AuthContext);
  return (
    <Stack.Navigator>
      {isLoggedIn ? (
        <>
          <Stack.Screen name="Home" component={TabScreen} />
          <Stack.Screen name="Single" component={Single} />
          <Stack.Screen name="MyFiles" component={MyFiles} />
          <Stack.Screen name="Modify" component={Modify} />
        </>
      ) : (
          <>
            <Stack.Screen name="Login" component={Login} />
          </>
        )}
    </Stack.Navigator>
  );
};

const Navigator = () => {
  return (
    <NavigationContainer>
      <StackScreen />
    </NavigationContainer>
  );
};

export default Navigator;
