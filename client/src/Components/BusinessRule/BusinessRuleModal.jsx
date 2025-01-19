import React, { useState } from 'react';
import { Upload, Code } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
  } from "../../Components/ui/dialog";
  
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../Components/ui/tabs";
import { Button } from "../../Components/ui/button";
import { Input } from "../../Components/ui/input";
import { Textarea } from "../../Components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../Components/ui/select";

const BusinessRuleModal = ({ closeModal, dispatch }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [javaCode, setJavaCode] = useState('');
  const [ruleName, setRuleName] = useState('');
  const [rulesetId, setRulesetId] = useState('');
  const [priority, setPriority] = useState(3);
  const [minConfidence, setMinConfidence] = useState(0.8);

  const handleSubmit = async (type) => {
    setIsLoading(true);
    try {
      let formData = new FormData();
      
      if (type === 'pdf') {
        formData.append('file', selectedFile);
      } else {
        formData.append('code', javaCode);
      }
      
      formData.append('rule_name', ruleName);
      formData.append('ruleset_id', rulesetId);
      formData.append('priority', priority);
      formData.append('min_confidence_score', minConfidence);
      formData.append('created_by', 'current_user'); // Replace with actual user

      // Call your API here
      // await dispatch(createBusinessRule(formData));
      closeModal();
    } catch (error) {
      console.error('Error creating rule:', error);
    }
    setIsLoading(false);
  };

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create Business Rule</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Input
              placeholder="Rule Name"
              value={ruleName}
              onChange={(e) => setRuleName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select value={rulesetId} onValueChange={setRulesetId}>
              <SelectTrigger>
                <SelectValue placeholder="Select Ruleset" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="form941">Form 941</SelectItem>
                <SelectItem value="form1040">Form 1040</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map((p) => (
                  <SelectItem key={p} value={p}>
                    Priority {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Tabs defaultValue="pdf">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="pdf">PDF Upload</TabsTrigger>
              <TabsTrigger value="java">Java Code</TabsTrigger>
            </TabsList>

            <TabsContent value="pdf">
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <Input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  className="hidden"
                  id="pdf-upload"
                />
                <label htmlFor="pdf-upload" className="cursor-pointer">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2">Upload Form 941 PDF</p>
                  <p className="text-sm text-gray-500">
                    {selectedFile ? selectedFile.name : 'PDF files only'}
                  </p>
                </label>
              </div>
              
              <div className="mt-4 flex justify-end">
                <Button
                  onClick={() => handleSubmit('pdf')}
                  disabled={!selectedFile || isLoading}
                >
                  Create Rule
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="java">
              <Textarea
                placeholder="Paste your Java code here..."
                value={javaCode}
                onChange={(e) => setJavaCode(e.target.value)}
                className="h-48"
              />
              
              <div className="mt-4 flex justify-end">
                <Button
                  onClick={() => handleSubmit('java')}
                  disabled={!javaCode.trim() || isLoading}
                >
                  Create Rule
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BusinessRuleModal;