import { Link } from 'react-router-dom';
import Breadcrumb from 'react-bootstrap/Breadcrumb';

type OwnProps = {
  processModelId?: string;
  processGroupId?: string;
  linkProcessModel?: boolean;
};

export default function ProcessBreadcrumb({
  processModelId,
  processGroupId,
  linkProcessModel = false,
}: OwnProps) {
  let processGroupBreadcrumb = '';
  let processModelBreadcrumb = '';

  if (processModelId) {
    if (linkProcessModel) {
      // @ts-expect-error TS(2322): Type 'Element' is not assignable to type 'string'.
      processModelBreadcrumb = (
        // @ts-expect-error TS(2686): 'React' refers to a UMD global, but the current fi... Remove this comment to see the full error message
        <Breadcrumb.Item
          linkAs={Link}
          linkProps={{
            to: `/admin/process-models/${processGroupId}/${processModelId}`,
          }}
        >
          Process Model: {processModelId}
        </Breadcrumb.Item>
      );
    } else {
      // @ts-expect-error TS(2322): Type 'Element' is not assignable to type 'string'.
      processModelBreadcrumb = (
        // @ts-expect-error TS(2686): 'React' refers to a UMD global, but the current fi... Remove this comment to see the full error message
        <Breadcrumb.Item active>
          Process Model: {processModelId}
        </Breadcrumb.Item>
      );
    }
    // @ts-expect-error TS(2322): Type 'Element' is not assignable to type 'string'.
    processGroupBreadcrumb = (
      // @ts-expect-error TS(2686): 'React' refers to a UMD global, but the current fi... Remove this comment to see the full error message
      <Breadcrumb.Item
        linkAs={Link}
        linkProps={{ to: `/admin/process-groups/${processGroupId}` }}
      >
        Process Group: {processGroupId}
      </Breadcrumb.Item>
    );
  } else if (processGroupId) {
    // @ts-expect-error TS(2322): Type 'Element' is not assignable to type 'string'.
    processGroupBreadcrumb = (
      // @ts-expect-error TS(2686): 'React' refers to a UMD global, but the current fi... Remove this comment to see the full error message
      <Breadcrumb.Item active>Process Group: {processGroupId}</Breadcrumb.Item>
    );
  }

  return (
    // @ts-expect-error TS(2686): 'React' refers to a UMD global, but the current fi... Remove this comment to see the full error message
    <main style={{ padding: '1rem 0' }}>
      {/* @ts-expect-error TS(2686): 'React' refers to a UMD global, but the current fi... Remove this comment to see the full error message */}
      <Breadcrumb>
        {/* @ts-expect-error TS(2686): 'React' refers to a UMD global, but the current fi... Remove this comment to see the full error message */}
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/admin' }}>
          Home
        </Breadcrumb.Item>
        {processGroupBreadcrumb}
        {processModelBreadcrumb}
      </Breadcrumb>
    </main>
  );
}
