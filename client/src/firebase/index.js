import {initializeApp} from 'firebase/app'
import {getStorage} from 'firebase/storage'
const firebaseConfig = {
    apiKey: "AIzaSyDtrpzg_HCq8-WyU4PZZ3GkZ-dr9KT-xn4",
    authDomain: "the-coffee-shop-ab9d0.firebaseapp.com",
    projectId: "the-coffee-shop-ab9d0",
    storageBucket: "the-coffee-shop-ab9d0.appspot.com",
    messagingSenderId: "604076981382",
    appId: "1:604076981382:web:0104f8f3cdb8f491362507",
    measurementId: "G-B1KGYGYWVG"
};
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app)

