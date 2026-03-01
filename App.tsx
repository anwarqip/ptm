import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/PtmHome';
import LoginScreen from './screens/LoginScreen';
import { getToken } from './utils/auth';
import { StyleSheet,ActivityIndicator, View } from 'react-native';
import { validateToken } from './utils/auth';
//import * as LocalAuthentication from 'expo-local-authentication';
import Constants from 'expo-constants';
import PtmWebView from './screens/Ptmurl'
import PtmTrip from './screens/PtmTrip'
import PtmParkIn from './innerScreens/ParkIn'
import PtmParkOut from './innerScreens/ParkOut'
import PtmReceipt from './innerScreens/receipt'
import PtmPriceRule from './innerScreens/PriceRule'
import MainTabs from './navigation/BottomTabs';
import { ReferenceTableService } from './services/ReferenceTableService.ts';

//import { Header } from 'react-native/Libraries/NewAppScreen';

const Stack = createNativeStackNavigator();
export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    async function checkLogin() {
      const token = await getToken();
      if (token) {
        const isValid = await validateToken(token);
        setIsLoggedIn(isValid);
      } else {
        setIsLoggedIn(false);
      }
      setIsLoading(false);
    }

    checkLogin();
  }, []);

    useEffect(() => {
    (async () => {
      await ReferenceTableService.createTables();
    })();
  }, []);


  if (isLoading) {
    return null; // You can show splash here
  }

  //run DB
  

 return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />

        {/* Bottom Navigation */}
        <Stack.Screen name="MainTabs" component={MainTabs} />

        {/* Screens WITHOUT bottom bar */}
        <Stack.Screen name="PtmWeb" component={PtmWebView} />

        {/* Screens WITHOUT bottom bar */}
        <Stack.Screen name="PtmParkIn" component={PtmParkIn} />

        {/* Screens WITHOUT bottom bar */}
        <Stack.Screen name="PtmParkOut" component={PtmParkOut} />
        
        {/* Screens WITHOUT bottom bar */}
        <Stack.Screen name="PtmReceipt" component={PtmReceipt} />

        {/* Screens WITHOUT bottom bar */}
        <Stack.Screen name="PtmPriceRule" component={PtmPriceRule} />
      </Stack.Navigator>
    </NavigationContainer>
  );
  
}

const styles = StyleSheet.create({
  container: {
    marginTop: Constants.statusBarHeight,

    //width: '100%',
    //paddingTop: 50
  },

});