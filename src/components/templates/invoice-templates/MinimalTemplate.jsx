import React from 'react';

export function MinimalTemplate({ formData }) {
  return (
    <div className="p-6 bg-white h-full font-sans">
      {/* Header - Invoice title centered */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">INVOICE</h1>
        <p className="text-base">#{formData.invoiceNumber || 'invoice no'}</p>
      </div>
      
      {/* From/To and Logo row */}
      <div className="flex justify-between items-start mb-16">
        {/* Logo on left */}
        <div className="flex-none w-32 h-32 border border-gray-300 rounded-full flex items-center justify-center">
          {formData.companyLogo ? (
            <img src={formData.companyLogo} alt="Company Logo" className="max-h-full max-w-full rounded-full p-1" />
          ) : (
            <span className="text-gray-400 text-center text-sm">LOGO HERE</span>
          )}
        </div>
        
        {/* From address */}
        <div className="mt-6">
          <h2 className="text-2xl font-bold mb-4">From</h2>
          <p className="text-base mb-1">{formData.companyName || 'company name'}</p>
          <p className="text-base mb-1">{formData.companyAddress || 'address line1'}</p>
          <p className="text-base mb-1">{formData.companyNumber || 'mobile no'}</p>
        </div>
        
        {/* Bill to address */}
        <div className="mt-6">
          <h2 className="text-2xl font-bold mb-4">Bill to</h2>
          <p className="text-base mb-1">{formData.customerName || 'customer name'}</p>
          <p className="text-base mb-1">{formData.customerAddress || 'address line1'}</p>
          <p className="text-base mb-1">{formData.customerNumber || 'mobile no'}</p>
        </div>
      </div>
      
      {/* Dates */}
      <div className="flex justify-between mb-8">
        <div>
          <h3 className="text-xl font-bold mb-2">Issued Date</h3>
          <p className="text-sm">{formData.issueDate || ''}</p>
        </div>
        
        <div>
          <h3 className="text-xl font-bold mb-2">Due Date</h3>
          <p className="text-sm">{formData.dueDate || ''}</p>
        </div>
      </div>
      
      {/* Separator */}
      <div className="border-b-2 border-black mb-6"></div>
      
      {/* Invoice Items */}
      <div className="mb-8">
        <div className="flex font-bold border-b-2 border-gray-200 py-2 mb-2">
          <div className="w-2/5 text-sm">Description</div>
          <div className="w-1/5 text-center text-sm">QTY</div>
          <div className="w-1/5 text-center text-sm">Price</div>
          <div className="w-1/5 text-right text-sm">Amount</div>
        </div>
        
        {formData.items.length > 0 ? formData.items.map((item, index) => (
          <div key={index} className="flex border-b border-gray-200 py-2">
            <div className="w-2/5 text-sm">{item.description || ''}</div>
            <div className="w-1/5 text-center text-sm">{item.quantity || ''}</div>
            <div className="w-1/5 text-center text-sm">
              {item.price ? `${formData.currency || '$'}${item.price}` : ''}
            </div>
            <div className="w-1/5 text-right text-sm">
              {item.quantity && item.price 
                ? `${formData.currency || '$'}${(parseFloat(item.quantity) * parseFloat(item.price)).toFixed(2)}`
                : ''}
            </div>
          </div>
        )) : (
          <div className="flex border-b border-gray-200 py-2">
            <div className="w-2/5 text-sm"></div>
            <div className="w-1/5 text-center text-sm"></div>
            <div className="w-1/5 text-center text-sm"></div>
            <div className="w-1/5 text-right text-sm"></div>
          </div>
        )}
      </div>
      
      {/* Totals */}
      <div className="flex justify-end mb-12">
        <div className="w-1/2">
          <div className="flex justify-between py-2">
            <div className="font-bold text-sm">Subtotal</div>
            <div className="text-sm">{formData.subtotal ? `${formData.currency || '$'}${formData.subtotal}` : ''}</div>
          </div>
          <div className="flex justify-between py-2">
            <div className="font-bold text-sm">VAT({formData.vatPercent || '0'}%)</div>
            <div className="text-sm">{formData.vat ? `${formData.currency || '$'}${formData.vat}` : ''}</div>
          </div>
          <div className="flex justify-between py-2 border-b-2 border-gray-200">
            <div className="font-bold text-sm">Discount({formData.discountPercent || '0'}%)</div>
            <div className="text-sm">{formData.discount ? `${formData.currency || '$'}${formData.discount}` : ''}</div>
          </div>
          <div className="flex justify-between py-2">
            <div className="font-bold text-base">Total</div>
            <div className="font-bold text-base">{formData.total ? `${formData.currency || '$'}${formData.total}` : ''}</div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="flex justify-between mt-16 mb-16">
        <div className="w-1/2 pr-4">
          <h3 className="text-base font-bold mb-2">Terms and Condition :</h3>
          <p className="text-sm">{formData.termsAndCondition || 'Tems and condition here'}</p>
        </div>
        
        <div className="w-1/2 pl-4">
          <h3 className="text-base font-bold mb-2">Payment Method :</h3>
          <p className="text-sm">{formData.paymentMethod || 'Payement method here'}</p>
        </div>
      </div>
      
      {/* Thank You Note */}
      <div className="text-center mb-6">
        <p className="text-base font-bold">{formData.greetingMessage || 'Thank you for your purchase'}</p>
      </div>
      
      {/* Created With */}
      <div className="text-center text-gray-400 text-xs">
        <p>Created with CEYINVOICE</p>
      </div>
    </div>
  );
}