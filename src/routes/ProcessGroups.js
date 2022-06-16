import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { BACKEND_BASE_URL } from '../config';
import { HOT_AUTH_TOKEN } from '../config';
import ProcessBreadcrumb from '../components/ProcessBreadcrumb'
import { Button, Table } from 'react-bootstrap'
import PaginationForTable, { DEFAULT_PER_PAGE, DEFAULT_PAGE } from '../components/PaginationForTable'

// Example process group json
// {'admin': False, 'display_name': 'Test Workflows', 'display_order': 0, 'id': 'test_process_group'}
export default function ProcessGroups() {
  const [searchParams] = useSearchParams();

  const [processGroups, setProcessGroups] = useState([]);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    const page = searchParams.get('page') || DEFAULT_PAGE;
    const perPage = parseInt(searchParams.get('per_page') || DEFAULT_PER_PAGE);
    fetch(`${BACKEND_BASE_URL}/process-groups?per_page=${perPage}&page=${page}`, {
      headers: new Headers({
        'Authorization': `Bearer ${HOT_AUTH_TOKEN}`
      })
    })
      .then(res => res.json())
      .then(
        (result) => {
          setProcessGroups(result.results);
          setPagination(result.pagination);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (newError) => {
          console.log(newError);
        }
      )
  }, [searchParams]);

  const buildTable = (() => {
    const rows = processGroups.map((row,index) => {
      return (
        <tr key={index}>
          <td>
            <Link to={`/process-groups/${row.id}`}>{row.id}</Link>
          </td>
          <td>{row.display_name}</td>
        </tr>
      )
    })
    return(
      <Table striped bordered >
        <thead>
          <tr>
            <th>Process Group Id</th>
            <th>Display Name</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </Table>
    )
  });

  if (processGroups?.length > 0) {
    const perPage = parseInt(searchParams.get('per_page') || DEFAULT_PER_PAGE);
    const page = parseInt(searchParams.get('page') || DEFAULT_PAGE);
    return (
      <main style={{ padding: "1rem 0" }}>
        <ProcessBreadcrumb />
        <h2>Process Groups</h2>
        <Button href={`/process-groups/new`}>Add a process group</Button>
        <br />
        <br />
        <PaginationForTable
          page={page}
          perPage={perPage}
          pagination={pagination}
          tableToDisplay={buildTable()}
          path={`/process-groups`}
        />
      </main>
    );
  } else {
    return (<></>)
  }
}

