"use client";

import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form } from "@/components/ui/form";
import { Button } from './ui/button';
import CustomFormField from './CustomFormField';
import { authFormSchema } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signIn, signUp } from '@/lib/actions/user.actions';
import PlaidLink from './PlaidLink';

    
const AuthForm = ({ type }: { type: string }) => {

    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const formSchema =  authFormSchema(type);
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            firstName: "",
            lastName: "",
            address1: "",
            state: "",
            postalCode: "",
            dateOfBirth: "",
            ssn: "",
        }
    })

    const onSubmit = async(data: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        try {
            //sign-up
            if(type === 'sign-up') {
                const userData = {
                    firstName: data.firstName!,
                    lastName: data.lastName!,
                    address1: data.address1!,
                    city: data.city!,
                    state: data.state!,
                    postalCode: data.postalCode!,
                    dateOfBirth: data.dateOfBirth!,
                    ssn: data.ssn!,
                    email: data.email,
                    password: data.password,
                }
                const newUser = await signUp(userData);

                setUser(newUser);
            }
            //sign in
            if(type === 'sign-in') {
                const response = await signIn({
                    email: data.email,
                    password: data.password,
                });
                
                if(response) router.push('/')
            }
            // console.log(values);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);         
        }
    }

  return (
    <section className='auth-form'>
        <header className='flex flex-col gap-5 md:gap-8'>
            <Link href={'/'} className='flex cursor-pointer items-center gap-1'>
                <Image src='/icons/logo.svg' alt='logo' width={34} height={34} />
                <h1 className='text-26 text-bold text-black-1 font-ibm-plex-serif'>Martin's</h1>
            </Link>
            <div className='flex flex-col gap-1 md:gap-3'>
                <h1 className='text-24 lg:text-36 font-semibold text-gray-900'>
                    {user ? 'Link Account' : type === 'sign-in' ? 'Sign In' : 'Sign Up'}
                    <p className='text-16 font-normal text-gray-600'>
                        {user ? 'Link your account to get started':'Please enter your details'}
                    </p>
                </h1>
            </div>
        </header>
        {user ? (
            <div className='flex flex-col gap-4'>
                <PlaidLink user={ user } variant='primary' />
            </div>
        ) : ( 
            <>
            <Form { ...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                    { type === 'sign-up' && (
                        <>
                        <div className='flex gap-4'>
                            <CustomFormField control={ form.control } name='firstName' label='First Name' />
                            <CustomFormField control={ form.control } name='lastName' label='Last Name' />
                        </div>
                        <div className='flex gap-4'>
                        <CustomFormField control={ form.control } name='address1' label='Address' />
                        <CustomFormField control={ form.control } name='city' label='City' />
                        </div>
                        <div className='flex gap-4'>
                            <CustomFormField control={ form.control } name='state' label='State' placeholder='Two letter abbreviation.' />
                            <CustomFormField control={ form.control } name='postalCode' label='Postal Code' placeholder='Five-digit ZIP code'/>
                        </div>
                        <div className='flex gap-4'>
                            <CustomFormField control={ form.control } name='dateOfBirth' label='Date of Birth' placeholder='YYYY-MM-DD' />
                            <CustomFormField control={ form.control } name='ssn' label='SSN' placeholder='Last 4 or full 9 digits'/>
                        </div>
                        </>
                    )}

                    <CustomFormField control={ form.control } name='email' label='Email' />
                    <CustomFormField control={ form.control } name='password' label='Password' />

                <div className='flex flex-col gap-4'>
                    <Button className='form-btn' type='submit' disabled={isLoading}>
                        {isLoading ? (
                            <>
                            <Loader2 size={20} className='animate-spin' /> &nbsp; Loading...
                            </>
                        ): type === 'sign-in' ? 'Sign In' : 'Sign Up'}
                    </Button>
                </div>
                </form>
            </Form>
            <footer className='flex justify-center gap-1'>
                <p className='text-14 font-normal text-gray-600'>
                    {type === 'sign-in' ? "Don't have an account?" : "Already have an account"}
                </p>
                <Link className="form-link" href={type === 'sign-in' ? 'sign-up' : 'sign-in'}>
                    { type === 'sign-in' ? 'Sign Up' : 'Sign In'}
                </Link>
            </footer>
            </>
        )}  
    </section>
  )
}

export default AuthForm