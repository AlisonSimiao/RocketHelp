import { Box, HStack, ScrollView, Text, useTheme, VStack } from 'native-base';
import React, { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { useNavigation, useRoute } from "@react-navigation/native"
import { OrderProps } from '../components/Order';
import { OrderFirestoreDTO } from '../DTOs/OrderFirestoreDTO';
import firestore from "@react-native-firebase/firestore"
import { dateFormat } from '../utils/firebaseDateFormat';
import { Loading } from '../components/Loading';
import { CircleWavyCheck, Clipboard, ClipboardText, DesktopTower, Hourglass } from 'phosphor-react-native';
import { CardDetails } from '../components/CardDetails';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Alert } from 'react-native';


type RouteParams = {
  orderId: string;
}

type OrderDetails = OrderProps & {
  description: string;
  solution: string;
  closed: string;
}

export function Details() {

  const [order, setOrder] = useState<OrderDetails>({} as OrderDetails)
  const [solution, setsolution] = useState("")
  const [isLoading, setisLoading] = useState(false)
  const route = useRoute();
  const { orderId } = route.params as RouteParams;
  const { colors } = useTheme();
  const navigate = useNavigation()
  useEffect(() => {
    setisLoading(true)
    firestore()
      .collection<OrderFirestoreDTO>('orders')
      .doc(orderId)
      .get()
      .then(doc => {
        const { patrimony, description, status, created_at, solution, closed_at } = doc.data()

        const closed = closed_at ? dateFormat(closed_at) : null;

        setOrder({
          id: doc.id,
          patrimony,
          description,
          solution,
          status,
          when: dateFormat(created_at),
          closed
        })
        setisLoading(false)
      })
    return () => {

    }
  }, [])

  function handleOrderClose() {
    if( !solution )
      return Alert.alert("Slicitação", "informa a solicitação para fechar")
  
    firestore()
    .collection<OrderFirestoreDTO>('orders')
    .doc(orderId)
    .update({
      status: "closed",
      solution,
      closed_at: firestore.FieldValue.serverTimestamp()
    })
    .then(()=>{
      Alert.alert('Solicitação', "Solicitação encerrada.")
      navigate.goBack();
    })
    }

  if (isLoading)
    return <Loading />

  return (
    <VStack flex={1} bg="gray.700" >
      <Box px={6} bg="gray.600">
        <Header title='solicitação' />
      </Box>

      <HStack bg="gray.500" justifyContent={"center"} p={4}>

        {
          order.status === "closed"
            ? <CircleWavyCheck size={22} color={colors.green[300]} />
            : <Hourglass size={22} color={colors.secondary[700]} />
        }
        <Text
          fontSize={"sm"}
          color={order.status === "closed" ? colors.green[300] : colors.secondary[700]}
          ml={2}
          textTransform="uppercase"
        >
          {
            order.status === "closed"
              ? "finalizado"
              : "em andamento"
          }
        </Text>
      </HStack>
      <ScrollView
        mx={5}
        showsVerticalScrollIndicator={false}
      >
        <CardDetails
          title='equipamento'
          description={`Patrimonio ${order.patrimony}`}
          icon={DesktopTower}
          
        />

        <CardDetails
          title='Descrição do problema'
          description={order.description}
          icon={ClipboardText}
          footer={`Registrado em ${order.when}`}
        />

        <CardDetails
          title='solução'
          icon={CircleWavyCheck}
          description={order.solution}
          footer={order.closed && `Encerrado em ${order.closed}`}
        >

          { order.status === 'open' && <Input
            placeholder='Descrição da solução'
            onChangeText={setsolution}
            textAlignVertical="top"
            multiline
            h={24}
          />}
        </CardDetails>
      </ScrollView>
      {
        order.status === 'open' &&
        <Button
          title='Encerrar solicitação'
          m={5}
          onPress={ handleOrderClose }
        />
      }
    </VStack>
  );
}