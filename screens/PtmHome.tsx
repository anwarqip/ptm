import React, { useEffect } from 'react';
import Constants from 'expo-constants';
import { View,StyleSheet, Button, Image, ImageBackground, TextInput, TouchableOpacity,Text, Alert } from 'react-native';
import { removeToken } from '../utils/auth';
import { logout } from '../services/authService';

 const HomeScreen = ({navigation}: any) =>{

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Login'); // Replaces Home with Dashboard
    }, 5000); // 5 seconds

    return () => clearTimeout(timer); // Clean up timer if unmounted early
  }, [navigation]);

  
  async function handleLogout() {
    await logout();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });

    
  }

  return (
        <ImageBackground source={require('../assets/splash.png')} style={styles.backgroundImage}>
          <View style={styles.myview}>
              <Text style={styles.welcomeText}>Welcome</Text>
              <Text style={styles.welcomeText}>To</Text>
              <Text style={styles.welcomeText}>PTM</Text>
          </View>
        
          <View style={styles.buttonView}>

              <Button title="Start" onPress={handleLogout}/>
          </View>

        </ImageBackground>
  );
}
export default HomeScreen

const styles = StyleSheet.create({
  container: {
    marginTop: Constants.statusBarHeight,

  },
  button: {
    flex: 1,
    fontSize: 30
  },
  backgroundImage:{
    flex: 1,
    flexDirection: 'column'
  },
  welcomeText:{
    fontSize: 40,
    fontWeight: 'bold',
  },
  myview:{
    alignItems: 'center',
    marginTop: 50
  },
  buttonView:{
    justifyContent:'flex-end',
    flex: 2,
    marginBottom:10,
  }
});
