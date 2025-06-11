'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  BarChart3, 
  TrendingUp, 
  DollarSign,
  Package,
  Users,
  Trash2,
  Copy,
  Download
} from 'lucide-react';
import { toast } from 'sonner';
import { CustomBarChart, CustomPieChart, formatCurrency, formatNumber } from './chart-components';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isAnalysis?: boolean;
  chartData?: any;
  chartType?: 'bar' | 'pie' | 'line' | 'area';
}

interface AIAssistantProps {
  aggregatedData: any;
  isLoading?: boolean;
}

const QUICK_PROMPTS = [
  {
    icon: BarChart3,
    text: "Show me sales performance this month",
    category: "Sales"
  },
  {
    icon: Package,
    text: "What's my inventory status?",
    category: "Inventory"
  },
  {
    icon: DollarSign,
    text: "Analyze my cash flow trends",
    category: "Finance"
  },
  {
    icon: TrendingUp,
    text: "Compare revenue vs expenses",
    category: "Analysis"
  },
  {
    icon: Users,
    text: "Show employee department distribution",
    category: "HR"
  }
];

export function AIAssistant({ aggregatedData, isLoading = false }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hello! I'm your AI Analytics Assistant. I can help you analyze your business data, create visualizations, and provide insights. Try asking me about your sales, inventory, finances, or any other business metrics!",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Simulate AI response with data analysis
  const generateAIResponse = async (userMessage: string): Promise<Message> => {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const lowerMessage = userMessage.toLowerCase();
    
    // Sales analysis
    if (lowerMessage.includes('sales') || lowerMessage.includes('revenue')) {
      const salesData = aggregatedData?.sales?.metrics;
      if (salesData) {
        return {
          id: Date.now().toString(),
          type: 'assistant',
          content: `Based on your sales data analysis:

📊 **Sales Performance Summary:**
• Total Sales: ${salesData.totalSales} transactions
• Total Revenue: ${formatCurrency(salesData.totalRevenue)}
• Average Sale Value: ${formatCurrency(salesData.totalRevenue / salesData.totalSales)}

📈 **Key Insights:**
• Your sales performance shows ${salesData.totalSales > 50 ? 'strong' : 'moderate'} activity
• Revenue distribution across customers appears ${salesData.salesByCustomer?.length > 5 ? 'diversified' : 'concentrated'}

Would you like me to create a visualization of your sales by customer or analyze trends over time?`,
          timestamp: new Date(),
          isAnalysis: true,
          chartData: salesData.salesByCustomer?.slice(0, 10),
          chartType: 'bar'
        };
      }
    }

    // Inventory analysis
    if (lowerMessage.includes('inventory') || lowerMessage.includes('stock')) {
      const inventoryData = aggregatedData?.inventory?.metrics;
      if (inventoryData) {
        return {
          id: Date.now().toString(),
          type: 'assistant',
          content: `Here's your inventory analysis:

📦 **Inventory Overview:**
• Total Items: ${inventoryData.totalItems}
• Total Quantity: ${formatNumber(inventoryData.totalQuantity)} units
• Total Value: ${formatCurrency(inventoryData.totalValue)}
• Categories: ${inventoryData.categories}

⚠️ **Stock Alerts:**
• Low Stock Items: ${inventoryData.lowStock} items need attention
• Stock Health: ${inventoryData.lowStock < 5 ? 'Good' : inventoryData.lowStock < 15 ? 'Moderate' : 'Needs Attention'}

The category distribution shows how your inventory is spread across different product types.`,
          timestamp: new Date(),
          isAnalysis: true,
          chartData: inventoryData.categoryDistribution?.slice(0, 8),
          chartType: 'pie'
        };
      }
    }

    // Finance analysis
    if (lowerMessage.includes('finance') || lowerMessage.includes('cash') || lowerMessage.includes('expense')) {
      const financeData = aggregatedData?.finance?.metrics;
      if (financeData) {
        return {
          id: Date.now().toString(),
          type: 'assistant',
          content: `Financial analysis results:

💰 **Financial Health:**
• Total Income: ${formatCurrency(financeData.income)}
• Total Expenses: ${formatCurrency(financeData.expenses)}
• Net Cash Flow: ${formatCurrency(financeData.netCashflow)}
• Financial Status: ${financeData.netCashflow > 0 ? '✅ Profitable' : '⚠️ Loss'}

📊 **Expense Breakdown:**
Your expenses are distributed across ${financeData.expensesByCategory?.length || 0} categories. The largest expense categories should be monitored for optimization opportunities.

💡 **Recommendation:** ${financeData.netCashflow > 0 ? 'Consider investing surplus cash or expanding operations.' : 'Review expense categories to identify cost reduction opportunities.'}`,
          timestamp: new Date(),
          isAnalysis: true,
          chartData: financeData.expensesByCategory?.slice(0, 8),
          chartType: 'pie'
        };
      }
    }

    // Employee analysis
    if (lowerMessage.includes('employee') || lowerMessage.includes('hr') || lowerMessage.includes('department')) {
      const employeeData = aggregatedData?.employees?.metrics;
      if (employeeData) {
        return {
          id: Date.now().toString(),
          type: 'assistant',
          content: `Employee analytics summary:

👥 **Workforce Overview:**
• Total Employees: ${employeeData.totalEmployees}
• Active Employees: ${employeeData.activeEmployees}
• Activity Rate: ${((employeeData.activeEmployees / employeeData.totalEmployees) * 100).toFixed(1)}%

🏢 **Department Distribution:**
Your workforce is distributed across ${employeeData.departmentDistribution?.length || 0} departments. This shows how your human resources are allocated across different business functions.`,
          timestamp: new Date(),
          isAnalysis: true,
          chartData: employeeData.departmentDistribution,
          chartType: 'bar'
        };
      }
    }

    // General business overview
    if (lowerMessage.includes('overview') || lowerMessage.includes('summary') || lowerMessage.includes('business')) {
      return {
        id: Date.now().toString(),
        type: 'assistant',
        content: `Here's your comprehensive business overview:

🏢 **Business Health Dashboard:**

**Sales & Revenue:**
• Revenue: ${formatCurrency(aggregatedData?.sales?.metrics?.totalRevenue || 0)}
• Transactions: ${aggregatedData?.sales?.metrics?.totalSales || 0}

**Inventory Management:**
• Total Items: ${aggregatedData?.inventory?.metrics?.totalItems || 0}
• Inventory Value: ${formatCurrency(aggregatedData?.inventory?.metrics?.totalValue || 0)}

**Financial Position:**
• Net Cash Flow: ${formatCurrency(aggregatedData?.finance?.metrics?.netCashflow || 0)}
• Status: ${(aggregatedData?.finance?.metrics?.netCashflow || 0) > 0 ? '✅ Profitable' : '⚠️ Needs Attention'}

**Workforce:**
• Total Employees: ${aggregatedData?.employees?.metrics?.totalEmployees || 0}
• Active Projects: ${aggregatedData?.projects?.metrics?.activeProjects || 0}

💡 **Key Insights:**
Your business shows ${(aggregatedData?.finance?.metrics?.netCashflow || 0) > 0 ? 'positive' : 'challenging'} financial performance with ${aggregatedData?.sales?.metrics?.totalSales > 20 ? 'strong' : 'moderate'} sales activity.`,
        timestamp: new Date(),
        isAnalysis: true
      };
    }

    // Default response
    return {
      id: Date.now().toString(),
      type: 'assistant',
      content: `I understand you're asking about "${userMessage}". I can help you analyze various aspects of your business data including:

📊 **Available Analysis:**
• Sales performance and customer insights
• Inventory levels and stock management
• Financial health and cash flow
• Employee and department analytics
• Project status and progress
• Cross-module business insights

Try asking me something like:
• "Show me my sales performance"
• "What's my inventory status?"
• "Analyze my cash flow"
• "How are my employees distributed?"

What specific aspect would you like me to analyze?`,
      timestamp: new Date()
    };
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isProcessing) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsProcessing(true);

    try {
      const aiResponse = await generateAIResponse(userMessage.content);
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error generating AI response:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: 'assistant',
        content: "I apologize, but I encountered an error while processing your request. Please try again or rephrase your question.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    setInputValue(prompt);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearConversation = () => {
    setMessages([messages[0]]); // Keep the initial greeting
    toast.success('Conversation cleared');
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Message copied to clipboard');
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Chat Interface */}
      <div className="lg:col-span-2">
        <Card className="h-[600px] flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5 text-primary" />
              <CardTitle>AI Analytics Assistant</CardTitle>
            </div>
            <Button variant="outline" size="sm" onClick={clearConversation}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col space-y-4">
            {/* Messages */}
            <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className="space-y-2">
                    <div className={`flex items-start space-x-3 ${
                      message.type === 'user' ? 'justify-end' : 'justify-start'
                    }`}>
                      {message.type === 'assistant' && (
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <Bot className="h-4 w-4 text-primary" />
                          </div>
                        </div>
                      )}
                      
                      <div className={`max-w-[80%] ${
                        message.type === 'user' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted'
                      } rounded-lg p-3`}>
                        <div className="whitespace-pre-wrap text-sm">
                          {message.content}
                        </div>
                        
                        {message.isAnalysis && (
                          <div className="mt-2 flex items-center space-x-2">
                            <Badge variant="secondary" className="text-xs">
                              <Sparkles className="h-3 w-3 mr-1" />
                              AI Analysis
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyMessage(message.content)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                      
                      {message.type === 'user' && (
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                            <User className="h-4 w-4 text-primary-foreground" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Chart visualization */}
                    {message.chartData && message.chartType && (
                      <div className="ml-11">
                        {message.chartType === 'bar' && (
                          <CustomBarChart
                            data={message.chartData}
                            xKey="name"
                            yKey="amount"
                            height={200}
                            formatter={formatCurrency}
                          />
                        )}
                        {message.chartType === 'pie' && (
                          <CustomPieChart
                            data={message.chartData}
                            nameKey="name"
                            valueKey="count"
                            height={200}
                            formatter={formatNumber}
                          />
                        )}
                      </div>
                    )}
                  </div>
                ))}
                
                {isProcessing && (
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Bot className="h-4 w-4 text-primary animate-pulse" />
                      </div>
                    </div>
                    <div className="bg-muted rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                        <span className="text-sm text-muted-foreground">Analyzing your data...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="flex space-x-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about your business data..."
                disabled={isProcessing}
                className="flex-1"
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={!inputValue.trim() || isProcessing}
                size="sm"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Prompts */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Analysis</CardTitle>
            <CardDescription>
              Click on any prompt to get instant insights
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {QUICK_PROMPTS.map((prompt, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full justify-start h-auto p-3"
                onClick={() => handleQuickPrompt(prompt.text)}
                disabled={isProcessing}
              >
                <div className="flex items-start space-x-3">
                  <prompt.icon className="h-4 w-4 mt-0.5 text-primary" />
                  <div className="text-left">
                    <div className="text-sm font-medium">{prompt.text}</div>
                    <div className="text-xs text-muted-foreground">{prompt.category}</div>
                  </div>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Data Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Sales Data</span>
              <Badge variant={aggregatedData?.sales?.transactions?.length > 0 ? "default" : "secondary"}>
                {aggregatedData?.sales?.transactions?.length > 0 ? "Available" : "No Data"}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Inventory Data</span>
              <Badge variant={aggregatedData?.inventory?.items?.length > 0 ? "default" : "secondary"}>
                {aggregatedData?.inventory?.items?.length > 0 ? "Available" : "No Data"}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Finance Data</span>
              <Badge variant={aggregatedData?.finance?.transactions?.length > 0 ? "default" : "secondary"}>
                {aggregatedData?.finance?.transactions?.length > 0 ? "Available" : "No Data"}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Employee Data</span>
              <Badge variant={aggregatedData?.employees?.employees?.length > 0 ? "default" : "secondary"}>
                {aggregatedData?.employees?.employees?.length > 0 ? "Available" : "No Data"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
