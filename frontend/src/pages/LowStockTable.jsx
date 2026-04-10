const LowStockTable = ({ items }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reorder Level</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {items.length === 0 ? (
            <tr>
              <td colSpan={3} className="px-6 py-4 text-center text-gray-400">
                No low stock items
              </td>
            </tr>
          ) : (
            items.map((item, idx) => (
              <tr key={item.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50 hover:bg-gray-100"}>
                <td className="px-6 py-4 text-gray-800 font-medium">{item.product_name}</td>
                <td className="px-6 py-4 text-gray-800 font-semibold">{item.quantity}</td>
                <td className="px-6 py-4 text-red-500 font-semibold">{item.reorder_level}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LowStockTable;
