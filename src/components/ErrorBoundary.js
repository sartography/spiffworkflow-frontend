import React from "react";
//FIXME: this is currently not actually catching any issues. not sure why
class ErrorBoundary extends React.Component {
  constructor(props) {
    console.log("WE CALL CONST")
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    console.log("GET DERIED");
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log("COM DCATH");
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
    // You can also log the error to an error reporting service
    console.log("HELLO: ", error, errorInfo);
  }

  render() {
    console.log("WEC ALL RENDER");
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
