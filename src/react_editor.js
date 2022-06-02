import BpmnModeler from 'bpmn-js/lib/Modeler';
import {
  BpmnPropertiesPanelModule,
  BpmnPropertiesProviderModule,
} from 'bpmn-js-properties-panel';
import React from "react";

import "bpmn-js-properties-panel/dist/assets/properties-panel.css"
import './bpmn-js-properties-panel.css';

export default class ReactEditor extends React.Component {
    constructor(props) {
    super(props);

    this.state = { };

    this.containerRef = React.createRef();
  }

  componentDidMount() {

    const {
      url,
      diagramXML
    } = this.props;

    const container = this.containerRef.current;

    this.bpmnViewer = new BpmnModeler({
      container: container,
      keyboard: {
        bindTo: document
      },
      propertiesPanel: {
        parent: '#js-properties-panel'
      },
      additionalModules: [
        BpmnPropertiesPanelModule,
        BpmnPropertiesProviderModule
      ]
    });

    this.bpmnViewer.on('import.done', (event) => {
      const {
        error,
        warnings
      } = event;

      if (error) {
        return this.handleError(error);
      }

      this.bpmnViewer.get('canvas').zoom('fit-viewport');

      return this.handleShown(warnings);
    });

    if (url) {
      return this.fetchDiagram(url);
    }

    if (diagramXML) {
      return this.displayDiagram(diagramXML);
    }
  }

  componentWillUnmount() {
    this.bpmnViewer.destroy();
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      props,
      state
    } = this;

    if (props.url !== prevProps.url) {
      return this.fetchDiagram(props.url);
    }

    const currentXML = props.diagramXML || state.diagramXML;

    const previousXML = prevProps.diagramXML || prevState.diagramXML;

    if (currentXML && currentXML !== previousXML) {
      return this.displayDiagram(currentXML);
    }
  }

  displayDiagram(diagramXML) {
    this.bpmnViewer.importXML(diagramXML);
  }

  fetchDiagram(url) {

    this.handleLoading();

    fetch(url)
      .then(response => response.text())
      .then(text => this.setState({ diagramXML: text }))
      .catch(err => this.handleError(err));
  }

  handleLoading() {
    const { onLoading } = this.props;

    if (onLoading) {
      onLoading();
    }
  }

  handleError(err) {
    const { onError } = this.props;

    if (onError) {
      onError(err);
    }
  }

  handleShown(warnings) {
    const { onShown } = this.props;

    if (onShown) {
      onShown(warnings);
    }
  }

  render() {
    return (
      <div className="content with-diagram" id="js-drop-zone">
      <div className="canvas" id="js-canvas" ref={ this.containerRef }
      style={{
        border: "1px solid #000000",
          height: "90vh",
          width: "90vw",
          margin: "auto"
      }}
      ></div>
      <div className="properties-panel-parent" id="js-properties-panel"></div>
      </div>
    );
  }
}
