import { FaktsEndpoint, useFakts, useLoadFakts } from "@jhnnsrs/fakts";
import { manifest } from "../manifest";

const defaultButtonClassName =
  "w-full shadow-lg shadow-primary-700/90 flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-300 hover:bg-primary-500 md:py-4 md:text-lg md:px-10";
const defaultContainerClassName =
  "mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start gap-2";

export type ConnectButtonsProps = {
  containerClassName?: string;
  onError?: (e: Error) => void;
  buttonClassName?: (e: FaktsEndpoint) => string;
  buttonLabel?: (e: FaktsEndpoint) => React.ReactNode;
  noEndpointsFallback?: React.ReactNode;
};

export const ConnectButtons = ({
  containerClassName = defaultContainerClassName,
  onError = (e) => alert(e.message),
  buttonLabel = (e) => `Connect to ${e.name}`,
  noEndpointsFallback = "No endpoints available",
}: ConnectButtonsProps) => {
  const { registeredEndpoints} = useFakts();
  const { ongoing, load, loading } = useLoadFakts({
    manifest,
    requestedRedirectURIs: [window.location.origin + "/callback"],
  });

  return (
    <div className={containerClassName}>
      {registeredEndpoints.length > 0
        ? registeredEndpoints.map((e, index) => (
            <button
              key={index}
              type="button"
              onClick={() =>
                load({
                  endpoint: e,
                  manifest,
              })}
            >
              {buttonLabel(e)} {loading && "(Connecting)"}
            </button>
          ))
        : noEndpointsFallback}
    </div>
  );
};
