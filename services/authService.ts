import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';
import { Alert } from 'react-native';



export const PTM_API_URL = "https://ptm.kedmewyizezu.com.et";
//export const PTM_API_URL =  'http://192.168.137.30:5055';
//export const PTM_PAGE_URL =  `http://192.168.137.30:4200`;
//export const PTM_API_URL =  `http://192.168.43.219:5055`;
//export const PTM_PAGE_URL =  `http://192.168.43.219:4200`;
//export const PTM_PAGE_URL =  `https://ptm.kedmewyizezu.com.et`;
// API call to login
export async function login(email: string, password: string) {

  try {
    console.log('Login url: '+PTM_API_URL+'/pmi/users/login')
    const response = await fetch(PTM_API_URL+'/pmi/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    console.log("Login Response: "+JSON.stringify(response))
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error('Login failed! '+errorData.error  );
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function changePwd(password: string) {
  const url_pwdTRst = PTM_API_URL+'/pmi/users/pwdreset'
  const id = await getUserId()
  //console.log(id+": url_pwdTRst: "+url_pwdTRst)
    const response = await fetch(url_pwdTRst, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, password }),
    });

    //console.log("Pwd Rst Result:"+JSON.stringify(response))
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error('Login failed! '+errorData.message  );
    }else{
      Alert.alert("Sucess", "Password Reset Successfull")
    }
    return true;
}

// Save token securely
export async function saveToken(token: string) {
  await SecureStore.setItemAsync('auth_token', token);
}
// Save User securely
export async function saveUser(ptmUser: string) {
  await SecureStore.setItemAsync('ptm_user', ptmUser);
}
// Save User id
export async function saveUserId(ptmUserId: string) {
  await SecureStore.setItemAsync('ptm_user_id', ptmUserId);
}
// Save User id
export async function savePwd(ptmUserPwd: string) {
  await SecureStore.setItemAsync('ptm_user_pwd', ptmUserPwd);
}
// Save User status Ative/Inactive
export async function saveUserStatus(ptmUserStatus: string) {
  await SecureStore.setItemAsync('ptm_user_status', ptmUserStatus);
}
// Save User account status locked, expired, Active
export async function saveUserAccountStatus(ptmUserAccountStatus: string) {
  await SecureStore.setItemAsync('ptm_user_acc_status', ptmUserAccountStatus);
}
// Save User securely Approved or not
export async function saveUserApprovalStatus(ptmUserApprovalStatus: string) {
  await SecureStore.setItemAsync('ptm_user_apprv_status', ptmUserApprovalStatus);
}
// Save org securely
export async function saveOrgId(ptmOrgId: string) {
  await SecureStore.setItemAsync('ptm_org_id', ptmOrgId);
}

export async function saveOrgName(ptm_org_name: string) {
  await SecureStore.setItemAsync('ptm_org_name', ptm_org_name);
}

export async function saveOrgStatus(ptm_org_status: string) {
  await SecureStore.setItemAsync('ptm_org_status', ptm_org_status);
}

// Get saved token
export async function getToken() {
  return await SecureStore.getItemAsync('auth_token');
}
// Get saved user
export async function getUser() {
  return await SecureStore.getItemAsync('ptm_user');
}

export async function getUserId() {
  return await SecureStore.getItemAsync('ptm_user_id');
}

export async function getUserPwd() {
  return await SecureStore.getItemAsync('ptm_user_pwd');
}

export async function getUserStatus() {
  return await SecureStore.getItemAsync('ptm_user_status');
}

export async function getUserAccountStatus() {
  return await SecureStore.getItemAsync('ptm_user_acc_status');
}

export async function getUserApprovalStatus() {
  return await SecureStore.getItemAsync('ptm_user_apprv_status');
}

export async function getOrgId() {
  return await SecureStore.getItemAsync('ptm_org_id');
}

export async function getOrgName() {
  return await SecureStore.getItemAsync('ptm_org_name');
}

export async function getOrgStatus() {
  return await SecureStore.getItemAsync('ptm_org_status');
}

// Delete token
export async function deleteToken() {
  await SecureStore.deleteItemAsync('auth_token');
}
// Delete token
export async function deleteUser() {
  await SecureStore.deleteItemAsync('ptm_user');
}

// Logout (clear token)
export async function logout() {
  await deleteToken();
  await deleteUser();
 
  //console.log("Token after Delete: "+ JSON.stringify(getToken()))
  //console.log("User after Delete: "+  JSON.stringify(getUser()))
}

const SERVICES_KEY = 'orgServices';

export async function savePtmServices(services: string[]) {
  await SecureStore.setItemAsync(
    SERVICES_KEY,
    JSON.stringify(services)
  );
}

export async function getPtmServices(): Promise<string[]> {
  const value = await SecureStore.getItemAsync(SERVICES_KEY);
  return value ? JSON.parse(value) : [];
}
// Biometric Login (fingerprint/faceID)
export async function biometricLogin() {
  const isBiometricAvailable = await LocalAuthentication.hasHardwareAsync();
  const savedBiometrics = await LocalAuthentication.isEnrolledAsync();

  if (!isBiometricAvailable || !savedBiometrics) {
    throw new Error('Biometric authentication is not available');
  }

  const biometricAuth = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Login with Biometrics',
    fallbackLabel: 'Enter Password',
    disableDeviceFallback: false,
  });

  if (!biometricAuth.success) {
    throw new Error('Biometric authentication failed');
  }

  const token = await getToken();
  if (!token) {
    throw new Error('No token saved, please login manually first.');
  }

  return token; // Return saved token if biometric success
}

// Validate token with server
export async function validateToken(token: string) {

  try {
    const response = await fetch(PTM_API_URL+'/validate-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // send token in Authorization header
      },
    });

    if (!response.ok) {
      throw new Error('Invalid token');
    }

    const data = await response.json();
    return data.valid; // true or false
  } catch (error) {
    //console.log("AuthService Tocken Validation Error: "+error)
    return false;
  }
}

// Refresh token (get a new one, assuming a valid token is given)
export async function refreshToken(oldToken: string) {
  try {
    const response = await fetch(PTM_API_URL+'/refresh-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${oldToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const data = await response.json();
    return data.newToken; // Return the new token
  } catch (error) {
    throw new Error('Token refresh failed');
  }
}
