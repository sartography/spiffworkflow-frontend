import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import { Table } from 'react-bootstrap';
import { BACKEND_BASE_URL, HOT_AUTH_TOKEN } from '../config';
import ProcessBreadcrumb from '../components/ProcessBreadcrumb';

import PaginationForTable, {
  DEFAULT_PER_PAGE,
  DEFAULT_PAGE,
} from '../components/PaginationForTable';

export default function ProcessInstanceReport() {
  const params = useParams();
  const [searchParams] = useSearchParams();

  const [processInstances, setProcessInstances] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [processGroupId, setProcessGroupId] = useState(null);

  useEffect(() => {
    function getProcessInstances() {
      const page = searchParams.get('page') || DEFAULT_PAGE;
      const perPage = parseInt(
        // @ts-expect-error TS(2345): Argument of type 'string | 50' is not assignable t... Remove this comment to see the full error message
        searchParams.get('per_page') || DEFAULT_PER_PAGE,
        10
      );
      fetch(
        `${BACKEND_BASE_URL}/process-models/${params.process_group_id}/${params.process_model_id}/process-instances/report?per_page=${perPage}&page=${page}`,
        {
          headers: new Headers({
            Authorization: `Bearer ${HOT_AUTH_TOKEN}`,
          }),
        }
      )
        .then((res) => res.json())
        .then(
          (result) => {
            const processInstancesFromApi = result.results;
            setProcessInstances(processInstancesFromApi);
            setPagination(result.pagination);
            if (processInstancesFromApi[0]) {
              setProcessGroupId(processInstancesFromApi[0].process_group_id);
            }
          },
          (error) => {
            console.log(error);
          }
        );
    }

    getProcessInstances();
  }, [searchParams, params]);

  const buildTable = () => {
    const rows = processInstances.map((row) => {
      return (
        <tr key={(row as any).id}>
          <td>{(row as any).id}</td>
          <td>{(row as any).data.month}</td>
          <td>{(row as any).data.milestone}</td>
          <td>{(row as any).data.req_id}</td>
          <td>{(row as any).data.feature}</td>
          <td>{(row as any).data.priority}</td>
        </tr>
      );
    });
    return (
      <Table striped bordered>
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
        <tbody>{rows}</tbody>
      </Table>
    );
  };

  if (pagination) {
    const perPage = parseInt(
      // @ts-expect-error TS(2345): Argument of type 'string | 50' is not assignable t... Remove this comment to see the full error message
      searchParams.get('per_page') || DEFAULT_PER_PAGE,
      10
    );
    // @ts-expect-error TS(2345): Argument of type 'string | 1' is not assignable to... Remove this comment to see the full error message
    const page = parseInt(searchParams.get('page') || DEFAULT_PAGE, 10);
    return (
      <main>
        <ProcessBreadcrumb
          processModelId={params.process_model_id}
          // @ts-expect-error TS(2322): Type 'null' is not assignable to type 'string | un... Remove this comment to see the full error message
          processGroupId={processGroupId}
          // @ts-expect-error TS(2322): Type 'string' is not assignable to type 'boolean |... Remove this comment to see the full error message
          linkProcessModel="true"
        />
        <h2>Process Instances for {params.process_model_id}</h2>
        <PaginationForTable
          page={page}
          perPage={perPage}
          pagination={pagination}
          // @ts-expect-error TS(2322): Type 'Element' is not assignable to type 'string'.
          tableToDisplay={buildTable()}
          path={`/admin/process-models/${params.process_group_id}/${params.process_model_id}/process-instances/report`}
        />
      </main>
    );
  }
}
