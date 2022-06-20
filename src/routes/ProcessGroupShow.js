import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { BACKEND_BASE_URL } from '../config';
import { HOT_AUTH_TOKEN } from '../config';
import { useParams } from "react-router-dom";
import ProcessBreadcrumb from '../components/ProcessBreadcrumb'
import { Button, Table, Stack } from 'react-bootstrap'
import PaginationForTable, { DEFAULT_PER_PAGE, DEFAULT_PAGE } from '../components/PaginationForTable'

export default function ProcessGroupShow() {
  const params = useParams();
  const [searchParams] = useSearchParams();

  const [processGroup, setProcessGroup] = useState(null);
  const [processModels, setProcessModels] = useState([]);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    const page = searchParams.get('page') || DEFAULT_PAGE;
    const perPage = parseInt(searchParams.get('per_page') || DEFAULT_PER_PAGE);
    fetch(`${BACKEND_BASE_URL}/process-groups/${params.process_group_id}`, {
      headers: new Headers({
        'Authorization': `Bearer ${HOT_AUTH_TOKEN}`
      })
    })
      .then(res => res.json())
      .then(
        (result) => {
          setProcessGroup(result);
          fetch(`${BACKEND_BASE_URL}/process-groups/${params.process_group_id}/process-models?per_page=${perPage}&page=${page}`, {
            headers: new Headers({
              'Authorization': `Bearer ${HOT_AUTH_TOKEN}`
            })
          })
            .then(res => res.json())
            .then(
              (result) => {
                setProcessModels(result.results);
                setPagination(result.pagination);
              },
              (error) => {
                console.log(error);
              })
        },
        (error) => {
          console.log(error);
        }
      )
  }, [params, searchParams]);

  const buildTable = (() => {
    const rows = processModels.map((row,index) => {
      return (
        <tr key={index}>
          <td>
            <Link to={`/process-models/${processGroup.id}/${row.id}`}>{row.id}</Link>
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

  if (processGroup && pagination) {
    const perPage = parseInt(searchParams.get('per_page') || DEFAULT_PER_PAGE);
    const page = parseInt(searchParams.get('page') || DEFAULT_PAGE);
    return (
      <main style={{ padding: "1rem 0" }}>
        <ProcessBreadcrumb processGroupId={processGroup.id} />
        <h2>Process Group: {processGroup.id}</h2>
        <ul>
        <Stack direction="horizontal" gap={3}>
          <Button href={`/process-models/${processGroup.id}/new`}>Add a process model</Button>
          <Button href={`/process-groups/${processGroup.id}/edit`} variant="secondary">Edit process group</Button>
        </Stack>
        <br />
        <br />
        <PaginationForTable
          page={page}
          perPage={perPage}
          pagination={pagination}
          tableToDisplay={buildTable()}
          path={`/process-groups/${processGroup.id}`}
        />
        </ul>
      </main>
    );
  } else {
    return (<></>)
  }
}
