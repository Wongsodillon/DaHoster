import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { FieldValues, useForm } from "react-hook-form";
import { useState } from "react";
import LoadingButton from "@/components/LoadingButton";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, provider } from "@/firebase/firebaseConfig";

const Login = () => {

    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: { errors, isSubmitted }, watch } = useForm();
    const [loginError, setLoginError] = useState<string | null>(null); 
    const nav = useNavigate()

    const loginUser = async (data: FieldValues) => {
        setLoading(true);
        try {
            let credential = await signInWithEmailAndPassword(auth, data.email, data.password);
            console.log("User logged in successfully ", credential);
            nav('/')
        }
        catch (error: string | any) {
            setLoginError("Invalid username or password"); 
        }
        finally {
            setLoading(false);
        }
    }

    const googleLogin = async () => {
        try {
            let credential = await signInWithPopup(auth, provider);
            console.log("User logged in successfully ", credential);
            nav("/")
        }
        catch (error: string | any) {
            setLoginError("Error Login with Google"); 
        }
        finally {
            setLoading(false);
        }
    }

    return ( 
        <div className="h-screen flex items-center justify-center home">
            <Card className="w-96">
                <CardHeader>
                    <CardTitle className="text-blue">Login</CardTitle>
                    <CardDescription className="text-black">Enter your credentials below</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="flex flex-col gap-4" onSubmit={handleSubmit(data => loginUser(data))}>
                        <Button className="flex gap-2 items-center w-full py-4" type="button" onClick={googleLogin} variant='outline'>
                            <img className="w-5 h-5" src="https://www.svgrepo.com/show/475656/google-color.svg" />
                            Login with Google
                        </Button>
                        <div className='flex items-center gap-4'>
                            <hr className='w-full border-t-2 border-slate-200' />
                            <span className='text-slate-400'>OR</span>
                            <hr className='w-full border-t-2 border-slate-200' />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-blue">Email</Label>
                            <Input {...register('email', {
                                required: 'Email is required'
                            })} placeholder="Enter your email" />
                            {errors.email && 
                                <p className="text-sm text-destructive">
                                    {errors.email.message as string}
                                </p>
                            }
                        </div>
                        <div className="space-y-1">
                            <Label>Password</Label>
                            <Input {...register('password', {
                                required: 'Password is required'
                            })} type="password" placeholder="Enter your password" />
                            {errors.password && 
                                <p className="text-sm text-destructive">
                                    {errors.password.message as string}
                                </p>
                            }
                            {loginError && 
                                <p className="text-sm text-destructive">{loginError}</p>
                            }
                        </div>
                        {loading ? (
                            <LoadingButton className="text-black" />
                            ) : (
                            <Button className="flex gap-2 items-center w-full py-4" type="submit">
                                Login
                            </Button>
                        )}
                        <div className="flex items-center justify-between">
                            <CardDescription>Don't have an account?</CardDescription>
                            <Link to='/register' className="on-hover">Register</Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
 
export default Login;