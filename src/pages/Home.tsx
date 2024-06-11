import { useEffect, useState } from "react";
import Dropzone from "@/components/Dropzone";
import Navbar from "@/components/ui/Navbar";
import { Toaster } from "@/components/ui/toaster"
import "../index.css"
import { Button } from "@/components/ui/button";

const Home = () => {

    const [showDropzone, setShowDropzone] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
  
    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
        setShowDropzone(true);
    };

    const toggleDropzone = () => {
        setShowDropzone(!showDropzone);
    }

    useEffect(() => console.log(isDragging), [isDragging])

    return ( 
        <>
            <Dropzone show={showDropzone} toggleDropzone={toggleDropzone} />
            <div className={`h-screen home ${showDropzone ? 'brightness-50 transition-all duration-800' : ""}`} onDragEnter={handleDragEnter}>
                <Navbar toggleDropzone={toggleDropzone} />
                <div className={`select-none text-white pt-60 flex gap-4 flex-col items-center`}>
                    <p className="text-3xl sm:text-5xl text-center font-bold">Upload and share your images.</p>
                    <p className="text-2xl">Drag & Drop your image here</p>
                    <Button onClick={() => setShowDropzone(true)} disabled={showDropzone} className="py-8 px-8 text-xl">
                        Start Uploading
                    </Button>
                </div>
                <Toaster />
            </div>
        </>
    );
}

export default Home;
