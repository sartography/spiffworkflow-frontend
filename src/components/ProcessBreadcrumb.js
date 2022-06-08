import { Link } from "react-router-dom";
import Breadcrumb from 'react-bootstrap/Breadcrumb'
import 'bootstrap/dist/css/bootstrap.css';

export default function ProcessBreadcrumb(props) {
  let processGroupBreadcrumb = ''
  let processModelBreadcrumb = ''

  if (props.processModelId) {
    if (props.linkProcessModel) {
      processModelBreadcrumb = <Breadcrumb.Item linkAs={Link} linkProps={{ to: `/process-models/${props.processModelId}` }}>Process Model: {props.processModelId}</Breadcrumb.Item>
    } else {
      processModelBreadcrumb = <Breadcrumb.Item active={true}>Process Model: {props.processModelId}</Breadcrumb.Item>
    }
    processGroupBreadcrumb = <Breadcrumb.Item linkAs={Link} linkProps={{ to: `/process-groups/${props.processGroupId}` }}>
      Process Group: {props.processGroupId}
    </Breadcrumb.Item>
  } else if (props.processGroupId) {
    processGroupBreadcrumb = <Breadcrumb.Item active={true}>Process Group: {props.processGroupId}</Breadcrumb.Item>
  }

  return (
    <main style={{ padding: "1rem 0" }}>
    <Breadcrumb>
      <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>Home</Breadcrumb.Item>
      {processGroupBreadcrumb}
      {processModelBreadcrumb}
    </Breadcrumb>
    </main>
  );
}
