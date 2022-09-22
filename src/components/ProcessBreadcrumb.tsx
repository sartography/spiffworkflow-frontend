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
  let processGroupBreadcrumb = null;
  let processModelBreadcrumb = null;

  if (processModelId) {
    if (linkProcessModel) {
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
      processModelBreadcrumb = (
        <Breadcrumb.Item active>
          Process Model: {processModelId}
        </Breadcrumb.Item>
      );
    }
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
    processGroupBreadcrumb = (
      <Breadcrumb.Item active>Process Group: {processGroupId}</Breadcrumb.Item>
    );
  }

  return (
    <main style={{ padding: '1rem 0' }}>
      <Breadcrumb>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/admin' }}>
          Process Groups
        </Breadcrumb.Item>
        {processGroupBreadcrumb}
        {processModelBreadcrumb}
      </Breadcrumb>
    </main>
  );
}
