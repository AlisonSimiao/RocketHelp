import React, { useEffect, useState } from 'react';
import { useNavigation } from "@react-navigation/native";
import { Center, FlatList, Heading, HStack, IconButton, Text, useTheme, VStack } from 'native-base';
import Logo from "./../assets/logo_secondary.svg"
import { ChatTeardropText, SignOut } from 'phosphor-react-native';
import { Filter } from '../components/Filter';
import { Order, OrderProps } from '../components/Order';
import { Button } from '../components/Button';
import auth from "@react-native-firebase/auth";
import { Alert } from 'react-native';
import firestore from "@react-native-firebase/firestore"
import {dateFormat} from "../utils/firebaseDateFormat";
import { isLoading } from 'expo-font';
import { Loading } from '../components/Loading';

export function Home() {
    const { colors } = useTheme()
    const [statusSelected, setStatusSelected] = useState<'open' | 'closed'>("open")
    const [IsLoading, setIsLoading] = useState(false);

    const [orders, setOrders] = useState<OrderProps[]>([])
    const navigate = useNavigation()
    function handleNewOrder() {
        navigate.navigate("new")
    }

    function handleLogOut() {
        auth()
            .signOut()
            .catch(error => {
                console.log(error)
                return Alert.alert("Sair", "Nao foi posssivel sair")
            })
    }

    function handleOpenDetail(orderId: string) {
        navigate.navigate("details", { orderId })
    }

    useEffect(() => {
        setIsLoading(true);
        const subscribed = firestore()
            .collection('orders')
            .where('status', "==", statusSelected)
            .onSnapshot(snapshot => {
                const data = snapshot.docs.map((doc) => {
                    const { patrimony, status, description, created_at } = doc.data();

                    return {
                        id: doc.id,
                        patrimony,
                        status,
                        description,
                        when: dateFormat( created_at )
                    }
                })
                setOrders(data);
                setIsLoading(false);
            })

        return subscribed;
    }, [statusSelected])

    return (
        <VStack flex={1} pb={6} bg="gray.700">
            <HStack
                w="full"
                justifyContent={'space-between'}
                alignItems="center"
                bg="gray.600"
                pt={12}
                pb={6}
                px={6}
            >
                <Logo />

                <IconButton icon={<SignOut size={26} color={colors.gray[300]} />} onPress={handleLogOut} />
            </HStack>

            <VStack flex={1} px={6}>
                <HStack w="full" mt="8" mb={4} justifyContent="space-between" alignItems={"center"}>
                    <Heading color={"gray.100"}>
                        Solicitações
                    </Heading>
                    <Text color="gray.200">
                        {orders.length}
                    </Text>
                </HStack>
                <HStack
                    space={3}
                    mb={8}
                >
                    <Filter
                        title='em andamento'
                        type='open'
                        onPress={() => setStatusSelected("open")}
                        isActive={statusSelected === "open"}
                    />
                    <Filter
                        onPress={() => setStatusSelected("closed")}
                        isActive={statusSelected === "closed"}
                        title='finalizado' type='closed' />
                </HStack>

               { 
                IsLoading
                ? <Loading />
                : <FlatList
                    data={orders}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => <Order data={item} onPress={() => handleOpenDetail(item.id)} />}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    ListEmptyComponent={() => {
                        return (
                            <Center >
                                <ChatTeardropText color={colors.gray[300]} size={40} />
                                <Text
                                    color={"gray.300"}
                                    fontSize="xl"
                                    mt="6"
                                    textAlign={"center"}
                                >
                                    Voce ainda nao possui {'\n'}
                                    solicitações
                                    {
                                        statusSelected === 'open'
                                            ? " em andamento"
                                            : " finalizadas"
                                    }
                                </Text>
                            </Center>
                        )
                    }}
                />}
                <Button title='Nova solicitação' onPress={handleNewOrder} />
            </VStack>



        </VStack>
    );
}