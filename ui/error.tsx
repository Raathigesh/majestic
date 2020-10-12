import React, { Component } from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  align-items: center;
  justify-content: center;
  background-color: #262529;
  color: #fdc055;
  font-size: 25px;
  font-weight: 500;
`;

const Loader = styled.div`
  margin-bottom: 20px;
  svg {
    text-align: center;
    margin: auto;
    width: 60px;
    height: 60px;
  }

  #icon-stop-circle .stopping {
    animation-name: stopping;
    animation-duration: 5s;
    animation-timing-function: ease-in-out;
    animation-iteration-count: infinite;
    transform-origin: center center;
  }

  @keyframes stopping {
    from,
    50%,
    to {
      opacity: 1;
      fill: #ea3970;
      stroke: none;
    }

    25%,
    75% {
      opacity: 0;
    }
  }
`;

const Message = styled.div`
  font-size: 15px;
`;

export class ErrorBoundary extends Component {
  state = {
    didError: false
  };

  componentDidCatch() {
    this.setState({
      didError: true
    });
  }

  render() {
    if (!this.state.didError) {
      return this.props.children;
    }

    return (
      <Container>
        <Loader>
          <svg
            id="icon-stop-circle"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="aliceblue"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <rect className="stopping" x="9" y="9" width="6" height="6" />
          </svg>
        </Loader>
        <Message>
          Oops, Something went wrong. Check the terminal for exact error
          message!
        </Message>
      </Container>
    );
  }
}
