import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useChatStore } from '../../stores/chatStore';

const createChatroomSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be at most 100 characters'),
  description: z.string().min(1, 'Description is required').max(500, 'Description must be at most 500 characters'),
});

export const CreateChatroomModal = ({ isOpen, onClose }) => {
  const { addChatroom } = useChatStore();
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: zodResolver(createChatroomSchema),
  });

  const onSubmit = async (data) => {
    try {
      addChatroom(data);
      toast.success('Chatroom created successfully!');
      reset();
      onClose();
    } catch (error) {
      toast.error('Failed to create chatroom. Please try again.');
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create New Chatroom">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          {...register('title')}
          label="Chatroom Title"
          placeholder="Enter chatroom title"
          error={errors.title?.message}
        />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            {...register('description')}
            placeholder="Enter chatroom description"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 resize-none"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1"
            loading={isSubmitting}
          >
            Create Chatroom
          </Button>
        </div>
      </form>
    </Modal>
  );
};