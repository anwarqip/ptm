import React, { useRef } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { formatDate } from '../services/ParkingService';
import RNPrint from 'react-native-print';

export default function Receipt ({route}){
    const { parking, parkoutPayment } = route.params;
    const currentDateTime = new Date();
    const viewShotRef = useRef<any>(null);

      const printReceipt = async () => {
    try {
      // Capture the receipt view as an image
      const uri = await viewShotRef.current.capture();
      // Send the image to the native print dialog
      await RNPrint.print({ filePath: uri });
    } catch (error) {
      console.error('Print error:', error);
    }
  };

  return (
    <View style={styles.container}>

      <View style={styles.receipt}>
        <Text style={styles.centerText}>*************************************************</Text>
        <Text style={[styles.centerText, styles.title]}>Parking Info Receipt</Text>
        <Text style={styles.centerText}>*************************************************</Text>
        <View style={styles.separator} />

        <Row label="Date:" value={formatDate(new Date(currentDateTime || ''))} />
        <Row label="Plate:" value={parking.plate} />
        <Row label="Park-In:" value={formatDate(new Date(parking.parkInTime?.parkInTime || ''))} />
        <Row label="Park-Out:" value={formatDate(new Date(parking.parkOutTime || ''))} />
        <Row label="Duration (Min):" value={String(parking.parkDurationMinutes)} />
        <Row label="Parking Status:" value={parkoutPayment.parkStatus} />
        <Row label="Parking Fee:" value={`ETB${parkoutPayment.paymentBreakdown.baseAmount}`} />

        {Object.entries(parkoutPayment.paymentBreakdown.charges).map(([key, val]) => (
          <Row key={key} label={`${key}:`} value={`ETB${val}`} />
        ))}

        <Row label="Total Amount:" value={`ETB${parkoutPayment.paymentBreakdown.totalAmount}`} />
        <Row label="Paid Amount:" value={`ETB${parkoutPayment.paymentBreakdown.totalAmount}`} />
        <Row label="Reference:" value={parkoutPayment.paymentResult.payReference} />
        <Row label="Pay Method:" value={parkoutPayment.paymentResult.payMethod} />
        <Row label="Payment Status:" value={parkoutPayment.paymentResult.payStatus} />

        <Text style={styles.total}>
          Total: ETB{parkoutPayment.paymentBreakdown.totalAmount}
        </Text>

        <View style={styles.qrContainer}>
          <QRCode value={parkoutPayment.receiptLink} size={90} />
        </View>

        <View style={styles.separator} />
        <Text style={styles.centerText}>*************************************************</Text>
        <Text style={[styles.centerText, styles.thankYou]}>Thank You, Come Back!</Text>
        <Text style={styles.centerText}>*************************************************</Text>
      </View>

      <View style={styles.actions}>
        <Button title="🖨️ Print" onPress={printReceipt} />
        <Button title="📄 Download PDF" onPress={() => console.log('Download PDF')} />
        <Button title="🔗 Share Link" onPress={() => console.log('Share Link')} />
      </View>
    </View>
  );
};

const Row = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
    fontFamily: 'Courier',
  },
  error: { color: 'red', textAlign: 'center' },
  success: { color: 'green', textAlign: 'center', marginBottom: 8 },
  receipt: {
    width: 300,
    padding: 10,
    borderWidth: 2,
    borderColor: '#333',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  centerText: { textAlign: 'center', fontSize: 9 },
  title: { fontSize: 11, fontWeight: 'bold' },
  separator: { borderBottomWidth: 1, borderBottomColor: '#333', marginVertical: 5 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  label: { fontWeight: 'bold'},
  value: { flex: 1, textAlign: 'right' },
  total: {
    fontSize: 14,
    textAlign: 'right',
    textDecorationLine: 'underline',
    fontWeight: 'bold',
    marginTop: 8,
  },
  qrContainer: { alignItems: 'flex-start', marginTop: 8 },
  thankYou: { fontSize: 11, fontWeight: 'bold' },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    width: '100%',
  },
});

//export default Receipt;