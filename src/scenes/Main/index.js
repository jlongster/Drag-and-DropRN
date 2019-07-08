import React from 'react'
import { Dimensions, ScrollView, Text, FlatList, StyleSheet, View } from 'react-native'
import { LongPressGestureHandler, TapGestureHandler } from 'react-native-gesture-handler'

import timeGridParts, { timeGridHeight } from 'src/helpers/timeGridParts'
import days from 'src/helpers/days'

const { width: deviceWidth } = Dimensions.get('window')

const App = () => {
  const renderTimeGrid = () => (
    <View
      style={{
        height: timeGridHeight,
        width: deviceWidth,
        borderBottomWidth: 1,
        borderRightWidth: 1,
        borderColor: 'black',
      }}
    />
  )

  const renderTimeIndicator = ({ item }) => (
    <View style={{ height: timeGridHeight, borderRightWidth: 1, width: 40 }}>
      <Text>{item}</Text>
    </View>
  )

  const renderDay = ({ item }) => (
    <View>
      <Text style={{ alignSelf: 'center' }}>{item}</Text>
      <FlatList
        data={timeGridParts()}
        keyExtractor={item => item}
        listKey={`${item}-timeGrid`}
        renderItem={renderTimeGrid}
        scrollEnabled={false}
        style={styles.timeGrid}
      />
    </View>
  )

  getItemLayout = (data, index) => ({
    length: deviceWidth,
    offset: index * deviceWidth,
    index,
  })

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <FlatList
        data={timeGridParts()}
        keyExtractor={item => item}
        renderItem={renderTimeIndicator}
        scrollEnabled={false}
        style={styles.timeIndicator}
      />

      <FlatList
        data={days()}
        getItemLayout={getItemLayout}
        horizontal
        initialScrollIndex={14}
        keyExtractor={item => item}
        pagingEnabled
        renderItem={renderDay}
      />
    </ScrollView>
  )
}

export default App

const styles = StyleSheet.create({
  container: {
    marginTop: 60,
    paddingBottom: 60,
  },
  timeIndicator: {
    position: 'absolute',
    backgroundColor: 'white',
    width: 40,
    zIndex: 2,
  },
  timeGrid: {
    width: deviceWidth,
  },
})
