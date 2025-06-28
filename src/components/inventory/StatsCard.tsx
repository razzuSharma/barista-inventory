import React from "react";

type StatsCardProps = {
  title: string;
  value: number;
  icon: React.ComponentType<any>;
  color?: "blue" | "orange" | "red";
};

const StatsCard = ({
  title,
  value,
  icon: Icon,
  color = "blue",
}: StatsCardProps) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    orange: "bg-orange-50 text-orange-600",
    red: "bg-red-50 text-red-600",
  };

  const textColors = {
    blue: "text-gray-900",
    orange: "text-orange-600",
    red: "text-red-600",
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-2xl font-bold ${textColors[color]}`}>{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
