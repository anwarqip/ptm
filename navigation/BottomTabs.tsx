import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { getPtmServices } from '../services/authService';


import PtmCommon from '../screens/PtmCommonApps';
import PtmTrip from '../screens/PtmTrip';
import PtmParking from '../screens/PtmParking';
import {  getUserAccountStatus, getUserApprovalStatus, getUserStatus,  getOrgStatus} from '../services/authService';

const Tab = createBottomTabNavigator();

export default function MainTabs({ navigation }: any) {
const [services, setServices] = useState<string[] | null>(null);

  useEffect(() => {
    const loadServices = async () => {
      const srv = await getPtmServices();
      setServices(srv);
    };
    loadServices();
  }, []);

     useEffect(() => {
    const checkAccess = async () => {
      const userStatus = await getUserStatus(); // adjust according to your service
      const userAccouintStatus = await getUserAccountStatus(); // adjust according to your service
      const userApprovalStatus = await getUserApprovalStatus(); // adjust according to your service
      const orgStatus = await getOrgStatus(); // adjust according to your service
      // Example: hide username if user has some property
      if (userStatus.toLowerCase()=='active' && (userAccouintStatus.toLowerCase()=='active' || userAccouintStatus.toLowerCase()=='registered') && userApprovalStatus.toLowerCase()=='approved' && orgStatus.toLowerCase()=='active') {
      }
      else
        navigation.replace('Login');
    };
  
    checkAccess();
  }, []); 

  if (services === null) {
    return null; // or splash / loader
  }else{
    //console.log("Services: "+services)
  }
  

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName: any;

          if (route.name === 'Trip') iconName = 'car';
          if (route.name === 'Parking') iconName = 'trail-sign-outline';
          if (route.name === 'Other') iconName = 'apps';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
      })}
    >

        {services.includes('tripSrv') && (
          <Tab.Screen name="Trip" component={PtmTrip} />
        )}
        {services.includes('parkingSrv') && (
          <Tab.Screen name="Parking" component={PtmParking} />
        )}
        <Tab.Screen name="Other" component={PtmCommon} />
         
    </Tab.Navigator>
  );
}
