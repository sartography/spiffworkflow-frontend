import { useEffect, useState } from 'react';
import { Link, useSearchParams, useParams } from 'react-router-dom';
import { Button, Table, Stack } from 'react-bootstrap';
import ProcessBreadcrumb from '../components/ProcessBreadcrumb';
import PaginationForTable, {
  DEFAULT_PER_PAGE,
  DEFAULT_PAGE,
} from '../components/PaginationForTable';
import HttpService from '../services/HttpService';

export default function ProcessGroupShow() {
  const params = useParams();
  const [searchParams] = useSearchParams();

  const [processGroup, setProcessGroup] = useState(null);
  const [processModels, setProcessModels] = useState([]);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    const setProcessModelFromResult = (result: any) => {
      setProcessModels(result.results);
      setPagination(result.pagination);
    };
    const processResult = (result: any) => {
      setProcessGroup(result);
      HttpService.makeCallToBackend({
        path: `/process-groups/${params.process_group_id}/process-models?per_page=${perPage}&page=${page}`,
        successCallback: setProcessModelFromResult,
      });
    };
    // @ts-expect-error TS(2345) FIXME: Argument of type 'string | 1' is not assignable to... Remove this comment to see the full error message
    const page = parseInt(searchParams.get('page') || DEFAULT_PAGE, 10);
    const perPage = parseInt(
      // @ts-expect-error TS(2345) FIXME: Argument of type 'string | 50' is not assignable t... Remove this comment to see the full error message
      searchParams.get('per_page') || DEFAULT_PER_PAGE,
      10
    );
    HttpService.makeCallToBackend({
      path: `/process-groups/${params.process_group_id}`,
      successCallback: processResult,
    });
  }, [params, searchParams]);

  const buildTable = () => {
    const rows = processModels.map((row) => {
      return (
        <tr key={(row as any).id}>
          <td>
            <Link
              // @ts-expect-error TS(2531) FIXME: Object is possibly 'null'.
              to={`/admin/process-models/${processGroup.id}/${(row as any).id}`}
              data-qa="process-model-show-link"
            >
              {(row as any).id}
            </Link>
          </td>
          <td>{(row as any).display_name}</td>
        </tr>
      );
    });
    return (
      <div>
        <h3>Process Models</h3>
        <Table striped bordered>
          <thead>
            <tr>
              <th>Process Model Id</th>
              <th>Display Name</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </div>
    );
  };

  if (processGroup && pagination) {
    const perPage = parseInt(
      // @ts-expect-error TS(2345) FIXME: Argument of type 'string | 50' is not assignable t... Remove this comment to see the full error message
      searchParams.get('per_page') || DEFAULT_PER_PAGE,
      10
    );
    // @ts-expect-error TS(2345) FIXME: Argument of type 'string | 1' is not assignable to... Remove this comment to see the full error message
    const page = parseInt(searchParams.get('page') || DEFAULT_PAGE, 10);
    return (
      <main style={{ padding: '1rem 0' }}>
        <ProcessBreadcrumb processGroupId={(processGroup as any).id} />
        <h2>Process Group: {(processGroup as any).id}</h2>
        <ul>
          <Stack direction="horizontal" gap={3}>
            <Button
              href={`/admin/process-models/${(processGroup as any).id}/new`}
            >
              Add a process model
            </Button>
            <Button
              href={`/admin/process-groups/${(processGroup as any).id}/edit`}
              variant="secondary"
            >
              Edit process group
            </Button>
          </Stack>
          <br />
          <br />
          <PaginationForTable
            page={page}
            perPage={perPage}
            pagination={pagination}
            // @ts-expect-error TS(2322) FIXME: Type 'Element' is not assignable to type 'string'.
            tableToDisplay={buildTable()}
            path={`/admin/process-groups/${(processGroup as any).id}`}
          />
        </ul>
      </main>
    );
  }
}
