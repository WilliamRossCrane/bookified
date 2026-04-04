'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Upload, ImageIcon } from 'lucide-react';
import { UploadSchema } from '@/lib/zod';
import { BookUploadFormValues } from '@/types';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ACCEPTED_PDF_TYPES, ACCEPTED_IMAGE_TYPES } from '@/lib/constants';
import LoadingOverlay from './LoadingOverlay';

const UploadForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<BookUploadFormValues>({
    resolver: zodResolver(UploadSchema),
    defaultValues: {
      title: '',
      author: '',
      persona: '',
      pdfFile: undefined,
      coverImage: undefined,
    },
  });

  const onSubmit = async (data: BookUploadFormValues) => {
    setIsSubmitting(true);
    try {
      console.log(data);
      await new Promise((res) => setTimeout(res, 1500));
      form.reset();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {isSubmitting && <LoadingOverlay />}

      <div className="new-book-wrapper">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

            {/* PDF Upload */}
            <FormField
              control={form.control}
              name="pdfFile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="form-label">Book PDF File</FormLabel>
                  <FormControl>
                    <div className="upload-dropzone">
                      <Upload />
                      <p>Click to upload PDF</p>
                      <span>PDF file (max 50MB)</span>
                      <input
                        type="file"
                        accept={ACCEPTED_PDF_TYPES.join(',')}
                        onChange={(e) => field.onChange(e.target.files?.[0])}
                        disabled={isSubmitting}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Cover Upload */}
            <FormField
              control={form.control}
              name="coverImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="form-label">Cover Image (Optional)</FormLabel>
                  <FormControl>
                    <div className="upload-dropzone">
                      <ImageIcon />
                      <p>Click to upload cover image</p>
                      <span>Leave empty to auto-generate from PDF</span>
                      <input
                        type="file"
                        accept={ACCEPTED_IMAGE_TYPES.join(',')}
                        onChange={(e) => field.onChange(e.target.files?.[0])}
                        disabled={isSubmitting}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="form-label">Title</FormLabel>
                  <FormControl>
                    <Input
                      className="form-input"
                      placeholder="ex: Rich Dad Poor Dad"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Author */}
            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="form-label">Author Name</FormLabel>
                  <FormControl>
                    <Input
                      className="form-input"
                      placeholder="ex: Robert Kiyosaki"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Voice Selector */}
            <FormField
              control={form.control}
              name="persona"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="form-label">Choose Assistant Voice</FormLabel>
                  <FormControl>
                    <div className="grid gap-4">
                      <div>
                        <p>Male Voices</p>
                        {['Dave', 'Daniel', 'Chris'].map((voice) => (
                          <label key={voice} className={`voice-selector-option ${field.value === voice ? 'voice-selector-option-selected' : ''}`}>
                            <input
                              type="radio"
                              value={voice}
                              checked={field.value === voice}
                              onChange={field.onChange}
                              disabled={isSubmitting}
                            />
                            <span>{voice}</span>
                          </label>
                        ))}
                      </div>

                      <div>
                        <p>Female Voices</p>
                        {['Rachel', 'Sarah'].map((voice) => (
                          <label key={voice} className={`voice-selector-option ${field.value === voice ? 'voice-selector-option-selected' : ''}`}>
                            <input
                              type="radio"
                              value={voice}
                              checked={field.value === voice}
                              onChange={field.onChange}
                              disabled={isSubmitting}
                            />
                            <span>{voice}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit */}
            <Button type="submit" className="form-btn w-full" disabled={isSubmitting}>
              Begin Synthesis
            </Button>

          </form>
        </Form>
      </div>
    </>
  );
};

export default UploadForm;
