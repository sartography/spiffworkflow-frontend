import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BACKEND_BASE_URL } from '../config';
import { HOT_AUTH_TOKEN } from '../services/UserService';
import ProcessBreadcrumb from '../components/ProcessBreadcrumb';

export default function ProcessInstanceReportNew() {
  const params = useParams();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState('');
  const [columns, setColumns] = useState('');
  const [orderBy, setOrderBy] = useState('');
  const [filterBy, setFilterBy] = useState('');

  const addProcessInstanceReport = (event: any) => {
    event.preventDefault();

    const columnArray = columns.split(',').map((column) => {
      return { Header: column, accessor: column };
    });
    const orderByArray = orderBy.split(',').filter((n) => n);

    const filterByArray = filterBy
      .split(',')
      .map((filterByItem) => {
        const [fieldName, fieldValue] = filterByItem.split('=');
        if (fieldValue) {
          return {
            field_name: fieldName,
            operator: 'equals',
            field_value: fieldValue,
          };
        }
        return null;
      })
      .filter((n) => n);

    fetch(
      `${BACKEND_BASE_URL}/process-models/${params.process_group_id}/${params.process_model_id}/process-instances/reports`,
      {
        headers: new Headers({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${HOT_AUTH_TOKEN}`,
        }),
        method: 'POST',
        body: JSON.stringify({
          identifier,
          report_metadata: {
            columns: columnArray,
            order_by: orderByArray,
            filter_by: filterByArray,
          },
        }),
      }
    ).then(
      () => {
        navigate(
          `/admin/process-models/${params.process_group_id}/${params.process_model_id}/process-instances/reports/${identifier}`
        );
      },
      // Note: it's important to handle errors here
      // instead of a catch() block so that we don't swallow
      // exceptions from actual bugs in components.
      (newError) => {
        console.log(newError);
      }
    );
  };

  return (
    <main style={{ padding: '1rem 0' }}>
      <ProcessBreadcrumb />
      <h2>Add Process Model</h2>
      <form onSubmit={addProcessInstanceReport}>
        <label htmlFor="identifier">
          identifier:
          <input
            name="identifier"
            id="identifier"
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />
        </label>
        <br />
        <label htmlFor="columns">
          columns:
          <input
            name="columns"
            id="columns"
            type="text"
            value={columns}
            onChange={(e) => setColumns(e.target.value)}
          />
        </label>
        <br />
        <label htmlFor="order_by">
          order_by:
          <input
            name="order_by"
            id="order_by"
            type="text"
            value={orderBy}
            onChange={(e) => setOrderBy(e.target.value)}
          />
        </label>
        <br />
        <br />
        <p>Like: month=3,milestone=2</p>
        <label htmlFor="filter_by">
          filter_by:
          <input
            name="filter_by"
            id="filter_by"
            type="text"
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
    </main>
  );
}
