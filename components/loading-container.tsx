import { CircularProgress } from "@nextui-org/react";
import * as React from "react";

export const LoadingContainer = () => {
  return (
    <div className="col-span-full">
      <div className="card flex flex-col justify-center items-center">
        <div>
            <CircularProgress label="Loading..." color="primary" />
        </div>
      </div>
    </div>
  );
};
