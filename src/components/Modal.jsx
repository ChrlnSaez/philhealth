/* eslint-disable react/prop-types */
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
} from '@material-tailwind/react';

export default function Modal({
  open,
  handleOpen,
  title,
  children,
  action,
  noButtons,
}) {
  return (
    <Dialog open={open} handler={handleOpen} size='sm'>
      <DialogHeader>{title}</DialogHeader>
      <DialogBody>{children}</DialogBody>
      {!noButtons && (
        <DialogFooter>
          <Button
            variant='text'
            color='red'
            onClick={handleOpen}
            className='mr-1'>
            Close
          </Button>
          <Button variant='gradient' color='green' onClick={action}>
            Save
          </Button>
        </DialogFooter>
      )}
    </Dialog>
  );
}
