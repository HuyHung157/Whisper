import React, { ReactNode } from "react";
import { Card, Input, Skeleton } from "antd";

interface CustomCardProps {
  label: string;
  icon?: ReactNode;
  children: ReactNode;
}

const CustomCard = ({ icon, label, children }: CustomCardProps) => {
  return (
    <>
      <div className="card-container">
        <div className="flex align-middle top-left-label">
          {icon && icon}
          <span className="ml-5">{label}</span>
        </div>
        <Card>{children}</Card>
      </div>
    </>
  );
};

export default CustomCard;
