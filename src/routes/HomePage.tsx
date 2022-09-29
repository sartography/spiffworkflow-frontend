import { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { Link, useSearchParams } from 'react-router-dom';
import PaginationForTable from '../components/PaginationForTable';
import { getPageInfoFromSearchParams } from '../helpers';
import HttpService from '../services/HttpService';

export default function HomePage() {
  const [searchParams] = useSearchParams();
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    const { page, perPage } = getPageInfoFromSearchParams(searchParams);
    const setTasksFromResult = (result: any) => {
      setTasks(result.results);
      setPagination(result.pagination);
    };
    HttpService.makeCallToBackend({
      path: `/tasks?per_page=${perPage}&page=${page}`,
      successCallback: setTasksFromResult,
    });
  }, [searchParams]);

  const buildTable = () => {
    const rows = tasks.map((row) => {
      const rowToUse = row as any;
      const taskUrl = `/tasks/${rowToUse.process_instance_id}/${rowToUse.id}`;
      return (
        <tr key={rowToUse.id}>
          <td>
            <Link
              data-qa="process-model-show-link"
              to={`/admin/process-models/${rowToUse.process_group_identifier}/${rowToUse.process_model_identifier}`}
            >
              {rowToUse.process_model_display_name}
            </Link>
          </td>
          <td>
            <Link
              data-qa="process-instance-show-link"
              to={`/admin/process-models/${rowToUse.process_group_identifier}/${rowToUse.process_model_identifier}/process-instances/${rowToUse.process_instance_id}`}
            >
              View
            </Link>
          </td>
          <td
            title={`task id: ${rowToUse.name}, spiffworkflow task guid: ${rowToUse.id}`}
          >
            {rowToUse.title}
          </td>
          <td>{rowToUse.state}</td>
          <td>
            <Button variant="primary" href={taskUrl}>
              Complete Task
            </Button>
          </td>
        </tr>
      );
    });
    return (
      <Table striped bordered>
        <thead>
          <tr>
            <th>Process Model</th>
            <th>Process Instance</th>
            <th>Task Name</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    );
  };

  if (pagination) {
    const { page, perPage } = getPageInfoFromSearchParams(searchParams);
    return (
      <>
        <h2>Tasks</h2>
        <PaginationForTable
          page={page}
          perPage={perPage}
          pagination={pagination}
          tableToDisplay={buildTable()}
          path="/tasks"
        />
      </>
    );
  }
  return null;
}
