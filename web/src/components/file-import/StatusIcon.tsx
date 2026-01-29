'use client';

/**
 * StatusIcon - Displays file status with appropriate color and icon
 * Used in Portfolio and Other Imports dashboards
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import type { FileStatusColor } from '@/types/file-import';
import { getStatusAriaLabel, getStatusColorClasses } from '@/types/file-import';

interface StatusIconProps {
  statusColor: FileStatusColor;
  fileType: string;
  onClick?: () => void;
  disabled?: boolean;
  readOnly?: boolean;
}

export function StatusIcon({
  statusColor,
  fileType,
  onClick,
  disabled = false,
  readOnly = false,
}: StatusIconProps) {
  const ariaLabel = readOnly
    ? `View details: ${getStatusAriaLabel(statusColor, fileType)}`
    : getStatusAriaLabel(statusColor, fileType);

  const colorClasses = getStatusColorClasses(statusColor);

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`w-8 h-8 p-0 rounded-full ${colorClasses} hover:opacity-80 focus:ring-2 focus:ring-offset-2`}
    >
      {statusColor === 'Yellow' ? (
        <span className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
      ) : (
        <StatusSymbol statusColor={statusColor} />
      )}
    </Button>
  );
}

function StatusSymbol({ statusColor }: { statusColor: FileStatusColor }) {
  switch (statusColor) {
    case 'Red':
      return <span className="text-xs font-bold">!</span>;
    case 'Green':
      return <span className="text-xs font-bold">&#10003;</span>;
    case 'Gray':
    default:
      // Treat unknown status values as Gray (not uploaded)
      return <span className="text-xs">-</span>;
  }
}

export default StatusIcon;
