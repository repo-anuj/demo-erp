/**
 * Export utilities for analytics data
 * Provides functions to export data in various formats (CSV, JSON, PDF)
 */

// CSV Export Function
export function exportAsCSV(data: any, filename?: string) {
  try {
    const csvData = convertToCSV(data);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename || `analytics-export-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  } catch (error) {
    console.error('Error exporting CSV:', error);
    throw new Error('Failed to export CSV file');
  }
}

// JSON Export Function
export function exportAsJSON(data: any, filename?: string) {
  try {
    const jsonData = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename || `analytics-export-${new Date().toISOString().split('T')[0]}.json`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  } catch (error) {
    console.error('Error exporting JSON:', error);
    throw new Error('Failed to export JSON file');
  }
}

// PDF Export Function (placeholder - would require a PDF library in real implementation)
export function exportAsPDF(data: any, filename?: string) {
  try {
    // In a real implementation, you would use a library like jsPDF or Puppeteer
    console.log('PDF export would be implemented with a PDF library');
    
    // For demo purposes, we'll create a simple HTML representation
    const htmlContent = convertToHTML(data);
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename || `analytics-export-${new Date().toISOString().split('T')[0]}.html`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  } catch (error) {
    console.error('Error exporting PDF:', error);
    throw new Error('Failed to export PDF file');
  }
}

// Convert data to CSV format
function convertToCSV(data: any): string {
  if (!data) return '';

  let csvContent = '';
  
  // Add metadata
  csvContent += `Analytics Export Report\n`;
  csvContent += `Generated: ${new Date().toLocaleString()}\n`;
  csvContent += `\n`;

  // Export inventory data
  if (data.inventory?.items?.length > 0) {
    csvContent += `INVENTORY DATA\n`;
    csvContent += `Name,Category,Quantity,Price,Total Value\n`;
    data.inventory.items.forEach((item: any) => {
      csvContent += `"${item.name}","${item.category}",${item.quantity},${item.price},${item.price * item.quantity}\n`;
    });
    csvContent += `\n`;
  }

  // Export sales data
  if (data.sales?.transactions?.length > 0) {
    csvContent += `SALES DATA\n`;
    csvContent += `Date,Customer,Total,Status\n`;
    data.sales.transactions.forEach((sale: any) => {
      csvContent += `"${sale.date}","${sale.customer || 'N/A'}",${sale.total},"${sale.status}"\n`;
    });
    csvContent += `\n`;
  }

  // Export finance data
  if (data.finance?.transactions?.length > 0) {
    csvContent += `FINANCE DATA\n`;
    csvContent += `Date,Description,Category,Type,Amount\n`;
    data.finance.transactions.forEach((transaction: any) => {
      csvContent += `"${transaction.date}","${transaction.description}","${transaction.category}","${transaction.type}",${transaction.amount}\n`;
    });
    csvContent += `\n`;
  }

  // Export employee data
  if (data.employees?.employees?.length > 0) {
    csvContent += `EMPLOYEE DATA\n`;
    csvContent += `Name,Department,Position,Status\n`;
    data.employees.employees.forEach((employee: any) => {
      csvContent += `"${employee.name}","${employee.department}","${employee.position}","${employee.status}"\n`;
    });
    csvContent += `\n`;
  }

  // Export project data
  if (data.projects?.projects?.length > 0) {
    csvContent += `PROJECT DATA\n`;
    csvContent += `Name,Status,Budget,Progress\n`;
    data.projects.projects.forEach((project: any) => {
      csvContent += `"${project.name}","${project.status}",${project.budget || 0},${project.progress || 0}\n`;
    });
    csvContent += `\n`;
  }

  // Add summary metrics
  csvContent += `SUMMARY METRICS\n`;
  csvContent += `Metric,Value\n`;
  
  if (data.inventory?.metrics) {
    csvContent += `Total Inventory Items,${data.inventory.metrics.totalItems}\n`;
    csvContent += `Total Inventory Value,${data.inventory.metrics.totalValue}\n`;
    csvContent += `Low Stock Items,${data.inventory.metrics.lowStock}\n`;
  }
  
  if (data.sales?.metrics) {
    csvContent += `Total Sales,${data.sales.metrics.totalSales}\n`;
    csvContent += `Total Revenue,${data.sales.metrics.totalRevenue}\n`;
  }
  
  if (data.finance?.metrics) {
    csvContent += `Total Income,${data.finance.metrics.income}\n`;
    csvContent += `Total Expenses,${data.finance.metrics.expenses}\n`;
    csvContent += `Net Cashflow,${data.finance.metrics.netCashflow}\n`;
  }

  return csvContent;
}

// Convert data to HTML format (for PDF placeholder)
function convertToHTML(data: any): string {
  if (!data) return '<html><body><h1>No data available</h1></body></html>';

  let htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Analytics Export Report</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #333; border-bottom: 2px solid #333; }
        h2 { color: #666; margin-top: 30px; }
        table { border-collapse: collapse; width: 100%; margin: 10px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .metric { background-color: #f9f9f9; padding: 10px; margin: 5px 0; }
        .summary { background-color: #e8f4f8; padding: 15px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <h1>Analytics Export Report</h1>
      <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
  `;

  // Add inventory section
  if (data.inventory?.items?.length > 0) {
    htmlContent += `
      <h2>Inventory Data</h2>
      <table>
        <thead>
          <tr><th>Name</th><th>Category</th><th>Quantity</th><th>Price</th><th>Total Value</th></tr>
        </thead>
        <tbody>
    `;
    data.inventory.items.forEach((item: any) => {
      htmlContent += `
        <tr>
          <td>${item.name}</td>
          <td>${item.category}</td>
          <td>${item.quantity}</td>
          <td>$${item.price.toFixed(2)}</td>
          <td>$${(item.price * item.quantity).toFixed(2)}</td>
        </tr>
      `;
    });
    htmlContent += `</tbody></table>`;
  }

  // Add sales section
  if (data.sales?.transactions?.length > 0) {
    htmlContent += `
      <h2>Sales Data</h2>
      <table>
        <thead>
          <tr><th>Date</th><th>Customer</th><th>Total</th><th>Status</th></tr>
        </thead>
        <tbody>
    `;
    data.sales.transactions.forEach((sale: any) => {
      htmlContent += `
        <tr>
          <td>${sale.date}</td>
          <td>${sale.customer || 'N/A'}</td>
          <td>$${sale.total.toFixed(2)}</td>
          <td>${sale.status}</td>
        </tr>
      `;
    });
    htmlContent += `</tbody></table>`;
  }

  // Add finance section
  if (data.finance?.transactions?.length > 0) {
    htmlContent += `
      <h2>Finance Data</h2>
      <table>
        <thead>
          <tr><th>Date</th><th>Description</th><th>Category</th><th>Type</th><th>Amount</th></tr>
        </thead>
        <tbody>
    `;
    data.finance.transactions.forEach((transaction: any) => {
      htmlContent += `
        <tr>
          <td>${transaction.date}</td>
          <td>${transaction.description}</td>
          <td>${transaction.category}</td>
          <td>${transaction.type}</td>
          <td>$${transaction.amount.toFixed(2)}</td>
        </tr>
      `;
    });
    htmlContent += `</tbody></table>`;
  }

  // Add summary metrics
  htmlContent += `
    <div class="summary">
      <h2>Summary Metrics</h2>
  `;
  
  if (data.inventory?.metrics) {
    htmlContent += `
      <div class="metric">
        <strong>Inventory:</strong> ${data.inventory.metrics.totalItems} items, 
        $${data.inventory.metrics.totalValue.toFixed(2)} total value, 
        ${data.inventory.metrics.lowStock} low stock alerts
      </div>
    `;
  }
  
  if (data.sales?.metrics) {
    htmlContent += `
      <div class="metric">
        <strong>Sales:</strong> ${data.sales.metrics.totalSales} transactions, 
        $${data.sales.metrics.totalRevenue.toFixed(2)} total revenue
      </div>
    `;
  }
  
  if (data.finance?.metrics) {
    htmlContent += `
      <div class="metric">
        <strong>Finance:</strong> $${data.finance.metrics.income.toFixed(2)} income, 
        $${data.finance.metrics.expenses.toFixed(2)} expenses, 
        $${data.finance.metrics.netCashflow.toFixed(2)} net cashflow
      </div>
    `;
  }

  htmlContent += `
    </div>
    </body>
    </html>
  `;

  return htmlContent;
}

// Utility function to format data for export
export function prepareDataForExport(rawData: any) {
  return {
    metadata: {
      exportDate: new Date().toISOString(),
      version: '1.0',
      source: 'ERP Analytics System'
    },
    data: rawData,
    summary: generateSummary(rawData)
  };
}

// Generate summary statistics
function generateSummary(data: any) {
  const summary: any = {};

  if (data.inventory) {
    summary.inventory = {
      totalItems: data.inventory.metrics?.totalItems || 0,
      totalValue: data.inventory.metrics?.totalValue || 0,
      lowStockAlerts: data.inventory.metrics?.lowStock || 0
    };
  }

  if (data.sales) {
    summary.sales = {
      totalTransactions: data.sales.metrics?.totalSales || 0,
      totalRevenue: data.sales.metrics?.totalRevenue || 0,
      averageTransactionValue: data.sales.metrics?.totalSales > 0 ? 
        (data.sales.metrics.totalRevenue / data.sales.metrics.totalSales) : 0
    };
  }

  if (data.finance) {
    summary.finance = {
      totalIncome: data.finance.metrics?.income || 0,
      totalExpenses: data.finance.metrics?.expenses || 0,
      netCashflow: data.finance.metrics?.netCashflow || 0,
      profitMargin: data.finance.metrics?.income > 0 ? 
        ((data.finance.metrics.netCashflow / data.finance.metrics.income) * 100) : 0
    };
  }

  return summary;
}
