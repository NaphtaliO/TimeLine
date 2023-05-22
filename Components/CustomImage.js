import { View } from 'react-native';
import { Image } from "react-native-expo-image-cache";

const CustomImage = ({ style, uri }) => {
  return (
    <View>
      <Image style={style} uri={uri} />
    </View>
  )
}

export default CustomImage;

