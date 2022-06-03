import React, { useEffect, useState } from "react";

// Example process group json
// {'admin': False, 'display_name': 'Test Workflows', 'display_order': 0, 'id': 'test_process_group'}
export default function ProcessGroups() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [errro, setError] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/v1.0/process-groups", {
      headers: new Headers({
        'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJVSUQxIn0.Olnuo3Luuv0AM_4mBfH35SovXCyN3Zt9in7zZaNMSMA',
        'Content-Type': 'application/x-www-form-urlencoded'
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
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }, []);

  return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Process Groups</h2>
      <ul>
        {items.map(item => (
          <li key={item.id}>
            {item.id} {item.display_name} {item.display_order}
          </li>
        ))}
      </ul>
    </main>
  );
}

