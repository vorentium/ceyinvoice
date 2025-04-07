import React from 'react';
import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import InvoiceTemplates from '../templates/invoice_templates';

// Create styles for the PDF document
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
  },
  section: {
    margin: 10,
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  companyDetails: {
    maxWidth: '50%',
  },
  logo: {
    width: 80,
    height: 80,
    objectFit: 'contain',
  },
  companyName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  companyInfo: {
    fontSize: 10,
    marginBottom: 2,
  },
  invoiceTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'right',
  },
  invoiceInfo: {
    fontSize: 10,
    textAlign: 'right',
    marginBottom: 2,
  },
  customerSection: {
    marginTop: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  customerInfo: {
    fontSize: 10,
    marginBottom: 2,
  },
  table: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableColHeader: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: '#f2f2f2',
    padding: 5,
  },
  tableCol: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
  },
  tableCellHeader: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  tableCell: {
    fontSize: 10,
  },
  totals: {
    marginTop: 20,
    alignItems: 'flex-end',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 5,
  },
  totalLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    width: 100,
  },
  totalValue: {
    fontSize: 10,
    width: 80,
    textAlign: 'right',
  },
  paymentDetails: {
    marginTop: 20,
  },
  greeting: {
    marginTop: 30,
    fontSize: 12,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  footer: {
    marginTop: 30,
    fontSize: 10,
    textAlign: 'center',
    color: '#666',
  },
});

// Create the Invoice PDF document component
const InvoicePDFDocument = ({ data, template = 'basic' }) => {
  // Since we can't use JSX templates directly in PDF, we'll create a custom PDF layout
  // that mirrors the styling of each template as much as possible
  
  let headerBackgroundColor = '#FFFFFF';
  let primaryColor = '#3B82F6';
  
  // Customize based on template
  if (template === 'minimal') {
    primaryColor = '#374151';
  } else if (template === 'modern') {
    primaryColor = '#1E293B';
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header with company info and invoice details */}
        <View style={styles.header}>
          <View style={styles.companyDetails}>
            {data.companyLogo && (
              <Image src={data.companyLogo} style={styles.logo} />
            )}
            <Text style={styles.companyName}>{data.companyName || 'Company Name'}</Text>
            <Text style={styles.companyInfo}>{data.companyAddress || 'Company Address'}</Text>
            <Text style={styles.companyInfo}>{data.companyPhone || 'Phone Number'}</Text>
          </View>
          
          <View>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <Text style={styles.invoiceInfo}>Invoice No: {data.invoiceNumber || 'N/A'}</Text>
            <Text style={styles.invoiceInfo}>Issue Date: {data.issueDate || 'N/A'}</Text>
            <Text style={styles.invoiceInfo}>Due Date: {data.dueDate || 'N/A'}</Text>
          </View>
        </View>
        
        {/* Customer section */}
        <View style={styles.customerSection}>
          <Text style={styles.sectionTitle}>BILL TO</Text>
          <Text style={styles.customerInfo}>{data.customerName || 'Customer Name'}</Text>
          <Text style={styles.customerInfo}>{data.customerAddress || 'Customer Address'}</Text>
        </View>
        
        {/* Items table */}
        <View style={styles.table}>
          {/* Table header */}
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Description</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Quantity</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Unit Price</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Amount</Text>
            </View>
          </View>
          
          {/* Table rows */}
          {(data.items || []).map((item, index) => (
            <View style={styles.tableRow} key={index}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.description || ''}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.quantity || ''}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.price || ''}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.amount || ''}</Text>
              </View>
            </View>
          ))}
        </View>
        
        {/* Totals section */}
        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>{data.subtotal || '0.00'}</Text>
          </View>
          
          {data.vat && parseFloat(data.vat) > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>VAT {data.vatRate || ''}</Text>
              <Text style={styles.totalValue}>{data.vat || '0.00'}</Text>
            </View>
          )}
          
          {data.discount && parseFloat(data.discount) > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Discount</Text>
              <Text style={styles.totalValue}>{data.discount || '0.00'}</Text>
            </View>
          )}
          
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { fontWeight: 'bold' }]}>Total</Text>
            <Text style={[styles.totalValue, { fontWeight: 'bold' }]}>{data.total || '0.00'}</Text>
          </View>
        </View>
        
        {/* Payment details */}
        {data.paymentMethod && (
          <View style={styles.paymentDetails}>
            <Text style={styles.sectionTitle}>PAYMENT DETAILS</Text>
            <Text style={styles.customerInfo}>Method: {data.paymentMethod}</Text>
          </View>
        )}
        
        {/* Terms */}
        {data.terms && (
          <View style={styles.paymentDetails}>
            <Text style={styles.sectionTitle}>TERMS</Text>
            <Text style={styles.customerInfo}>{data.terms}</Text>
          </View>
        )}
        
        {/* Greeting message */}
        {data.greetingMessage && (
          <Text style={styles.greeting}>{data.greetingMessage}</Text>
        )}
        
        {/* Footer */}
        <Text style={styles.footer}>
          Thank you for your business!
        </Text>
      </Page>
    </Document>
  );
};

export default InvoicePDFDocument; 