import React from 'react'
import { View, Text } from 'react-native'

import Block from './Block'

const Blocks = ({ blocks, setDragging }) => {
  if (blocks.length <= 0) {
    return null
  }

  return blocks.map(({ blockTop, blockHeight }) => (
    <Block
      height={blockHeight}
      key={`${blockHeight}-${blockTop}`}
      setDragging={setDragging}
      top={blockTop}
    />
  ))
}

export default Blocks
