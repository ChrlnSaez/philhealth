/* eslint-disable react/prop-types */
import { Card, CardBody, Typography } from '@material-tailwind/react';
import {
  BuildingOffice2Icon,
  ClipboardDocumentIcon,
  UserGroupIcon,
} from '@heroicons/react/24/solid';
import { cn } from '../lib/utils';

export default function CardWithLink({
  isFacility,
  isHealthCare,
  choose,
  numFacilities = 0,
  numHealthCare = 0,
}) {
  return (
    <div className='grid grid-cols-3 pt-16 gap-10 px-20'>
      <Card className='w-full bg-gray-500 text-white'>
        <CardBody className='flex flex-col items-center justify-center'>
          <ClipboardDocumentIcon className='h-14 w-14' />
          <Typography
            variant='h4'
            color='blue-gray'
            className='mb-2 text-white'>
            Total Accreditations
          </Typography>
          <Typography variant='p' className='text-xl'>
            {numFacilities + numHealthCare}
          </Typography>
        </CardBody>
      </Card>

      <Card
        className={cn('w-full cursor-pointer', !choose && 'bg-yellow-600')}
        onClick={isFacility}>
        <CardBody className='flex flex-col items-center justify-center'>
          <BuildingOffice2Icon
            className={cn('h-14 w-14 text-green-500', !choose && 'text-white')}
          />
          <Typography
            variant='h4'
            color='blue-gray'
            className={cn('mb-2', !choose && 'text-white')}>
            Facility
          </Typography>
          <Typography
            variant='p'
            className={cn('text-xl', !choose && 'text-white')}>
            {numFacilities}
          </Typography>
        </CardBody>
      </Card>

      <Card
        className={cn('w-full cursor-pointer', choose && 'bg-yellow-600')}
        onClick={isHealthCare}>
        <CardBody className='flex flex-col items-center justify-center'>
          <UserGroupIcon
            className={cn('h-14 w-14 text-green-500', choose && 'text-white')}
          />
          <Typography
            variant='h4'
            color='blue-gray'
            className={cn('mb-2', choose && 'text-white')}>
            Healthcare Professional
          </Typography>
          <Typography
            variant='p'
            className={cn('text-xl', choose && 'text-white')}>
            {numHealthCare}
          </Typography>
        </CardBody>
      </Card>
    </div>
  );
}
