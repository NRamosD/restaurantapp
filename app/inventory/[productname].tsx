import { CContainerView } from '@/components/CContainerView'
import { CText } from '@/components/CText'
import { CView } from '@/components/CView'
import { useLocalSearchParams } from 'expo-router'
import React from 'react'

type Props = {}

const DetailedProductScreen = (props: Props) => {
    const {nameproduct} = useLocalSearchParams()
    return (
        <CContainerView>
            <CView>
                <CText type="title">
                    {`Detalles de ${nameproduct}`}
                </CText>
                <CText type="title">
                    Si, aqui esta el detalle
                </CText>

            </CView>

        </CContainerView>
    )
}

export default DetailedProductScreen