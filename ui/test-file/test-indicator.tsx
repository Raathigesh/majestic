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

  if (!describe) {
    if (status === "passed") {
      Icon = CheckCircle;
    } else if (status === "failed") {
      Icon = XCircle;
    }
  }

  if (status === "passed") {
    color = "#50E3C2";
  } else if (status === "failed") {
    color = "#FF4954";
  }

  return <Icon size={14} color={color} />;
}
