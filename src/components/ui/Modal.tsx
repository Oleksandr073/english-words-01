import { PropsWithChildren } from 'react';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from './dialog';

type Props = PropsWithChildren & {
  isOpen: boolean;
  setIsOpen(isOpen: boolean): void;
  title: string;
};
export function Modal({ isOpen, setIsOpen, title, children }: Props) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-[328px] rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-left">{title}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
