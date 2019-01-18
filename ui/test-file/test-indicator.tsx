import React from "react";
import { X, Check, Octagon } from "react-feather";

interface Props {
  status: "passed" | "failed";
}

export default function TestIndicator({ status }: Props) {
  let Icon = Octagon;

  if (status === "passed") {
    Icon = Check;
  } else if (status === "failed") {
    Icon = X;
  }

  return <Icon size={12} />;
}
