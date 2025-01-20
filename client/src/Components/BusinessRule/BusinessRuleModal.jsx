// import React, { useState } from 'react';
// import { Upload, Code } from 'lucide-react';
// import {
//     Dialog,
//     DialogContent,
//     DialogHeader,
//     DialogTitle,
//   } from "../../Components/ui/dialog";

// import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../Components/ui/tabs";
// import { Button } from "../../Components/ui/button";
// import { Input } from "../../Components/ui/input";
// import { Textarea } from "../../Components/ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../../Components/ui/select";

// const BusinessRuleModal = ({ closeModal, dispatch }) => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [javaCode, setJavaCode] = useState('');
//   const [ruleName, setRuleName] = useState('');
//   const [rulesetId, setRulesetId] = useState('');
//   const [priority, setPriority] = useState(3);
//   const [minConfidence, setMinConfidence] = useState(0.8);

//   const handleSubmit = async (type) => {
//     setIsLoading(true);
//     try {
//       let formData = new FormData();

//       if (type === 'pdf') {
//         formData.append('file', selectedFile);
//       } else {
//         formData.append('code', javaCode);
//       }

//       formData.append('rule_name', ruleName);
//       formData.append('ruleset_id', rulesetId);
//       formData.append('priority', priority);
//       formData.append('min_confidence_score', minConfidence);
//       formData.append('created_by', 'current_user'); // Replace with actual user

//       // Call your API here
//       // await dispatch(createBusinessRule(formData));
//       closeModal();
//     } catch (error) {
//       console.error('Error creating rule:', error);
//     }
//     setIsLoading(false);
//   };

//   return (
//     <Dialog open onOpenChange={closeModal}>
//       <DialogContent className="sm:max-w-[600px]">
//         <DialogHeader>
//           <DialogTitle>Create Business Rule</DialogTitle>
//         </DialogHeader>

//         <div className="space-y-4 py-4">
//           <div className="space-y-2">
//             <Input
//               placeholder="Ruleset Name"
//               value={ruleName}
//               onChange={(e) => setRuleName(e.target.value)}
//             />
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <Select value={rulesetId} onValueChange={setRulesetId}>
//               <SelectTrigger>
//                 <SelectValue placeholder="Select Ruleset" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="form941">Form 941</SelectItem>
//                 <SelectItem value="form1040">Form 1040</SelectItem>
//               </SelectContent>
//             </Select>

//             <Select value={priority} onValueChange={setPriority}>
//               <SelectTrigger>
//                 <SelectValue placeholder="Priority" />
//               </SelectTrigger>
//               <SelectContent>
//                 {[1, 2, 3, 4, 5].map((p) => (
//                   <SelectItem key={p} value={p}>
//                     Priority {p}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>

//           <Tabs defaultValue="pdf">
//             <TabsList className="grid w-full grid-cols-2">
//               <TabsTrigger value="pdf">PDF Upload</TabsTrigger>
//               <TabsTrigger value="java">Java Code</TabsTrigger>
//             </TabsList>

//             <TabsContent value="pdf">
//               <div className="border-2 border-dashed rounded-lg p-6 text-center">
//                 <Input
//                   type="file"
//                   accept=".pdf"
//                   onChange={(e) => setSelectedFile(e.target.files[0])}
//                   className="hidden"
//                   id="pdf-upload"
//                 />
//                 <label htmlFor="pdf-upload" className="cursor-pointer">
//                   <Upload className="mx-auto h-12 w-12 text-gray-400" />
//                   <p className="mt-2">Upload Form 941 PDF</p>
//                   <p className="text-sm text-gray-500">
//                     {selectedFile ? selectedFile.name : 'PDF files only'}
//                   </p>
//                 </label>
//               </div>

//               <div className="mt-4 flex justify-end">
//                 <Button
//                   onClick={() => handleSubmit('pdf')}
//                   disabled={!selectedFile || isLoading}
//                 >
//                   Create Rule
//                 </Button>
//               </div>
//             </TabsContent>

