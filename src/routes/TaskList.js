import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { Link, useSearchParams } from 'react-router-dom';
import PaginationForTable, {
  DEFAULT_PER_PAGE,
  DEFAULT_PAGE,
} from '../components/PaginationForTable';
import { BACKEND_BASE_URL, HOT_AUTH_TOKEN } from '../config';

export default function TaskList() {
  const [searchParams] = useSearchParams();
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    const page = parseInt(searchParams.get('page') || DEFAULT_PAGE, 10);
    const perPage = parseInt(
      searchParams.get('per_page') || DEFAULT_PER_PAGE,
      10
    );
    fetch(
      `${BACKEND_BASE_URL}/tasks/my-tasks?per_page=${perPage}&page=${page}`,
      {
        headers: new Headers({
          Authorization: `Bearer ${HOT_AUTH_TOKEN}`,
        }),
      }
    )
      .then((res) => res.json())
      .then(
        (result) => {
          setTasks(result.results);
          setPagination(result.pagination);
        },
        (newError) => {
          console.log(newError);
        }
      );
  }, [searchParams]);

  const buildTable = () => {
    const rows = tasks.map((row) => {
      return (
        <tr key={row.id}>
          <td>
            <Link to={`/tasks/${row.id}`}>{row.id}</Link>
          </td>
        </tr>
      );
    });
    return (
      <Table striped bordered>
        <thead>
          <tr>
            <th>Id</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    );
  };

  if (pagination) {
    const perPage = parseInt(
      searchParams.get('per_page') || DEFAULT_PER_PAGE,
      10
    );
    const page = parseInt(searchParams.get('page') || DEFAULT_PAGE, 10);
    return (
      <main>
        <h2>Tasks</h2>
        <PaginationForTable
          page={page}
          perPage={perPage}
          pagination={pagination}
          tableToDisplay={buildTable()}
          path="/tasks"
        />
      </main>
    );
  }
}
