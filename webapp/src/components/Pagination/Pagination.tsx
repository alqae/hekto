import React from 'react'
import classNames from 'classnames'
import styles from './Pagination.module.scss'
import { BsSkipStartFill, BsSkipEndFill } from 'react-icons/bs'
import { motion } from 'framer-motion'

export interface PaginationProps {
  total: number
  perPage: number
  onPageChange: (pageNumber: number) => void
  pagesToShow: number
  currentPage: number
}

const Pagination: React.FC<PaginationProps> = ({ total, perPage, onPageChange, pagesToShow, currentPage }) => {
  const [maxPageLimit, setMaxPageLimit] = React.useState(pagesToShow);
  const [minPageLimit, setMinPageLimit] = React.useState(0);
  const [pages, setPages] = React.useState<number[]>([]);

  React.useEffect(() => {
    const pages = [];
    for (let i = 1; i <= Math.ceil(total / perPage); i++) {
      pages.push(i);
    }
    setPages(pages);
  }, [total, perPage]);

  const onPrevClick = () => {
    const nextPage = currentPage - 1
    calculatePagesToShow(nextPage);
    onPageChange(nextPage);
  }

  const onNextClick = () => {
    const nextPage = currentPage + 1
    calculatePagesToShow(nextPage);
    onPageChange(nextPage);
  }

  const handlePageChange = (pageToChange: number) => {
    calculatePagesToShow(pageToChange);
    onPageChange(pageToChange);
  }

  const calculatePagesToShow = (pageToCalculate: number) => {
    if (!!pageToCalculate) {
      if (pageToCalculate >= maxPageLimit) {
        setMaxPageLimit(maxPageLimit + pagesToShow);
        setMinPageLimit(minPageLimit + pagesToShow);
      } else if (pageToCalculate <= minPageLimit) {
        setMaxPageLimit(maxPageLimit - pagesToShow);
        setMinPageLimit(minPageLimit - pagesToShow);
      }
    } else {
      setMaxPageLimit(pagesToShow);
      setMinPageLimit(0);
    }
  }

  const pageNumbers = pages.map((page) => {
    if (page <= maxPageLimit && page > minPageLimit) {
      return (
        <motion.li
          key={page}
          whileTap={{ scale: 0.9 }}
          onClick={() => handlePageChange(page - 1)}
          className={classNames(styles.page, { [styles.active]: currentPage === (page - 1) })}
        >
          {page}
        </motion.li>
      );
    } else {
      return null;
    }
  });

  return (
    <ul className={classNames(styles.pagination, 'd-flex', 'gap-1', 'align-items-center', 'justify-content-center')}>
      <button
        onClick={onPrevClick}
        className={styles.arrow}
        disabled={!currentPage}
      >
        <BsSkipStartFill />
      </button>
      {minPageLimit >= 1 && <li onClick={() => handlePageChange(0)}>&hellip;</li>}
      {pageNumbers}
      {(pages.length - 1) > maxPageLimit && <li onClick={() => handlePageChange(pages.length - 1)}>&hellip;</li>}
      <button
        onClick={onNextClick}
        className={styles.arrow}
        disabled={currentPage === (pages.length - 1)}
      >
        <BsSkipEndFill />
      </button>
    </ul>
  )
}

Pagination.defaultProps = {
  pagesToShow: 5,
}

export default Pagination
