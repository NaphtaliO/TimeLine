import { useDispatch } from "react-redux"
import { logOut } from "../src/redux/userSlice";
import { setFeed } from "../src/redux/feedSlice";
import { setPosts } from "../src/redux/postsSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useLogout = () => {
    const dispatch = useDispatch();

    const logout = async () => {
        try {
            //remove user from react native storage
            await AsyncStorage.removeItem('user');
            await AsyncStorage.removeItem('feed');
            //update redux state
            dispatch(setPosts([]));
            dispatch(setFeed([]));
            dispatch(logOut());
        } catch (error) {
            console.log(e.message);
        }
    }

    return { logout }
}