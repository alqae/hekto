import React from 'react'
import * as Yup from 'yup'
import classNames from 'classnames'
import styles from './Faq.module.scss'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { AnimationProps, motion } from 'framer-motion'

import Paragraph from '@components/Paragraph'
import Heading from '@components/Heading'
import Button from '@components/Button'
import Field from '@components/Field'

const transition: AnimationProps['transition'] = {
  duration: 0.5,
  ease: [0.43, 0.13, 0.23, 0.96],
}

interface FaqProps { }

interface FaqForm {
  name: string
  subject: string
  message: string
}

const formSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  subject: Yup.string().required("Subject is required"),
  message: Yup.string().required("Subject is required")
})

export const Faq: React.FC<FaqProps> = () => {
  const questions = [
    {
      question: 'Eu dictumst cum at sed euismood condimentum?',
      answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tincidunt sed tristique mollis vitae, consequat gravida sagittis.'
    },
    {
      question: 'Magna bibendum est fermentum eros.',
      answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tincidunt sed tristique mollis vitae, consequat gravida sagittis.'
    },
    {
      question: 'Odio muskana hak eris conseekin sceleton?',
      answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tincidunt sed tristique mollis vitae, consequat gravida sagittis.'
    },
    {
      question: 'Elit id blandit sabara boi velit gua mara?',
      answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tincidunt sed tristique mollis vitae, consequat gravida sagittis.'
    }
  ]

  const methods = useForm<FaqForm>({
    defaultValues: {
      name: "",
      subject: "",
      message: "",
    },
    resolver: yupResolver(formSchema)
  })

  const onSubmit = (data: FaqForm) => {
    console.warn('data', data);
  }

  return (
    <section className={classNames(styles.faq, 'container')}>
      <motion.div
        initial={{ opacity: 0, x: 70 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={transition}
        className="row"
      >
        <div className="col-6 pe-10">
          <Heading level={2} size="md" className="mb-8">Generel Information</Heading>

          {questions.map((question, index) => (
            <div className={classNames({ 'mb-8': index !== (questions.length - 1) })}>
              <Heading level={4} size="xs" className="mb-2">{question.question}</Heading>
              <Paragraph color="sub">{question.answer}</Paragraph>
            </div>
          ))}
        </div>

        <motion.form
          initial={{ opacity: 0, x: 70 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={transition}
          className={classNames(
            'col-6',
            'px-5',
            'py-8',
            'd-flex',
            'flex-column',
            'justify-content-between',
          )}
          onSubmit={methods.handleSubmit(onSubmit)}
        >
          <Heading level={3} size="sm" className="mb-10">Ask a Question</Heading>

          <Field
            className="mb-4"
            placeholder="Your Name"
            type="text"
            name="name"
            rules={{ required: true }}
            control={methods.control}
          />
          <Field
            className="mb-4"
            placeholder="Subject"
            type="text"
            name="subject"
            rules={{ required: true }}
            control={methods.control}
          />
          <Field
            className="mb-4"
            placeholder="Type Your Messege"
            type="textarea"
            name="message"
            rules={{ required: true }}
            control={methods.control}
          />

          <div>
            <Button fullWidth={false} type="submit">Send Mail</Button>
          </div>
        </motion.form>
      </motion.div>
    </section>
  )
}
