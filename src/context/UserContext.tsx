import { auth, db } from "@/firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { User } from "@/types/User";
import { Children } from "@/types/Children";

export const UserContext = createContext<{ user: User | null, loading: boolean }>({ user: null, loading: true });

export default function UserContextProvider({ children }: Children) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (currentUser: any) => {
            setLoading(true)
            if (currentUser) {
                const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
                if (userDoc.exists()) {
                    currentUser['name'] = userDoc.data().name;
                    currentUser['email'] = userDoc.data().email;
                }
            }
            setUser(currentUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [location]);

    return <UserContext.Provider value={{ user, loading }}>{children}</UserContext.Provider>;
}

export const useAuth = () => {
    return useContext(UserContext);
}
