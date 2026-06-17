import React, { useState } from 'react'
import { Eye, X, Printer, Download, Trash2 } from 'lucide-react'
import { jsPDF } from "jspdf"
import { useQuery } from '@tanstack/react-query'
import useAxiosSecure from '../../hooks/useAxiosSecure'
import { printInvoice, downloadInvoicePDF } from '../../utils/invoiceUtils'

import Table from '../../components/Table'
import Breadcrumb from '../../components/Breadcrumb'

const OrderList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderProducts, setOrderProducts] = useState([]);
  const axiosSecure = useAxiosSecure();

  const { data: responseData, isLoading, error } = useQuery({
    queryKey: ['orderList'],
    queryFn: async () => {
      try {
        const res = await axiosSecure.get('/business-owner/order-managment/');
        console.log("Order List API Response:", res.data);
        return res.data;
      } catch (err) {
        console.error("Order List API Error:", err);
        throw err;
      }
    }
  });

  const orders = responseData?.data || [];

  const handleViewClick = (order) => {
    setSelectedOrder(order);
    // Use items from API, fallback to empty array
    setOrderProducts(order.items || []);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (order) => {
    // Placeholder for delete logic
    console.log("Delete order clicked:", order.id);
  };

  const columns = [
    { key: 'orderNumber', Title: 'Order No.', width: '10%' },
    { key: 'customerName', Title: 'Customer Name', width: '20%' },
    { key: 'customerPhone', Title: 'Phone', width: '15%' },
    { key: 'date', Title: 'Date', width: '20%' },
    { key: 'total', Title: 'Total', width: '10%' },
    { 
      key: 'action', 
      Title: 'Action', 
      width: '15%',
      sortable: false,
      render: (row) => (
        <div className="flex justify-center gap-2">
          <button 
            onClick={() => handleViewClick(row)}
            className="text-[#9fa5ac] hover:text-[#0e1217] transition-colors p-2 hover:bg-[#edebe5] rounded-lg"
          >
            <Eye className="w-5 h-5" />
          </button>
          <button 
            onClick={() => handleDeleteClick(row)}
            className="text-[#9fa5ac] hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      )
    }
  ]

  return (
    <div>
      <Breadcrumb text="You can see your orders" />

      <div className="bg-[#ffffff] border border-[#e6e4df] rounded-2xl shadow-sm">
        {isLoading ? (
          <div className="p-8 text-center text-[#9fa5ac]">Loading orders...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">Failed to load orders: {error.message || 'Unknown error'}</div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center text-[#9fa5ac]">No orders found.</div>
        ) : (
          <Table 
            TableHeads={columns} 
            TableRows={orders} 
            headClass=" border-b border-[#e6e4df] text-[#0e1217] whitespace-nowrap last:[&>div]:justify-center"
            tableClass="border-none"
            wrapperClass="pb-4"
          />
        )}
      </div>

      {/* View Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-[#0e1217]">
           <div className="bg-[#ffffff] border border-[#e6e4df] rounded-[20px] w-full max-w-[700px] overflow-hidden relative shadow-2xl">
              
              {/* Header */}
              <div className="px-8 py-6 border-b border-[#e6e4df] flex justify-between items-center">
                <h2 className="text-[17px] text-[#0e1217]">
                  Order Summary <span className="text-[#9fa5ac]">({selectedOrder?.customerName || 'Unknown'})</span>
                </h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-[#9fa5ac] hover:text-[#0e1217] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Table Content */}
              <div className="px-8 py-2 max-h-[60vh] overflow-y-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#e6e4df]">
                      <th className="py-4 text-[14px] font-semibold text-[#0e1217]">Product Name</th>
                      <th className="py-4 text-[14px] font-semibold text-[#0e1217]">Size</th>
                      <th className="py-4 text-[14px] font-semibold text-[#0e1217] text-center">Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderProducts.map((product, idx) => (
                      <tr key={idx} className="border-b border-[#e6e4df] last:border-0">
                        <td className="py-5 text-[14px] text-[#9fa5ac]">{product.name || 'N/A'}</td>
                        <td className="py-5 text-[14px] text-[#9fa5ac]">{product.size || '-'}</td>
                        <td className="py-5 text-[14px] text-[#9fa5ac] text-center">
                          <span className="inline-block">{product.quantity || 0}</span>
                        </td>
                      </tr>
                    ))}
                    {orderProducts.length === 0 && (
                      <tr>
                        <td colSpan="3" className="py-8 text-center text-[#9fa5ac] text-sm">No items found in this order.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Footer Actions */}
              <div className="border-t border-[#e6e4df] px-8 py-6 flex justify-end gap-4">
                <button 
                  onClick={() => printInvoice(selectedOrder, orderProducts)}
                  className="flex items-center gap-2 bg-[#edebe5] hover:bg-[#e6e4df] transition-colors text-[#0e1217] px-6 py-2.5 rounded-[10px] text-[13px] font-medium"
                >
                  <Printer className="w-4 h-4" />
                  Print
                </button>
                <button 
                  onClick={() => downloadInvoicePDF(selectedOrder, orderProducts)}
                  className="flex items-center gap-2 bg-[#edebe5] hover:bg-[#e6e4df] transition-colors text-[#0e1217] px-6 py-2.5 rounded-[10px] text-[13px] font-medium"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>

           </div>
        </div>
      )}

    </div>
  )
}

export default OrderList
