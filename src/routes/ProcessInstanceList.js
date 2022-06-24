import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";

import { BACKEND_BASE_URL } from '../config';
import { HOT_AUTH_TOKEN } from '../config';
import ProcessBreadcrumb from '../components/ProcessBreadcrumb';
import { Button, Table, Stack, Dropdown }  from 'react-bootstrap';
import DatePicker from "react-datepicker";
import { convertDateToSeconds } from "../helpers";

import PaginationForTable, { DEFAULT_PER_PAGE, DEFAULT_PAGE } from '../components/PaginationForTable'
import "react-datepicker/dist/react-datepicker.css";

export default function ProcessInstanceList() {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [processInstances, setProcessInstances] = useState([]);
  const [pagination, setPagination] = useState(null);
  const executedRef = useRef(false);

  const currentDate = new Date();
  const oneMonthAgo = convertDateToSeconds(currentDate.setMonth(currentDate.getMonth() - 1));
  const oneHourFromNow = convertDateToSeconds(new Date()) + 3600;
  const [startFrom, setStartFrom] = useState(oneMonthAgo);
  const [startTill, setStartTill] = useState(oneHourFromNow);
  const [endFrom, setEndFrom] = useState(oneMonthAgo);
  const [endTill, setEndTill] = useState(oneHourFromNow);

  const PROCESS_STATUSES = [
    "all",
    "not_started",
    "user_input_required",
    "waiting",
    "complete",
    "erroring",
  ]
  const [processStatus, setProcessStatus] = useState(PROCESS_STATUSES[0]);


  useEffect(() => {
    if (executedRef.current) {
      return;
    }

    const parametersToAlwaysFilterBy = {
      'start_from': [setStartFrom, startFrom],
      'start_till': [setStartTill, startTill],
      'end_from': [setEndFrom, endFrom],
      'end_till': [setEndTill, endTill],
    }
    getProcessInstances();

    function getProcessInstances() {
      const page = searchParams.get('page') || DEFAULT_PAGE;
      const perPage = parseInt(searchParams.get('per_page') || DEFAULT_PER_PAGE);
      let queryParamString = `per_page=${perPage}&page=${page}`;

      for (const paramProperty in parametersToAlwaysFilterBy) {
        const configs = parametersToAlwaysFilterBy[paramProperty]
        let functionToCall = configs[0];
        let defaultValue = configs[1];
        let searchParamValue = searchParams.get(paramProperty);
        if (searchParamValue) {
          queryParamString += `&${paramProperty}=${searchParamValue}`;
          functionToCall(searchParamValue);
        } else if (defaultValue) {
          queryParamString += `&${paramProperty}=${defaultValue}`;
        }
      }
      if (searchParams.get('process_status')) {
        queryParamString += `&process_status=${searchParams.get('process_status')}`;
        setProcessStatus(searchParams.get('process_status'));
      }

      fetch(`${BACKEND_BASE_URL}/process-models/${params.process_group_id}/${params.process_model_id}/process-instances?${queryParamString}`, {
        headers: new Headers({
          'Authorization': `Bearer ${HOT_AUTH_TOKEN}`
        })
      })
        .then(res => res.json())
        .then(
          (result) => {
            const processInstancesFromApi = result.results;
            setProcessInstances(processInstancesFromApi);
            setPagination(result.pagination);
            executedRef.current = true;
          },
          (error) => {
            console.log(error);
          }
        )
    }
  }, [searchParams, params, startFrom, startTill, endFrom, endTill]);

  const buildTable = (() => {
      const rows = processInstances.map((row,i) => {
        let start_date = 'N/A'
        if (row.start_in_seconds) {
          start_date = new Date(row.start_in_seconds * 1000);
        }
        let end_date = 'N/A'
        if (row.end_in_seconds) {
          end_date = new Date(row.end_in_seconds * 1000);
        }
        return (
          <tr key={i}>
          <td>
            <Link data-qa="process-instance-show-link" to={`/process-models/${params.process_group_id}/${params.process_model_id}/process-instances/${row.id}`}>{row.id}</Link>
          </td>
          <td>{row.process_model_identifier}</td>
          <td>{row.process_group_id}</td>
          <td>{start_date.toString()}</td>
          <td>{end_date.toString()}</td>
          <td>{row.status}</td>
          </tr>
        )
      })
    return(
      <Table striped bordered >
        <thead>
          <tr>
            <th>Process Instance Id</th>
            <th>Process Model Id</th>
            <th>Process Group Id</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </Table>
    )
  });

  const handleFilter = ((event) => {
    event.preventDefault();
    const page = searchParams.get('page') || DEFAULT_PAGE;
    const perPage = parseInt(searchParams.get('per_page') || DEFAULT_PER_PAGE);
    let queryParamString = `per_page=${perPage}&page=${page}`;

    if (startFrom) {
      queryParamString += `&start_from=${startFrom}`;
    }
    if (startTill) {
      queryParamString += `&start_till=${startTill}`;
    }
    if (endFrom) {
      queryParamString += `&end_from=${endFrom}`;
    }
    if (endTill) {
      queryParamString += `&end_till=${endTill}`;
    }
    if (processStatus && processStatus !== "all") {
      queryParamString += `&process_status=${processStatus}`;
    }

    executedRef.current = false;
    navigate(`/process-models/${params.process_group_id}/${params.process_model_id}/process-instances?${queryParamString}`)
  });

  const dateComponent = ((labelString, initialDate, onChangeFunction) => {
    return (
      <Stack className="ms-auto" direction="horizontal" gap={3}>
        <label className="text-nowrap">{labelString}</label>
        <DatePicker
          selected={new Date(initialDate * 1000)}
          onChange={(date) => convertDateToSeconds(date, onChangeFunction)}
          showTimeSelect
          dateFormat="MMMM d, yyyy h:mm aa"
        />
      </Stack>
    )
  });

  const filterOptions = (() => {
    const processStatusesRows = PROCESS_STATUSES.map(processStatusOption => {
      if (processStatusOption === processStatus) {
        return <Dropdown.Item key={processStatusOption} active>{processStatusOption}</Dropdown.Item>
      } else {
        return <Dropdown.Item key={processStatusOption} onClick={(e) => setProcessStatus(processStatusOption)}>{processStatusOption}</Dropdown.Item>
      }
    });
    return (
      <div class="container">
        <div class="row">
          <div class="col">
            <form onSubmit={handleFilter}>
              <Stack direction="horizontal" gap={3}>
                {dateComponent("Start Range: ", startFrom, setStartFrom)}
                {dateComponent("-", startTill, setStartTill)}
              </Stack>
              <br />
              <Stack direction="horizontal" gap={3}>
                {dateComponent("End Range: ", endFrom, setEndFrom)}
                {dateComponent("-", endTill, setEndTill)}
              </Stack>
              <br />
              <Stack direction="horizontal" gap={3}>
                <Dropdown data-qa="process-status-dropdown" id="process-status-dropdown">
                  <Dropdown.Toggle id="process-status" variant="light border">
                    Process Statuses: {processStatus}
                  </Dropdown.Toggle>

                  <Dropdown.Menu variant="light">
                    {processStatusesRows}
                  </Dropdown.Menu>
                </Dropdown>
                <Button className="ms-auto" variant="secondary" type="submit">Filter</Button>
              </Stack>
            </form>
          </div>
          <div class="col">
          </div>
        </div>
      </div>
    );
  });

  if (pagination) {
    const perPage = parseInt(searchParams.get('per_page') || DEFAULT_PER_PAGE);
    const page = parseInt(searchParams.get('page') || DEFAULT_PAGE);
    return(
      <main>
      <ProcessBreadcrumb
        processModelId={params.process_model_id}
        processGroupId={params.process_group_id}
        linkProcessModel="true"
      />
      <h2>Process Instances for {params.process_model_id}</h2>
      {filterOptions()}
      <PaginationForTable
        page={page}
        perPage={perPage}
        pagination={pagination}
        tableToDisplay={buildTable()}
        path={`/process-models/${params.process_group_id}/${params.process_model_id}/process-instances`}
      />
   	  </main>
    )
  } else {
    return(<></>)
  }
}
