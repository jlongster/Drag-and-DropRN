import Animated from 'react-native-reanimated'
import React, { useState, useRef } from 'react'
import { Dimensions, ScrollView, Text, FlatList, StyleSheet, View } from 'react-native'
import {
  State as GestureState,
  LongPressGestureHandler,
  TapGestureHandler,
} from 'react-native-gesture-handler'
import { onScroll } from 'react-native-redash'
import { get } from 'lodash'

import timeGridParts, { timeGridHeight, minuteHeight } from 'src/helpers/timeGridParts'
import days from 'src/helpers/days'

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window')
const TOP_MARGIN = 60
const {
  add,
  multiply,
  interpolate,
  divide,
  cond,
  Value,
  call,
  event,
  eq,
  block,
  set,
  greaterOrEq,
  abs,
  sub,
} = Animated

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

const getItemLayout = (data, index) => ({
  length: deviceWidth,
  offset: index * deviceWidth,
  index,
})

const renderTimeIndicator = ({ item }) => (
  <View style={{ height: timeGridHeight, borderRightWidth: 1, width: 40 }}>
    <Text>{item}</Text>
  </View>
)

const App = () => {
  const [{ dragX, scrollY, dragTop, previewHeight, dragY, yOffset, shouldSetOffset }] = useState({
    dragTop: new Value(0),
    scrollY: new Value(0),
    dragX: new Value(0),
    dragY: new Value(0),
    previewHeight: new Value(0),
    shouldSetOffset: new Value(0),
    yOffset: new Value(0),
  })
  const [events, setEvents] = useState({})
  const currentDayIndex = useRef(14)

  const handleLongPressGestureEvent = useRef(
    event([
      {
        nativeEvent: ({ numberOfPointers, x, y, absoluteY, absoluteX, state }) =>
          cond(
            block([
              set(dragX, absoluteX),
              set(dragY, absoluteY),
              cond(eq(state, GestureState.ACTIVE), [
                cond(eq(shouldSetOffset, 1), [
                  set(shouldSetOffset, 0),
                  set(yOffset, sub(absoluteY, TOP_MARGIN)),
                  set(dragTop, add(sub(dragY, TOP_MARGIN), scrollY)),
                ]),
                set(previewHeight, add(minuteHeight * 15, sub(y, yOffset, scrollY))),
              ]),
              cond(eq(state, GestureState.END), [
                set(dragTop, 0),
                set(dragX, 0),
                set(dragY, 0),
                set(previewHeight, 0),
                set(shouldSetOffset, 1),
                call([previewHeight, dragTop], createCalendarEvent),
              ]),
            ]),
          ),
      },
    ]),
  )

  const createCalendarEvent = ([height, top]) => {
    setEvents(events => {
      const currentDayEvents = events[currentDayIndex]

      return {
        ...events,
        [currentDayIndex]: [...currentDayEvents, { height, top }],
      }
    })
  }

  const renderDay = ({ item }) => (
    <LongPressGestureHandler
      maxDist={deviceHeight}
      minDurationMs={250}
      onGestureEvent={handleLongPressGestureEvent.current}
      onHandlerStateChange={handleLongPressGestureEvent.current}
    >
      <Animated.View>
        <Text style={{ position: 'absolute', alignSelf: 'center' }}>{item}</Text>

        {get(events, `${[item]}`, []).map(({ height, top }) => (
          <View
            key={top}
            style={{
              top,
              height,
              backgroundColor: 'blue',
              position: 'absolute',
            }}
          />
        ))}

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
  )

  return (
    <Animated.ScrollView
      contentContainerStyle={styles.container}
      onScroll={onScroll({ y: scrollY })}
      scrollEventThrottle={16}
    >
      <Animated.View
        style={{
          width: deviceWidth - 40,
          left: 40,
          position: 'absolute',
          backgroundColor: 'red',
          zIndex: 10,
          top: cond(greaterOrEq(previewHeight, 0), dragTop, add(dragTop, previewHeight)),
          height: abs(previewHeight),
        }}
      />

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
        // onScroll={handleHorizontalScroll}
        pagingEnabled
        renderItem={renderDay}
      />
    </Animated.ScrollView>
  )
}

export default App

const styles = StyleSheet.create({
  container: {
    marginTop: TOP_MARGIN,
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
