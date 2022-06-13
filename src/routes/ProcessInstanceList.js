import React, { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";

import { BACKEND_BASE_URL } from '../config';
import { HOT_AUTH_TOKEN } from '../config';
import ProcessBreadcrumb from '../components/ProcessBreadcrumb'
import { Table, Dropdown, Stack }  from 'react-bootstrap'

export default function ProcessInstanceList() {
  let params = useParams();
  let [searchParams] = useSearchParams();

  const DEFAULT_PER_PAGE = 50;
  const DEFAULT_PAGE = 1;
  const PER_PAGE_OPTIONS = [2, 10, 50, 100];

  const [processInstances, setProcessInstances] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [processGroupId, setProcessGroupId] = useState(null);

  useEffect(() => {
    getProcessInstances();

    function getProcessInstances() {
      const page = searchParams.get('page') || DEFAULT_PAGE;
      const perPage = parseInt(searchParams.get('per_page') || DEFAULT_PER_PAGE);
      fetch(`${BACKEND_BASE_URL}/process-models/${params.process_model_id}/process-instances?per_page=${perPage}&page=${page}`, {
        headers: new Headers({
          'Authorization': `Bearer ${HOT_AUTH_TOKEN}`
        })
      })
        .then(res => res.json())
        .then(
          (result) => {
            setProcessInstances(result.results);
            setPagination(result.pagination);
            setProcessGroupId(result.results[0].process_group_id)
          },
          // Note: it's important to handle errors here
          // instead of a catch() block so that we don't swallow
          // exceptions from actual bugs in components.
          (error) => {
            console.log(error);
          }
        )
    }
  }, [searchParams, params]);

  const getPerPage = (() => {
    return parseInt(searchParams.get('per_page') || DEFAULT_PER_PAGE);
  });

  const buildTable = (() => {
      const rows = processInstances.map((row,i) => {
        let start_date = 'N/A'
        if (row.start_in_seconds) {
          start_date = new Date(row.start_in_seconds * 1000);
        }
        let end_date = 'N/A'
        if (row.end_in_seconds) {
          end_date = new Date(row.end_in_seconds * 1000);
        }
        return (
          <tr key={i}>
          <td>{row.id}</td>
          <td>{row.process_model_identifier}</td>
          <td>{row.process_group_id}</td>
          <td>{start_date.toString()}</td>
          <td>{end_date.toString()}</td>
          <td>{row.status}</td>
          </tr>
        )
      })
    return(
      <Table striped bordered >
        <thead>
          <tr>
            <th>Process Instance Id</th>
            <th>Process Model Id</th>
            <th>Process Group Id</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </Table>
    )
  });

  const getCurrentPage = (() => {
    return parseInt(searchParams.get('page') || DEFAULT_PAGE);
  });

  const buildPerPageDropdown = (() => {
    const perPageDropdownRows = PER_PAGE_OPTIONS.map(per_page_option => {
      if (per_page_option === getPerPage()) {
          return <Dropdown.Item key={per_page_option} href={`/process-models/${params.process_group_id}/${params.process_model_id}/process-instances?page=1&per_page=${per_page_option}`} active>{per_page_option}</Dropdown.Item>
      } else {
          return <Dropdown.Item key={per_page_option} href={`/process-models/${params.process_group_id}/${params.process_model_id}/process-instances?page=1&per_page=${per_page_option}`}>{per_page_option}</Dropdown.Item>
      }
    });
    return (
      <Stack direction="horizontal" gap={3}>
      <Dropdown className="ms-auto">
        <Dropdown.Toggle id="process-instances-per-page" variant="light border">
          Process Instances to Show: {getPerPage()}
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
    if (getCurrentPage() === 1) {
      previousPageTag = (
        <li className="page-item disabled" key="previous"><span style={{fontSize:"1.5em"}} className="page-link">&laquo;</span></li>
      )
    } else {
      previousPageTag = (
        <li className="page-item" key="previous">
          <Link className="page-link" style={{fontSize:"1.5em"}} to={`/process-models/${params.process_group_id}/${params.process_model_id}/process-instances?page=${getCurrentPage() - 1}&per_page=${getPerPage()}`}>&laquo;</Link>
        </li>
      )
    }

    let nextPageTag = "";
    if (getCurrentPage() === pagination.pages) {
      nextPageTag = (
        <li className="page-item disabled" key="next"><span style={{fontSize:"1.5em"}} className="page-link">&raquo;</span></li>
      )
    } else {
      nextPageTag = (
        <li className="page-item" key="next">
          <Link className="page-link" style={{fontSize:"1.5em"}} to={`/process-models/${params.process_group_id}/${params.process_model_id}/process-instances?page=${getCurrentPage() + 1}&per_page=${getPerPage()}`}>&raquo;</Link>
        </li>
      )
    }

    let startingNumber = ((getCurrentPage() - 1) * getPerPage()) + 1
    let endingNumber = ((getCurrentPage()) * getPerPage())
    if (endingNumber > pagination.total) {
      endingNumber = pagination.total
    }

    return (
      <Stack direction="horizontal" gap={3}>
        <p className="ms-auto">{startingNumber}-{endingNumber} of {pagination.total}</p>
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

  if (processInstances) {
    return(
      <main>
      <ProcessBreadcrumb
        processModelId={params.process_model_id}
        processGroupId={processGroupId}
        linkProcessModel="true"
      />
      <h2>Process Instances for {params.process_model_id}</h2>
      {buildPaginationNav()}
     	{buildTable()}
      {buildPerPageDropdown()}
   	  </main>
    )
  } else {
    return(<></>)
  }
}
