import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { BACKEND_BASE_URL } from '../config';
import { HOT_AUTH_TOKEN } from '../config';
import ProcessBreadcrumb from '../components/ProcessBreadcrumb'
import Table from 'react-bootstrap/Table'

export default function ProcessInstanceList() {
  let params = useParams();

  const [error, setError] = useState(null);
  const [processInstances, setProcessInstances] = useState(null);
  const [processGroupId, setProcessGroupId] = useState(null);

  useEffect(() => {
    fetch(`${BACKEND_BASE_URL}/process-models/${params.process_model_id}/process-instances`, {
      headers: new Headers({
        'Authorization': `Bearer ${HOT_AUTH_TOKEN}`
      })
    })
      .then(res => res.json())
      .then(
        (result) => {
          setProcessInstances(result.results);
          setProcessGroupId(result.results[0].process_group_id)
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          setError(error);
        }
      )
  }, []);

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
        return <tr style={{backgroundColor: i%2 ? '#F0FFF2':'white'}} key={i}>
          <td>{row.id}</td>
          <td>{row.process_model_identifier}</td>
          <td>{row.process_group_id}</td>
          <td>{start_date.toString()}</td>
          <td>{end_date.toString()}</td>
          <td>{row.status}</td>
          </tr>
      })
    return(
      <Table>
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

  if (processInstances) {
  return(
    <main>
    <ProcessBreadcrumb
      processModelId={params.process_model_id}
      processGroupId={processGroupId}
      linkProcessModel="true"
    />
   	{buildTable()}
   	</main>
  )
  } else {
    return(<></>)
  }
}
