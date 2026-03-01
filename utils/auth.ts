import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';

// Store token securely
export async function saveToken(token: string) {
  await SecureStore.setItemAsync('userToken', token);
}

// Retrieve token
export async function getToken(): Promise<string | null> {
  return await SecureStore.getItemAsync('userToken');
}

// Remove token
export async function removeToken() {
  await SecureStore.deleteItemAsync('userToken');
}

// Optional: Validate token with server
export async function validateToken(token: string): Promise<boolean> {
  try {
    const res = await fetch('https://ptm.kedmewyizezu.com.et/validate-token', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return res.ok;
  } catch {
    return false; // fallback logic will handle offline
  }
}

// Optional: Biometric login
export async function biometricLogin(): Promise<boolean> {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  const isEnrolled = await LocalAuthentication.isEnrolledAsync();

  if (hasHardware && isEnrolled) {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Login with Biometrics',
      fallbackLabel: 'Enter Password',
    });
    return result.success;
  }
  return false;
}
