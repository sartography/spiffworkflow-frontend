import React, { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { BACKEND_BASE_URL, HOT_AUTH_TOKEN } from '../config';
import ProcessBreadcrumb from '../components/ProcessBreadcrumb';

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

  const headerStuff = (
    <>
      <ProcessBreadcrumb
        processGroupId={params.process_group_id}
        processModelId={params.process_model_id}
        // @ts-expect-error TS(2322) FIXME: Type 'string' is not assignable to type 'boolean |... Remove this comment to see the full error message
        linkProcessModel="true"
      />
      <h2>Reports for Process Model: {params.process_model_id}</h2>
      <Button
        href={`/admin/process-models/${params.process_group_id}/${params.process_model_id}/process-instances/reports/new`}
      >
        Add a process instance report
      </Button>
    </>
  );
  if (processInstanceReports?.length > 0) {
    return (
      <main>
        {headerStuff}
        {buildTable()}
      </main>
    );
  }
  return (
    <main>
      {headerStuff}
      <p>No reports found</p>
    </main>
  );
}
