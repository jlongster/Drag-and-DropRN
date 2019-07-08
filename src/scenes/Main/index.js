import React from 'react'
import { Dimensions, ScrollView, Text, FlatList, StyleSheet, View } from 'react-native'

import timeGridParts, { timeGridHeight } from 'src/helpers/timeGridParts'

const { width: deviceWidth } = Dimensions.get('window')

const App = () => {
  const renderTimeGrid = () => (
    <View
      style={{
        height: timeGridHeight,
        width: deviceWidth - 40,
        borderWidth: 1,
        borderColor: 'black',
      }}
    />
  )

  const renderTimeIndicator = ({ item }) => (
    <View style={{ height: timeGridHeight, width: 40 }}>
      <Text>{item}</Text>
    </View>
  )

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <FlatList
        data={timeGridParts()}
        renderItem={renderTimeIndicator}
        style={styles.timeIndicator}
      />
      <FlatList data={timeGridParts()} renderItem={renderTimeGrid} style={styles.timeGrid} />
    </ScrollView>
  )
}

export default App

const styles = StyleSheet.create({
  timeIndicator: {},
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
})
