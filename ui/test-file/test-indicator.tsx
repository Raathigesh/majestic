import React from "react";
import {
  X,
  Check,
  Octagon,
  Code,
  XCircle,
  CheckCircle,
  Circle
} from "react-feather";

interface Props {
  status: "passed" | "failed";
}

export default function TestIndicator({ status }: Props) {
  let Icon = Circle;

  if (status === "passed") {
    Icon = CheckCircle;
  } else if (status === "failed") {
    Icon = XCircle;
  }

  return <Icon size={14} />;
}
