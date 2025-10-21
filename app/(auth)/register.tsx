import React from 'react'
import { CContainerView } from '@/components'
import { CText } from '@/components'
type Props = {}

const RegisterScreen = ({
    
}: Props) => {
  return (
    <CContainerView style={{flex:1, alignContent:"center", justifyContent:"center"}}>
      <CText type="title">Bienvenido!</CText>
    </CContainerView>
  )
}

export default RegisterScreen