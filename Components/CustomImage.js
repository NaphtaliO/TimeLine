import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Image } from "react-native-expo-image-cache";


const CustomImage = ({ style, uri }) => {
  return (
    <View>
      <Image style={style} uri={uri} />
    </View>
  )
}

export default CustomImage

const styles = StyleSheet.create({})

// import { StyleSheet, View, Image } from 'react-native'
// import React from 'react'


// const CustomImage = ({ style, uri }) => {
//     return (
//         <View>
//             <Image style={style} source={{uri:uri}} />
//         </View>
//     )
// }

// export default CustomImage

// const styles = StyleSheet.create({})


