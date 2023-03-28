import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

import NotFoundImage from '../../assets/images/404.png'

import { Heading } from '../Heading'
import { Button } from '../Button'

export interface NoMatchProps { }

const NoMatch: React.FC<NoMatchProps> = () => {
  const navigate = useNavigate()

  return (
    <motion.section
      className="container text-center"
      viewport={{ once: true }}
      initial={{ y: -100, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.25, duration: 0.5 }}
    >
      <img src={NotFoundImage} alt="Not Found" className="mb-4" />
      <Heading level={2} size="xs" className="mb-4">oops!, The page you requested was not found!</Heading>
      <Button onClick={() => navigate('/', { replace: true })} fullWidth={false}>Back To Home</Button>
    </motion.section>
  )
}

export default NoMatch
