import { jsPDF } from "jspdf";

export const printInvoice = (selectedOrder, orderProducts) => {
  const printContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Invoice - ${selectedOrder?.orderNumber || 'Download'}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          body { font-family: 'Inter', sans-serif; color: #0e1217; padding: 40px; max-width: 800px; margin: 0 auto; }
          .header { background-color: #205943; color: white; padding: 40px; display: flex; justify-content: space-between; align-items: center; border-radius: 16px; margin-bottom: 40px; }
          .header h1 { margin: 0; font-size: 32px; font-weight: 700; letter-spacing: 1px; }
          .header p { margin: 0; font-size: 15px; opacity: 0.9; font-weight: 500; }
          .info-section { display: flex; justify-content: space-between; margin-bottom: 40px; padding: 0 10px; }
          .info-box { width: 45%; }
          .info-box h3 { color: #9fa5ac; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; }
          .info-box p { margin: 6px 0; font-weight: 600; font-size: 16px; color: #0e1217; }
          table { width: 100%; border-collapse: separate; border-spacing: 0; margin-bottom: 40px; }
          th { background-color: #fbfaf6; padding: 16px 20px; text-align: left; border-bottom: 2px solid #e6e4df; color: #9fa5ac; text-transform: uppercase; font-size: 12px; font-weight: 600; letter-spacing: 0.5px; }
          th:first-child { border-top-left-radius: 12px; }
          th:last-child { border-top-right-radius: 12px; }
          td { padding: 20px; border-bottom: 1px solid #e6e4df; font-size: 15px; font-weight: 500; color: #364153; }
          .total-section { display: flex; justify-content: flex-end; padding: 0 10px; }
          .total-box { background-color: #fbfaf6; padding: 24px 40px; border-radius: 16px; border: 1px solid #e6e4df; text-align: right; min-width: 250px; }
          .total-box span { font-size: 14px; color: #9fa5ac; text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px; margin-right: 20px; }
          .total-box strong { font-size: 24px; color: #205943; font-weight: 700; }
          .footer { margin-top: 80px; text-align: center; color: #9fa5ac; font-size: 14px; font-weight: 500; }
          
          @media print {
            body { padding: 0; margin: 0; max-width: 100%; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            .header { border-radius: 0; padding: 30px; }
            .total-box { border-radius: 0; border-left: none; border-right: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>INVOICE</h1>
          <p>FoodVoice.ai</p>
        </div>
        
        <div class="info-section">
          <div class="info-box">
            <h3>Billed To</h3>
            <p>${selectedOrder?.customerName || 'N/A'}</p>
            <p style="color: #6b7280; font-weight: 500; font-size: 14px;">${selectedOrder?.customerPhone || 'N/A'}</p>
          </div>
          <div class="info-box" style="text-align: right;">
            <h3>Invoice Details</h3>
            <p>Order No: ${selectedOrder?.orderNumber || 'N/A'}</p>
            <p style="color: #6b7280; font-weight: 500; font-size: 14px;">Date: ${selectedOrder?.date || 'N/A'}</p>
          </div>
        </div>

          <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Size</th>
              <th style="text-align: center;">Qty</th>
            </tr>
          </thead>
          <tbody>
            ${orderProducts.map(p => `
              <tr>
                <td>${p.name || 'N/A'}</td>
                <td>${p.size || '-'}</td>
                <td style="text-align: center;">${p.quantity || 0}</td>
              </tr>
            `).join('')}
            ${orderProducts.length === 0 ? '<tr><td colspan="3" style="text-align: center; padding: 40px; color: #9fa5ac;">No items found in this order.</td></tr>' : ''}
          </tbody>
        </table>

        <div class="total-section">
          <div class="total-box">
            <span>Total Amount</span>
            <br/>
            <strong>${selectedOrder?.total || '$0.00'}</strong>
          </div>
        </div>

        <div class="footer">
          Thank you for your business!
        </div>
      </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  printWindow.document.write(printContent);
  printWindow.document.close();
  
  setTimeout(() => {
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  }, 250);
};

export const downloadInvoicePDF = (selectedOrder, orderProducts) => {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(18);
  doc.text("Order Summary", 20, 20);
  
  // Order Info
  doc.setFontSize(12);
  doc.text(`Order No: ${selectedOrder?.orderNumber || ''}`, 20, 35);
  doc.text(`Customer Name: ${selectedOrder?.customerName || ''}`, 20, 45);
  doc.text(`Phone: ${selectedOrder?.customerPhone || ''}`, 20, 55);
  doc.text(`Date: ${selectedOrder?.date || ''}`, 20, 65);
  doc.text(`Total: ${selectedOrder?.total || ''}`, 20, 75);
  
  // Products List
  doc.setFontSize(14);
  doc.text("Products:", 20, 95);
  
  doc.setFontSize(12);
  let yPos = 105;
  orderProducts.forEach(product => {
    doc.text(`- ${product.name} (Size: ${product.size || 'N/A'}): ${product.quantity}x`, 25, yPos);
    yPos += 10;
  });
  
  // Save the PDF
  doc.save(`order_${selectedOrder?.orderNumber?.replace('#', '') || 'download'}.pdf`);
};
