import React from 'react';
import { Link } from 'react-router-dom';

import { Dropdown, Stack } from 'react-bootstrap';
import PropTypes from 'prop-types';

export const DEFAULT_PER_PAGE = 50;
export const DEFAULT_PAGE = 1;

export default function PaginationForTable({
  page,
  perPage,
  pagination,
  tableToDisplay,
  queryParamString,
  path,
}) {
  const PER_PAGE_OPTIONS = [2, 10, 50, 100];

  const buildPerPageDropdown = () => {
    const perPageDropdownRows = PER_PAGE_OPTIONS.map((perPageOption) => {
      if (perPageOption === perPage) {
        return (
          <Dropdown.Item
            key={perPageOption}
            href={`${path}?page=1&per_page=${perPageOption}`}
            active
          >
            {perPageOption}
          </Dropdown.Item>
        );
      }
      return (
        <Dropdown.Item
          key={perPageOption}
          href={`${path}?page=1&per_page=${perPageOption}`}
        >
          {perPageOption}
        </Dropdown.Item>
      );
    });
    return (
      <Stack direction="horizontal" gap={3}>
        <Dropdown className="ms-auto" id="pagination-page-dropdown">
          <Dropdown.Toggle
            id="process-instances-per-page"
            variant="light border"
          >
            Number to show: {perPage}
          </Dropdown.Toggle>

          <Dropdown.Menu variant="light">{perPageDropdownRows}</Dropdown.Menu>
        </Dropdown>
      </Stack>
    );
  };

  const buildPaginationNav = () => {
    let previousPageTag = '';
    if (page === 1) {
      previousPageTag = (
        <li
          data-qa="pagination-previous-button-inactive"
          className="page-item disabled"
          key="previous"
        >
          <span style={{ fontSize: '1.5em' }} className="page-link">
            &laquo;
          </span>
        </li>
      );
    } else {
      previousPageTag = (
        <li className="page-item" key="previous">
          <Link
            data-qa="pagination-previous-button"
            className="page-link"
            style={{ fontSize: '1.5em' }}
            to={`${path}?page=${
              page - 1
            }&per_page=${perPage}${queryParamString}`}
          >
            &laquo;
          </Link>
        </li>
      );
    }

    let nextPageTag = '';
    if (page >= pagination.pages) {
      nextPageTag = (
        <li
          data-qa="pagination-next-button-inactive"
          className="page-item disabled"
          key="next"
        >
          <span style={{ fontSize: '1.5em' }} className="page-link">
            &raquo;
          </span>
        </li>
      );
    } else {
      nextPageTag = (
        <li className="page-item" key="next">
          <Link
            data-qa="pagination-next-button"
            className="page-link"
            style={{ fontSize: '1.5em' }}
            to={`${path}?page=${
              page + 1
            }&per_page=${perPage}${queryParamString}`}
          >
            &raquo;
          </Link>
        </li>
      );
    }

    let startingNumber = (page - 1) * perPage + 1;
    let endingNumber = page * perPage;
    if (endingNumber > pagination.total) {
      endingNumber = pagination.total;
    }
    if (startingNumber > pagination.total) {
      startingNumber = pagination.total;
    }

    return (
      <Stack direction="horizontal" gap={3}>
        <p className="ms-auto">
          {startingNumber}-{endingNumber} of{' '}
          <span data-qa="total-paginated-items">{pagination.total}</span>
        </p>
        <nav aria-label="Page navigation">
          <div>
            <ul className="pagination">
              {previousPageTag}
              {nextPageTag}
            </ul>
          </div>
        </nav>
      </Stack>
    );
  };

  return (
    <main>
      {buildPaginationNav()}
      {tableToDisplay}
      {buildPerPageDropdown()}
    </main>
  );
}

PaginationForTable.propTypes = {
  page: PropTypes.number.isRequired,
  perPage: PropTypes.number.isRequired,
  pagination: PropTypes.objectOf(PropTypes.number).isRequired,
  tableToDisplay: PropTypes.string.isRequired,
  queryParamString: PropTypes.string,
  path: PropTypes.string.isRequired,
};

PaginationForTable.defaultProps = {
  queryParamString: '',
};
