import React ,{ useState, useEffect, useRef  }  from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image, Alert } from 'react-native';
import { logout, getToken } from '../services/authService';
import { syncVehicleTypes, syncParkingTypes } from '../services/ParkingService';

const items = [
    { id: 1, label: 'Case Management', request: 'mobile/mobapp/case', image: require('../assets/casemanagement.png') },
    { id: 2, label: 'Leave Management', request: 'mobile/mobapp/leave', image: require('../assets/leavemanagement.png') },
    { id: 3, label: 'Profile Summary', request: 'mobile/mobapp/profile', image: require('../assets/profilesummary.png') },
    { id: 4, label: 'General Summary', request: 'mobile/mobapp/summary', image: require('../assets/casemanagement.png') },
  ];

  const PtmMainView = ({ navigation }) => {
  //const items = Array.from({ length: 8 }, (_, i) => `Item ${i + 1}`);
  const [token, setToken] = React.useState<string | null>(null);

    useEffect(() => {
    const loadToken = async () => {
      const t = await getToken();
      setToken(t);
    };
    loadToken();
  }, []);

  const handleLongPress = () => {
    Alert.alert(
      "Are you sure, Logout?",
      "Need to re-login",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "OK",
          onPress: () => {
            logout()
            navigation.navigate('Login')
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleSync = async () =>{
    try {
      await syncVehicleTypes(token);
      alert("Sucess")        
      await syncParkingTypes(token);
      alert("Sucess")
      //console.log('Vehicle types synced');
    } catch (e) {
        alert("Error")
      //console.warn('Vehicle type sync failed:', e.message);
    }
  }
  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        key='0'
        style={styles.topBlock}
        //onPress={() => navigation.navigate('Login')}
        onLongPress={handleLongPress}
        delayLongPress={500}          
      >
        <Text style={styles.topBlockText}>Announcement</Text>
      </TouchableOpacity>

        <View style={styles.gridContainer}>
          {   
            items.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.gridItem}
                onPress={() => navigation.navigate('PtmWeb', { request: item.request})}
              >
                <Image source={item.image} style={styles.image} />
                <Text style={styles.itemText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
        </View>

        <View style={styles.gridContainer}>
          {
            <><TouchableOpacity
              style={styles.gridItem}
              onPress={() => handleSync()}
            >
            <Text style={styles.itemText}>{'Sync'}</Text>
            </TouchableOpacity><TouchableOpacity
              style={styles.gridItem}
              onPress={() => navigation.navigate('Login', { request: 'changePwd'})}
            >
              <Text style={styles.itemText}>{'Change Password'}</Text>
            </TouchableOpacity></>
          }
        </View>
    </View>
);
};

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const itemSize = screenWidth / 2 - 20;
const itemHeight = screenHeight / 5 - 20; //130;
const numRows = 4;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 15,
    paddingTop: 20,
  },
  topBlock: {
    flex: 1,
    backgroundColor: '#673AB7',
    borderRadius: 12,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  topBlockText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  gridContainer: {
    height: itemHeight * numRows + 10, // small padding
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: itemSize,
    height: itemHeight,
    backgroundColor: '#2196F3',
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    elevation: 4,
  },
  itemText: {
    color: '#fff',
    fontSize: 14,
    marginTop: 8,
    fontWeight: '600',
  },
  image: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
});

export default PtmMainView;
