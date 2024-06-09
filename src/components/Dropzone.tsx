import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore"; 
import { db, storage } from "@/firebase/firebaseConfig";
import { FaCloudUploadAlt } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { Button } from "./ui/button";
import { FaDownload } from "react-icons/fa";
import { IoMdImages } from "react-icons/io";
import LoadingButton from "./LoadingButton";
import copy from "copy-to-clipboard";
import { MdContentCopy } from "react-icons/md";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog"
import { Input } from "./ui/input";
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/context/UserContext";

type DropzoneProps = {
    className?: string;
    toggleDropzone: () => void;
    show: boolean;
}

const Dropzone = ({ className = '', toggleDropzone, show }: DropzoneProps) => {
    const [files, setFiles] = useState<(File & {preview:string})[]>([]);
    const [loading, setLoading] = useState(false);  
    const [showDialog, setShowDialog] = useState(false);
    const [downloadURL, setDownloadURL] = useState('' as string);

    const { toast } = useToast()

    const { user } = useAuth();

    const copyToClipboard = () => {
        copy(downloadURL);
        toast({
            description: "Link copied to clipboard",
        })
    }

    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            'image/*': []
        },
        onDrop: acceptedFiles => {
            setFiles(acceptedFiles.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file)
            })));
        }
    })

    useEffect(() => {
        setDownloadURL('')
    }, [files])

    const handleUpload = async () => {
        setLoading(true);
        if (downloadURL !== '') {
            setLoading(false);
            setShowDialog(true);
            return;
        }
        const file = files[0];
        const storageRef = ref(storage, `images/${file.name}`);
        try {
            const snapshot = await uploadBytes(storageRef, file);
            console.log('Uploaded a blob or file!', snapshot);
            const url = await getDownloadURL(storageRef);
            setDownloadURL(url);
            setLoading(false);
            setShowDialog(true);
    
            if (user) {
                const docRef = await addDoc(collection(db, 'images'), {
                    file_name: file.name,
                    link: url,
                    user_id: user?.uid,
                    uploaded_at: new Date().toISOString(),
                });
                console.log(docRef);
            }
        } catch (error) {
            console.error('Error uploading file: ', error);
            setLoading(false);
        }
    }
    
    const handleClose = () => {
        if (files.length > 0) {
            URL.revokeObjectURL(files[0].preview)
            setFiles([])
        }
        else {
            toggleDropzone()
        }
    }

    return (
        <div className={`w-full fixed z-50 flex flex-col bg-black text-white px-8 pb-8 pt-4 duration-500 ease-in-out transition-all ${show ? ' translate-y-0  ' : ' -translate-y-full '} ${className}`}>
            <div className="flex items-center w-full justify-between">
                <p>JPG JPEG WEBP AVIF</p>   
                <Button onClick={handleClose} className="flex bg-transparent hover:bg-transparent items-center gap-1 px-2">
                    <IoMdClose onClick={() => setFiles([])} size={24}/>
                    {files.length > 0 ? 'Remove' : 'Close'}
                </Button>
            </div>
            <div {...getRootProps()} className='flex flex-col items-center gap-4'>
                <input {...getInputProps()} />
                {files.length === 0 ? (
                    <>
                        <div className="cursor-pointer">
                            <FaDownload size={64} color="gray"  />
                        </div>
                        <p>Drag & Drop your image here</p>
                        <p>or</p>
                        <Button className="flex items-center gap-1">
                            <FaCloudUploadAlt size={24}/>
                            Browse
                        </Button>
                    </> ) : (
                        <>
                        <div>
                            <IoMdImages size={64} color="gray"  />
                        </div>
                        <p>Drag & Drop your image here</p>
                        <div className="max-w-40 max-height-40">
                            <img src={files[0].preview} alt="" />
                        </div>
                    </>
                )}
            </div>
            {files.length > 0 &&
                (<div className="w-full flex justify-center mt-8">
                    {loading ? (
                        <LoadingButton />
                    ) : 
                        <Button onClick={handleUpload} className="bg-green-500 hover:bg-green-400">
                            Upload
                        </Button>
                    }
                </div>)
            }
            <Dialog open={showDialog} >
                <DialogContent>
                    <DialogHeader className="flex flex-row justify-center items-center gap-4">
                        <DialogTitle className="text-black/80 text-2xl">Upload Successful</DialogTitle>
                    </DialogHeader>
                    <DialogDescription className="flex flex-col gap-2 items-center">
                        <img src={downloadURL} loading="lazy" alt="Image not working" className="max-w-64 max-h-64" />
                        <div className="flex w-full gap-2">
                            <Input disabled={true} value={downloadURL} className="w-full" />
                            <Button onClick={copyToClipboard} className="flex items-center gap-2">
                                <MdContentCopy size={24} />
                            </Button>
                        </div>
                    </DialogDescription>
                    <DialogFooter>
                        <Button className="bg-red-500 hover:bg-red-400" onClick={() => setShowDialog(false)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Dropzone;