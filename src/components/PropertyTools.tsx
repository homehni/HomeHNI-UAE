import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, DollarSign, TrendingUp, Ruler } from 'lucide-react';
import EMICalculatorModal from '@/components/EMICalculatorModal';
import BudgetCalculatorModal from '@/components/BudgetCalculatorModal';
import AreaConverterModal from '@/components/AreaConverterModal';

const PropertyTools = () => {
  const [emiModalOpen, setEmiModalOpen] = useState(false);
  const [budgetModalOpen, setBudgetModalOpen] = useState(false);
  const [areaModalOpen, setAreaModalOpen] = useState(false);
  const navigate = useNavigate();
  const tools = [
    {
      id: 'budget-calculator',
      title: 'Budget Calculator',
      description: 'Check your affordability range for buying home',
      icon: Calculator,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 'emi-calculator', 
      title: 'EMI Calculator',
      description: 'Calculate your home loan EMI',
      icon: DollarSign,
      color: 'bg-green-100 text-green-600'
    },
    {
      id: 'loan-eligibility',
      title: 'Loan Eligibility', 
      description: 'See what you can borrow for your home',
      icon: TrendingUp,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      id: 'area-converter',
      title: 'Area Converter',
      description: 'Convert one area into any other easily',
      icon: Ruler,
      color: 'bg-orange-100 text-orange-600'
    }
  ];

  const handleToolClick = (toolId: string) => {
    switch (toolId) {
      case 'emi-calculator':
        setEmiModalOpen(true);
        break;
      case 'budget-calculator':
        setBudgetModalOpen(true);
        break;
      case 'loan-eligibility':
        navigate('/loans');
        break;
      case 'area-converter':
        setAreaModalOpen(true);
        break;
      default:
        break;
    }
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-brand-red w-8 h-8 rounded-full flex items-center justify-center mr-3">
              <Calculator className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Use popular tools</h2>
          </div>
          <p className="text-gray-600 text-lg">Go from browsing to buying</p>
          <Button variant="outline" className="mt-4">
            View all insights
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((tool) => (
            <Card 
              key={tool.id} 
              className="hover:shadow-lg transition-all duration-300 cursor-pointer group border-2 border-primary"
              onClick={() => handleToolClick(tool.id)}
            >
              <CardContent className="p-6 text-center">
                <div className={`w-16 h-16 ${tool.color} rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <tool.icon className="w-8 h-8" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-gray-900">
                  {tool.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {tool.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      <EMICalculatorModal 
        isOpen={emiModalOpen} 
        onClose={() => setEmiModalOpen(false)} 
      />
      
      <BudgetCalculatorModal 
        isOpen={budgetModalOpen} 
        onClose={() => setBudgetModalOpen(false)} 
      />
      
      <AreaConverterModal 
        isOpen={areaModalOpen} 
        onClose={() => setAreaModalOpen(false)} 
      />
    </section>
  );
};

export default PropertyTools;