import React, { useState } from 'react';
import { MessageCircle, Minimize2 } from 'lucide-react';
import { Card, IconButton } from '@mui/material';

const Chatbot = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-[1000]">
      {isExpanded ? (
        <Card className="w-[400px] h-[600px] flex flex-col bg-white shadow-xl rounded-lg">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-[#0B5487] text-white">
            <h3 className="font-semibold">AI Assistant</h3>
            <IconButton 
              onClick={() => setIsExpanded(false)}
              className="text-white hover:bg-[#0B5487]/80"
              size="small"
            >
              <Minimize2 className="h-4 w-4" />
            </IconButton>
          </div>
          
          {/* Placeholder Content */}
          <div className="flex-1 p-4">
            <p>Chat interface will go here</p>
          </div>
        </Card>
      ) : (
        <IconButton
          onClick={() => setIsExpanded(true)}
          className="h-12 w-12 rounded-full shadow-lg bg-[#0B5487] hover:bg-[#0B5487]/90 text-white"
        >
          <MessageCircle className="h-6 w-6" />
        </IconButton>
      )}
    </div>
  );
};

export default Chatbot;