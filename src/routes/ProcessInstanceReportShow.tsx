import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import { Button, Table } from 'react-bootstrap';
import { BACKEND_BASE_URL } from '../config';
import { HOT_AUTH_TOKEN } from '../services/UserService';
import ProcessBreadcrumb from '../components/ProcessBreadcrumb';

import PaginationForTable, {
  DEFAULT_PAGE,
} from '../components/PaginationForTable';

const PER_PAGE_FOR_PROCESS_INSTANCE_REPORT = 500;

export default function ProcessInstanceReport() {
  const params = useParams();
  const [searchParams] = useSearchParams();

  const [processInstances, setProcessInstances] = useState([]);
  const [reportMetadata, setReportMetadata] = useState({});
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    function getProcessInstances() {
      const page = searchParams.get('page') || DEFAULT_PAGE;
      const perPage = parseInt(
        // @ts-expect-error TS(2345) FIXME: Argument of type 'string | 50' is not assignable t... Remove this comment to see the full error message
        searchParams.get('per_page') || PER_PAGE_FOR_PROCESS_INSTANCE_REPORT,
        10
      );
      let query = `?page=${page}&per_page=${perPage}`;
      searchParams.forEach((value, key) => {
        if (key !== 'page' && key !== 'per_page') {
          query += `&${key}=${value}`;
        }
      });
      fetch(
        `${BACKEND_BASE_URL}/process-models/${params.process_group_id}/${params.process_model_id}/process-instances/reports/${params.report_identifier}?${query}`,
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
            setReportMetadata(result.report_metadata);
            setPagination(result.pagination);
          },
          (error) => {
            console.log(error);
          }
        );
    }

    getProcessInstances();
  }, [searchParams, params]);

  const buildTable = () => {
    const headers = (reportMetadata as any).columns.map((column: any) => {
      return <th>{(column as any).Header}</th>;
    });

    const rows = processInstances.map((row) => {
      const currentRow = (reportMetadata as any).columns.map((column: any) => {
        return <td>{(row as any)[column.accessor]}</td>;
      });
      return <tr key={(row as any).id}>{currentRow}</tr>;
    });
    return (
      <Table striped bordered>
        <thead>
          <tr>{headers}</tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    );
  };

  if (pagination) {
    const perPage = parseInt(
      // @ts-expect-error TS(2345) FIXME: Argument of type 'string | 50' is not assignable t... Remove this comment to see the full error message
      searchParams.get('per_page') || PER_PAGE_FOR_PROCESS_INSTANCE_REPORT,
      10
    );
    // @ts-expect-error TS(2345) FIXME: Argument of type 'string | 1' is not assignable to... Remove this comment to see the full error message
    const page = parseInt(searchParams.get('page') || DEFAULT_PAGE, 10);
    return (
      <main>
        <ProcessBreadcrumb
          processModelId={params.process_model_id}
          processGroupId={params.process_group_id}
          // @ts-expect-error TS(2322) FIXME: Type 'string' is not assignable to type 'boolean |... Remove this comment to see the full error message
          linkProcessModel="true"
        />
        <h2>Process Instance Report: {params.report_identifier}</h2>
        <Button
          href={`/admin/process-models/${params.process_group_id}/${params.process_model_id}/process-instances/reports/${params.report_identifier}/edit`}
        >
          Edit process instance report
        </Button>
        <PaginationForTable
          page={page}
          perPage={perPage}
          pagination={pagination}
          // @ts-expect-error TS(2322) FIXME: Type 'Element' is not assignable to type 'string'.
          tableToDisplay={buildTable()}
          path={`/admin/process-models/${params.process_group_id}/${params.process_model_id}/process-instances/report`}
        />
      </main>
    );
  }
}
