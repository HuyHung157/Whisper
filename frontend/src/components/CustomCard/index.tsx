import React, { ReactNode } from "react";
import { Card } from "antd";
import "./CustomCard.css";

interface CustomCardProps {
  label: string;
  icon?: ReactNode;
  children: ReactNode;
}

const CustomCard = ({ icon, label, children }: CustomCardProps) => {
  return (
    <>
      <div className="card-container">
        <div className="flex items-center h-8 p-1 px-5 top-left-label ">
          {icon && icon}
          <span className="ml-1">{label}</span>
        </div>
        <Card>{children}</Card>
      </div>
    </>
  );
};

export default CustomCard;
