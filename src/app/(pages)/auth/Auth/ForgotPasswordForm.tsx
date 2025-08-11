'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Loader2, X } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface ForgotPasswordFormData {
  email: string;
}

interface ForgotPasswordFormProps {
  direction: 'row' | 'col';
  className?: string;
  buttonVariant?: string;
  cancelText?: string;
  submitText?: string;
  email: string;
  isEmailReadOnly?: boolean;
}

export default function ForgotPasswordForm({
  className = '',
  direction = 'col',
  buttonVariant = 'link',
  cancelText = 'Cancel',
  submitText = 'Send Reset Instructions',
  email,
  isEmailReadOnly,

}: ForgotPasswordFormProps) {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { forgotPassword } = useAuth();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ForgotPasswordFormData>();

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setLoading(true);
      await forgotPassword(data.email);
      toast({
        title: 'Success',
        description: 'Password reset instructions have been sent to your email.',
      });
      setIsOpen(false);
      reset();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to send reset instructions',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex flex-${direction} gap-2 items-start ${className}`}>
      <Button
        // variant={buttonVariant}
        className="px-4 py-1 rounded-xl text-sm"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        Forgot password?
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="w-full mt-2"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 border p-4 rounded-xl shadow-sm bg-muted">
              <div className="space-y-2">
                <Label htmlFor="reset-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address',
                      },
                    })}
                    id="reset-email"
                    type="email"
                    value={email}
                    readOnly={isEmailReadOnly}
                    placeholder="Enter your email"
                    className="pl-10"
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-organe-500">{errors.email.message}</p>
                )}
              </div>

              <div className="flex justify-between items-center gap-2">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {submitText}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setIsOpen(false);
                    reset();
                  }}
                  className="text-sm"
                >
                  <X className="h-4 w-4 mr-1" />
                  {cancelText}
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
