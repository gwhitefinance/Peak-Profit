import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Info, Shield, FileText, Clock, ChevronDown, ChevronRight } from "lucide-react";

const FAQ = () => {
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);

  const faqCategories = [
    {
      title: "Getting Started",
      description: "Learn the basics of our trading platform and how to get started with your first challenge.",
      icon: Info,
      color: "bg-blue-500/10 border-blue-500/20",
      iconColor: "text-blue-400"
    },
    {
      title: "Account Management", 
      description: "Everything you need to know about managing your trading account, verification, and security.",
      icon: Shield,
      color: "bg-teal-500/10 border-teal-500/20",
      iconColor: "text-teal-400"
    },
    {
      title: "Trading Rules",
      description: "Understand our trading rules, risk management requirements, and evaluation criteria.",
      icon: FileText,
      color: "bg-purple-500/10 border-purple-500/20", 
      iconColor: "text-purple-400"
    },
    {
      title: "Payouts & Billing",
      description: "Information about payout schedules, billing cycles, and payment processing.",
      icon: Clock,
      color: "bg-orange-500/10 border-orange-500/20",
      iconColor: "text-orange-400"
    }
  ];

  const popularQuestions = [
    "How to start my first challenge?",
    "When will I receive my payout?", 
    "What instruments can I trade?",
    "What are the trading rules?",
    "How to reset my account?",
    "How to contact support?"
  ];

  const handleCategoryClick = () => {
    window.open("https://peakprofitfunding.com/faq", "_blank");
  };

  const handleQuestionClick = (index: number) => {
    if (expandedQuestion === index) {
      setExpandedQuestion(null);
    } else {
      setExpandedQuestion(index);
      // After a brief delay, redirect to FAQ
      setTimeout(() => {
        window.open("https://peakprofitfunding.com/faq", "_blank");
      }, 300);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header title="FAQ" subtitle="Your complete support center" />
        
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-6 py-8">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="w-8 h-8 border-2 border-primary rounded-sm"></div>
              </div>
              
              <h1 className="text-3xl font-bold mb-4">Complete FAQ & Support Center</h1>
              <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
                Get instant answers to all your questions about trading challenges, account management, payouts, and more.
              </p>
              
              <Button 
                onClick={handleCategoryClick}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Visit Full FAQ Center
              </Button>
            </div>

            {/* FAQ Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {faqCategories.map((category, index) => {
                const IconComponent = category.icon;
                return (
                  <Card 
                    key={index}
                    className={`${category.color} hover:scale-105 transition-transform cursor-pointer`}
                    onClick={handleCategoryClick}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-background/10 flex items-center justify-center">
                          <IconComponent className={`w-5 h-5 ${category.iconColor}`} />
                        </div>
                        <CardTitle className="text-xl">{category.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base leading-relaxed">
                        {category.description}
                      </CardDescription>
                      <Button 
                        variant="link" 
                        className="p-0 h-auto mt-4 text-primary hover:text-primary/80"
                      >
                        Learn more <ExternalLink className="w-3 h-3 ml-1" />
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Popular Questions */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Popular Questions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {popularQuestions.map((question, index) => (
                  <Card 
                    key={index}
                    className="hover:bg-accent/50 transition-colors cursor-pointer"
                    onClick={() => handleQuestionClick(index)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{question}</span>
                        <div className="flex items-center gap-2">
                          {expandedQuestion === index ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                          <ExternalLink className="w-3 h-3 text-muted-foreground" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Still Need Help Section */}
            <Card className="bg-card border-border">
              <CardContent className="text-center py-12">
                <h3 className="text-xl font-semibold mb-4">Still need help?</h3>
                <p className="text-muted-foreground mb-6">
                  Can't find what you're looking for? Our support team is here to help.
                </p>
                <Button 
                  onClick={handleCategoryClick}
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default FAQ;