import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import {
  NavigationContainer,
  getFocusedRouteNameFromRoute,
} from '@react-navigation/native'
import {
  HeaderButtons,
  Item,
} from 'react-navigation-header-buttons'
import CustomHeaderButton from '../components/HeaderButton'
import {createStackNavigator} from '@react-navigation/stack'
import {Octicons, FontAwesome, AntDesign} from '@expo/vector-icons'
import React, {useContext, useEffect} from 'react'
import {Button, Text, Icon} from 'native-base'
import {AuthContext} from '../contexts/AuthContext'
import Login from '../views/Login'
import Modify from '../views/Modify'
import Profile from '../views/Profile'
import MyFiles from '../views/MyFiles'
import Favourites from '../views/Favourites'
import Search from '../views/Search'
import Single from '../views/Single'
import NewDocument from '../views/NewDocument'
import ChangeName from '../views/changeUserSettings/ChangeName'
import ChangeEmail from '../views/changeUserSettings/ChangeEmail'
import ChangePassword from '../views/changeUserSettings/ChangePassword'
import {Platform} from 'react-native'
import Colors from '../constants/Colors'

const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()

const getHeaderTitle = (route) => {
  // If the focused route is not found,
  // we need to assume it's the initial screen
  // This can happen during if there hasn't
  // been any navigation inside the screen
  // In our case, it's "Feed" as that's the
  // first screen inside the navigator}

  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Search'

  switch (routeName) {
    case 'Search':
      return 'Search'
    case 'MyFiles':
      return 'My Documents'
    case 'Favourites':
      return 'Favourites'
  }
}

const defaultStackNavOptions = ({navigation}) => {
  return {
    headerStyle: {
      backgroundColor:
        Platform.OS === 'android' ? Colors.primaryColor : 'white',
    },
    headerTitleStyle: {
      fontFamily: 'Roboto_medium',
    },
    // Affects only iOS
    headerBackTitleStyle: {
      fontFamily: 'Roboto_medium',
    },
    headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primaryColor,
    // headerTitle: "A Screen",
    // eslint-disable-next-line react/display-name
  }
}

const TabScreen = ({navigation, route}) => {
  useEffect(() => {
    navigation.setOptions({headerTitle: getHeaderTitle(route)})
  }, [navigation, route])
  return (
    <Tab.Navigator
      initialRouteName='My Documents'
      tabBarOptions={{
        activeTintColor: Colors.accentColor,
        safeAreaInsets: {bottom: 10},
      }}
      style={{flex: 1}}
    >
      <Tab.Screen
        name='Search'
        component={Search}
        options={{
          tabBarIcon: ({color, size}) => (
            // Näiden värejä pitäis saada muutettua
            <Octicons name='search' size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name='MyFiles'
        component={MyFiles}
        options={{
          tabBarLabel: 'My Documents',
          tabBarIcon: ({color, size}) => (
            // Myös tämän väri
            <AntDesign name='copy1' size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name='Favourites'
        component={Favourites}
        options={{
          tabBarIcon: ({color, size}) => (
            // Myös tämän väri
            <AntDesign name='heart' size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  )
}
const StackScreen = () => {
  const {isLoggedIn} = useContext(AuthContext)
  return (
    <Stack.Navigator>
      {isLoggedIn ? (
        /* here it code for the top header*/ <>
          <Stack.Screen
            options={({navigation, route}) => ({
              headerStyle: {
                backgroundColor:
                  Platform.OS === 'android' ? Colors.primaryColor : 'white',
              },
              headerTitleStyle: {
                fontFamily: 'Roboto_medium',
              },
              // Affects only iOS
              headerBackTitleStyle: {
                fontFamily: 'Roboto_medium',
              },
              headerTintColor: Platform.OS === 'android' ?
                'white' : Colors.primaryColor,
              headerRight: () => (
                <HeaderButtons
                  HeaderButtonComponent={CustomHeaderButton}
                >
                  <Item
                    title="profile"
                    iconName="ios-settings"
                    onPress={() => navigation.navigate('Profile')}
                  />
                </HeaderButtons>
              ),
            })}
            name='Home'
            component={TabScreen}
          />
          <Stack.Screen
            name='Single'
            component={Single}
            options={defaultStackNavOptions}
          />
          <Stack.Screen name='Profile' component={Profile} />
          <Stack.Screen
            name='NewDocument'
            options={defaultStackNavOptions}
            component={NewDocument}
          />
          <Stack.Screen
            name='MyFiles'
            options={defaultStackNavOptions}
            component={MyFiles}
          />
          <Stack.Screen
            name='Modify'
            options={defaultStackNavOptions}
            component={Modify}
          />
          <Stack.Screen
            name='ChangeName'
            options={defaultStackNavOptions}
            component={ChangeName}
          />
          <Stack.Screen
            name='ChangeEmail'
            options={defaultStackNavOptions}
            component={ChangeEmail}
          />
          <Stack.Screen
            name='ChangePassword'
            options={defaultStackNavOptions}
            component={ChangePassword}
          />
        </>
      ) : (
          <>
            <Stack.Screen
              options={{
                headerTitleStyle: {
                  alignSelf: 'center',
                  color: '#23527c',
                },
              }}
              name='Authentication'
              component={Login}
            />
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
