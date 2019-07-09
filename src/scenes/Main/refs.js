import Animated from 'react-native-reanimated'
import React from 'react'

export let blockRefs = []
export const horizontalGestureRef = React.createRef()
export const horizontalScrollViewRef = React.createRef()
export const verticalGestureRef = React.createRef()
export const verticalScrollViewRef = React.createRef()

export const addBlockRef = ref => {
  blockRefs = [...blockRefs, ref].filter(ref => ref.current)
}
