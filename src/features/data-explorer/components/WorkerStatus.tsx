import { Cpu } from 'lucide-react';
import { useWorkerProcessor } from '../hooks/useWorkerProcessor';
import { Badge } from '@shared/ui/Badge';

export const WorkerStatus = () => {
  const { isProcessing, lastDuration } = useWorkerProcessor();

  if (!isProcessing && lastDuration === 0) return null;

  return (
    <div className="flex items-center gap-2 text-sm">
      <Cpu className="h-4 w-4 text-slate-500" />
      {isProcessing ? (
        <Badge variant="warning">Processing in Web Worker...</Badge>
      ) : (
        <span className="text-slate-500">Last query: {lastDuration}ms</span>
      )}
    </div>
  );
};
