import React from 'react'
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { AiOutlineMail, AiOutlineLock } from 'react-icons/ai'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

import { useForgotPasswordMutation, useResetPasswordMutation } from '../../generated/graphql'
import { Button, Field, Heading } from '../../components'

interface Props { }

interface ForgotPasswordForm {
  email: string
  password: string
  confirmPassword: string
}

const formForgotSchema = Yup.object().shape({
  email: Yup.string()
    .required("Email is required")
    .email("Email is invalid")
})

const formResetSchema = Yup.object().shape({
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password length should be at least 8 characters")
    .max(12, "Password cannot exceed more than 12 characters"),
  confirmPassword: Yup.string()
    .required("Confirm Password is required")
    .min(8, "Password length should be at least 8 characters")
    .max(12, "Password cannot exceed more than 12 characters")
    .oneOf([Yup.ref("password")], "Passwords do not match")
})

const ForgotPassword: React.FC<Props> = () => {
  const navigate = useNavigate()
  const [token, setToken] = React.useState<string | null>(null)
  const [forgotPassowrd] = useForgotPasswordMutation()
  const [resetPassword] = useResetPasswordMutation()
  const [searchParams] = useSearchParams()
  const methods = useForm<ForgotPasswordForm>({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      // rememberMe: false
    },
    resolver: yupResolver(token ? formResetSchema : formForgotSchema)
  })

  const onSubmit = async (data: ForgotPasswordForm) => {
    await toast.promise(
      new Promise(async (resolve, reject) => {
        try {
          var result: boolean

          if (token) {
            const response = await resetPassword({ variables: { token, password: data.password } })
            result = response.data?.resetPassword || false

            if (result) {
              navigate("/auth/sign-in")
            }
          } else {
            const response = await forgotPassowrd({ variables: { email: data.email } })
            result = response.data?.forgotPassword || false
          }

          if (result) {
            methods.setValue("email", "")
            resolve(result)
          }
        } catch (error) {
          reject(error)
        }
      }),
      {
        loading: 'Loading...',
        success: token ? 'Password reset successfully' : 'Link sent successfully',
        error: (error) => <b>{error.message}</b>,
      }
    );
  }

  React.useEffect(() => {
    const token = searchParams.get('token')
    setToken(token)
  }, [searchParams])

  return (
    <motion.div
      viewport={{ once: true }}
      initial={{ y: !!searchParams.get('token') ? '-100%' : '100%', opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="text-center"
    >
      <Heading level={1} size="md" color="black">
        {token ? 'Reset Password' : 'Forgot Password'}
      </Heading>

      <form onSubmit={methods.handleSubmit(onSubmit)} className="mt-4 my-2 text-start">
        {
          token ? (
            <React.Fragment>
              <Field
                suffixIcon={<AiOutlineLock />}
                placeholder="Password"
                type="password"
                className="mb-3"
                name="password"
                control={methods.control}
              />

              <Field
                suffixIcon={<AiOutlineLock />}
                placeholder="Confirm Password"
                type="password"
                name="confirmPassword"
                control={methods.control}
              />
            </React.Fragment>
          ) : (
            <Field
              suffixIcon={<AiOutlineMail />}
              placeholder="Email"
              type="text"
              name="email"
              control={methods.control}
            />
          )
        }

        <Link to="/auth/sign-in" className="mt-2">Back to Sign in</Link>

        <Button type="submit" className="fw-bold mt-3">
          {token ? 'Reset Password' : 'Send Link'}
        </Button>
      </form>

      <Link to="/auth/sign-up">Don’t have an Account? Create account</Link>
    </motion.div>
  )
}

export default ForgotPassword
