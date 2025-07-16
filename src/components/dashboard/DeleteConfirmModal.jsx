import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

export const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, chatroomTitle }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Chatroom">
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 mb-4">
          <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          Delete "{chatroomTitle}"?
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          This action cannot be undone. All messages in this chatroom will be permanently deleted.
        </p>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={onConfirm}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
};