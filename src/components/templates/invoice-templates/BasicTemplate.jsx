import React from 'react';

export function BasicTemplate({ formData }) {
  return (
    <div className="p-8 bg-white h-full">
      <div className="flex justify-between items-start mb-12 gap-8">
        <div className="flex-1">
          <h1 className="text-5xl font-bold mb-2">INVOICE</h1>
          <p className="text-xl mb-8">#{formData.invoiceNumber || '00000'}</p>
          
          <p className="mb-1">{formData.companyName || 'Company name here'}</p>
          <p className="mb-1">{formData.companyAddress || 'Company Address Line 1'}</p>
          <p>{formData.companyNumber || 'Company mobile no.'}</p>
        </div>

        <div className="flex-1 mt-2">
          <h2 className="font-bold mb-2 mt-[72px]">BILL TO :</h2>
          <p className="mb-1">{formData.customerName || 'Customer Name'}</p>
          <p className="mb-1">{formData.customerAddress || 'Customer Address Line'}</p>
          <p>{formData.customerNumber || 'Customer mobile no.'}</p>
        </div>
        
        <div className="flex-1 flex flex-col items-end">
          <div className="w-40 h-40 border-none mb-8 flex items-center justify-center">
            {formData.companyLogo ? (
              <img src={formData.companyLogo} alt="Company Logo" className="max-h-full max-w-full" />
            ) : (
              <p className="text-gray-500 text-center">LOGO HERE</p>
            )}
          </div>
          
          <div className="text-right">
            <div className="mb-2">
              <span className="mr-2">Issue Date :</span>
              <span>{formData.issueDate || ''}</span>
            </div>
            <div>
              <span className="mr-2">Due Date :</span>
              <span>{formData.dueDate || ''}</span>
            </div>
          </div>
        </div>
      </div>
      
      <table className="w-full border-collapse mb-16">
        <thead>
          <tr>
            <th className="text-left p-3 bg-gray-100 border">Item</th>
            <th className="text-center p-3 bg-gray-100 border">Unit Price</th>
            <th className="text-center p-3 bg-gray-100 border">Quantity</th>
            <th className="text-right p-3 bg-gray-100 border">Total</th>
          </tr>
        </thead>
        <tbody>
          {formData.items.length > 0 ? formData.items.map((item, index) => (
            <tr key={index} className="border">
              <td className="p-2 border text-sm">{item.description || ''}</td>
              <td className="p-2 text-center border text-sm">{item.price ? `${formData.currency || ''} ${item.price}` : ''}</td>
              <td className="p-2 text-center border text-sm">{item.quantity || ''}</td>
              <td className="p-2 text-right border text-sm">
                {item.quantity && item.price 
                  ? `${formData.currency || ''} ${(parseFloat(item.quantity) * parseFloat(item.price)).toFixed(2)}`
                  : ''}
              </td>
            </tr>
          )) : (
            <tr className="border">
              <td className="p-2 border text-sm"></td>
              <td className="p-2 text-center border text-sm"></td>
              <td className="p-2 text-center border text-sm"></td>
              <td className="p-2 text-right border text-sm"></td>
            </tr>
          )}
        </tbody>
      </table>
      
      <div className="flex justify-end mb-12">
        <div className="w-2/5">
          <div className="flex justify-between mb-2">
            <span>Discount</span>
            <span className="mx-4">:</span>
            <span className="w-48 text-right">{parseFloat(formData.discount) > 0 ? `${formData.currency || ''} ${formData.discount}` : ''}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Vat</span>
            <span className="mx-4">:</span>
            <span className="w-48 text-right">{parseFloat(formData.vat) > 0 ? `${formData.currency || ''} ${formData.vat}` : ''}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Shipping Fee</span>
            <span className="mx-4">:</span>
            <span className="w-48 text-right"></span>
          </div>
          <div className="border-t border-b-2 my-2"></div>
          <div className="flex justify-between font-bold">
            <span>Sub Total</span>
            <span className="w-48 text-right">{formData.subtotal ? `${formData.currency || ''} ${formData.subtotal}` : ''}</span>
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <p className="mb-2">Payment Method ;</p>
        <p className="mb-8">{formData.paymentMethod || 'Bank Transfer'}</p>
        
        <p className="mb-2">Term & Contion :</p>
        <p>{formData.termsAndCondition || 'Details of terms and condition'}</p>
      </div>
      
      <div className="text-center mt-12 mb-4">
        <p className="font-medium">{formData.greetingMessage || 'Thank You for your buisness with us !'}</p>
      </div>
      
      <div className="text-center text-xs text-gray-500 mt-16">
        <p>Created with CEYINVOICE</p>
      </div>
    </div>
  );
}