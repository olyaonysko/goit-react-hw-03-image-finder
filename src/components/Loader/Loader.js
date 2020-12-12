import { Component } from 'react';
import { css } from '@emotion/core';
import RingLoader from 'react-spinners/RingLoader';

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

export default class Loader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }

  render() {
    return (
      <div className="sweet-loading">
        <RingLoader
          css={override}
          size={60}
          color={'#36d7b7'}
          loading={this.state.loading}
        />
      </div>
    );
  }
}
