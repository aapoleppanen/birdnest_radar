import { DeviceInformation } from '../../types';

type Props = {
  deviceInformation: DeviceInformation | null;
}

const DeviceInfo = ({ deviceInformation }: Props) => {
  if (!deviceInformation) return <></>;

  return (
    <div className="flex flex-col items-center justify-center">
      <div>
        {`Radar started: ${deviceInformation && new Date(deviceInformation.deviceStarted).toLocaleString()}`}
      </div>
      <div>
        {`Uptime: ${deviceInformation && Math.floor(Number(deviceInformation.uptimeSeconds) / 60)} minutes`}
      </div>
      <div>
        {`Update Interval: ${deviceInformation && Math.floor(Number(deviceInformation.updateIntervalMs) / 1000)} seconds`}
      </div>
    </div>
  );
};

export default DeviceInfo;
