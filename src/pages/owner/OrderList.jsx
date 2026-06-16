import React, { useState } from 'react'
import { Eye, X, Printer, Download } from 'lucide-react'
import { jsPDF } from "jspdf"


import Table from '../../components/Table'
import Breadcrumb from '../../components/Breadcrumb'

const OrderList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderProducts, setOrderProducts] = useState([]);

  const handleViewClick = (order) => {
    setSelectedOrder(order);
    setOrderProducts(order.products || [
      { id: 1, name: 'Coca-Cola', quantity: 12, time: '4:45 pm', price: '$2.12k' },
      { id: 2, name: 'Sprite', quantity: 213, time: '4:46 pm', price: '$10k' },
      { id: 3, name: 'Sprite', quantity: 213, time: '4:46 pm', price: '$1.9k' },
    ]);
    setIsModalOpen(true);
  };

  const handleQuantityChange = (id, change) => {
    setOrderProducts(prev => prev.map(p => {
      if (p.id === id) {
        const newQuantity = Math.max(0, p.quantity + change);
        return { ...p, quantity: newQuantity };
      }
      return p;
    }));
  };

  const columns = [
    { key: 'callerId', Title: 'Caller ID', width: '15%' },
    { key: 'customerName', Title: 'Customer Name', width: '20%' },
    { key: 'time', Title: 'Time', width: '15%' },
    { key: 'date', Title: 'Date', width: '15%' },
    { key: 'email', Title: 'Email', width: '20%' },
    { 
      key: 'action', 
      Title: 'Action', 
      width: '15%',
      sortable: false,
      render: (row) => (
        <div className="flex justify-center">
          <button 
            onClick={() => handleViewClick(row)}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
          >
            <Eye className="w-5 h-5" />
          </button>
        </div>
      )
    }
  ]

  const orders = [
    { callerId: '20260223', customerName: 'MD Nadim', time: '4:45 pm', date: '30/07/2025', email: 'example@email.com' },
    { callerId: '20260223', customerName: 'Fatema Akter', time: '4:45 pm', date: '30/07/2025', email: 'example@email.com' },
    { callerId: '20260223', customerName: 'Nusrat Jahan', time: '4:45 pm', date: '30/07/2025', email: 'example@email.com' },
    { callerId: '20260223', customerName: 'Tazreen Huda', time: '4:45 pm', date: '30/07/2025', email: 'example@email.com' },
    { callerId: '20260223', customerName: 'Shakib Ahmed', time: '4:45 pm', date: '30/07/2025', email: 'example@email.com' },
    { callerId: '20260223', customerName: 'Mitu Jahan', time: '4:45 pm', date: '30/07/2025', email: 'example@email.com' },
  ]

  return (
    <div>
      <Breadcrumb text="You can see your order" />

      <div className="bg-[#191919] border border-[#1A1A1A] rounded-2xl overflow-hidden shadow-sm">
        <Table 
          TableHeads={columns} 
          TableRows={orders} 
          headClass=" border-b border-[#1A1A1A] text-gray-200 whitespace-nowrap last:[&>div]:justify-center"
          tableClass="border-none"
        />
      </div>

      {/* View Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-white">
           <div className="bg-[#111111] border border-[#1A1A1A] rounded-[20px] w-full max-w-[700px] overflow-hidden relative shadow-2xl">
              
              {/* Header */}
              <div className="px-8 py-6 border-b border-[#1A1A1A] flex justify-between items-center">
                <h2 className="text-[17px] text-gray-200">
                  Order Summary <span className="text-gray-400">({selectedOrder?.customerName})</span>
                </h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Table Content */}
              <div className="px-8 py-2">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#1A1A1A]">
                      <th className="py-4 text-[14px] font-semibold text-white">Product name</th>
                      <th className="py-4 text-[14px] font-semibold text-white text-center">Order Quantity</th>
                      <th className="py-4 text-[14px] font-semibold text-white">Time</th>
                      <th className="py-4 text-[14px] font-semibold text-white text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderProducts.map((product) => (
                      <tr key={product.id} className="border-b border-[#1A1A1A]">
                        <td className="py-5 text-[14px] text-gray-300">{product.name}</td>
                        <td className="py-5 text-[14px] text-gray-300 text-center">
                          <span onClick={() => handleQuantityChange(product.id, -1)} className="text-gray-500 mr-3 cursor-pointer select-none hover:text-white transition-colors">—</span>
                          <span className="inline-block w-8">{product.quantity}</span>
                          <span onClick={() => handleQuantityChange(product.id, 1)} className="text-gray-500 ml-3 cursor-pointer select-none hover:text-white transition-colors">+</span>
                        </td>
                        <td className="py-5 text-[14px] text-gray-300">{product.time}</td>
                        <td className="py-5 text-[14px] text-gray-300 text-right">{product.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Footer Actions */}
              <div className="px-8 py-6 flex justify-end gap-4 mt-2">
                <button 
                  onClick={() => window.print()}
                  className="flex items-center gap-2 bg-[#1A2255] hover:bg-[#232D70] transition-colors text-white px-6 py-2.5 rounded-[10px] text-[13px] font-medium"
                >
                  <Printer className="w-4 h-4" />
                  Print
                </button>
                <button 
                  onClick={() => {
                    const doc = new jsPDF();
                    
                    // Title
                    doc.setFontSize(18);
                    doc.text("Order Summary", 20, 20);
                    
                    // Order Info
                    doc.setFontSize(12);
                    doc.text(`Customer Name: ${selectedOrder?.customerName || ''}`, 20, 35);
                    doc.text(`Caller ID: ${selectedOrder?.callerId || ''}`, 20, 45);
                    doc.text(`Date: ${selectedOrder?.date || ''}`, 20, 55);
                    doc.text(`Time: ${selectedOrder?.time || ''}`, 20, 65);
                    doc.text(`Email: ${selectedOrder?.email || ''}`, 20, 75);
                    
                    // Products List
                    doc.setFontSize(14);
                    doc.text("Products:", 20, 95);
                    
                    doc.setFontSize(12);
                    let yPos = 105;
                    orderProducts.forEach(product => {
                      doc.text(`- ${product.name}: ${product.quantity} x ${product.price}`, 25, yPos);
                      yPos += 10;
                    });
                    
                    // Save the PDF
                    doc.save(`order_${selectedOrder?.customerName?.replace(/\s+/g, '_') || 'download'}.pdf`);
                  }}
                  className="flex items-center gap-2 bg-[#1A2255] hover:bg-[#232D70] transition-colors text-white px-6 py-2.5 rounded-[10px] text-[13px] font-medium"
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
