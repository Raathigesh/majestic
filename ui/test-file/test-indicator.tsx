import React from "react";
import {
  CheckCircle,
  Circle,
  Package,
  XCircle,
  Zap,
  Edit2
} from "react-feather";

interface Props {
  status: string | null | undefined;
  describe: boolean;
  todo: boolean;
}

export default function TestIndicator({ status, describe, todo }: Props) {
  let Icon = describe ? Package : Zap;
  let color = "#AC61FF";

  if (todo) {
    return <Edit2 size={14} color="#AC61FF" />;
  }

  if (!describe) {
    if (status === "passed") {
      Icon = CheckCircle;
    } else if (status === "todo") {
      Icon = Circle;
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
