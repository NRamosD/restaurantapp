import { useSQLiteContext } from 'expo-sqlite'
import React from 'react'
import useOrderStore from './useOrderStore'
import { createOrder, updateOrder } from '@/db/order.operations'
import { createOrderProduct, deleteOrderProduct, deleteOrderProductById, getOrderProduct, getProductsByOrderId, updateOrderProduct } from '@/db/order_product.operations'
// import { getProductById, updateProductStock } from '@/db/producto.operations'
import { Product } from '@/interfaces'
import { useOrdenService } from '@/modules'

type Props = {}

const useOrderOperations = ({
    
}: Props) => {
    const { obtenerOrdenPorUuid } = useOrdenService()

    const {
        setItems,
        setOrderDetails
    } = useOrderStore()

    const loadOrderData = async(ordenUuid: string)=>{
        // console.log("loadOrderData", ordenUuid)
        const resultOrder = await obtenerOrdenPorUuid(ordenUuid)
        setOrderDetails(resultOrder)
        setItems(resultOrder?.ordenProductos || [])

    }


    return {
        loadOrderData
    }
}

export default useOrderOperations