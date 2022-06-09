import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BACKEND_BASE_URL } from '../config';
import { HOT_AUTH_TOKEN } from '../config';
import ProcessBreadcrumb from '../components/ProcessBreadcrumb'
import Button from 'react-bootstrap/Button'

// Example process group json
// {'admin': False, 'display_name': 'Test Workflows', 'display_order': 0, 'id': 'test_process_group'}
export default function ProcessGroups() {
  const [processGroups, setProcessGroups] = useState([]);

  useEffect(() => {
    fetch(`${BACKEND_BASE_URL}/process-groups`, {
      headers: new Headers({
        'Authorization': `Bearer ${HOT_AUTH_TOKEN}`
      })
    })
      .then(res => res.json())
      .then(
        (result) => {
          setProcessGroups(result);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (newError) => {
          console.log(newError);
        }
      )
  }, []);

  if (processGroups) {
    return (
      <main style={{ padding: "1rem 0" }}>
        <ProcessBreadcrumb />
        <h2>Process Groups</h2>
        <Button href={`/process-groups/new`}>Add a process group</Button>
        <br />
        <br />
        <ul>
          {processGroups.map(processGroup => (
            <li key={processGroup.id}>
              <Link to={`/process-groups/${processGroup.id}`}>{processGroup.id}</Link>
            </li>
          ))}
        </ul>
      </main>
    );
  } else {
    return (<></>)
  }
}

