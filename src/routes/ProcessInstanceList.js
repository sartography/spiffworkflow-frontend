import React, { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";

import { BACKEND_BASE_URL } from '../config';
import { HOT_AUTH_TOKEN } from '../config';
import ProcessBreadcrumb from '../components/ProcessBreadcrumb'
import { Table }  from 'react-bootstrap'

import PaginationForTable, { DEFAULT_PER_PAGE, DEFAULT_PAGE } from '../components/PaginationForTable'

export default function ProcessInstanceList() {
  let params = useParams();
  let [searchParams] = useSearchParams();

  const [processInstances, setProcessInstances] = useState([]);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    getProcessInstances();

    function getProcessInstances() {
      const page = searchParams.get('page') || DEFAULT_PAGE;
      const perPage = parseInt(searchParams.get('per_page') || DEFAULT_PER_PAGE);
      fetch(`${BACKEND_BASE_URL}/process-models/${params.process_group_id}/${params.process_model_id}/process-instances?per_page=${perPage}&page=${page}`, {
        headers: new Headers({
          'Authorization': `Bearer ${HOT_AUTH_TOKEN}`
        })
      })
        .then(res => res.json())
        .then(
          (result) => {
            const processInstancesFromApi = result.results;
            setProcessInstances(processInstancesFromApi);
            setPagination(result.pagination);
          },
          (error) => {
            console.log(error);
          }
        )
    }
  }, [searchParams, params]);

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
          <td>
            <Link data-qa="process-instance-show-link" to={`/process-models/${params.process_group_id}/${params.process_model_id}/process-instances/${row.id}`}>{row.id}</Link>
          </td>
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

  if (pagination) {
    const perPage = parseInt(searchParams.get('per_page') || DEFAULT_PER_PAGE);
    const page = parseInt(searchParams.get('page') || DEFAULT_PAGE);
    return(
      <main>
      <ProcessBreadcrumb
        processModelId={params.process_model_id}
        processGroupId={params.process_group_id}
        linkProcessModel="true"
      />
      <h2>Process Instances for {params.process_model_id}</h2>
      <PaginationForTable
        page={page}
        perPage={perPage}
        pagination={pagination}
        tableToDisplay={buildTable()}
        path={`/process-models/${params.process_group_id}/${params.process_model_id}/process-instances`}
      />
   	  </main>
    )
  } else {
    return(<></>)
  }
}
