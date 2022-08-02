import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button, Table } from 'react-bootstrap';
import ProcessBreadcrumb from '../components/ProcessBreadcrumb';
import PaginationForTable from '../components/PaginationForTable';
import HttpService from '../services/HttpService';
import { getPageInfoFromSearchParams } from '../helpers';

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
    const { page, perPage } = getPageInfoFromSearchParams(searchParams);
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
    const { page, perPage } = getPageInfoFromSearchParams(searchParams);
    let displayText = null;
    if (processGroups?.length > 0) {
      displayText = (
        <PaginationForTable
          page={page}
          perPage={perPage}
          pagination={pagination as any}
          tableToDisplay={buildTable()}
          path="/admin/process-groups"
        />
      );
    } else {
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
