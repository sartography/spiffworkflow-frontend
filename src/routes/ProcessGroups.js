import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BACKEND_BASE_URL } from '../config';
import { HOT_AUTH_TOKEN } from '../config';

// Example process group json
// {'admin': False, 'display_name': 'Test Workflows', 'display_order': 0, 'id': 'test_process_group'}
export default function ProcessGroups() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch(`${BACKEND_BASE_URL}/process-groups`, {
      headers: new Headers({
        'Authorization': `Bearer ${HOT_AUTH_TOKEN}`
      })
    })
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setItems(result);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (newError) => {
          setIsLoaded(true);
          setError(newError);
        }
      )
  }, []);

  return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Process Groups</h2>
      <ul>
        {items.map(item => (
          <li key={item.id}>
            <Link to={`/process-groups/${item.id}`}>{item.id}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

