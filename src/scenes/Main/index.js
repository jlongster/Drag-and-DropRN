import React, { Component } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'

export default class App extends Component {
  state = {}

  render() {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View />
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
})