//             <TabsContent value="java">
//               <div className="border-2 border-dashed rounded-lg p-6 text-center">
//                 <Input
//                   type="file"
//                   accept=".java"
//                   onChange={(e) => setSelectedFile(e.target.files[0])}
//                   className="hidden"
//                   id="pdf-upload"
//                 />
//                 <label htmlFor="pdf-upload" className="cursor-pointer">
//                   <Upload className="mx-auto h-12 w-12 text-gray-400" />
//                   <p className="mt-2">Upload Java Code</p>
//                   <p className="text-sm text-gray-500">
//                     {selectedFile ? selectedFile.name : 'java file only'}
//                   </p>
//                 </label>
//               </div>

//               <div className="mt-4 flex justify-end">
//                 <Button
//                   onClick={() => handleSubmit('java')}
//                   disabled={!selectedFile || isLoading}
//                 >
//                   Create Rule
//                 </Button>
//               </div>
//             </TabsContent>


//           </Tabs>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default BusinessRuleModal;

import { Code, Upload } from 'lucide-react';
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../Components/ui/dialog";

// import { Alert, AlertDescription } from '../../Components/ui/alert';
import { Button } from "../../Components/ui/button";
import { Input } from "../../Components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../Components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../Components/ui/tabs";





const BusinessRuleModal = ({ closeModal, dispatch }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [javaCode, setJavaCode] = useState('');
  const [ruleName, setRuleName] = useState('');
  const [rulesetId, setRulesetId] = useState('');
  const [priority, setPriority] = useState(3);
  const [minConfidence, setMinConfidence] = useState(0.8);
  const [error, setError] = useState('');

  const analyzeJavaCode = async (file) => {
    try {
      const formData = new FormData();
      // Using URL parameters for ruleset_name as required by the API
      const url = `https://google-docai-be-685246125222.us-central1.run.app/api/v1/code-analysis/analyze?ruleset_name=${encodeURIComponent(ruleName)}`;
      formData.append('code_type', 'java');
      formData.append('code_file', file);

      const response = await fetch(url, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Analysis failed with status: ${response.status}`);
      }

      const analysisResult = await response.json();
      return analysisResult;
    } catch (error) {
      throw new Error(`Code analysis failed: ${error.message}`);
    }
  };

  const handleSubmit = async (type) => {
    setIsLoading(true);
    setError('');

    try {
      let formData = new FormData();

      if (type === 'pdf') {
        formData.append('file', selectedFile);
      } else if (type === 'java') {
        // First analyze the Java code
        const analysisResult = await analyzeJavaCode(selectedFile);

        // If analysis is successful, proceed with rule creation
        formData.append('code', javaCode);
        formData.append('analysis_result', JSON.stringify(analysisResult));
      }

      formData.append('rule_name', ruleName);
      formData.append('ruleset_id', rulesetId);
      formData.append('priority', priority);
      formData.append('min_confidence_score', minConfidence);
      formData.append('created_by', 'current_user');

      // Call your API here
      // await dispatch(createBusinessRule(formData));
      closeModal();
    } catch (error) {
      setError(error.message);
      console.error('Error creating rule:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === 'text/x-java' || file.name.endsWith('.java')) {
        setSelectedFile(file);
        setError('');
      } else {
        setError('Please select a valid Java file');
        setSelectedFile(null);
      }
    }
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
              placeholder="Ruleset Name"
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
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <Input
                  type="file"
                  accept=".java"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="java-upload"
                />
                <label htmlFor="java-upload" className="cursor-pointer">
                  <Code className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2">Upload Java Code</p>
                  <p className="text-sm text-gray-500">
                    {selectedFile ? selectedFile.name : 'Java files only'}
                  </p>
                </label>
              </div>

              <div className="mt-4 flex justify-end">
                <Button
                  onClick={() => handleSubmit('java')}
                  disabled={!selectedFile || !ruleName || isLoading}
                >
                  {isLoading ? 'Analyzing...' : 'Create Rule'}
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