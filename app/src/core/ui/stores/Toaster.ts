import { Toaster, Position } from '@blueprintjs/core';
const toast = Toaster.create({
  position: Position.BOTTOM_LEFT
});

export function show(message: string) {
  toast.show({
    message
  });
}
