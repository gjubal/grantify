import { Dispatch, SetStateAction, useEffect } from 'react';
import { PaginationButton } from './styles';

interface TableFooterProps {
  range: number[];
  setPage: Dispatch<SetStateAction<number>>;
  page: number;
  slice: number[];
}

const TableFooter = ({ range, setPage, page, slice }: TableFooterProps) => {
  useEffect(() => {
    if (slice.length < 1 && page !== 1) {
      setPage(page - 1);
    }
  }, [slice, page, setPage]);
  return (
    <div className="flex flex-row">
      {range.map((el: number, index: number) => (
        <PaginationButton
          key={index}
          isActive={el === page}
          onClick={() => setPage(el)}
        >
          {el}
        </PaginationButton>
      ))}
    </div>
  );
};

export default TableFooter;
