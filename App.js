import React from 'react';
import { StyleSheet, Dimensions, Text, View, Animated, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from './constants';
import card from './dummy/card.json';

const { width, height } = Dimensions.get('screen')

const menu = [
  { icon: "location-outline", ref: React.createRef() },
  { icon: "location-outline", ref: React.createRef() },
  { icon: "location-outline", ref: React.createRef() },
  { icon: "location-outline", ref: React.createRef() },
  { icon: "location-outline", ref: React.createRef() },
  { icon: "location-outline", ref: React.createRef() },
]

const List = ({ item }) => {
  return (
    <View style={{ width: 62, height: 62, borderRadius: 8, backgroundColor: 'green' }}>

    </View>
  )
}

const CardList = ({ item, index }) => {
  let items = []
  if (item.items) {
    items = item.items.map((_, i) => <List key={i}  />)
  }

  return (
    <View style={{ width, height: 62 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
        {items}
      </View>
    </View>
  )
}

const Indicator = ({ scrollX }) => (
  card.map((_, i) => {
    const inputRange = [
      (i - 1) * width,
      i * width,
      (i + 1) * width
    ]

    const w = scrollX.interpolate({
      inputRange,
      outputRange: [6, 24, 6],
      extrapolate: 'clamp'
    })
    const backgroundColor = scrollX.interpolate({
      inputRange,
      outputRange: ['gray', colors.HEADER, 'gray'],
      extrapolate: 'clamp'
    })

    return (
      <Animated.View
        key={i}
        style={{
          width: w,
          height: 6,
          backgroundColor,
          borderRadius: 30,
          margin: 4
        }}
      />
    )
  })
)

const Tab = React.forwardRef(({ item, index, onPress }, ref) => {
  return (
    <TouchableOpacity onPress={() => onPress(index)}>
      <View {...{ ref }}>
        <Ionicons name={item.icon} size={32} color="#000" />
      </View>
    </TouchableOpacity>
  )
})

const Tabs = () => {
  const [measures, setMeasures] = React.useState([])
  const indicatorRef = React.useRef(new Animated.Value(0)).current
  const containerRef = React.useRef()

  React.useEffect(() => {
    let m = []
    menu.map(item => {
      item.ref?.current?.measureLayout(
        containerRef.current,
        (x, y, width, height) => {
          m.push({ x, y, width, height })
          if (m.length === menu.length) setMeasures(m)
        }
      )
    })
  }, [measures[0] && measures[0].x > 0])

  const onPress = (index) => {
    Animated.timing(indicatorRef, {
      toValue: index,
      duration: 500,
      useNativeDriver: false
    }).start()
  }

  return (
    <>
      <View ref={containerRef} style={{ flexDirection: 'row', width: '100%', paddingTop: 8, paddingBottom: 8, alignItems: 'center', justifyContent: 'space-evenly', borderRadius: 30, backgroundColor: '#fff', shadowColor: "#000", shadowOffset: { width: 0, height: 2, }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 }}>
        {menu.map((item, index) => {
          return (
            <Tab key={index} ref={item.ref} {...{ item }} {...{ index }} {...{ onPress }} />
          )
        })}
      </View>
      {measures.length > 0 && <IndicatorMenu {...{ measures }} {...{ indicatorRef }} />}
    </>
  )
}

const IndicatorMenu = ({ measures, indicatorRef }) => {
  const translateX = indicatorRef.interpolate({
    inputRange: measures.map((_, i) => i),
    outputRange: measures.map(measure => measure.x + 8)
  })

  return (
    <Animated.View
      style={{
        width: 40,
        height: 40,
        position: 'absolute',
        bottom: 18,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: 'blue',
        elevation: 5,
        transform: [{ translateX }]
      }}
    />
  )
}

export default function App() {
  const scrollX = React.useRef(new Animated.Value(0)).current

  return (
    <View style={styles.container}>
      <View style={{ width, padding: 24, backgroundColor: colors.HEADER }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 24 }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#fff' }}>Payers</Text>
          <Ionicons name="notifications-outline" size={24} color="#fff" />
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 18 }}>
          <View style={{ width: 48, height: 48, borderRadius: 30, backgroundColor: colors.AVATAR }} />
          <View style={{ marginLeft: 14 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#fff' }}>Muhammad Julfansha</Text>
            <Text style={{ color: '#fff' }}>+62895336835534</Text>
          </View>
        </View>
      </View>

      <View style={{ padding: 12 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text>Voucher Game</Text>
          <Text style={{ fontWeight: 'bold' }}>Lihat Semua</Text>
        </View>
      </View>
      <Animated.FlatList
        data={card}
        keyExtractor={(_, i) => i.toString()}
        renderItem={CardList}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
      />
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 12 }}>
        <Indicator {...{ scrollX }} />
      </View>

      <View style={{ marginTop: 200, padding: 24 }}>
        <View style={{ marginTop: height / 4.5, padding: 12 }}>
          <Tabs />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
});
