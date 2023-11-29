import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLogout } from "./useLogout";
import { updateFavourites } from "../redux/userSlice";
import { URL } from '@env';

export const useAddToFavourites = () => {
    const [loading, setLoading] = useState(false);
    const user = useSelector((state) => state.user.value);
    const dispatch = useDispatch();
    const { logout } = useLogout();

    const addToFavourites = async (id) => {
        if (loading) {
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(`${URL}/api/posts/addToFavourites/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                },
            });
            const json = await response.json();
            if (!response.ok) {
                if (json.error === "Request is not authorized") {
                    logout()
                }
            }
            if (response.ok) {
                dispatch(updateFavourites(json));
            }
        } catch (error) {
            console.log(error.message);
        }
        setLoading(false);
    }

    return { addToFavourites }
}