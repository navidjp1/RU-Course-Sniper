import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Dialog, DialogPanel } from "@headlessui/react";

export const Dashboard = () => {
  const location = useLocation();

  return (
    <div className="dashboard">
      <h1>Hi and welcome to the dashboard</h1>
    </div>
  );
};
