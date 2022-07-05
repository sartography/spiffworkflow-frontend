export default function Expenses() {
  return (
    // @ts-expect-error TS(2686) FIXME: 'React' refers to a UMD global, but the current fi... Remove this comment to see the full error message
    <main style={{ padding: '1rem 0' }}>
      {/* @ts-expect-error TS(2686) FIXME: 'React' refers to a UMD global, but the current fi... Remove this comment to see the full error message */}
      <h2>Expenses</h2>
    </main>
  );
}
