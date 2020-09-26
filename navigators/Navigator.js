import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Octicons} from '@expo/vector-icons';
import {AntDesign} from '@expo/vector-icons';
import React, {useContext} from 'react';
import {Button} from 'react-native';
import {AuthContext} from '../contexts/AuthContext';
import Login from '../views/Login';
import Modify from '../views/Modify';
import Profile from '../views/Profile';
import MyFiles from '../views/MyFiles';
import Search from '../views/Search';
import Single from '../views/Single';
import NewDocument from '../views/NewDocument'

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
      <Tab.Screen name='MyFiles' component={MyFiles} options={{
        tabBarLabel: 'My documents',
        tabBarIcon: ({color, size}) => (
          <AntDesign name="copy1" size={size} color={color} />
        )
      }} />
    </Tab.Navigator>
  );
};
const StackScreen = () => {
  const {isLoggedIn} = useContext(AuthContext);
  return (
    <Stack.Navigator>
      {isLoggedIn ? (
        /*here it code for the top header*/<>
          <Stack.Screen options={({navigation, route}) => ({
            headerTitle: 'Document scanner', headerRight: () => (
              <Button
                onPress={() => navigation.navigate('Profile')} 
                // kysy opettajalta mitä vittua miksei tämä näy
                icon={<AntDesign name="user" size={24} color="black" />}
                title="User"
              />
            ),
          })} name="Home" component={TabScreen} />
          <Stack.Screen name="Single" component={Single} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="NewDocument" component={NewDocument} />
          <Stack.Screen name="MyFiles" component={MyFiles} />
          <Stack.Screen name="Modify" component={Modify} />
        </>
      ) : (
          <>
            <Stack.Screen options={{
              headerTitleStyle: {
                alignSelf: 'center'
              }
            }} name="Login" component={Login} />
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
