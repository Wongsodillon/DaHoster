import { Button } from "./ui/button";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const LoadingButton = ({ className = "" }: { className?: string }) => {
    return (  
        <Button className={"flex gap-2 items-center py-4 text-black " + className} variant='outline'>
            <AiOutlineLoading3Quarters className="animate-spin w-5 h-5" />
            Loading...
        </Button>
    );
}
 
export default LoadingButton;