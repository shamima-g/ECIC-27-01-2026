'use client';

/**
 * StatusIcon - Displays file status with appropriate color and icon
 * Used in Portfolio and Other Imports dashboards
 *
 * Status values from API:
 * - ✅ = Complete (green tick)
 * - ⏱️ = No file uploaded (gray)
 * - ⚠️ = Error in file (orange)
 * - ⏳ = File busy uploading (yellow spinner)
 * - ‼️ = Missing mappings, requires action (red)
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import type { FileStatusColor } from '@/types/file-import';
import { getStatusConfig, getStatusAriaLabel } from '@/types/file-import';

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
  const config = getStatusConfig(statusColor);
  const ariaLabel = readOnly
    ? `View details: ${getStatusAriaLabel(statusColor, fileType)}`
    : getStatusAriaLabel(statusColor, fileType);

  const colorClasses = `${config.bgColor} ${config.textColor}`;

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`w-8 h-8 p-0 rounded-full ${colorClasses} hover:opacity-80 focus:ring-2 focus:ring-offset-2`}
    >
      {config.isAnimated ? (
        <span className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
      ) : (
        <span className="text-sm font-bold">{config.icon}</span>
      )}
    </Button>
  );
}

export default StatusIcon;
