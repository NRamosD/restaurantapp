import { StyleSheet, FlatList } from 'react-native';
import { CContainerView } from '@/components/CContainerView';
import { TopBarWithMenu } from '@/components/TopBarWithMenu';
import { CView } from '@/components/CView';
import { CText } from '@/components/CText';
import { Product } from "@/interfaces/products";
import ItemMenuSquareDetails from '@/components/orders/ItemMenuSquareDetails';
import { useSQLiteContext } from 'expo-sqlite';
import { getProducts } from '@/database/product.operations';
import { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';







export default function TabTwoScreen() {

  const db = useSQLiteContext();
  const isFocused = useIsFocused();
  const [products, setProducts] = useState<Product[]>([]);

  const fetchProducts = async () => {
    const products = await getProducts(db);
    setProducts(products);
  };

  useEffect(() => {
    fetchProducts();
  }, [isFocused]);

  return (
    <CContainerView style={{
      flex: 1,
      flexDirection:"column",
    }}>
        <TopBarWithMenu title={"Productos"}/>
        <CView style={{flex:10, flexDirection:"row", width:"90%", margin:"auto", paddingHorizontal:10}}>
          <FlatList<Product>
            data={products}
            renderItem={({item}) => <ItemMenuSquareDetails data={item}/> }
            horizontal={false}
            numColumns={2}
            keyExtractor={item => item.uuid}
            columnWrapperStyle={{
              justifyContent:"space-between",
              gap:10,
              width:"100%"
            }}
            ListEmptyComponent={<CText>No hay productos registrados</CText>}
            
          />
          {/* <ItemOrderExtendedLink data={item}/> */}
        </CView>
        
    </CContainerView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
