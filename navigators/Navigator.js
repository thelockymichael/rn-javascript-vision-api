import React, {useContext} from 'react'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import {createStackNavigator} from '@react-navigation/stack'
import {NavigationContainer} from '@react-navigation/native'
import Home from '../views/Home'
import Profile from '../views/Profile'
import Single from '../views/Single'
import Login from '../views/Login'
import {AuthContext} from '../contexts/AuthContext'
import NewDocument from '../views/NewDocument'
import MyFiles from '../views/MyFiles'
import Modify from '../views/Modify'

const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()

const TabScreen = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name='Home' component={Home} />
      <Tab.Screen name='Profile' component={Profile} />
      <Tab.Screen name='NewDocument' component={NewDocument} />
    </Tab.Navigator>
  )
}

const StackScreen = () => {
  const {isLoggedIn} = useContext(AuthContext)
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
  )
}

const Navigator = () => {
  return (
    <NavigationContainer>
      <StackScreen />
    </NavigationContainer>
  )
}

export default Navigator
