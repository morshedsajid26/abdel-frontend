import Breadcrumb from "@/components/Breadcrumb";
import React from "react";
import BillingHistory from "./settings/BillingHistory";
import Plan from "./Plan";
import CurrentPlan from "./settings/CurrentPlan";

const Subscription = () => {
  return (
    <div>
      <Breadcrumb text="You can see your subscription details" />

      <div>
        <CurrentPlan />
      </div>

      <div>
        <Plan />
      </div>

      <div>
        <BillingHistory />
      </div>
    </div>
  );
};

export default Subscription;
