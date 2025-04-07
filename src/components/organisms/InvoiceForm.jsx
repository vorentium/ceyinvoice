import React from 'react';

function InvoiceForm({ formData, handleChange, handleItemChange, addItem, deleteItem, handleLogoUpload, handleSaveInvoice }) {
  return (
    <div className="w-full lg:w-2/4 bg-var-primary p-4 lg:p-6 text-white relative overflow-y-auto custom-scrollbar h-screen max-h-screen">
      <div className="flex justify-between items-center mb-4 sticky top-0 z-10 pb-2 pt-1 bg-var-primary">
        <button
          type="button"
          onClick={handleSaveInvoice}
          className="py-2 px-4 bg-white text-var-primary hover:bg-gray-100 rounded-md flex items-center shadow-sm mx-[80%]"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
          </svg>
          Save
        </button>
      </div>
      
      <form className="space-y-6 pb-10">
        {/* Company Details */}
        <div>
          <h2 className="text-lg font-medium mb-2">Your Company Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Company Name</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-md text-black bg-white"
                placeholder="Your Company Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Company Phone Number</label>
              <input
                type="text"
                name="companyNumber"
                value={formData.companyNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-md text-black bg-white"
                placeholder="Phone Number"
              />
              <p className="text-xs text-white/70 mt-1">This will appear on your invoice</p>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Company Address</label>
              <input
                type="text"
                name="companyAddress"
                value={formData.companyAddress}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-md text-black bg-white"
                placeholder="Your Company Address"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Company Logo</label>
              <div className="flex items-center space-x-2">
                <label className="flex items-center justify-center px-3 py-2 bg-white rounded-md cursor-pointer text-black hover:bg-gray-100">
                  <span className="text-sm">Upload Here</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>
                {formData.companyLogo && (
                  <div className="h-10 w-10 bg-white rounded-md">
                    <img 
                      src={formData.companyLogo} 
                      alt="Company Logo" 
                      className="h-full w-full object-contain rounded-md"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <hr className="border-white/30" />
        
        {/* Invoice Details */}
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Invoice number</label>
              <input
                type="text"
                name="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-md text-black bg-white"
                placeholder="INV-001"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Issue Date</label>
              <input
                type="date"
                name="issueDate"
                value={formData.issueDate}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-md text-black bg-white"
                placeholder="Select Issue Date"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Due Date</label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-md text-black bg-white"
                placeholder="Select Due Date"
              />
            </div>
          </div>
        </div>
        
        <hr className="border-white/30" />
        
        {/* Customer Details */}
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Customer Name</label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-md text-black bg-white"
                placeholder="Customer Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Customer Number</label>
              <input
                type="text"
                name="customerNumber"
                value={formData.customerNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-md text-black bg-white"
                placeholder="Phone Number"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Customer Address</label>
              <input
                type="text"
                name="customerAddress"
                value={formData.customerAddress}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-md text-black bg-white"
                placeholder="Customer Address"
              />
            </div>
          </div>
        </div>
        
        <hr className="border-white/30" />
        
        {/* Items */}
        <div>
          <div className="space-y-3">
            {formData.items.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-3">
                <div className="col-span-5">
                  <label className={index === 0 ? "block text-sm font-medium mb-1" : "sr-only"}>
                    Item - Description
                  </label>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                    className="w-full px-3 py-2 rounded-md text-black bg-white"
                    placeholder="Item description"
                  />
                </div>
                <div className="col-span-3">
                  <label className={index === 0 ? "block text-sm font-medium mb-1" : "sr-only"}>
                    Item - Quantity
                  </label>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                    className="w-full px-3 py-2 rounded-md text-black bg-white"
                    placeholder="Qty"
                  />
                </div>
                <div className="col-span-3">
                  <label className={index === 0 ? "block text-sm font-medium mb-1" : "sr-only"}>
                    Unit Price
                  </label>
                  <input
                    type="number"
                    value={item.price}
                    onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                    className="w-full px-3 py-2 rounded-md text-black bg-white"
                    placeholder="Price"
                  />
                </div>
                <div className="col-span-1 flex items-center">
                  {index === 0 && <div className="h-6 mb-1"></div>}
                  <button
                    type="button"
                    onClick={() => deleteItem(index)}
                    className="text-white hover:text-red-300 transition-colors focus:outline-none cursor-pointer"
                    title="Delete item"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
            
            <button
              type="button"
              onClick={addItem}
              className="flex items-center space-x-1 bg-white text-black px-3 py-2 rounded-md hover:bg-gray-100 cursor-pointer"
            >
              <span className="text-sm">+ Add Item</span>
            </button>
          </div>
        </div>
        
        <hr className="border-white/30" />
        
        {/* Payment Details */}
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Select Currency</label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-md text-black bg-white"
              >
                <option value="">Select Currency...</option>
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="LKR">LKR - Sri Lankan Rupee</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Subtotal (Auto-calculated)</label>
              <input
                type="text"
                name="subtotal"
                value={formData.subtotal}
                readOnly
                className="w-full px-3 py-2 rounded-md text-black bg-white bg-gray-50"
              />
            </div>
            
            {/* VAT and Discount section */}
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-var-primary rounded-lg overflow-hidden p-2">
                <div className="text-white font-medium text-xl mb-2">VAT</div>
                <div className="flex items-center">
                  <div className="w-2/3 pr-2">
                    <input
                      type="text"
                      name="vat"
                      value={formData.vat}
                      readOnly
                      className="w-full px-3 py-3 rounded-lg text-black bg-white"
                    />
                  </div>
                  <div className="w-1/3 flex items-center">
                    <input
                      type="number"
                      name="vatPercent"
                      value={formData.vatPercent}
                      onChange={handleChange}
                      className="w-full px-2 py-3 rounded-lg text-black text-center bg-white"
                      placeholder="0"
                      min="0"
                      max="100"
                    />
                    <div className="text-white font-medium ml-1">%</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-var-primary rounded-lg overflow-hidden p-2">
                <div className="text-white font-medium text-xl mb-2">Discount</div>
                <div className="flex items-center">
                  <div className="w-2/3 pr-2">
                    <input
                      type="text"
                      name="discount"
                      value={formData.discount}
                      readOnly
                      className="w-full px-3 py-3 rounded-lg text-black bg-white"
                    />
                  </div>
                  <div className="w-1/3 flex items-center">
                    <input
                      type="number"
                      name="discountPercent"
                      value={formData.discountPercent}
                      onChange={handleChange}
                      className="w-full px-2 py-3 rounded-lg text-black text-center bg-white"
                      placeholder="0"
                      min="0"
                      max="100"
                    />
                    <div className="text-white font-medium ml-1">%</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Total (Auto-calculated)</label>
              <input
                type="text"
                name="total"
                value={formData.total}
                readOnly
                className="w-full px-3 py-2 rounded-md text-black bg-white bg-gray-50 font-bold"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Select Payment method</label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-md text-black bg-white"
              >
                <option value="">Select Payment Method...</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cash">Cash</option>
                <option value="Credit Card">Credit Card</option>
                <option value="PayPal">PayPal</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Greeting Message</label>
              <input
                type="text"
                name="greetingMessage"
                value={formData.greetingMessage}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-md text-black bg-white"
                placeholder="Thank you for your business!"
              />
              <p className="text-xs text-white/70 mt-1">This message will appear with a stylish curved design on your invoice</p>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Terms and Condition</label>
              <textarea
                name="termsAndCondition"
                value={formData.termsAndCondition}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-md text-black bg-white resize-none h-24"
                placeholder="Enter your terms and conditions here"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default InvoiceForm; 