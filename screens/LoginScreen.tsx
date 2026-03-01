import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { login, changePwd, saveToken, biometricLogin, saveUser, saveUserId, saveOrgId, saveOrgName, 
  savePtmServices, getUser, getUserPwd, getUserId, getUserAccountStatus, getUserApprovalStatus, getUserStatus, 
  getOrgStatus, saveOrgStatus,saveUserAccountStatus,saveUserApprovalStatus,saveUserStatus,
  savePwd} from '../services/authService';

export default function LoginScreen({ navigation, route }) {
  let [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showUsername, setShowUsername] = useState(false);
  const [isPwdReset, setIsPwdReset] = useState(false);
  const [isAccessAlowed, setIsAccessAlowed] = useState(false);
  const { request } = route.params || {}; //;



  useEffect(() => {
  const checkUser = async () => {
    const user = await getUser(); // adjust according to your service
    const pwd = await getUserPwd(); // adjust according to your service
    // Example: hide username if user has some property
    if (user) {
      setEmail(user);
      setShowUsername(false);
    }else
      setShowUsername(true);
  };

  checkUser();
}, []);

   useEffect(() => {
  const checkAccess = async () => {
    if(request==='changePwd'){
      setIsPwdReset(true);
    }
    const userStatus = await getUserStatus(); // adjust according to your service
    const userAccouintStatus = await getUserAccountStatus(); // adjust according to your service
    const userApprovalStatus = await getUserApprovalStatus(); // adjust according to your service
    const orgStatus = await getOrgStatus(); // adjust according to your service
    // Example: hide username if user has some property
    if (userStatus.toLowerCase()=='active' && (userAccouintStatus.toLowerCase()=='active' || userAccouintStatus.toLowerCase()=='registered') && userApprovalStatus.toLowerCase()=='approved' && orgStatus.toLowerCase()=='active') {
      setIsAccessAlowed(true);
    }
    else if (userStatus.toLowerCase()=='' && userAccouintStatus.toLowerCase()=='' && userApprovalStatus.toLowerCase()=='' && orgStatus.toLowerCase()=='') {
      setIsAccessAlowed(true);
    }else
      setIsAccessAlowed(false);
  };

  checkAccess();
}, []); 

  async function handleLogin() {
    setIsAccessAlowed(false);       

    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }
    setLoading(true);
    try {
      const userDetail = await login(email, password);
      console.log("userDetail: "+JSON.stringify(userDetail));
      if (userDetail.token) {
        await saveToken(userDetail.token);
        await saveUser(userDetail.user.username);
        await savePwd(userDetail.user.username);
        await saveUserId(String(userDetail.user.id));
        await saveOrgId(String(userDetail.user.orgRecordId));
        await saveOrgName(JSON.stringify(userDetail.user.orgName));
        await savePtmServices(userDetail.user.orgServices);

        await saveOrgStatus(userDetail.user.orgStatus);
        await saveUserAccountStatus(userDetail.user.userAccountStatus);
        await saveUserApprovalStatus(userDetail.user.userApprovalStatus);
        await saveUserStatus(userDetail.user.userStatus);
      }
        navigation.replace('MainTabs');

    } catch (error: any) {
      Alert.alert('Login Failed', error.message);
    } finally {
      setLoading(false);
    }
  }

    async function handlePwdReset() {
    if (!password) {
      Alert.alert('Error', 'Please enter password and Confirm Password.');
      return
    }
    else if(password!=confirmPassword){
      Alert.alert('Error', 'Password do not match.');
      return
    }

    setLoading(true);

    try {
      const userDetail = await changePwd(password);
        if(userDetail){
          setIsPwdReset(false);
          setConfirmPassword('');
          setPassword('');
        }
    }catch(error){

    }  finally {
      setLoading(false);
    }  
  }
  async function handleBiometricLogin() {
    try {
      const token = await biometricLogin();
      if (token) {
        Alert.alert('Success', 'Biometric login successful!');
        navigation.replace('MainTabs');
      }
     
    } catch (error: any) {
      Alert.alert('Biometric Login Failed', error.message);
    }
  }

  async function resetApp() {
    await saveOrgStatus('');
    await saveUserAccountStatus('');
    await saveUserApprovalStatus('');
    await saveUserStatus('');
    Alert.alert("Success","App Reset Success. Close and Open Again")
  }

  return (
    <View style={styles.container}>
    {loading && (
      <View style={styles.container}>
      <TouchableOpacity  >        
        <Text style={styles.title}>Please Wait ...</Text>
      </TouchableOpacity>
      <Text ></Text>

    </View>
      )}    

    {!loading && !isPwdReset && isAccessAlowed && (
      <View style={styles.container}>
      {showUsername &&(
        <Text style={styles.title}>Welcome</Text>)}
      {!showUsername &&(
        <Text style={styles.title}>Welcome Back</Text>)}

      {showUsername && (<TextInput
        placeholder="Email, Username or Phone"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      )}
      <TextInput
        placeholder="Password or PIN"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button
        title={loading ? 'Logging in...' : 'Login'}
        onPress={handleLogin}
        disabled={loading}
      />
      <Text ></Text>

      <Button
        title="Login with Biometrics"
        onPress={handleBiometricLogin}
      />
    </View>)}
    {!loading && !isPwdReset && !isAccessAlowed && (
        <View style={styles.container}>
        <TouchableOpacity onLongPress={resetApp} >        
          <Text style={styles.title}>Access Denied</Text>
          <Text style={styles.title}>Please Contact Service Desk</Text>
        </TouchableOpacity>
        <Text ></Text>

      </View>
    )}
      {!loading && isPwdReset && isAccessAlowed && (<View style={styles.container}>
      <Text style={styles.title}>Change Password</Text>

      <TextInput
        placeholder="Email, Username or Phone"
        style={styles.input}
        value={email}
        readOnly = {true}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
   
      <TextInput
        placeholder="Password or PIN"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />   
      <TextInput
        placeholder="Confirm Password or PIN"
        style={styles.input}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <Button
        title={loading ? 'Logging in...' : 'Change Password'}
        onPress={handlePwdReset}
        disabled={loading}
      />

    </View>)}
</View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  button:{
    paddingBottom: 5
  }
});
