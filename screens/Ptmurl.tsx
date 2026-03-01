import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';
import { View, Text, StyleSheet, Button, ActivityIndicator, Alert } from 'react-native';
import * as Location from 'expo-location';
import React,{ useState, useEffect, useRef  } from 'react';
import { useCameraPermissions } from 'expo-camera';
import { getToken, getUser, PTM_PAGE_URL} from '../services/authService'; // Your local storage utils
import { useNavigation } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';

type PtmurlProps = {
  route: RouteProp<{ params: { [key: string]: any } }, 'params'>;
};

export default function Ptmurl({route}: PtmurlProps) {
  
  const { request } = route.params;
  const webviewRef = useRef<WebView>(null);
 
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  //const [facing, setFacing] = useState<CameraType>('back');
  //const [permission, requestPermission] = Camera.useCameraPermissions();
  const [permission, requestPermission] = useCameraPermissions();
  const [token, setToken] = React.useState<string | null>(null);
  const [username, setUser] = React.useState<string | null>(null);
  const [url, setUrl] = React.useState<string | null>(null);
  //const route = useRoute();
  //const { pageUrl } = route.params as { pageUrl: string };
  var latlng: string ="default";
  //latlng = `123&456`
  
    const handleMessage = (event: { nativeEvent: { data: any; }; }) => {
      const navigation = useNavigation();
      const message = event.nativeEvent.data;
      Alert.alert('Loggout from server', message); // Do anything with it
    };

  useEffect(() => {(async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (!permission) {
            requestPermission();
          }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      latlng = `${latitude}&${longitude}`
      //setLocation(location);
    })();



    async function loadToken() {
      const storedToken = await getToken();
      setToken(storedToken);      
      const storedUser = await getUser();
      setUser(storedUser);
      
    }
    loadToken();
  }, []);

  if (request==='triplogging' || request==='summary' ){

    //console.log("rqst: "+request)
  }
  if (!token) return null; // Or show loading

  if (!permission && request==='triplogging') {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted && request==='triplogging') {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to use the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }
  
  const payload = {
    token,
    username,
  };

  const script = `
    window.dispatchEvent(new CustomEvent('SecureToken', {
      detail: ${JSON.stringify(payload)}
    }));
    true;
  `;

  const ptmUrl= PTM_PAGE_URL +`/${request}/`+latlng;
  //console.log(`url: `+ptmUrl)
  //console.log(`token: `+token)
  return (
    <WebView
        geolocationEnabled={ true }
        //injectedJavaScript={ getGeoLocationJS() }
        javaScriptEnabled={ true }
        onMessage={handleMessage}
        injectedJavaScriptBeforeContentLoaded={`window.isNativeApp = true; true;`}
        //originWhitelist={[ptmUrl]}
        originWhitelist={['*']}
        ref={webviewRef} // ✅ attach the ref here
        source={{ uri: ptmUrl, headers: { Authorization: `Bearer ${token}`, },}}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false} // For iOS
        domStorageEnabled={true}
        startInLoadingState={true}
        mixedContentMode="compatibility"

        onLoadEnd={() => {
          if (webviewRef.current) {
            webviewRef.current.injectJavaScript(script);
          }
        }}
        style={styles.container}
        renderLoading={()=>(
          <View style={{flex: 1}}>
            <ActivityIndicator size='large' color="lightskyblue"/>
          </View>         
        )}
        //onLoad={console.log(ptmUrl+": Loaded!")}
      />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
  buttonView:{
    justifyContent:'flex-end',
    flex: 2,
    marginBottom:10,
  },
  message:{
    fontSize: 30,
    justifyContent:'center',
    fontWeight: 'bold',
  }
});


