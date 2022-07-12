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
      // @ts-expect-error TS(2322) FIXME: Type 'Element' is not assignable to type 'string'.
      processModelBreadcrumb = (
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
      // @ts-expect-error TS(2322) FIXME: Type 'Element' is not assignable to type 'string'.
      processModelBreadcrumb = (
        <Breadcrumb.Item active>
          Process Model: {processModelId}
        </Breadcrumb.Item>
      );
    }
    // @ts-expect-error TS(2322) FIXME: Type 'Element' is not assignable to type 'string'.
    processGroupBreadcrumb = (
      <Breadcrumb.Item
        linkAs={Link}
        data-qa="process-group-breadcrumb-link"
        linkProps={{ to: `/admin/process-groups/${processGroupId}` }}
      >
        Process Group: {processGroupId}
      </Breadcrumb.Item>
    );
  } else if (processGroupId) {
    // @ts-expect-error TS(2322) FIXME: Type 'Element' is not assignable to type 'string'.
    processGroupBreadcrumb = (
      <Breadcrumb.Item active>Process Group: {processGroupId}</Breadcrumb.Item>
    );
  }

  return (
    <main style={{ padding: '1rem 0' }}>
      <Breadcrumb>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/admin' }}>
          Home
        </Breadcrumb.Item>
        {processGroupBreadcrumb}
        {processModelBreadcrumb}
      </Breadcrumb>
    </main>
  );
}
