import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import React from 'react';

interface ContentSectionProps {
  title: string;
  desc: string;
  children: React.ReactNode; // Allow multiple children
  className?: string; // Optional className for custom styling
  scrollAreaClassName?: string; // Optional className for ScrollArea
}

export default function ContentSection({
  title,
  desc,
  children,
  className = '',
  scrollAreaClassName = 'lg:max-w-xl -mx-1 px-1.5',
}: ContentSectionProps) {
  return (
    <div className={`flex flex-1 gap-4 flex-col ${className}`}>
      {/* Header Section */}
      <div className='flex-none'>
        <h3 className='text-lg font-medium'>{title}</h3>
        <p className='text-sm text-muted-foreground'>{desc}</p>
      </div>

      {/* Separator */}
      <Separator className='my-4 flex-none' />

      {/* Scrollable Content Area */}
      <ScrollArea className={`faded-bottom flex-1 scroll-smooth ${scrollAreaClassName}`}>
        <div className='space-y-4'>{children}</div>
      </ScrollArea>
    </div>
  );
}