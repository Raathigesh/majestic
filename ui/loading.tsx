import React from "react";
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

  #icon-crop-button {
    animation: cropped 1s alternate infinite ease-in-out;
    transform-origin: center;
    fill: aliceblue;
  }

  @-webkit-keyframes cropped {
    0% {
      transform: rotate(0deg) scale(1);
    }

    50% {
      transform: rotate(90deg) scale(0.9);
    }

    100% {
      transform: rotate(180deg) scale(1);
    }
  }

  @keyframes cropped {
    0% {
      transform: rotate(0deg) scale(1);
    }

    50% {
      transform: rotate(90deg) scale(0.9);
    }

    100% {
      transform: rotate(180deg) scale(1);
    }
  }
`;

const Message = styled.div`
  font-size: 15px;
`;

export default function Loading() {
  return (
    <Container>
      <Loader>
        <svg
          id="icon-crop-button"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 459 459"
        >
          <path d="M0 51v102h51V51h102V0H51C23 0 0 23 0 51zm51 255H0v102c0 28 23 51 51 51h102v-51H51V306zm357 102H306v51h102c28 0 51-23 51-51V306h-51v102zm0-408H306v51h102v102h51V51c0-28-23-51-51-51z" />
        </svg>
      </Loader>
      <Message>Getting things ready for you</Message>
    </Container>
  );
}
