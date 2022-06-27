import { Link } from 'react-router-dom';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import PropTypes from 'prop-types';

export default function ProcessBreadcrumb({
  processModelId,
  processGroupId,
  linkProcessModel,
}) {
  let processGroupBreadcrumb = '';
  let processModelBreadcrumb = '';

  if (processModelId) {
    if (linkProcessModel) {
      processModelBreadcrumb = (
        <Breadcrumb.Item
          linkAs={Link}
          linkProps={{
            to: `/process-models/${processGroupId}/${processModelId}`,
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
        linkProps={{ to: `/process-groups/${processGroupId}` }}
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
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>
          Home
        </Breadcrumb.Item>
        {processGroupBreadcrumb}
        {processModelBreadcrumb}
      </Breadcrumb>
    </main>
  );
}

ProcessBreadcrumb.propTypes = {
  processModelId: PropTypes.string,
  processGroupId: PropTypes.string,
  linkProcessModel: PropTypes.bool,
};

ProcessBreadcrumb.defaultProps = {
  processGroupId: null,
  processModelId: null,
  linkProcessModel: false,
};
