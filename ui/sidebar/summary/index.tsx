import React from "react";
import styled from "styled-components";
import { space } from "styled-system";
import { useSpring, animated } from "react-spring";
import { CheckCircle, ZapOff, Layers } from "react-feather";
import { Summary } from "../../../server/api/workspace/summary";

const Container = styled.div<any>`
  ${space};
`;

const Row = styled.div`
  display: flex;
  font-size: 16px;
  margin-bottom: 5px;
`;

const Cell = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const Label = styled.div`
  font-size: 12px;
  color: #dcdbdb;
`;

const Value = styled.div<any>`
  font-size: 20px;
  color: ${props => (props.failed ? "#FF4F56" : "#19E28D")};
`;

const CoverageLabel = styled.div`
  font-size: 10px;
  color: #dcdbdb;
`;

const CoverageValue = styled.div<any>`
  font-size: 14px;
`;

const Coverage = styled.div`
  margin-top: 10px;
`;

interface Props {
  summary: Summary | undefined;
}

export default function SummaryPanel({ summary }: Props) {
  const passedSuitesProps = useSpring({
    number: summary && summary.numPassedTestSuites | 0,
    from: { number: 0 }
  } as any);

  const failedSuitesProps = useSpring({
    number: summary && summary.numFailedTestSuites | 0,
    from: { number: 0 }
  } as any);

  const passedTestProps = useSpring({
    number: summary && summary.numPassedTests | 0,
    from: { number: 0 }
  } as any);

  const failedTestProps = useSpring({
    number: summary && summary.numFailedTests | 0,
    from: { number: 0 }
  } as any);

  const coverage = summary && summary.coverage;
  const haveCoverage =
    coverage &&
    (coverage.branch ||
      coverage.function ||
      coverage.line ||
      coverage.statement);

  return (
    <Container mt={3} mb={3}>
      <Row>
        <Cell>
          <Value>
            <animated.span>
              {(passedSuitesProps as any).number.interpolate((value: any) =>
                value.toFixed()
              )}
            </animated.span>
          </Value>
          <Label>
            <CheckCircle size={11} /> Passing suites
          </Label>
        </Cell>
        <Cell>
          <Value failed>
            <animated.span>
              {(failedSuitesProps as any).number.interpolate((value: any) =>
                value.toFixed()
              )}
            </animated.span>
          </Value>
          <Label>
            <ZapOff size={11} /> Failing suites
          </Label>
        </Cell>
      </Row>
      <Row>
        <Cell>
          <Value>
            <animated.span>
              {(passedTestProps as any).number.interpolate((value: any) =>
                value.toFixed()
              )}
            </animated.span>
          </Value>
          <Label>
            <CheckCircle size={11} /> Passing tests
          </Label>
        </Cell>
        <Cell>
          <Value failed>
            <animated.span>
              {(failedTestProps as any).number.interpolate((value: any) =>
                value.toFixed()
              )}
            </animated.span>
          </Value>
          <Label>
            <ZapOff size={11} /> Failing tests
          </Label>
        </Cell>
      </Row>
      {!!haveCoverage && (
        <Coverage>
          <Row>
            <Cell>
              <CoverageValue>
                {summary && summary.coverage && summary.coverage.statement}%
              </CoverageValue>
              <CoverageLabel>
                <Layers size={9} /> Stmts
              </CoverageLabel>
            </Cell>
            <Cell>
              <CoverageValue>
                {summary && summary.coverage && summary.coverage.branch}%
              </CoverageValue>
              <CoverageLabel>
                <Layers size={9} /> Branch
              </CoverageLabel>
            </Cell>
            <Cell>
              <CoverageValue>
                {summary && summary.coverage && summary.coverage.function}%
              </CoverageValue>
              <CoverageLabel>
                <Layers size={9} /> Funcs
              </CoverageLabel>
            </Cell>
            <Cell>
              <CoverageValue>
                {summary && summary.coverage && summary.coverage.line}%
              </CoverageValue>
              <CoverageLabel>
                <Layers size={9} /> Lines
              </CoverageLabel>
            </Cell>
          </Row>
        </Coverage>
      )}
    </Container>
  );
}
