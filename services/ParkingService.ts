import React ,{ useState, useEffect, useRef  }  from 'react';
import { getToken, getUser, PTM_PAGE_URL, PTM_API_URL, getOrgId} from './authService'; // Your local storage utils
import { db } from './database';


async function authHeaders() {
  const token = await getToken();
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}
const sanitize = (obj: any) =>
  JSON.parse(JSON.stringify(obj));

export const ParkingService = {

    printConsole(){
       // console.log("Token: "+token)
        //console.log("API Url: "+PTM_API_URL)
    },

    async parkIn(data: any) {
        //console.log(`${PTM_API_URL}/pmi/parkings/park-in`+" ==> parkin-in Data: "+JSON.stringify(data))
        const safeData = sanitize(data);

        //console.log("Sending data:", safeData);
        const ParkinHeaders = await authHeaders()
        //console.log("Headers:", ParkinHeaders);
        const res = await fetch(`${PTM_API_URL}/pmi/parkings/park-in`, {
            method: 'POST',
            headers: ParkinHeaders,
            body: JSON.stringify(safeData),
        });
        //console.log("Status:", res.status);
        //const text = await res.text();
        //console.log("Raw response:", text);
        //console.log("parkin result:"+JSON.stringify(res))
        return res.json();
    },

    async serachParked(plate: any) {
        //console.log(`${PTM_API_URL}/pmi/parkings/park-in`+" ==> parkin-in Data: "+JSON.stringify(data))

        //console.log("Sending data:", safeData);
        const ParkinHeaders = await authHeaders()
        //console.log("Headers:", ParkinHeaders);
        const res = await fetch(`${PTM_API_URL}/pmi/parkings/active-Plate/${plate}`, {
            method: 'GET',
            headers: ParkinHeaders,
        });
        //console.log("Status:", res.status);
        //const text = await res.text();
        //console.log("Raw response:", text);
        //console.log("parkin result:"+JSON.stringify(res))
        return res.json();
    },

    async parkOut(payload: any) {
      console.log("park Out Payload: "+JSON.stringify(payload))
        const res = await fetch(`${PTM_API_URL}/pmi/parkings/park-out`, {
        method: 'POST',
        headers: await authHeaders(),
        body: JSON.stringify(payload),
        });

        return res.json();
    },
    async getActiveParkings() {
        const orgId = await getOrgId();
        console.log("active-parking url: "+`${PTM_API_URL}/pmi/parkings/active-parking/${orgId}`)
        const res = await fetch(`${PTM_API_URL}/pmi/parkings/active-parking/${orgId}`, {
        //method: 'GET',
        headers: await authHeaders(),
        //body: JSON.stringify(payload),
        });

        return res.json();
    },
    
/*
    async getPriceRules() {
        const res = await fetch(`${PTM_API_URL}/price-rules`, {
            headers: await authHeaders(),
        });

        return res.json();
    },
*/
  /* 
async saveAllVehicleTypes(list: any[]) {
        for (const item of list) {
            await db.runAsync(
                `REPLACE INTO vehicle_type (id, code, name, updatedAt)
                VALUES (?, ?, ?, ?)`,
                item.id,
                item.code,
                item.name,
                Date.now()
            );
        }
    },
*/
/*
    async getAllVehicleTypes() {
        return await db.getAllAsync(`SELECT * FROM vehicle_type`);
    },

*/
/*
    async  fetchVehicleTypes(token: string) {
        const res = await fetch(PTM_API_URL, {
            headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json'
            }
        });

        if (!res.ok) {
            throw new Error('Failed to fetch vehicle types');
        }
        return await res.json();
    },
*/
 /*  
    async syncVehicleTypes(token: string) {
        //console.log("sync Vehicle Types Token: "+token)
        const remoteList = await fetchVehicleTypes(token);
        if (!Array.isArray(remoteList)) {
            throw new Error('Invalid vehicle type response');
        }

            //console.log("Vehicle Type Result: "+ JSON.stringify(remoteList))
        await VehicleTypeService.upsert(remoteList);
        return remoteList.length;
    }
    */
};

export async function fetchDomainTypes(token: string, domain: string) {
    const fetchUrl = `${PTM_API_URL}/pmi/domainconfigs/name/${domain}`
    //console.log("Domain Types Token: "+fetchUrl)
    const res = await fetch(fetchUrl, {
        headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
        }
    });

    if (!res.ok) {
        throw new Error('Failed to fetch vehicle types'+JSON.stringify(res));
    }
    return await res.json();
    //throw new Error('Function not implemented.');
    
}

