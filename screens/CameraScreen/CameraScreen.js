// import { Button, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import React, { useState, useEffect } from 'react';
// import { AutoFocus, Camera, CameraType } from 'expo-camera';
// import * as FaceDetector from 'expo-face-detector';
// import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';
// import { Ionicons } from '@expo/vector-icons';
// import Photo from '../../Components/Photo';

// const CameraScreen = ({ navigation }) => {
//     const [camera, setCamera] = useState(null);
//     const [image, setImage] = useState(null);
//     const [flashOn, setFlashOn] = useState(0);
//     const [type, setType] = useState(CameraType.front);
//     const [permission, requestPermission] = Camera.useCameraPermissions();
//     const [numTaps, setNumTaps] = useState(0);
//     const [lastTap, setLastTap] = useState(null);

//     // useEffect(() => {
//     //     requestPermission()
//     // })

//     if (!permission) {
//         // Camera permissions are still loading
//         return <View />;
//     }

//     if (!permission.granted) {
//         // Camera permissions are not granted yet
//         return (
//             <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center' }}>
//                 <Text style={{ textAlign: 'center', color: 'black' }}>
//                     We need your permission to access the camera
//                 </Text>
//                 <Button onPress={() => requestPermission()} title="Grant permission" />
//             </View>
//         );
//     }



//     //Checking and changing camera type
//     function toggleCameraType() {
//         setType((current) => (
//             current === CameraType.back ? CameraType.front : CameraType.back
//         ));
//     }

//     const doubleTab = () => {
//         const now = Date.now();
//         if (lastTap && (now - lastTap) < 250) {
//             // Double tap detected
//             setNumTaps(numTaps + 1);
//             setLastTap(null);
//         } else {
//             setLastTap(now);
//         }
//     }

//     //Manipulates an image by flipping it horizontally
//     const manipulateResult = async (image) => {
//         try {
//             const manipResult = await manipulateAsync(image.localUri || image.uri,
//                 [{ flip: FlipType.Horizontal }],
//                 { compress: 1, format: SaveFormat.PNG }
//             );
//             return manipResult;
//         } catch (error) {
//             console.log(error);
//         }

//     }

//     return (
//         <SafeAreaView style={styles.container}>
//             {image ? <Photo image={image} setImage={setImage} navigation={navigation} /> :
//                 <Camera
//                     ref={ref => setCamera(ref)}
//                     style={styles.camera}
//                     type={type}
//                     autoFocus={AutoFocus.on}
//                     flashMode={flashOn}
//                     focusDepth={0.5}
//                     pictureSize={"4:3"}
//                     faceDetectorSettings={{
//                         mode: FaceDetector.FaceDetectorMode.fast,
//                         detectLandmarks: FaceDetector.FaceDetectorLandmarks.none,
//                         runClassifications: FaceDetector.FaceDetectorClassifications.none,
//                         minDetectionInterval: 100,
//                         tracking: true,
//                     }}>

//                     <View style={styles.buttonsContainer}>
//                         <View style={styles.button}>
//                             <TouchableOpacity onPress={() => !flashOn ? setFlashOn(1) : setFlashOn(0)} style={styles.items}>
//                                 {flashOn ? <Ionicons name="flash" size={27} color="white" /> : <Ionicons name="flash-off" size={27} color="white" />}
//                             </TouchableOpacity>
//                         </View>
//                         <View style={styles.button}>
//                             <TouchableOpacity
//                                 onPress={
//                                     async () => {
//                                         // HAD TO PUT THIS IN HERE TO ACCESS NAVIGATION
//                                         if (camera) {
//                                             const photo = await camera.takePictureAsync()
//                                             const flippedPicture = await manipulateResult(photo)
//                                             setImage(flippedPicture);
//                                             //navigation.navigate('ImageScreen', { image: flippedPicture })
//                                         }
//                                     }
//                                 }
//                             >
//                                 <View style={{
//                                     borderWidth: 5,
//                                     borderColor: 'white',
//                                     borderRadius: 50,
//                                     width: 70,
//                                     height: 70,
//                                 }}>

//                                 </View></TouchableOpacity>
//                         </View>
//                         <View style={styles.button}>
//                             <TouchableOpacity onPress={toggleCameraType} style={styles.items}><Ionicons name="camera-reverse" size={30} color="white" /></TouchableOpacity>
//                         </View>
//                     </View>
//                 </Camera>
//             }
//             {image ?
//                 <View style={{ flexDirection: 'row', }}>
//                     <TouchableOpacity onPress={() => setImage(null)}>
//                         <View style={styles.buttonContainer}>
//                             <Text style={styles.buttonText}>Take Again</Text>
//                         </View>
//                     </TouchableOpacity>
//                     <TouchableOpacity onPress={() => navigation.navigate('Post', { passedImage: image })}>
//                         <View style={styles.buttonContainer}>
//                             <Text style={styles.buttonText}>Use Photo</Text>
//                         </View>
//                     </TouchableOpacity>
//                 </View>
//                 :
//                 <View style={styles.textPosition}>
//                     <Text style={styles.text}>Take a picture</Text>
//                 </View>

//             }
//         </SafeAreaView>
//     );
// }

// export default CameraScreen

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         backgroundColor: 'black',
//     },
//     camera: {
//         flex: 1,
//         borderRadius: 26,
//         marginBottom: 90
//     },
//     items: {
//         paddingVertical: 10,
//     },
//     buttonsContainer: {
//         position: 'absolute',
//         bottom: 10,
//         flexDirection: 'row',
//         flex: 1,
//         width: '100%',
//         padding: 20,
//         justifyContent: 'space-between'
//     },
//     button: {
//         alignSelf: 'center',
//         flex: 1,
//         alignItems: 'center'
//     },
//     text: {
//         color: 'white'
//     },
//     buttonText: {
//         padding: 10,
//         color: 'white',
//         fontWeight: "600",
//     },
//     textPosition: {
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginBottom: 'auto',
//         //position: 'relative'
//     },
//     buttonContainer: {
//         backgroundColor: '#3AB0FF',
//         borderRadius: 10,
//         justifyContent: 'center',
//         alignItems: 'center',
//         alignSelf: 'center',
//         margin: 30,
//         width: '90%',
//     }
// });




