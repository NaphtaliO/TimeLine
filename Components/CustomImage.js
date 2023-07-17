import { View } from 'react-native';
import { Image } from 'expo-image';

const CustomImage = ({ style, uri }) => {

  const blurhash =
    '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

  return (
    <View>
      <Image
        style={style}
        source={uri}
        placeholder={blurhash}
        contentFit="cover"
        transition={200}
      />
    </View>
  )
}

export default CustomImage;

