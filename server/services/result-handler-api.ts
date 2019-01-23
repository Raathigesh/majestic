import { Application } from "express";
import * as bodyParser from "body-parser";
import { pubsub } from "../event-emitter";

export const Events = {
  TEST_START: "TEST_START",
  TEST_RESULT: "TEST_RESULT",
  RUN_START: "RUN_START",
  RUN_COMPLETE: "RUN_COMPLETE",
  RUN_SUMMARY: "RUN_SUMMARY"
};

export interface ResultEvent {
  id: string;
  payload: any;
}

export interface SummaryEvent {
  id: string;
  payload: {
    summary: {
      numPassedTests: number;
      numFailedTests: number;
    };
  };
}

export default function handlerApi(expressApp: Application) {
  expressApp.use(bodyParser.json());
  expressApp.post("/test-start", ({ body }, res) => {
    pubsub.publish(Events.TEST_START, {
      id: Events.TEST_START,
      payload: {
        path: body.path,
        test: body
      }
    });
    res.send("ok");
  });

  expressApp.post("/test-result", ({ body }, res) => {
    pubsub.publish(Events.TEST_RESULT, {
      id: Events.TEST_RESULT,
      payload: {
        path: body.testResult.testFilePath,
        result: body
      }
    });

    pubsub.publish(Events.RUN_SUMMARY, {
      id: Events.RUN_SUMMARY,
      payload: {
        summary: body.aggregatedResult
      }
    });
    res.send("ok");
  });

  expressApp.post("/run-start", (req, res) => {
    pubsub.publish(Events.RUN_START, {
      id: Events.RUN_START,
      payload: req.body
    });
    res.send("ok");
  });

  expressApp.post("/run-complete", (req, res) => {
    pubsub.publish(Events.RUN_COMPLETE, {
      id: Events.RUN_COMPLETE,
      payload: req.body
    });
    res.send("ok");
  });
}
