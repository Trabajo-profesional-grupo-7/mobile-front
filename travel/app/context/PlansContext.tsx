import React, { createContext, useContext, useState, ReactNode } from "react";

interface Location {
  latitude: number;
  longitude: number;
}

interface Attraction {
  attraction_id: string;
  attraction_name: string;
  location: Location;
  date: string;
  hour: string | null;
}

interface Plan {
  [date: string]: Attraction[];
}

export interface PlanProps {
  user_id: number;
  plan_name: string;
  destination: string;
  init_date: string;
  end_date: string;
  attractions: string[];
  plan: Plan;
  id: string;
  image: string;
}

interface PlansContextProps {
  plans: PlanProps[];
  setPlans: (plans: PlanProps[]) => void;
  replacePlan: (newPlan: PlanProps) => void;
  deletePlan: (id: string) => void;
}

const PlansContext = createContext<PlansContextProps | undefined>(undefined);

export const PlansProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [plans, setPlans] = useState<PlanProps[]>([]);

  const replacePlan = (newPlan: PlanProps) => {
    setPlans((prevPlans) =>
      prevPlans.map((plan) => (plan.id === newPlan.id ? newPlan : plan))
    );
  };

  const deletePlan = (id: string) => {
    setPlans((prevPlans) => prevPlans.filter((plan) => plan.id !== id));
  };

  return (
    <PlansContext.Provider value={{ plans, setPlans, replacePlan, deletePlan }}>
      {children}
    </PlansContext.Provider>
  );
};

export const usePlans = (): PlansContextProps => {
  const context = useContext(PlansContext);
  if (context === undefined) {
    throw new Error("usePlans must be used within a PlansProvider");
  }
  return context;
};
