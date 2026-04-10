import { FaBox, FaWarehouse, FaShippingFast, FaExclamationTriangle } from "react-icons/fa";

const StatCard = ({ title, value, highlight, type }) => {
  const getCardStyle = () => {
    switch (type) {
      case "products":
        return "bg-blue-50 text-blue-700";
      case "stock":
        return "bg-green-50 text-green-700";
      case "shipment":
        return "bg-yellow-50 text-yellow-800";
      case "alert":
        return "bg-red-50 text-red-700";
      default:
        return "bg-gray-50 text-gray-900";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "products":
        return <FaBox className="w-6 h-6" />;
      case "stock":
        return <FaWarehouse className="w-6 h-6" />;
      case "shipment":
        return <FaShippingFast className="w-6 h-6" />;
      case "alert":
        return <FaExclamationTriangle className="w-6 h-6" />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`p-6 rounded-lg shadow-lg flex justify-between items-center hover:shadow-xl transition-shadow duration-200 ${getCardStyle()}`}
    >
      <div>
        <span className="text-sm uppercase tracking-wide">{title}</span>
        <div className={`mt-2 text-3xl font-extrabold ${highlight ? "text-red-600" : ""}`}>
          {value}
        </div>
      </div>
      <div className="p-3 rounded-full bg-white">{getIcon()}</div>
    </div>
  );
};

export default StatCard;
