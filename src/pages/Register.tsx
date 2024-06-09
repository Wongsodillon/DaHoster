import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";
import { Link, useNavigate } from "react-router-dom";
import { useForm, FieldValues } from "react-hook-form";
import LoadingButton from "@/components/LoadingButton";
import { db } from "@/firebase/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

const Register = () => {
    const { register, handleSubmit, formState: { errors, isSubmitted }, watch } = useForm();
    const nav = useNavigate();
    const password = watch('password');
    const [loading, setLoading] = useState(false);
    const [registrationError, setRegistrationError] = useState<string | null>(null); 

    const registerUser = async (data: FieldValues) => {
        console.log(data)
        setLoading(true);
        setRegistrationError(null); 
        try {
            let credential = await createUserWithEmailAndPassword(auth, data.email, data.password);
            await setDoc(doc(db, 'users', credential.user.uid), {
                "name": data.full_name,
                'email': data.email
            })
            console.log("User registered successfully ", credential);
            nav('/login');
        } catch (error: string | any) {
            console.error("Error registering user: ", error);
            setRegistrationError(error.message); 
        } finally {
            setLoading(false);
        }
    };

    return ( 
        <div className="h-screen home flex items-center justify-center py-16">
            <Card className="w-96">
                <CardHeader>
                    <CardTitle>Register</CardTitle>
                    <CardDescription>Enter your details below</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="flex flex-col gap-4" onSubmit={handleSubmit(registerUser)}>
                        <div>
                            <Label>Full Name</Label>
                            <Input {...register('full_name', {
                                required: 'Full Name is required'
                            })} placeholder="Enter your full name" />
                            {isSubmitted && errors.full_name && (
                                <p className="text-sm text-destructive">
                                    {errors.full_name.message as string}
                                </p>
                            )}
                        </div>
                        <div className="space-y-1">
                            <Label>Email</Label>
                            <Input {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                    message: 'Please enter a valid email'
                                }
                            })} placeholder="Enter your email" />
                            {isSubmitted && errors.email && (
                                <p className="text-sm text-destructive">
                                    {errors.email.message as string}
                                </p>
                            )}
                            {registrationError && (
                                <p className="text-sm text-destructive">{registrationError}</p>
                            )}
                        </div>
                        <div className="space-y-1">
                            <Label>Password</Label>
                            <Input {...register("password", {
                                required: 'Password is required',
                                minLength: {
                                    value: 6,
                                    message: 'Password must be at least 6 characters'
                                }
                            })} type="password" placeholder="Enter your password" />
                            {isSubmitted && errors.password && (
                                <p className="text-sm text-destructive">
                                    {errors.password.message as string}
                                </p>
                            )}
                        </div>
                        <div className="space-y-1">
                            <Label>Confirm Password</Label>
                            <Input {...register("confirm_password", {
                                required: 'Confirm Password is required',
                                validate: value => value === password || 'Passwords do not match'
                            })} type="password" placeholder="Reenter your password" />
                            {isSubmitted && errors.confirm_password && (
                                <p className="text-sm text-destructive">
                                    {errors.confirm_password.message as string}
                                </p>
                            )}
                        </div>
                        {loading ? (
                            <LoadingButton />
                            ) : (
                                <Button type="submit" className="flex gap-2 items-center w-full py-4">
                                    Register
                                </Button>
                        )}
                        <div className="flex items-center justify-between">
                            <CardDescription>Already have an account?</CardDescription>
                            <Link to='/login' className="on-hover">Login</Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default Register;
