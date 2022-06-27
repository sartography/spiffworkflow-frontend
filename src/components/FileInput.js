import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { BACKEND_BASE_URL, HOT_AUTH_TOKEN } from '../config';

export default class FileInput extends React.Component {
  constructor({ processGroupId, processModelId }) {
    super({ processGroupId, processModelId });
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fileInput = React.createRef();
    this.processGroupId = processGroupId;
    this.processModelId = processModelId;
  }

  handleSubmit(event) {
    event.preventDefault();
    const url = `${BACKEND_BASE_URL}/process-models/${this.processGroupId}/${this.processModelId}/file`;
    const formData = new FormData();
    formData.append('file', this.fileInput.current.files[0]);
    formData.append('fileName', this.fileInput.current.files[0].name);

    // this might work if we remove the content-type header
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
        Authorization: `Bearer ${HOT_AUTH_TOKEN}`,
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

FileInput.propTypes = {
  processGroupId: PropTypes.string.isRequired,
  processModelId: PropTypes.string.isRequired,
};
