import React from "react";
import {
  X,
  CheckCircle,
  Circle,
  Code,
  Package,
  XCircle,
  Zap
} from "react-feather";

interface Props {
  status: string | null | undefined;
  describe: boolean;
}

export default function TestIndicator({ status, describe }: Props) {
  let Icon = describe ? Package : Zap;
  let color = "#AC61FF";

  if (status === "passed") {
    Icon = CheckCircle;
    color = "#50E3C2";
  } else if (status === "failed") {
    Icon = XCircle;
    color = "#FF4954";
  }

  return <Icon size={14} color={color} />;
}
