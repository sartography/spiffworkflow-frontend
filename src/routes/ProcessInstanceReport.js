import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

import { BACKEND_BASE_URL } from '../config';
import { HOT_AUTH_TOKEN } from '../config';
import ProcessBreadcrumb from '../components/ProcessBreadcrumb'
import { Table }  from 'react-bootstrap'

import PaginationForTable, { DEFAULT_PER_PAGE, DEFAULT_PAGE } from '../components/PaginationForTable'

export default function ProcessInstanceReport() {
  let params = useParams();
  let [searchParams] = useSearchParams();

  const [processInstances, setProcessInstances] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [processGroupId, setProcessGroupId] = useState(null);

  useEffect(() => {
    getProcessInstances();

    function getProcessInstances() {
      const page = searchParams.get('page') || DEFAULT_PAGE;
      const perPage = parseInt(searchParams.get('per_page') || DEFAULT_PER_PAGE);
      fetch(`${BACKEND_BASE_URL}/process-models/${params.process_group_id}/${params.process_model_id}/process-instances/report?per_page=${perPage}&page=${page}`, {
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
            if (processInstancesFromApi[0]) {
              setProcessGroupId(processInstancesFromApi[0].process_group_id)
            }
          },
          (error) => {
            console.log(error);
          }
        )
    }
  }, [searchParams, params]);

  const buildTable = (() => {
      const rows = processInstances.map((row,i) => {
        return (
          <tr key={i}>
            <td>{row.id}</td>
            <td>{row.data.month}</td>
            <td>{row.data.milestone}</td>
            <td>{row.data.req_id}</td>
            <td>{row.data.feature}</td>
            <td>{row.data.priority}</td>
          </tr>
        )
      })
    return(
      <Table striped bordered >
        <thead>
          <tr>
            <th>db id</th>
            <th>month</th>
            <th>milestone</th>
            <th>req_id</th>
            <th>feature</th>
            <th>priority</th>
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
        processGroupId={processGroupId}
        linkProcessModel="true"
      />
      <h2>Process Instances for {params.process_model_id}</h2>
      <PaginationForTable
        page={page}
        perPage={perPage}
        pagination={pagination}
        tableToDisplay={buildTable()}
        path={`/process-models/${params.process_group_id}/${params.process_model_id}/process-instances/report`}
      />
   	  </main>
    )
  } else {
    return(<></>)
  }
}
