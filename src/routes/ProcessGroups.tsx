import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button, Table } from 'react-bootstrap';
import ProcessBreadcrumb from '../components/ProcessBreadcrumb';
import PaginationForTable, {
  DEFAULT_PER_PAGE,
  DEFAULT_PAGE,
} from '../components/PaginationForTable';
import HttpService from '../services/HttpService';

// Example process group json
// {'admin': False, 'display_name': 'Test Workflows', 'display_order': 0, 'id': 'test_process_group'}
export default function ProcessGroups() {
  const [searchParams] = useSearchParams();

  const [processGroups, setProcessGroups] = useState([]);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    const setProcessGroupsFromResult = (result: any) => {
      setProcessGroups(result.results);
      setPagination(result.pagination);
    };

    const page = parseInt(
      searchParams.get('page') || DEFAULT_PAGE.toString(),
      10
    );
    const perPage = parseInt(
      searchParams.get('per_page') || DEFAULT_PER_PAGE.toString(),
      10
    );
    HttpService.makeCallToBackend({
      path: `/process-groups?per_page=${perPage}&page=${page}`,
      successCallback: setProcessGroupsFromResult,
    });
  }, [searchParams]);

  const buildTable = () => {
    const rows = processGroups.map((row) => {
      return (
        <tr key={(row as any).id}>
          <td>
            <Link to={`/admin/process-groups/${(row as any).id}`}>
              {(row as any).id}
            </Link>
          </td>
          <td>{(row as any).display_name}</td>
        </tr>
      );
    });
    return (
      <Table striped bordered>
        <thead>
          <tr>
            <th>Process Group Id</th>
            <th>Display Name</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    );
  };

  const processGroupsDisplayArea = () => {
    const perPage = parseInt(
      searchParams.get('per_page') || DEFAULT_PER_PAGE.toString(),
      10
    );
    const page = parseInt(
      searchParams.get('page') || DEFAULT_PAGE.toString(),
      10
    );
    let displayText = '';
    if (processGroups?.length > 0) {
      // @ts-expect-error TS(2322) FIXME: Type 'Element' is not assignable to type 'string'.
      displayText = (
        <PaginationForTable
          page={page}
          perPage={perPage}
          // @ts-expect-error TS(2322) FIXME: Type 'null' is not assignable to type '{ [key: str... Remove this comment to see the full error message
          pagination={pagination}
          // @ts-expect-error TS(2322) FIXME: Type 'Element' is not assignable to type 'string'.
          tableToDisplay={buildTable()}
          path="/admin/process-groups"
        />
      );
    } else {
      // @ts-expect-error TS(2322) FIXME: Type 'Element' is not assignable to type 'string'.
      displayText = <p>No Groups To Display</p>;
    }
    return displayText;
  };

  if (pagination) {
    return (
      <main style={{ padding: '1rem 0' }}>
        <ProcessBreadcrumb />
        <h2>Process Groups</h2>
        <Button href="/admin/process-groups/new">Add a process group</Button>
        <br />
        <br />
        {processGroupsDisplayArea()}
      </main>
    );
  }
  return null;
}
