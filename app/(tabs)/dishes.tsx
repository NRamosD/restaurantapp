import { StyleSheet, Image, Platform, FlatList } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { CContainerView } from '@/components/CContainerView';
import { TopBarWithMenu } from '@/components/TopBarWithMenu';
import { CView } from '@/components/CView';
import { CText } from '@/components/CText';

export default function TabTwoScreen() {
  return (
    <CContainerView style={{
      flex: 1,
      flexDirection:"column",
    }}>
        <TopBarWithMenu title={"Menú"}/>
        <CView style={{flex:10}}>
          <FlatList
            data={[]}
            renderItem={({item}) => <CText>qweqwjehuqwh qweqw {item}</CText> }
            keyExtractor={item => item}
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
