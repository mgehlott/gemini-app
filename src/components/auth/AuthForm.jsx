import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Phone, MessageCircle, ArrowLeft } from 'lucide-react';
import { CountrySelector } from './CountrySelector';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAuthStore } from '../../stores/authStore';
import { simulateOTPSend, simulateOTPVerification } from '../../utils/api';

const phoneSchema = z.object({
  phone: z.string().min(5, 'Phone number must be at least 5 digits').max(15, 'Phone number must be at most 15 digits').regex(/^\d+$/, 'Phone number must contain only digits'),
});

const otpSchema = z.object({
  otp: z.string().min(4, 'OTP must be at least 4 digits').max(6, 'OTP must be at most 6 digits').regex(/^\d+$/, 'OTP must contain only digits'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be at most 50 characters'),
});

export const AuthForm = () => {
  const [step, setStep] = useState('phone');
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const { login, setLoading, isLoading } = useAuthStore();

  const phoneForm = useForm({
    resolver: zodResolver(phoneSchema),
  });

  const otpForm = useForm({
    resolver: zodResolver(otpSchema),
  });

  const handlePhoneSubmit = async (data) => {
    if (!selectedCountry) {
      toast.error('Please select a country');
      return;
    }

    setLoading(true);
    try {
      const fullPhone = selectedCountry.idd.root + (selectedCountry.idd.suffixes?.[0] || '') + data.phone;
      await simulateOTPSend(fullPhone);
      setPhoneNumber(fullPhone);
      setStep('otp');
      toast.success('OTP sent successfully!');
    } catch (error) {
      toast.error('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSubmit = async (data) => {
    setLoading(true);
    try {
      const isValid = await simulateOTPVerification(data.otp);
      console.log('iii',isValid);
      if (isValid) {
        const user = {
          id: Date.now().toString(),
          phone: phoneNumber,
          countryCode: selectedCountry?.cca2 || '',
          name: data.name,
          createdAt: new Date(),
        };
        
        login(user, 'mock-jwt-token');
        toast.success('Welcome to Gemini Chat!');
      } else {
        toast.error('Invalid OTP. Please try again.');
      }
    } catch (error) {
      toast.error('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  console.log('mmmmmmm',otpForm)
  console.log('vvvvvvvvv',phoneForm)
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
              <MessageCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Welcome to Gemini Chat
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {step === 'phone' ? 'Enter your phone number to get started' : 'Enter the OTP and your name to continue'}
            </p>
          </div>

          {step === 'phone' ? (
            <form onSubmit={phoneForm.handleSubmit(handlePhoneSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number
                </label>
                <div className="flex">
                  <CountrySelector
                    selectedCountry={selectedCountry}
                    onSelect={setSelectedCountry}
                  />
                  <input
                    {...phoneForm.register('phone')}
                    type="tel"
                    placeholder="Enter phone number"
                    className="flex-1 px-3 py-2 border border-l-0 border-gray-300 dark:border-gray-600 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </div>
                {phoneForm.formState.errors.phone && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {phoneForm.formState.errors.phone.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                loading={isLoading}
              >
                <Phone size={20} />
                Send OTP
              </Button>
            </form>
          ) : (
            <form onSubmit={otpForm.handleSubmit(handleOTPSubmit)} className="space-y-6">
              <Input
                {...otpForm.register('otp')}
                label="OTP Code"
                placeholder="Enter 4-6 digit OTP"
                error={otpForm.formState.errors.otp?.message}
                maxLength={6}
              />

              <Input
                {...otpForm.register('name')}
                label="Your Name"
                placeholder="Enter your name"
                error={otpForm.formState.errors.name?.message}
              />

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep('phone')}
                  className="flex-1"
                >
                  <ArrowLeft size={20} />
                  Back
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  loading={isLoading}
                >
                  Continue
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};