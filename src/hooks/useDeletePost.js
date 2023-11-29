import { useDispatch, useSelector } from "react-redux";
import { useLogout } from "./useLogout";
import { deletePost } from "../redux/postsSlice";
import { deletePostInFeed } from "../redux/feedSlice";
import { getStorage, ref, deleteObject } from 'firebase/storage';
import { URL } from '@env';
import { Alert } from "react-native";

export const useDeletePost = () => {
    const user = useSelector((state) => state.user.value);
    const dispatch = useDispatch();
    const { logout } = useLogout();

    const deleteFromFirebase = async (url) => {
        if (url === null || url === "") {
            null
        } else {
            try {
                let pictureRef = ref(getStorage(), url);
                await deleteObject(pictureRef).then(() => {
                    console.log("Deletion Successful");
                })
            } catch (error) {
                console.log(error.message);
            }
        }
    }

    const deletePostUI = async (id, uri) => {
        Alert.alert('Delete this post?', '', [
            { text: 'Cancel', onPress: () => { }, style: 'cancel' },
            {
                text: 'Delete', style: 'default', onPress: async () => {
                    await deleteFromFirebase(uri)
                    try {
                        const response = await fetch(`${URL}/api/posts/deletePost/${id}`, {
                            method: 'DELETE',
                            headers: {
                                'Authorization': `Bearer ${user.token}`
                            },
                        });
                        const json = await response.json()
                        if (!response.ok) {
                            if (json.error === "Request is not authorized") {
                                logout()
                            }
                        }
                        if (response.ok) {
                            dispatch(deletePost(json));
                            dispatch(deletePostInFeed(json))
                        }
                    } catch (error) {
                        console.log(error.message);
                    }
                }
            }
        ])

    };

    return { deletePostUI }
}