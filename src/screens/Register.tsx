import { VStack } from 'native-base';
import React, { useState } from 'react';
import { Alert } from 'react-native';
import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { Input } from '../components/Input';
import firestore from "@react-native-firebase/firestore"
import { useNavigation } from '@react-navigation/native';


export function Register() {
    const [isloading, setisloading] = useState(false)
    const [patrimony, setpatrimony] = useState("")
    const [description, setdescription] = useState("")
    const navigate = useNavigation()

    function handleNewOrder() {
        if (!patrimony || !description)
            return Alert.alert("Registrar", "Preencha todos os campos")
        setisloading(true);

        firestore()
            .collection('orders')
            .add({
                patrimony,
                description,
                status: "open",
                created_at: firestore.FieldValue.serverTimestamp()
            })
            .then(()=>{
                Alert.alert("solicitação", "add com sucesso")
                navigate.goBack();
            })
            .catch( (Error)=>{
                setisloading(false)
                console.log(Error);
                Alert.alert("Solicitação", "Não foi possivel registrar")
            } )

    }
    return (
        <VStack flex={1} p={6} bg="gray.600" >
            <Header
                title='Nova solicitação'
            />

            <Input
                placeholder='Número do patrimonio'
                mt={4}
                onChangeText={setpatrimony}
            />
            <Input
                placeholder='Descrição do problema'
                flex={1}
                mt={5}
                multiline
                textAlignVertical='top'
                onChangeText={setdescription}
            />

            <Button mt={8} title='Cadastrar' onPress={ handleNewOrder } isLoading={isloading}/>
        </VStack>
    );
}