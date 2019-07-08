import React from 'react'
import { Dimensions, ScrollView, Text, FlatList, StyleSheet, View } from 'react-native'
import Animated from 'react-native-reanimated'
import { LongPressGestureHandler, TapGestureHandler } from 'react-native-gesture-handler'

import timeGridParts, { timeGridHeight } from 'src/helpers/timeGridParts'
import days from 'src/helpers/days'

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window')

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

  // const handleTapStateChange = event([
  //   {
  //     nativeEvent: ({ numberOfPointers, state, absoluteX, absoluteY }) =>
  //       cond(
  //         eq(numberOfPointers, 1),
  //         block([
  //           set(this.absoluteX, absoluteX),
  //           set(this.absoluteY, absoluteY),
  //           cond(eq(state, 1), [call([], this.beginDrag)]),
  //           cond(eq(state, GestureState.BEGAN), [call([], this.hidePreview)]),
  //           cond(eq(state, GestureState.END), [
  //             call([this.absoluteX, this.absoluteY], this.debounceActivateSingleBlockPreview),
  //           ]),
  //         ]),
  //       ),
  //   },
  // ])

  // const handleLongPressGestureEvent = event([
  //   {
  //     nativeEvent: ({ numberOfPointers, y, absoluteY, absoluteX, state }) =>
  //       cond(
  //         eq(numberOfPointers, 1),
  //         block([
  //           set(this.absoluteX, absoluteX),
  //           set(this.absoluteY, absoluteY),
  //           cond(eq(state, GestureState.BEGAN), [
  //             set(this.yOffset, sub(absoluteY, this.listTop)),
  //             call([], this.hidePreview),
  //           ]),
  //           cond(eq(state, GestureState.ACTIVE), [
  //             cond(eq(this.shouldSetOffset, 1), [
  //               set(this.shouldSetOffset, 0),
  //               set(this.yOffset, sub(absoluteY, this.listTop)),
  //             ]),
  //             set(this.previewHeight, add(MINUTE_HEIGHT * 15, sub(y, this.yOffset))),
  //             call([this.absoluteX, this.absoluteY], this.debounceActivatePreview),
  //             set(this.dragDiff, add(this.dragDiff, diff(this.previewHeight))),
  //             cond(greaterOrEq(abs(this.dragDiff), 5 * MINUTE_HEIGHT), [
  //               set(this.dragDiff, 0),
  //               call([], () => hapticFeedback(HAPTIC_MODE.IMPACT_LIGHT)),
  //             ]),
  //           ]),
  //           cond(eq(state, GestureState.CANCELLED), [call([], this.handlePreviewFail)]),
  //           cond(eq(state, GestureState.END), [
  //             call([this.previewHeight], this.handleEventCreation),
  //             set(this.absoluteX, 0),
  //             set(this.absoluteY, 0),
  //             set(this.shouldSetOffset, 1),
  //           ]),
  //         ]),
  //       ),
  //   },
  // ])

  const renderDay = ({ item }) => (
    <TapGestureHandler>
      <Animated.View>
        <LongPressGestureHandler
          maxDist={deviceHeight}
          minDurationMs={250}
          onGestureEvent={handleLongPressGestureEvent}
          onHandlerStateChange={handleLongPressGestureEvent}
        >
          <Animated.View>
            <Text style={{ position: 'absolute', alignSelf: 'center' }}>{item}</Text>

            <FlatList
              data={timeGridParts()}
              keyExtractor={item => item}
              listKey={`${item}-timeGrid`}
              renderItem={renderTimeGrid}
              scrollEnabled={false}
              style={styles.timeGrid}
            />
          </Animated.View>
        </LongPressGestureHandler>
      </Animated.View>
    </TapGestureHandler>
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
