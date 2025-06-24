import { StyleSheet, Image, Platform, FlatList } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { CContainerView } from '@/components/CContainerView';
import { TopBarWithMenu } from '@/components/TopBarWithMenu';
import { CView } from '@/components/CView';
import { CText } from '@/components/CText';
import { Products } from "@/interfaces/products";
import ItemMenuSquareDetails from '@/components/orders/ItemMenuSquareDetails';

export default function TabTwoScreen() {
  return (
    <CContainerView style={{
      flex: 1,
      flexDirection:"column",
    }}>
        <TopBarWithMenu title={"Menú"}/>
        <CView style={{flex:10, flexDirection:"row"}}>
          <FlatList<Products>
            data={["1","2","3","4","5","6"]}
            renderItem={({item}) => <ItemMenuSquareDetails data={item}/> }
            horizontal={false}
            numColumns={2}
            keyExtractor={item => item}
            columnWrapperStyle={{
              justifyContent:"space-between",
              width:"100%"
            }}
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
