import React from 'react'
import * as Yup from 'yup'
import classNames from 'classnames'
import { useForm } from 'react-hook-form'
import styles from './Contact.module.scss'
import { yupResolver } from '@hookform/resolvers/yup'
import { AnimationProps, motion } from 'framer-motion'

import ContactImage from '../../assets/images/contact.png'

import { Button, Field, Heading, Paragraph } from '../../components'

const transition: AnimationProps['transition'] = {
  duration: 0.5,
  ease: [0.43, 0.13, 0.23, 0.96],
}

export interface ContactProps { }

interface ContactForm {
  name: string
  email: string
  subject: string
  message: string
}

const formSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().required("Email is required").email("Email is invalid"),
  subject: Yup.string().required("Subject is required"),
  message: Yup.string().required("Message is required"),
})

const Contact: React.FC<ContactProps> = () => {
  const methods = useForm<ContactForm>({
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
    resolver: yupResolver(formSchema)
  })

  const onSubmit = (data: ContactForm) => {
    // TODO: Send data to backend
    console.log(data)
  }

  return (
    <section className="container">
      <div className="row mb-10">
        <motion.div
          initial={{ opacity: 0, x: -70 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={transition}
          className="col-6"
        >
          <Heading level={3} size="md">Information About us</Heading>
          <Paragraph color="sub">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mattis neque ultrices
            mattis aliquam, malesuada diam est. Malesuada sem tristique amet erat vitae
            eget dolor lobortis. Accumsan faucibus vitae lobortis quis bibendum quam.
          </Paragraph>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 70 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={transition}
          className="col-6"
        >
          <Heading level={3} size="md" className="mb-3">Contact Way</Heading>

          <div className="row">
            <div className={classNames(styles.contactItem, 'col-6', 'd-flex', 'mb-6')}>
              <div className={styles.square}></div>
              <div>
                <Paragraph color="sub" as="span">Tel: 877-67-88-99</Paragraph>
                <Paragraph color="sub" as="span">E-Mail: shop@store.com</Paragraph>
              </div>
            </div>

            <div className={classNames(styles.contactItem, 'col-6', 'd-flex', 'mb-6')}>
              <div className={styles.square}></div>
              <div>
                <Paragraph color="sub" as="span">Support Forum</Paragraph>
                <Paragraph color="sub" as="span">For over 24hr</Paragraph>
              </div>
            </div>

            <div className={classNames(styles.contactItem, 'col-6', 'd-flex')}>
              <div className={styles.square}></div>
              <div>
                <Paragraph color="sub" as="span">20 Margaret st, London</Paragraph>
                <Paragraph color="sub" as="span">Great britain, 3NM98-LK</Paragraph>
              </div>
            </div>

            <div className={classNames(styles.contactItem, 'col-6', 'd-flex')}>
              <div className={styles.square}></div>
              <div>
                <Paragraph color="sub" as="span">Free standard shipping on all orders.</Paragraph>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="row pt-5">
        <motion.div
          initial={{ opacity: 0, x: -70 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={transition}
          className="col-6"
        >
          <Heading level={3} size="md">Get In Touch</Heading>
          <Paragraph color="sub" className="mb-6">

            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mattis neque ultrices
            tristique amet erat vitae eget dolor los vitae lobortis quis bibendum quam.
          </Paragraph>

          <form onSubmit={methods.handleSubmit(onSubmit)} className="row mb-4">
            <Field
              className="col-6 mb-4"
              placeholder="Your Name"
              type="text"
              name="name"
              rules={{ required: true }}
              control={methods.control}
            />
            <Field
              className="col-6 mb-4"
              placeholder="Your E-mail"
              type="text"
              name="email"
              rules={{ required: true }}
              control={methods.control}
            />

            <Field
              className="col-12 mb-4"
              placeholder="Subject"
              type="text"
              name="subject"
              rules={{ required: true }}
              control={methods.control}
            />
            <Field
              className="col-12 mb-4"
              placeholder="Type Your Messege"
              type="textarea"
              name="message"
              rules={{ required: true }}
              control={methods.control}
            />

            <div className="col">
              <Button fullWidth={false} type="submit">Send Mail</Button>
            </div>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 70 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={transition}
          className="col-6"
        >
          <img src={ContactImage} alt="Contact" />
        </motion.div>
      </div>
    </section>
  )
}

export default Contact
