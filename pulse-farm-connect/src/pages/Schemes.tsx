import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, ExternalLink, Bell } from "lucide-react";

const schemes = [
  {
    title: "PM Kisan Samman Nidhi",
    description: "Income support of ₹6000 per year to all farmer families",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    link: "https://pmkisan.gov.in/",
    category: "Financial Support"
  },
  {
    title: "Soil Health Card Scheme",
    description: "Provides soil testing and nutrient management recommendations",
    ministry: "Department of Agriculture & Cooperation",
    link: "https://soilhealth.dac.gov.in/",
    category: "Soil Management"
  },
  {
    title: "Kisan Credit Card (KCC)",
    description: "Provides adequate and timely credit support for farming activities",
    ministry: "Ministry of Agriculture",
    link: "https://www.india.gov.in/spotlight/kisan-credit-card-kcc",
    category: "Credit"
  },
  {
    title: "Pradhan Mantri Fasal Bima Yojana",
    description: "Crop insurance scheme providing financial support in case of crop loss",
    ministry: "Ministry of Agriculture",
    link: "https://pmfby.gov.in/",
    category: "Insurance"
  },
  {
    title: "Pradhan Mantri Krishi Sinchai Yojana",
    description: "Aims to expand cultivated area with assured irrigation",
    ministry: "Ministry of Agriculture",
    link: "https://pmksy.gov.in/",
    category: "Irrigation"
  },
  {
    title: "National Agriculture Market (e-NAM)",
    description: "Online trading platform for agricultural commodities",
    ministry: "Ministry of Agriculture",
    link: "https://www.enam.gov.in/",
    category: "Marketing"
  }
];

const Schemes = () => {
  return (
    <div className="min-h-screen bg-gradient-earth p-6 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Government Schemes
            </h1>
            <p className="text-muted-foreground mt-1">
              Latest agricultural schemes and subsidies for farmers
            </p>
          </div>
          <Button className="gap-2 bg-gradient-primary">
            <Bell className="h-4 w-4" />
            Enable Notifications
          </Button>
        </div>

        {/* Info Card */}
        <Card className="p-6 bg-secondary/10 border-secondary">
          <div className="flex items-start gap-3">
            <Bell className="h-5 w-5 text-secondary mt-1" />
            <div>
              <h3 className="font-semibold text-foreground mb-1">Stay Updated</h3>
              <p className="text-sm text-muted-foreground">
                Enable notifications to receive alerts when new schemes are announced. 
                All schemes link directly to official government websites for accurate information.
              </p>
            </div>
          </div>
        </Card>

        {/* Schemes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {schemes.map((scheme, idx) => (
            <Card key={idx} className="p-6 shadow-soft hover:shadow-strong transition-all bg-white">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-bold text-foreground leading-tight">
                      {scheme.title}
                    </h3>
                    <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-1 rounded whitespace-nowrap">
                      {scheme.category}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {scheme.description}
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    {scheme.ministry}
                  </p>
                  <a
                    href={scheme.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm" className="gap-2 w-full">
                      <ExternalLink className="h-3 w-3" />
                      Visit Official Website
                    </Button>
                  </a>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Footer Note */}
        <Card className="p-4 bg-muted">
          <p className="text-sm text-center text-muted-foreground">
            All schemes are verified and link to official government portals. 
            For eligibility and application details, please visit the respective websites.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Schemes;
