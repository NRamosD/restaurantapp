
import { CButton, CContainerView, CText, CView } from '@/components'
import { router } from "expo-router";
import { useState } from 'react';
import { StyleSheet } from 'react-native'
import ShareCheckout from './share-checkout';

type Props = {}


const FinalStatusCheckout = ({
  
}: Props) => {
  const [toShare, setToShare] = useState(false);
  // const [dataOrder, setDataOrder] = useState({
  //   id:0,
  //   ci:"",
  //   cliente:"",
  //   monto:0,
  //   metodo_pago:"",
  //   fecha:"",
  //   items:[]
  // });
  return (
    <CContainerView style={{flex:1, justifyContent:"center"}}>

      <CView style={{flex:7, gap:15, justifyContent:"center", paddingHorizontal:5, alignItems:"center"}}>
          <CText type="title" style={{textAlign:"center"}}>La orden ha sido facturada!</CText>
      </CView>
      <CView style={{flex:2, justifyContent:"center", paddingHorizontal:10, gap:10}}>
        <CButton containerStyles={styles.touchableCreate} onPress={()=>setToShare(true)} title={"Enviar Comprobante"}/>
        <CButton containerStyles={styles.touchableCreate} onPress={()=>router.dismissTo("/")} title={"Inicio"}/>
      </CView>

      {
        toShare && (
          <ShareCheckout toShare={toShare} setToShare={setToShare}/>
        )
      }
      


    </CContainerView>
  )
}

export default FinalStatusCheckout

const styles = StyleSheet.create({
  touchableCreate:{
    padding:10,
    textAlign:"center",
    justifyContent:"center",
    borderRadius:10,
    height:60,
    borderWidth:5,
    borderColor:"#cecece"
  },
})