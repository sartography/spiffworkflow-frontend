import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { BACKEND_BASE_URL, HOT_AUTH_TOKEN } from '../config';

export default function ProcessInstanceReportList() {
  const params = useParams();
  const [processInstanceReports, setProcessInstanceReports] = useState([]);

  useEffect(() => {
    fetch(
      `${BACKEND_BASE_URL}/process-models/${params.process_group_id}/${params.process_model_id}/process-instances/reports`,
      {
        headers: new Headers({
          Authorization: `Bearer ${HOT_AUTH_TOKEN}`,
        }),
      }
    )
      .then((res) => res.json())
      .then(
        (result) => {
          setProcessInstanceReports(result);
        },
        (error) => {
          console.log(error);
        }
      );
  }, [params]);

  const buildTable = () => {
    const rows = processInstanceReports.map((row) => {
      const rowToUse = row as any;
      return (
        <tr key={(row as any).id}>
          <td>
            <Link
              to={`/admin/process-models/${params.process_group_id}/${params.process_model_id}/process-instances/reports/${rowToUse.identifier}`}
            >
              {rowToUse.identifier}
            </Link>
          </td>
        </tr>
      );
    });
    return (
      <Table striped bordered>
        <thead>
          <tr>
            <th>Identifier</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    );
  };

  if (processInstanceReports?.length > 0) {
    return (
      <main>
        <h1>hello</h1>
        {buildTable()}
      </main>
    );
  }
  return <main />;
}
