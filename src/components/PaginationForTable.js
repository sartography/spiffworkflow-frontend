import React from "react";
import { Link } from "react-router-dom";

import { Dropdown, Stack }  from 'react-bootstrap'

export const DEFAULT_PER_PAGE = 50;
export const DEFAULT_PAGE = 1;

export default function PaginationForTable(props) {
  const PER_PAGE_OPTIONS = [2, 10, 50, 100];

  const buildPerPageDropdown = (() => {
    const perPageDropdownRows = PER_PAGE_OPTIONS.map(per_page_option => {
      if (per_page_option === props.perPage) {
          return <Dropdown.Item key={per_page_option} href={`${props.path}?page=1&per_page=${per_page_option}`} active>{per_page_option}</Dropdown.Item>
      } else {
          return <Dropdown.Item key={per_page_option} href={`${props.path}?page=1&per_page=${per_page_option}`}>{per_page_option}</Dropdown.Item>
      }
    });
    return (
      <Stack direction="horizontal" gap={3}>
      <Dropdown className="ms-auto">
        <Dropdown.Toggle id="process-instances-per-page" variant="light border">
          Process Instances to Show: {props.perPage}
        </Dropdown.Toggle>

        <Dropdown.Menu variant="light">
          {perPageDropdownRows}
        </Dropdown.Menu>
      </Dropdown>
      </Stack>
    )
  });

  const buildPaginationNav = (() => {
    let previousPageTag = "";
    if (props.page === 1) {
      previousPageTag = (
        <li className="page-item disabled" key="previous"><span style={{fontSize:"1.5em"}} className="page-link">&laquo;</span></li>
      )
    } else {
      previousPageTag = (
        <li className="page-item" key="previous">
          <Link className="page-link" style={{fontSize:"1.5em"}} to={`${props.path}?page=${props.page - 1}&per_page=${props.perPage}`}>&laquo;</Link>
        </li>
      )
    }

    let nextPageTag = "";
    if (props.page === props.pagination.pages) {
      nextPageTag = (
        <li className="page-item disabled" key="next"><span style={{fontSize:"1.5em"}} className="page-link">&raquo;</span></li>
      )
    } else {
      nextPageTag = (
        <li className="page-item" key="next">
          <Link className="page-link" style={{fontSize:"1.5em"}} to={`${props.path}?page=${props.page + 1}&per_page=${props.perPage}`}>&raquo;</Link>
        </li>
      )
    }

    let startingNumber = ((props.page - 1) * props.perPage) + 1
    let endingNumber = ((props.page) * props.perPage)
    if (endingNumber > props.pagination.total) {
      endingNumber = props.pagination.total
    }

    return (
      <Stack direction="horizontal" gap={3}>
        <p className="ms-auto">{startingNumber}-{endingNumber} of {props.pagination.total}</p>
        <nav aria-label="Page navigation">
        <div>
        <ul className="pagination">
          {previousPageTag}
          {nextPageTag}
        </ul>
      </div>
        </nav>
      </Stack>
    )
  });

  return(
    <main>
    {buildPaginationNav()}
    {props.tableToDisplay}
    {buildPerPageDropdown()}
    </main>
  )
}
