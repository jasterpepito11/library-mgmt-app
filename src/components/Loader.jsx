import React from "react";
import { MutatingDots } from "react-loader-spinner";
export default function Loader () {
  return (
      <div className="row align-items-center loader">
        <MutatingDots
          height="100"
          width="100"
          color="#0d6efd"
          secondaryColor='#0d6efd'
          radius='14'
          ariaLabel="mutating-dots-loading"
          wrapperStyle={{}}
          wrapperClass="justify-content-center"
          visible={true}
      />
      </div>
  );
}