export const VehicleTypeService = {

  async upsert(list: any[]) {
    await deleteAlltableRecord("vehicle_type")

    for (const item of list) {
      await db.runAsync(
        `INSERT OR REPLACE INTO vehicle_type 
         (id, code, name, updatedAt)
         VALUES (?, ?, ?, ?)`,
        item.id,
        item.code,
        item.name,
        Date.now()
      );
    }
  },

  async getAll() {
    const rows = await db.getAllAsync(
      `SELECT id, name FROM vehicle_type ORDER BY name`
    );

    const vehicleTypes = rows.map((row: any) => ({
            name: row.name,
            id: row.id,
          }));
    return vehicleTypes

  },

    async count() {
        const res = await db.getFirstAsync(
        `SELECT COUNT(*) as total FROM vehicle_type`
        );
        //return res?.total ?? 0;
        return res;
    }
};
export const ParkingTypeService = {
  async upsert(list: any[]) {
    await deleteAlltableRecord("parking_type")
//console.log("Park Type Old Deleted! New is: "+ JSON.stringify(list))
    for (const item of list) {
      await db.runAsync(
        `INSERT OR REPLACE INTO parking_type 
         (id, code, name, updatedAt)
         VALUES (?, ?, ?, ?)`,
        item.id,
        item.code,
        item.name,
        Date.now()
      );
    }
  },

  async getAll() {

    const rows = await db.getAllAsync(
      `SELECT id, name FROM parking_type ORDER BY name`
    );

    const parkingTypes = rows.map((row: any) => ({
            name: row.name,
            id: row.id,
          }));
          //console.log("Parking Type get All: "+JSON.stringify(parkingTypes))
    return parkingTypes

  },

    async count() {
        const res = await db.getFirstAsync(
        `SELECT COUNT(*) as total FROM parking_type`
        );
        //return res?.total ?? 0;
        return res;
    }
};

export async function syncVehicleTypes(token: string) {
  const remoteList = await fetchDomainTypes(token, 'vehicletypes');;
  //console.log("remoteList.length: "+JSON.stringify(remoteList))
  //console.log("remoteList.length: "+ JSON.stringify(JSON.parse(remoteList[0].domainvalues)))
  //console.log("typeof: "+ typeof JSON.parse(remoteList[0].domainvalues))
    const vehicleTypes = convertArrToJson(JSON.parse(remoteList[0].domainvalues))
    //console.log("vehicleTypes: "+JSON.stringify(vehicleTypes))

    //const vehicleTypes = JSON.parse(remoteList[0].domainvalues)
  if (!Array.isArray(vehicleTypes)) {
    throw new Error('Invalid vehicle type response');
  }

  await VehicleTypeService.upsert(vehicleTypes);

  return vehicleTypes.length;
}

export async function syncParkingTypes(token: string) {
  const remoteList = await fetchDomainTypes(token,'parkingtype');;
    const parkingTypes = convertArrToJson(JSON.parse(remoteList[0].domainvalues))
    //console.log("parkingTypes: "+JSON.stringify(parkingTypes))

    //const vehicleTypes = JSON.parse(remoteList[0].domainvalues)
  if (!Array.isArray(parkingTypes)) {
    throw new Error('Invalid Parking type response');
  }

  await ParkingTypeService.upsert(parkingTypes);

  return parkingTypes.length;
}

function convertArrToJson(arr: string[]) {
  return arr.map((item, index) => ({
    id: index + 1,
    code: item,
    name: item
    }));
}
async function deleteAlltableRecord(tableName: string){
    await db.runAsync(`DELETE from ${tableName}`);
}

export const formatDate = (date: Date) => {
  const pad = (n: number) => (n < 10 ? '0' + n : n);
if (!date || isNaN(date.getTime())) {
    return '';
  }
  return (
    date.getFullYear() +
    '-' +
    pad(date.getMonth() + 1) +
    '-' +
    pad(date.getDate()) +
    ' ' +
    pad(date.getHours()) +
    ':' +
    pad(date.getMinutes()) +
    ':' +
    pad(date.getSeconds())
  );
};

