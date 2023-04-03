import React from 'react'
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { BiRename } from 'react-icons/bi'
import { useForm } from 'react-hook-form'
import { Link, redirect } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import { AiOutlineLock, AiOutlineMail } from 'react-icons/ai'

import { Button, Checkbox, Field, Heading } from '../../components'
import { useSignUpMutation } from '../../generated/graphql'

interface Props { }

interface UserSignUpForm {
  firstName: string
  lastName: string
  email: string
  password: string
  termsAndConditions: boolean
}

const formSchema = Yup.object().shape({
  firstName: Yup.string()
    .required("FirstName is required"),
  lastName: Yup.string()
    .required("LastName is required"),
  email: Yup.string()
    .required("Email is required")
    .email("Email is invalid"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password length should be at least 8 characters")
    .max(12, "Password cannot exceed more than 12 characters"),
})

const SignUp: React.FC<Props> = () => {
  const [signUp] = useSignUpMutation()

  const methods = useForm<UserSignUpForm>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      termsAndConditions: false
    },
    resolver: yupResolver(formSchema)
  });

  const onSubmit = async (data: UserSignUpForm) => {
    await toast.promise(
      new Promise(async (resolve, reject) => {
        try {
          const result = await signUp({
            variables: {
              email: data.email,
              firstName: data.firstName,
              lastName: data.lastName,
              password: data.password,
            }
          })

          if (result.data?.signUp) {
            redirect("/auth/sign-in")
            resolve(result.data?.signUp)
          }
        } catch (error) {
          reject(error)
        }
      }),
      {
        loading: 'Saving...',
        success: 'Account created successfully',
        error: (error) => <b>{error.message}</b>,
      }
    );
  };

  return (
    <motion.div
      viewport={{ once: true }}
      initial={{ x: '-100%', opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="text-center"
    >
      <Heading level={1} size="md" color="black">Sign up</Heading>
      {/* <Paragraph size="md" color="gray" className="mb-3">
        Please login using account detail bellow.
      </Paragraph> */}

      <form onSubmit={methods.handleSubmit(onSubmit)} className="text-start my-3">
        <Field
          suffixIcon={<BiRename />}
          placeholder="First Name"
          type="text"
          name="firstName"
          className="mb-3"
          control={methods.control}
        />

        <Field
          suffixIcon={<BiRename />}
          placeholder="Last Name"
          type="text"
          name="lastName"
          className="mb-3"
          control={methods.control}
        />

        <Field
          suffixIcon={<AiOutlineMail />}
          placeholder="Email"
          type="text"
          name="email"
          className="mb-3"
          control={methods.control}
        />

        <Field
          suffixIcon={<AiOutlineLock />}
          placeholder="Password"
          type="password"
          name="password"
          className="mb-2"
          control={methods.control}
        />

        {/* <Checkbox
          control={methods.control}
          name="termsAndConditions"
          required={true}
          className="mb-2"
          label={<>I agree to these <Link to="/">Terms and Conditions</Link></>}
        /> */}

        <Link to="/auth/forgot" className="mb-2 text-start">Forgot password?</Link>
        <Button type="submit" className="fw-bold">Sign Up</Button>
      </form>

      <Link to="/auth/sign-in">Already have an account? Sign in</Link>
    </motion.div>
  )
}

export default SignUp
