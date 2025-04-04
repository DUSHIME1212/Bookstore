
import React, { useState } from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface FilterPanelProps {
  onFilterChange: (filters: Filters) => void;
  availableLanguages: string[];
  availableSubjects: string[];
}

export interface Filters {
  languages: string[];
  subjects: string[];
  yearRange: [number | null, number | null];
}

const FilterPanel: React.FC<FilterPanelProps> = ({ 
  onFilterChange, 
  availableLanguages = [], 
  availableSubjects = []
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [yearRange, setYearRange] = useState<[number | null, number | null]>([null, null]);
  
  const handleLanguageChange = (language: string, checked: boolean) => {
    setSelectedLanguages(prev => 
      checked ? [...prev, language] : prev.filter(l => l !== language)
    );
  };

  const handleSubjectChange = (subject: string, checked: boolean) => {
    setSelectedSubjects(prev => 
      checked ? [...prev, subject] : prev.filter(s => s !== subject)
    );
  };

  const applyFilters = () => {
    onFilterChange({
      languages: selectedLanguages,
      subjects: selectedSubjects, 
      yearRange
    });
  };

  const clearFilters = () => {
    setSelectedLanguages([]);
    setSelectedSubjects([]);
    setYearRange([null, null]);
    onFilterChange({
      languages: [],
      subjects: [],
      yearRange: [null, null]
    });
  };

  // Filter down to reasonable number of options
  const displayLanguages = availableLanguages.slice(0, 5);
  const displaySubjects = availableSubjects.slice(0, 8);

  return (
    <div className="mb-8 bg-white/90 backdrop-blur-sm rounded-lg border border-[#E5E5EA] p-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <SlidersHorizontal className="mr-2 text-apple-blue" size={18} />
            <h2 className="text-lg font-medium text-apple-dark">Filters</h2>
          </div>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="p-1 h-auto">
              {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </Button>
          </CollapsibleTrigger>
        </div>
        
        <CollapsibleContent className="mt-4 space-y-6">
          {displayLanguages.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-apple-dark mb-2">Language</h3>
              <div className="grid grid-cols-2 gap-2">
                {displayLanguages.map((language) => (
                  <div key={language} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`language-${language}`} 
                      checked={selectedLanguages.includes(language)}
                      onCheckedChange={(checked) => 
                        handleLanguageChange(language, checked === true)
                      }
                    />
                    <Label 
                      htmlFor={`language-${language}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {language === 'eng' ? 'English' : 
                       language === 'spa' ? 'Spanish' :
                       language === 'fre' ? 'French' :
                       language === 'ger' ? 'German' :
                       language === 'ita' ? 'Italian' : language}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {displaySubjects.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-apple-dark mb-2">Genre/Subject</h3>
              <div className="grid grid-cols-2 gap-2">
                {displaySubjects.map((subject) => (
                  <div key={subject} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`subject-${subject}`} 
                      checked={selectedSubjects.includes(subject)}
                      onCheckedChange={(checked) => 
                        handleSubjectChange(subject, checked === true)
                      }
                    />
                    <Label 
                      htmlFor={`subject-${subject}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {subject}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex space-x-3 pt-2">
            <Button 
              onClick={applyFilters} 
              className="bg-apple-blue hover:bg-apple-blue/90"
              size="sm"
            >
              Apply Filters
            </Button>
            <Button 
              onClick={clearFilters} 
              variant="outline" 
              size="sm"
            >
              Clear
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default FilterPanel;
