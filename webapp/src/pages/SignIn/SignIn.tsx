import React from 'react'
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { yupResolver } from '@hookform/resolvers/yup'
import { AiOutlineMail, AiOutlineLock } from 'react-icons/ai'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

import { useActivateUserMutation, useSignInMutation } from '../../generated/graphql'
import { Button, Field, Heading, Paragraph } from '../../components'
import { setToken } from '../../store/reducers'

interface Props { }

interface UserSignUpForm {
  email: string
  password: string
  rememberMe: boolean
}

const formSchema = Yup.object().shape({
  email: Yup.string().required("Email is required").email("Email is invalid"),
  password: Yup.string().required("Password is required"),
  rememberMe: Yup.boolean().optional()
})

const SignIn: React.FC<Props> = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [signIn] = useSignInMutation()
  const [activateUser] = useActivateUserMutation()
  const [searchParams] = useSearchParams()
  const methods = useForm<UserSignUpForm>({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false
    },
    resolver: yupResolver(formSchema)
  })

  React.useEffect(() => {
    const token = searchParams.get('token')

    if (token) {
      toast.promise(
        new Promise(async (resolve, reject) => {
          try {
            const result = await activateUser({ variables: { token } })
            if (result.data?.activeUser.token) {
              dispatch(setToken(result.data?.activeUser.token))
              navigate("/", { replace: true })
              resolve(result)
            }
          } catch (error) {
            reject(error)
          }
        }),
        {
          loading: 'Loading...',
          success: 'Account activated successfully',
          error: (error) => <b>{error.message}</b>,
        }
      )
    }
  }, [activateUser, dispatch, navigate, searchParams])

  const onSubmit = async (data: UserSignUpForm) => {
    await toast.promise(
      new Promise(async (resolve, reject) => {
        try {
          const result = await signIn({
            variables: {
              email: data.email,
              password: data.password,
            },
          })

          if (result.data?.signIn.token) {
            dispatch(setToken(result.data?.signIn.token))
            navigate("/", { replace: true })
            resolve(result)
          }
        } catch (error) {
          reject(error)
        }
      }),
      {
        loading: 'Loading...',
        success: 'Login successfully',
        error: (error) => <b>{error.message}</b>,
      }
    )
  }

  return (
    <motion.div
      viewport={{ once: true }}
      initial={{ x: '100%', opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="text-center"
    >
      <Heading level={1} size="md" color="black">Log in</Heading>
      <Paragraph size="md" color="gray" className="mb-3">
        Please login using account detail bellow.
      </Paragraph>

      <form onSubmit={methods.handleSubmit(onSubmit)} className="text-start mb-3">
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

        <Link to="/auth/forgot" className="mb-3 text-start">Forgot password?</Link>
        <Button type="submit" className="fw-bold">Sign In</Button>
      </form>

      <Link to="/auth/sign-up">Don’t have an Account? Create account</Link>
    </motion.div>
  )
}

export default SignIn
