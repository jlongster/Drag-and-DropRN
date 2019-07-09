import Animated from 'react-native-reanimated'
import React, { useState, useRef } from 'react'
import { Platform, Dimensions, ScrollView, Text, FlatList, StyleSheet, View } from 'react-native'
import {
  State as GestureState,
  LongPressGestureHandler,
  TapGestureHandler,
  NativeViewGestureHandler,
} from 'react-native-gesture-handler'
import { onScroll } from 'react-native-redash'
import { debounce, get } from 'lodash'

import timeGridParts, { timeGridHeight, minuteHeight } from 'src/helpers/timeGridParts'
import days from 'src/helpers/days'

import Blocks from './Blocks'
import { verticalGestureRef, blockRefs, horizontalGestureRef } from './refs'

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
  and,
  lessThan,
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
  const [
    {
      dragState,
      scrollY,
      tapEventCreation,
      dragTop,
      previewHeight,
      dragY,
      yOffset,
      startEventCreation,
    },
  ] = useState({
    tapEventCreation: new Value(0),
    dragTop: new Value(0),
    scrollY: new Value(0),
    dragState: new Value(0),
    dragY: new Value(0),
    previewHeight: new Value(0),
    startEventCreation: new Value(0),
    yOffset: new Value(0),
  })
  const [{ dragging, preview }, setState] = useState({ dragging: false, preview: false })
  const [events, setEvents] = useState({})
  const dayIndex = useRef(14)
  const longPressRef = useRef()
  const scrolling = useRef(false)

  const beginDrag = () => {
    Platform.OS === 'android' && !scrolling.current && setState({ dragging: true, preview: true })
  }

  const hidePreview = () => setState({ dragging: false, preview: false })
  const handleScrollBeginDrag = () => (scrolling.current = true)
  const handleMomentumScrollEnd = () => (scrolling.current = false)

  const handleTapGestureEvent = useRef(
    event([
      {
        nativeEvent: ({ state, absoluteX, absoluteY }) =>
          block([
            set(dragY, absoluteY),
            cond(eq(state, 1), [call([], beginDrag)]),
            cond(eq(state, GestureState.BEGAN), [call([], () => hidePreview())]),
          ]),
      },
    ]),
  )

  const handleLongPressGestureEvent = useRef(
    event([
      {
        nativeEvent: ({ numberOfPointers, x, y, absoluteY, absoluteX, state }) =>
          cond(
            block([
              set(dragY, absoluteY),
              cond(eq(state, GestureState.ACTIVE), [
                set(tapEventCreation, 0),
                cond(eq(startEventCreation, 1), [
                  call([], beginDrag),
                  set(startEventCreation, 0),
                  set(yOffset, sub(absoluteY, TOP_MARGIN)),
                  set(dragTop, add(sub(dragY, TOP_MARGIN), scrollY)),
                ]),
                set(previewHeight, add(minuteHeight * 15, sub(y, yOffset, scrollY))),
              ]),
              cond(eq(state, GestureState.END), [
                cond(
                  eq(startEventCreation, 0),
                  call([previewHeight, dragTop], ([height, top]) =>
                    createCalendarEvent(height, top),
                  ),
                ),
                set(dragY, 0),
                set(dragTop, 0),
                set(previewHeight, 0),
                set(startEventCreation, 1),
              ]),
            ]),
          ),
      },
    ]),
  )

  const createCalendarEvent = (blockHeight, blockTop) => {
    let block = {}
    if (blockHeight > 0) {
      block = { blockHeight, blockTop }
    } else {
      block = { blockHeight: Math.abs(blockHeight), blockTop: blockTop + blockHeight }
    }

    setEvents(events => {
      const currentDayEvents = events[dayIndex.current] || []

      return {
        ...events,
        [dayIndex.current]: [block],
      }
    })
  }

  const handleHorizontalScroll = ({
    nativeEvent: {
      contentOffset: { x },
    },
  }) => (dayIndex.current = Math.round(x / deviceWidth))

  const renderDay = ({ item, index }) => (
    <Animated.View>
      <Text style={{ position: 'absolute', alignSelf: 'center' }}>{item}</Text>

      <Blocks
        blocks={get(events, `${[index]}`, [])}
        dragging={dragging}
        setDragging={dragging => setState({ dragging })}
      />

      <FlatList
        data={timeGridParts()}
        keyExtractor={item => item}
        listKey={`${item}-timeGrid`}
        renderItem={renderTimeGrid}
        scrollEnabled={false}
        style={styles.timeGrid}
      />
    </Animated.View>
  )

  const gestureProps = Platform.select({
    android: {
      waitFor: [verticalGestureRef, horizontalGestureRef],
    },
  })

  return (
    <TapGestureHandler onHandlerStateChange={handleTapGestureEvent.current} {...gestureProps}>
      <Animated.View>
        <LongPressGestureHandler
          maxDist={deviceHeight}
          minDurationMs={250}
          onGestureEvent={handleLongPressGestureEvent.current}
          onHandlerStateChange={handleLongPressGestureEvent.current}
          ref={longPressRef}
          {...gestureProps}
        >
          <Animated.View>
            <NativeViewGestureHandler
              enabled={!dragging}
              ref={verticalGestureRef}
              simultaneousHandlers={[...blockRefs, horizontalGestureRef]}
            >
              <Animated.ScrollView
                contentContainerStyle={styles.container}
                onScroll={onScroll({ y: scrollY })}
                scrollEnabled={!dragging}
                scrollEventThrottle={16}
              >
                {preview && (
                  <Animated.View
                    style={{
                      width: deviceWidth - 40,
                      left: 40,
                      position: 'absolute',
                      backgroundColor: 'red',
                      zIndex: 10,
                      top: cond(
                        greaterOrEq(previewHeight, 0),
                        dragTop,
                        add(dragTop, previewHeight),
                      ),
                      height: abs(previewHeight),
                    }}
                  />
                )}

                <FlatList
                  data={timeGridParts()}
                  keyExtractor={item => item}
                  renderItem={renderTimeIndicator}
                  scrollEnabled={false}
                  style={styles.timeIndicator}
                />

                <NativeViewGestureHandler
                  enabled={!dragging}
                  ref={horizontalGestureRef}
                  simultaneousHandlers={[...blockRefs, verticalGestureRef]}
                >
                  <FlatList
                    data={days()}
                    extraData={events}
                    getItemLayout={getItemLayout}
                    horizontal
                    initialScrollIndex={14}
                    keyExtractor={item => item}
                    onBeginDrag
                    onMomentumScrollEnd={handleMomentumScrollEnd}
                    onScroll={handleHorizontalScroll}
                    onScrollBeginDrag={handleScrollBeginDrag}
                    pagingEnabled
                    renderItem={renderDay}
                    scrollEnabled={!dragging}
                  />
                </NativeViewGestureHandler>
              </Animated.ScrollView>
            </NativeViewGestureHandler>
          </Animated.View>
        </LongPressGestureHandler>
      </Animated.View>
    </TapGestureHandler>
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
