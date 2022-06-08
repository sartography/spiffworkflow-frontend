import React from "react";
import { BACKEND_BASE_URL } from '../config';
import { HOT_AUTH_TOKEN } from '../config';
import axios from 'axios';

export default class FileInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fileInput = React.createRef();
    this.props = props;
  }

  handleSubmit(event) {
    event.preventDefault()
    const url = `${BACKEND_BASE_URL}/process-models/${this.props.processModel.id}/file`;
    const formData = new FormData();
    formData.append('file', this.fileInput.current.files[0]);
    formData.append('fileName', this.fileInput.current.files[0].name);

    // const headers = {
    //   'Authorization': `Bearer ${HOT_AUTH_TOKEN}`,
    //     'content-type': 'multipart/form-data',
    // };
    // fetch(url, {
    //   headers: new Headers(headers),
    //   method: 'POST',
    //   body: formData
    // })
    //   .then((response) => response.json())
    //   .then((result) => {
    //     console.log('Success:', result);
    //   })
    //   .catch((error) => {
    //     console.error('Error:', error);
    // });

    const config = {
      headers: {
        'content-type': 'multipart/form-data',
        'Authorization': `Bearer ${HOT_AUTH_TOKEN}`,
      },
    };
    axios.post(url, formData, config).then((response) => {
      console.log(response.data);
    });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Upload file:
          <input type="file" ref={this.fileInput} />
        </label>
        <button type="submit">Submit</button>
      </form>
    );
  }
}
