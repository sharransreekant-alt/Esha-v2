import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey:            'AIzaSyCRaQAVFHkS3aOQ6Qvv9O0DW6vQ8C6-G40',
  authDomain:        'esha-tracker.firebaseapp.com',
  projectId:         'esha-tracker',
  storageBucket:     'esha-tracker.firebasestorage.app',
  messagingSenderId: '590302372163',
  appId:             '1:590302372163:web:cb0acdc297325bef454ff6',
}

export const app = initializeApp(firebaseConfig)
export const db  = getFirestore(app)
