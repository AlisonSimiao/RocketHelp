import { Heading, Icon, VStack, useTheme } from 'native-base'
import {useState} from 'react'
import { Input } from '../components/Input'
import Logo from "./../assets/logo_primary.svg"
import { Envelope, Key } from 'phosphor-react-native'
import { Button } from '../components/Button'
import React from 'react'
import auth from "@react-native-firebase/auth"
import { Alert } from 'react-native'

function SignIn() {
  const { colors } = useTheme()
  const [IsLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  
  const handleSignIn = ()=>{
    if(!email || !senha)
      return Alert.alert("Entrar","Email e senha são obrigatorios")

    setIsLoading(true);

    auth()
      .signInWithEmailAndPassword( email, senha)
      .catch((error) =>{
        console.log( error.code );
        switch( error.code ){
          case "auth/invalid-email":
            Alert.alert("Entrar", "Email invalido");
          break;
          case "auth/user-not-found":
            Alert.alert("Entrar", "Email ou senha invalido");
          break;
          case "auth/wrong-password":
            Alert.alert("Entrar", "Email ou senha invalido");
          break;
          default:
            Alert.alert("Entrar", "nao foi possivel acessar");
        }

        setIsLoading(false)
      })
  }

  return (
    <VStack bg="gray.600" flex={1} alignItems="center" px={8} pt={24}>
      <Logo />
      <Heading color="gray.100" fontSize={"xl"} mt={20} mb={6}>
        Acesse sua conta
      </Heading>
      <Input placeholder="E-mail" mb={4}
        InputLeftElement={<Icon as={<Envelope color={colors.gray[300]} />} ml={4} />}
        onChangeText={setEmail}
      />
      <Input
        placeholder="Senha"
        InputLeftElement={<Icon as={<Key color={colors.gray[300]} />} ml={4} />}
        secureTextEntry
        onChangeText={setSenha}
        mb={8}
      />
      <Button title='Entrar' w="full" onPress={ handleSignIn } isLoading={IsLoading} />
    </VStack>
  )
}

export default SignIn
