import React from 'react';
import PropTypes from 'prop-types';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, Alert, AlertDescription } from "../../Components/ui/alert";
import { Button } from "../../Components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const ConfidenceAlert = ({
  isOpen,
  onClose,
  onNext,
  onPrevious,
  currentIndex,
  totalItems,
  currentItem,
  disablePrevious,
  disableNext
}) => {
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="max-w-xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-semibold">
            Review Low Confidence Fields ({currentIndex + 1} of {totalItems})
          </AlertDialogTitle>
        </AlertDialogHeader>

        {currentItem && (
          <div className="my-4">
            <Alert variant="destructive" className="mb-4">
              <div className="flex flex-col gap-3">
                <AlertDescription>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="font-medium text-gray-700">Field:</div>
                    <div className="col-span-2">{currentItem.content?.text}</div>

                    <div className="font-medium text-gray-700">Value:</div>
                    <div className="col-span-2">{currentItem.key_pair?.value}</div>

                    <div className="font-medium text-gray-700">Confidence:</div>
                    <div className="col-span-2">
                      {Math.round(currentItem.key_pair?.confidence * 100)}%
                    </div>
                  </div>
                </AlertDescription>
              </div>
            </Alert>
          </div>
        )}

        <AlertDialogFooter className="flex justify-between items-center mt-6">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onPrevious}
              disabled={disablePrevious}
              className="flex items-center"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>

            <Button
              variant="outline"
              onClick={onNext}
              disabled={disableNext}
              className="flex items-center"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>

          <AlertDialogAction
            onClick={onClose}
            className="bg-red-500 hover:bg-red-600 text-white flex items-center"
          >
            <X className="h-4 w-4 mr-1" />
            Close Review
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

ConfidenceAlert.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onPrevious: PropTypes.func.isRequired,
  currentIndex: PropTypes.number.isRequired,
  totalItems: PropTypes.number.isRequired,
  currentItem: PropTypes.shape({
    content: PropTypes.shape({
      text: PropTypes.string
    }),
    key_pair: PropTypes.shape({
      value: PropTypes.string,
      confidence: PropTypes.number
    })
  }),
  disablePrevious: PropTypes.bool,
  disableNext: PropTypes.bool
};

ConfidenceAlert.defaultProps = {
  disablePrevious: false,
  disableNext: false
};

export default ConfidenceAlert;