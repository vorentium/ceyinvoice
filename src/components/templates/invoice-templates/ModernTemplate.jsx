import React from 'react';

export function ModernTemplate({ formData }) {
  return (
    <div className="bg-white h-full font-sans relative">
      {/* Updated Header Section with orange theme */}
      <div className="relative bg-[#f97316] p-6">
        <div className="flex justify-between items-center">
          {/* Logo area - larger circular container */}
          <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center overflow-hidden border-2 border-gray-200">
            {formData.companyLogo ? (
              <img src={formData.companyLogo} alt="Company Logo" className="max-h-full max-w-full rounded-full" />
            ) : (
              <span className="text-center text-gray-500 text-base">Logo here</span>
            )}
          </div>
          
          {/* Invoice details */}
          <div className="flex-1 pl-6">
            <div className="text-right text-white">
              <h1 className="text-4xl font-bold mb-2">INVOICE</h1>
              <p className="text-xl font-medium">#{formData.invoiceNumber || 'invoice no'}</p>
            </div>
            
            <div className="mt-6 text-left text-white">
              <div className="flex mb-3">
                <p className="font-bold text-base w-20">FROM :</p>
                <p className="text-base">{formData.companyName || 'company name'}, {formData.companyAddress || 'address'}</p>
              </div>
              
              <div className="flex mb-3">
                <p className="font-bold text-base w-20">PHONE :</p>
                <p className="text-base">{formData.companyNumber || 'company phone'}</p>
              </div>
              
              <div className="flex mb-3">
                <p className="font-bold text-base w-20">TO :</p>
                <p className="text-base">{formData.customerName || 'customer name'}, {formData.customerAddress || 'address'}</p>
              </div>
              
              <div className="flex mb-3">
                <p className="font-bold text-base w-20">PHONE :</p>
                <p className="text-base">{formData.customerNumber || 'customer phone'}</p>
              </div>
              
              <div className="flex justify-between mt-2">
                <p className="text-base"><span className="font-bold">ISSUE DATE : </span>{formData.issueDate || 'DD/MM/YYYY'}</p>
                <p className="text-base"><span className="font-bold mr-4">DUE DATE : </span>{formData.dueDate || 'DD/MM/YYYY'}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Orange diagonal design element */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-0 left-0 w-1/3 h-full bg-[#f97316] transform -skew-x-12 origin-top-right"></div>
        </div>
      </div>
      
      {/* Invoice table */}
      <div className="px-6 py-4">
        <table className="w-full">
          <thead>
            <tr className="bg-[#f97316] text-white">
              <th className="p-2 text-left text-sm">Description</th>
              <th className="p-2 text-center text-sm">QTY</th>
              <th className="p-2 text-center text-sm">Price</th>
              <th className="p-2 text-right text-sm">Amount</th>
            </tr>
          </thead>
          <tbody>
            {formData.items.length > 0 ? formData.items.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="p-2 text-left text-sm">{item.description || '-'}</td>
                <td className="p-2 text-center text-sm">{item.quantity || '-'}</td>
                <td className="p-2 text-center text-sm">{item.price ? `${formData.currency || ''} ${item.price}` : '-'}</td>
                <td className="p-2 text-right text-sm">
                  {item.quantity && item.price 
                    ? `${formData.currency || ''} ${(parseFloat(item.quantity) * parseFloat(item.price)).toFixed(2)}` 
                    : '-'}
                </td>
              </tr>
            )) : (
              <tr className="border-b">
                <td className="p-2 text-left text-sm">-</td>
                <td className="p-2 text-center text-sm">-</td>
                <td className="p-2 text-center text-sm">-</td>
                <td className="p-2 text-right text-sm">-</td>
              </tr>
            )}
          </tbody>
        </table>
        
        {/* Totals */}
        <div className="flex justify-end mt-4">
          <div className="w-1/2">
            <div className="flex justify-between py-2">
              <span className="text-sm">Subtotal</span>
              <span className="text-sm">{formData.subtotal ? `${formData.currency || ''} ${formData.subtotal}` : '0.00'}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-sm">VAT ({formData.vatPercent || '0'}%)</span>
              <span className="text-sm">{formData.vat ? `${formData.currency || ''} ${formData.vat}` : '0.00'}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-sm">DIS ({formData.discountPercent || '0'}%)</span>
              <span className="text-sm">{formData.discount ? `${formData.currency || ''} ${formData.discount}` : '0.00'}</span>
            </div>
            <div className="flex justify-between py-2 border-t-2 border-[#f97316] font-bold">
              <span className="text-sm">Total</span>
              <span className="text-sm">{formData.total ? `${formData.currency || ''} ${formData.total}` : '0.00'}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="px-6 py-8 relative mb-20">
        <div>
          <p className="font-bold text-sm">Terms & condition:</p>
          <p className="text-sm">{formData.termsAndCondition || 'Terms & condition here'}</p>
        </div>
        
        <div className="mt-4">
          <p className="font-bold text-sm">Payment Method</p>
          <p className="text-sm">{formData.paymentMethod || 'Payment method here'}</p>
        </div>
        
        <div className="mt-8 text-center">
          <p className="font-bold text-sm">{formData.greetingMessage || 'Thank you for your business with us!'}</p>
        </div>
      </div>
      
      {/* Orange wave design element - fixed at bottom */}
      <div className="absolute bottom-0 left-0 top-[138%] w-full " style={{ zIndex: 2 }}>
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="fill-[#f97316] w-full h-24">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C50,0,100,5.94,150.65,11.41c39.06,4.21,78.69,10.42,113.77,26.32C283.76,44.25,302.48,50.71,321.39,56.44Z"></path>
        </svg>
      </div>
    </div>
  );
}