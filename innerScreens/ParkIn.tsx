import { useState, useEffect } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, TouchableOpacity, Text, Modal,Image } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { getOrgId, getOrgName, getUser } from '../services/authService';

import { ParkingService, VehicleTypeService , ParkingTypeService } from '../services/ParkingService';
import React from 'react';

export default function ParkInScreen() {
  const [orgRecordId, setOrgRecordId] = useState('')
  const [orgName, setOrgName] = useState('')
  const [driver, setDriver] = useState('')
  const [gender, setGender] = useState('')
  const [phone, setPhone] = useState('')
  const [plate, setPlate] = useState('')  
  const [parkType, setParkType] = useState('')
  const [vehicleModel, setVehicleModel] = useState('')
  const [createdBy, setCreatedBy] = useState('')  
  const [updatedBy, setUpdatedBy] = useState('')
  const [vehicleType, setVehicleType] = useState<any[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);  
  const [parkingTypes, setParkingTypes] = useState<any[]>([]);
  const [selectedParking, setSelectedParking] = useState(null);
  const [selectedGender, setSelectedGender] = useState(null);
  const [user, setUser] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const loadOrg = async () => {const org = await getOrgId(); setOrgRecordId(org);};
    loadOrg();    
    const loadOrgName = async () => {const orgN = await getOrgName();setOrgName(orgN);};
    loadOrgName();      
    const loadUserName = async () => {const userName = await getUser(); setUser(userName);};
    loadUserName();    
    VehicleTypeService.getAll().then(setVehicleType);
  }, []);
  useEffect(() => {
    ParkingTypeService.getAll().then(setParkingTypes);
  }, []);

  //console.log("vehicleTypes typeof: "+vehicleTypes)
  //console.log("vehicleTypes: "+JSON.stringify(vehicleTypes))

  const submitParkin = async () => {
    //alert(plate)
    try {
      const result = await ParkingService.parkIn({
      orgRecordId: orgRecordId,
      driver: driver,
      gender: gender,
      phone: phone,
      plate: plate,
      parkType: selectedParking,
      vehicleType: selectedVehicle,
      vehicleModel: vehicleModel,
      createdBy: user,
      updatedBy: user
      });

      if(result.STATUS){
        if(result.WARN)
          Alert.alert('Warning',`Vehicle parked with warning ${result.WARN}`);
        else
          setVisible(true)
      }else{
        Alert.alert('Park-In Failed', result.ERROR);
      }  

    } catch (e) {
      Alert.alert('Error', 'Failed to park in because >> '+e);
    }
    
  };

  const reset = ()=>{
    setDriver('')
    setGender('')
    setPhone('')
    setPlate('')
    setParkType('')
    setVehicleModel('')
    setSelectedParking('')
    setSelectedVehicle('')
  }

  return (
    <View style={styles.container}>  
        <TouchableOpacity
          key='0'
          style={styles.topBlock}
        >
          <Text style={styles.topBlockText}>Park In</Text>
        </TouchableOpacity>
      <View style={styles.innerContainer}>  

      <TextInput
        placeholder="Organization ID"
        value={'Org: '+orgName}
        readOnly      
      />      
      <TextInput
        placeholder="Plate Number"
        value={plate}
        style={styles.input}
        onChangeText={setPlate}
      />      
      <TextInput
        placeholder="Phone Number"
        value={phone}
        style={styles.input}
        onChangeText={setPhone}
      />
      <Dropdown
        style={styles.input}
        data={parkingTypes}
        labelField="name"
        valueField="name"
        placeholder="Select Parking type"
        value={selectedParking}
        onChange={item => setSelectedParking(item.name)}
      />
      <Dropdown
        style={styles.input}
        data={vehicleType}
        labelField="name"
        valueField="name"
        placeholder="Select vehicle type"
        value={selectedVehicle}
        onChange={item => setSelectedVehicle(item.name)}
      />
      <TextInput
        placeholder="Vehicle Model"
        value={vehicleModel}
        style={styles.input}
        onChangeText={setVehicleModel}
      />
      <TextInput
        placeholder="Driver Name"
        value={driver}
        style={styles.input}
        onChangeText={setDriver}
      />
      <Dropdown
        style={styles.input}
        data={[{"id":'1', "name":'Male'}, {"id":'2', "name":'Female'}]}
        labelField="name"
        valueField="name"
        placeholder="Select Gender"
        value={selectedGender}
        onChange={item => setSelectedGender(item.name)}
      />

      <View style={styles.buttonContainer}>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={submitParkin} >
            <Text style={styles.text} >Park-In</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={reset} >
            <Text style={styles.text} >Reset</Text>
          </TouchableOpacity>
      </View>
      </View>
      </View>
        <Modal transparent={true} visible={visible} animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.alertBox}>
            <Image
              source={require('../assets/successtick.png')} // your thick checkmark image
              style={styles.icon}
            />
            <Text style={styles.alertText}>Success!</Text>
            <TouchableOpacity style={styles.closeButton} onPress={() => setVisible(false)}>
              <Text style={styles.text}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    paddingTop: 20
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
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
  buttonContainer:{
    flex: 1,
    justifyContent: 'center', // Space buttons evenly
    alignItems: 'center',   // Align vertically in the middle
  },
    buttonRow: {
    flexDirection: 'row',
    width: '100%',               // cover 80% of screen width
  },
  button: {
    flex: 1,                    // equal width for both buttons
    backgroundColor: '#007AFF',
    marginHorizontal: 5,        // spacing between buttons
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  topBlock: {
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBlockText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertBox: {
    width: 250,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  icon: { width: 100, height: 100, marginBottom: 10 },
  alertText: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign:'center' },
  closeButton: { backgroundColor: '#007AFF', padding: 10, borderRadius: 8, width:'100%', textAlign: 'center'},
});