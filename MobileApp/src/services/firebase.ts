import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database';

export const firebaseAuth = auth();
export const firebaseFirestore = firestore();
export const realtimeDb = database();
