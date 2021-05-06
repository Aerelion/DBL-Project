import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import firebase from 'firebase'

firebase.initializeApp({
    apiKey: "AIzaSyCAShPra8k4DxiBdJBl7StsVUBqldWG5ec",
    authDomain: "dbl-project-411b4.firebaseapp.com",
    projectId: "dbl-project-411b4",
    storageBucket: "dbl-project-411b4.appspot.com",
    messagingSenderId: "435554159758",
    appId: "1:435554159758:web:3e80462ea953f89e3c4ddf",
    measurementId: "G-15WM1WGL95"
});
const db = firebase.firestore()

export {db}

createApp(App).use(router).use(router).mount('#app')
