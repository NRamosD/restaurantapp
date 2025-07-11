
import { CView } from '@/components'
import CImagePicker from '@/components/CImagePicker'
import React from 'react'

type Props = {}

const ViewProduct = (props: Props) => {
  return (
    <CView style={{flex:1,}}>
      <CImagePicker/>

    </CView>
  )
}

export default ViewProduct