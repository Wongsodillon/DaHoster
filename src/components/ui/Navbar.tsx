import { useAuth } from "@/context/UserContext";
import { auth } from "@/firebase/firebaseConfig";
import { signOut } from "firebase/auth";
import { Button } from "./button";
import { Link } from "react-router-dom";
import { FaCloudUploadAlt } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

type NavbarProps = {
    toggleDropzone?: () => void;
}

const Navbar = ({ toggleDropzone }: NavbarProps) => {
    const { user, loading } = useAuth();

    return (
        <div className="flex fixed w-full justify-between items-center py-6 px-8 bg-black text-white">
            <Link to='/' className="text-xl font-bold">DaHoster</Link>
            {loading ? (
                <div className="flex gap-2 items-center">
                    <AiOutlineLoading3Quarters className="animate-spin w-5 h-5" />
                    Loading...
                </div>
            ) : user ? (
                <div className="flex items-center gap-4">
                    <Button onClick={toggleDropzone} className="flex items-center gap-2 text-lg bg-white text-black hover:bg-white/80">
                        <FaCloudUploadAlt />
                        Upload
                    </Button>
                    <Button className="bg-destructive hover:bg-destructive/80" onClick={() => signOut(auth)}>
                        Sign Out
                    </Button>
                </div>
            ) : (
                <div className="flex items-center gap-6">
                    <Button onClick={toggleDropzone} className="flex items-center gap-2 text-lg bg-white text-black hover:bg-white/80">
                        <FaCloudUploadAlt />
                        Upload
                    </Button>
                    <Link to="/login" className="on-hover">Login</Link>
                    <Link to="/register" className="on-hover">Register</Link>
                </div>
            )}
        </div>
    );
}

export default Navbar;
