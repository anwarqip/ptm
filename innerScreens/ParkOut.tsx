import { useState, useEffect } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, TouchableOpacity, Text, Modal,Image, 
  ScrollView, KeyboardAvoidingView, Platform, 
  FlatList,
  TouchableWithoutFeedback,
  Keyboard} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { getOrgId, getOrgName, getUser } from '../services/authService';

import { ParkingService, VehicleTypeService , ParkingTypeService, formatDate } from '../services/ParkingService';
import React from 'react';

export default function ParkOutScreen({ navigation }) {
  const [orgRecordId, setOrgRecordId] = useState('')
  const [orgName, setOrgName] = useState('')
  const [plate, setPlate] = useState('')  
  const [reference, setReference] = useState('')  
  const [visible, setVisible] = useState(false);
  const [visibleParkingList, setVisibleParkingList] = useState(false);
  const [activeParkings, setActiveParkings] = useState<{pid?: number, plate?: string, phone?: string, driver?: string, parkInTime?: string, parkOutTime?: string, parkDurationMinutes?: string, status?: string, parkType?: string, vehicleType?: any, orgRecordId?: number, amount?: string, WARN_CODE?: string, WARN_MSG?: string, reference?: string} | null>(null);
  const [allActiveParking, setAllActiveParking] = useState(null);
  const [parkOutData, setParkOutData] = useState(null);
  
//  activeParkings = Array.isArray(p) ? p : [p];
  const search = async (serachPlate: any) => {
    try{
      if(serachPlate){
        setVisibleParkingList(false)
        const result = await ParkingService.serachParked(serachPlate)
        setPlate(serachPlate)

        setActiveParkings(result)
        //console.log("ParkOur Result: "+JSON.stringify(result))
        //const po = Array.isArray(activeParkings) ? activeParkings : [activeParkings]
        //setParkOutData(po)
      }else{
        Alert.alert("Error","Invalid Plate")
      }
    }catch(e){
      Alert.alert("Error","Failed to search for parked vehicle >> "+e)
    }
  }
  const submitParkout = async () => {
    if(activeParkings){
      try {
        const result = await ParkingService.parkOut(activeParkings)
        console.log("ParkOut Result: "+JSON.stringify(result))
        if(result){
           // navigation.navigate('PtmReceipt', { parking:activeParkings, parkoutPayment:result})
        setVisible(true)
        }else{
          Alert.alert('Park-Out Failed','No Parkout Data returned');
        }  
    
        } catch (e) {
          Alert.alert('Error', 'Failed to park-out because >> '+e);
        }
    }
  }
  const closeParkoutConfirmation = () => {
    setVisible(false)
    navigation.navigate('MainTabs')
  }
  const getActiveParkings = async () => {
      try {
        const result = await ParkingService.getActiveParkings()
        console.log("Acive Parkings: "+JSON.stringify(result))
        if(result){
          setVisibleParkingList(true)
          setAllActiveParking(result)
        }else{
           setVisibleParkingList(false)

          Alert.alert('Success','No Active Parking Found!');
        }  
    
        } catch (e) {
          Alert.alert('Error', 'Failed to load active parkings >> '+e);
        }
  }

  const switchToParkout = async () => {
    setVisibleParkingList(false)
  }

      return (
        <View style={styles.container}>  
          <TouchableOpacity
            key='0'
            style={styles.topBlock}
          >
          <Text style={styles.topBlockText}>Park Out</Text>
        </TouchableOpacity>

      <View style={styles.innerContainer}> 
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
      > 
        {!visibleParkingList && (
        <View style={styles.buttonContainer}>
          <View style={styles.buttonRow}>
            <TextInput
              placeholder="Plate Number"
              value={plate}
              style={styles.input}
              onChangeText={setPlate}
            />   
            <TouchableOpacity style={styles.button} onPress={()=>search(plate)} >
              <Text style={styles.text} >Search</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>ParkID:</Text>
            <Text style={styles.value}>{activeParkings?.pid || ''}</Text>
          </View>          
          <View style={[styles.row, {backgroundColor: activeParkings?.WARN_CODE ? '#ffcccc' : 'transparent',width:'100%'}]}>
            <Text style={[styles.label, {color: activeParkings?.WARN_CODE ? 'red' : 'black',width:'100%'}]}>{ activeParkings?.WARN_CODE ? activeParkings?.WARN_CODE+': '+activeParkings?.WARN_MSG : ''}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Plate:</Text>
            <Text style={styles.value}>{activeParkings?.plate || ''}</Text>
          </View>          
          <View style={styles.row}>
            <Text style={styles.label}>Park-In:</Text>
            <Text style={styles.value}>{formatDate(new Date(activeParkings?.parkInTime || ''))}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Park-Out:</Text>
            <Text style={styles.value}>{formatDate(new Date(activeParkings?.parkOutTime || ''))}</Text>
          </View>          
          <View style={styles.row}>
            <Text style={styles.label}>Duration:</Text>
            <Text style={styles.value}>{activeParkings?.parkDurationMinutes || ''}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Status:</Text>
            <Text style={styles.value}>{activeParkings?.status || ''}</Text>
          </View>          
          <View style={styles.row}>
            <Text style={styles.label}>Payment ETB:</Text>
            <Text style={styles.value}>{activeParkings?.amount || ''}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Park Type:</Text>
            <Text style={styles.value}>{activeParkings?.parkType || ''}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Vehicle Type:</Text>
            <Text style={styles.value}>{activeParkings?.vehicleType || ''}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Reference:</Text>
            <TextInput
              placeholder="Payment Reference"
              value={reference || ''}
              style={styles.input}
              onChangeText={setReference}
            />
          </View>
         <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={submitParkout} >
            <Text style={styles.text} >Park-Out</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={getActiveParkings} >
            <Text style={styles.text} >Active Parkings</Text>
          </TouchableOpacity>
        </View>
        </View>
        
      )}

      </ScrollView>
    </TouchableWithoutFeedback>
  </KeyboardAvoidingView>
      {visibleParkingList && (
        <View style={styles.innerContainer}>
          <Row plate="Plate:" parkintime={'Park-In Time'}/>
            {   
           //   allActiveParking.map((item: { plate: string; parkInTime: any; }, index: any) => (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
> 
               <FlatList
                  data={allActiveParking}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => ( 
                  <TouchableOpacity onPress={() => search(item?.plate )} >
                    <Row 
                      plate={item?.plate} 
                      parkintime={formatDate(new Date(item?.parkInTime || ''))} />
                  </TouchableOpacity>
                  )} 
                />
          </KeyboardAvoidingView>  

              }
        </View> 
        )}

        {visibleParkingList && (
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={switchToParkout} >
            <Text style={styles.text} >Park-Out</Text>
          </TouchableOpacity>
        </View>
        )}
      </View>

        <Modal transparent={true} visible={visible} animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.alertBox}>
            <Image
              source={require('../assets/successtick.png')} // your thick checkmark image
              style={styles.icon}
            />
            <Text style={styles.alertText}>Park Out Success!</Text>
            <TouchableOpacity style={styles.closeButton} onPress={closeParkoutConfirmation}>
              <Text style={styles.text}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const Row = ({ plate, parkintime }: { plate: string; parkintime: string }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{plate}</Text>
    <Text style={styles.value}>{parkintime}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    paddingTop: 20
  },
  innerContainer: {
    flex: 1,
    //justifyContent: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 5,
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
    //marginBottom: 15,
    fontSize: 16,
    width: '60%'
  },
  buttonContainer:{
    flex: 1,
    //justifyContent: 'center', // Space buttons evenly
    alignItems: 'center',   // Align vertically in the middle
    paddingTop: 5,
    //borderColor: '#aaa',
    //borderWidth: 10,    
  },
    buttonRow: {
    flexDirection: 'row',
    width: '100%', 
    paddingBottom: 20 

             // cover 80% of screen width
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between', // pushes label left, value right
    alignItems: 'center',
    marginVertical: 4,
    
  },
  label: {
    fontWeight: 'bold',
  //  flex: 1, // takes available space
    fontSize: 18,
    width:'40%'

  },
  value: {
  //  flex: 2, // allows value to stretch more
    fontSize: 18,
    textAlign: 'left',
    width:'60%'
  },

  icon: { width: 100, height: 100, marginBottom: 10 },
  alertText: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign:'center' },
  closeButton: { backgroundColor: '#007AFF', padding: 10, borderRadius: 8, width:'100%', textAlign: 'center'},
});
