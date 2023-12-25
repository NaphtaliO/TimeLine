import { View } from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import { Image } from 'react-native';

const CustomImage = ({ style, uri, type }) => {

  const blurhash =
    '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';


  if (type === "profile") {
    return (
      uri === null || uri === "" ?
        <Image
          style={style}
          source={require('../assets/default_avatar.png')}
        /> :
        <ExpoImage
          style={style}
          source={uri}
          placeholder={blurhash}
          contentFit="cover"
          transition={200}
        />
    )
  } else if (type === "post-avatar") {
    return (
      uri === null || uri === "" ?
        <Image
          style={style}
          source={require('../assets/default_avatar.png')}
        /> :
        <ExpoImage
          style={style}
          source={uri}
          placeholder={blurhash}
          contentFit="cover"
          transition={200}
        />
    )
  } else if (type === "post-image") {
    return (
      uri === null || uri === "" ?
        null :
        <ExpoImage
          style={style}
          source={uri}
          placeholder={blurhash}
          contentFit="cover"
          transition={200}
        />
    )
  }
}

export default CustomImage;

