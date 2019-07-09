// @flow

import Animated, { Easing } from 'react-native-reanimated'
import React, { useState, useEffect, useRef, type ElementRef } from 'react'
import { Dimensions, Platform, StyleSheet, Text, View } from 'react-native'
import {
  State as GestureState,
  LongPressGestureHandler,
  LongPressGestureHandlerStateChangeEvent,
  PanGestureHandler,
  TapGestureHandler,
  TapGestureHandlerStateChangeEvent,
} from 'react-native-gesture-handler'
import { throttle } from 'lodash'

import {
  addBlockRef,
  horizontalGestureRef,
  horizontalScrollViewRef,
  verticalGestureRef,
} from './refs'

const {
  Adaptable,
  Value,
  add,
  and,
  block,
  call,
  cond,
  divide,
  eq,
  event,
  greaterOrEq,
  lessOrEq,
  multiply,
  round,
  set,
  sub,
} = Animated

const { height: deviceHeight, width: deviceWidth } = Dimensions.get('window')

type Props = {
  top: number,
  height: number,
  setDragging: boolean => void,
  scrollVerticalList: string => void,
  dragging: boolean,
}

type State = {
  verticalScrollOffset: number,
}

const timingAnimationConfig = (duration, toValue) => ({
  duration,
  toValue,
  easing: Easing.inOut(Easing.ease),
})

const Block = ({ top, height, scrollVerticalList, setDragging }: Props) => {
  const [{ X, Y, dragX, dragY, animating, dragging, opacity }] = useState({
    X: new Value(0),
    Y: new Value(0),
    dragX: new Value(0),
    dragY: new Value(0),
    animating: new Value(0),
    dragging: new Value(0),
    opacity: new Value(1),
  })
  const [offsetY, setOffsetY] = useState(0)
  const longPressRef: ElementRef<LongPressGestureHandler> = useRef()
  const panRef: ElementRef<PanGestureHandler> = useRef()

  useEffect(() => {
    addBlockRef(panRef)
  }, [])

  const handleVerticalChange = ([value]: [number]) => {
    setDragging(true)
  }

  const throttleHandleVerticalChange = useRef(handleVerticalChange)

  const panHandler: Adaptable<event> = useRef(
    event([
      {
        nativeEvent: ({ translationX: x, translationY: y, state, absoluteX, absoluteY }) =>
          block([
            cond(and(eq(state, GestureState.ACTIVE)), [
              set(dragX, absoluteX),
              set(dragY, absoluteY),
              set(Y, add(y, offsetY)),
              // set(X, x),
              call([Y], throttleHandleVerticalChange.current),
              // call([X], handleHorizontalChange),
              // cond(lessOrEq(absoluteY, 60), call([], () => scrollVerticalList('top'))),
              // cond(
              //   greaterOrEq(absoluteY, deviceHeight - 60),
              //   call([], () => scrollVerticalList('bottom')),
              // ),
              cond(and(eq(state, GestureState.END)), [
                // call([], handleBlockUpdate),
              ]),
            ]),
          ]),
      },
    ]),
  )

  const handleLongStateChange = ({ nativeEvent }) => {
    if (nativeEvent.state === GestureState.ACTIVE) {
      setDragging(true)

      Animated.timing(opacity, timingAnimationConfig(100, 0.6)).start()
      Animated.timing(dragging, timingAnimationConfig(10, 1)).start()
    }

    if (nativeEvent.state === GestureState.END) {
      setDragging(false)
      Animated.timing(opacity, timingAnimationConfig(500, 1)).start()
    }
  }

  return (
    <LongPressGestureHandler
      minDurationMs={250}
      onHandlerStateChange={handleLongStateChange}
      ref={longPressRef}
      simultaneousHandlers={[panRef, verticalGestureRef, horizontalGestureRef]}
    >
      <Animated.View
        style={[
          styles.blockContainer,
          {
            transform: [{ translateX: X }, { translateY: Y }],
            height: height + 8,
            left: 45,
            top,
            width: deviceWidth - 50,
          },
        ]}
      >
        <PanGestureHandler
          avgTouches
          maxDist={2}
          maxPointers={1}
          onGestureEvent={panHandler.current}
          onHandlerStateChange={panHandler.current}
          ref={panRef}
          waitFor={verticalGestureRef}
        >
          <Animated.View>
            <Text>
              {' '}
              Top: {top} {'\n'} Height:{height}
            </Text>
          </Animated.View>
        </PanGestureHandler>
      </Animated.View>
    </LongPressGestureHandler>
  )
}

export default Block

const styles = StyleSheet.create({
  blockContainer: {
    backgroundColor: 'turquoise',
    borderBottomRightRadius: 6,
    borderLeftWidth: 3.5,
    borderTopRightRadius: 6,
    ...Platform.select({
      android: {
        marginTop: 2,
      },
    }),
    height: '100%',
    overflow: 'visible',
    position: 'absolute',
    width: '100%',
    zIndex: 20,
  },
  container: {
    overflow: 'visible',
  },
})
