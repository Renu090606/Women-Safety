require('dotenv').config();
const { db } = require('./config/firebase');

const seed = async () => {
  const aadhaarUsers = [
    { aadhaarNumber: '111122223333', name: 'Priya Sharma', gender: 'Female' },
    { aadhaarNumber: '222233334444', name: 'Neha Gupta', gender: 'Female' },
    { aadhaarNumber: '333344445555', name: 'Anjali Singh', gender: 'Female' },
    { aadhaarNumber: '444455556666', name: 'Ritu Verma', gender: 'Female' },
    { aadhaarNumber: '555566667777', name: 'Kavya Reddy', gender: 'Female' },
  ];

  const licenses = [
    { licenseId: 'DL001', name: 'Ramesh Kumar' },
    { licenseId: 'DL002', name: 'Suresh Patel' },
    { licenseId: 'DL003', name: 'Mahesh Yadav' },
    { licenseId: 'DL004', name: 'Dinesh Singh' },
    { licenseId: 'DL005', name: 'Rakesh Sharma' },
  ];

  const buses = [
    { busNumber: 'BUS101', assignedDriverUid: '', isActive: false, currentFemaleCount: 0 },
    { busNumber: 'BUS102', assignedDriverUid: '', isActive: false, currentFemaleCount: 0 },
    { busNumber: 'BUS103', assignedDriverUid: '', isActive: false, currentFemaleCount: 0 },
  ];

  for (const item of aadhaarUsers) {
    await db.collection('aadhaar_users').doc(item.aadhaarNumber).set(item);
  }
  for (const item of licenses) {
    await db.collection('driver_licenses').doc(item.licenseId).set(item);
  }
  for (const item of buses) {
    await db.collection('buses').doc(item.busNumber).set(item);
  }

  console.log('Firebase seed complete.');
};

seed().catch((error) => {
  console.error('Seed failed:', error.message);
  process.exit(1);
});
