import { NavigationContainer } from "@react-navigation/native"
import React, { useEffect, useState } from "react";
import auth ,{FirebaseAuthTypes} from "@react-native-firebase/auth"
import SignIn from "../screens/Signin";
import { AppRoutes } from "./app.routes";
import { Loading } from "../components/Loading";
 
 export function Routes() {
  const [loading, setloading] = useState(true)
  const [user, setuser] = useState<FirebaseAuthTypes.User>()
  
  useEffect(()=>{
    const subscriber = auth().onAuthStateChanged( 
        Response => {
          setuser(Response);
          setloading(false)
      } )

      return subscriber;
  },[ ])

  if( loading )
    return <Loading />


  return (
     <NavigationContainer>
        {user ?<AppRoutes /> : <SignIn /> }
     </NavigationContainer>
   );
 }