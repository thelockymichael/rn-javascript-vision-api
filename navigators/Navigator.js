import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Octicons, FontAwesome, AntDesign} from '@expo/vector-icons';
import React, {useContext} from 'react';
import {Button, Text, Icon} from 'native-base';
import {AuthContext} from '../contexts/AuthContext';
import Login from '../views/Login';
import Modify from '../views/Modify';
import Profile from '../views/Profile';
import MyFiles from '../views/MyFiles';
import Search from '../views/Search';
import Single from '../views/Single';
import NewDocument from '../views/NewDocument'
import {
  Platform,
} from 'react-native'
import Colors from '../constants/Colors'

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

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
  }
}

const defaultStackNavOptions = ({navigation}) => {
  return {
    headerStyle: {
      backgroundColor: Platform.OS === 'android' ?
        Colors.primaryColor : 'white',
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
            headerTitleStyle: {
              color: '#23527c'
            },
            headerRight: () => (
              <Button style={{backgroundColor: 'transparent', elevation: 0, marginRight: 10}}
                onPress={() => navigation.navigate('Profile')}
              >
                <FontAwesome name="cog" size={40} color="#23527c" />
              </Button>
            ),
          })} name="Home" component={
          
          } />
          <Stack.Screen
            name="Single"
            component={Single}
            options={defaultStackNavOptions}
          />
          <Stack.Screen
            name="Profile"
            component={Profile}
          />
          <Stack.Screen
            name="NewDocument"
            options={
              defaultStackNavOptions
            }
            component={NewDocument}
          // options={defaultStackNavOptions}
          />
          <Stack.Screen
            name="MyFiles"
            component={MyFiles}
          />
          <Stack.Screen
            name="Modify"
            component={Modify}
          />
        </>
      ) : (
          <>
            <Stack.Screen options={{
              headerTitleStyle: {
                alignSelf: 'center',
                color: '#23527c'
              }
            }} name="Authentication" component={Login} />
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
