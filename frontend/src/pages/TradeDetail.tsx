import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TradeDetail as TradeDetailComponent } from '@/components/trades/TradeDetail';
import { tradeService } from '@/services/trade.service';
import { handleAPIError, showSuccess, getErrorMessage } from '@/lib/error-handler';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';

export const TradeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Fetch trade data
  const { data: trade, isLoading, error, isError } = useQuery({
    queryKey: ['trade', id],
    queryFn: () => tradeService.getTradeById(id!),
    enabled: !!id,
    retry: 2,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: () => tradeService.deleteTrade(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trades'] });
      showSuccess('Trade deleted successfully!');
      navigate('/trades');
    },
    onError: (error) => {
      handleAPIError(error, 'Failed to delete trade. Please try again.');
    },
  });

  const handleEdit = () => {
    navigate(`/trades/${id}/edit`);
  };

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    deleteMutation.mutate();
    setShowDeleteDialog(false);
  };

  const handleBack = () => {
    navigate('/trades');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50/30 to-accent-50/30">
        <header className="glass border-b border-white/20 sticky top-0 z-sticky backdrop-blur-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                Trade Detail
              </h1>
              <button
                onClick={handleBack}
                className="text-sm text-neutral-600 hover:text-neutral-900 
                  transition-colors duration-200"
              >
                ← Back to Trades
              </button>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600 mx-auto mb-4"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-8 w-8 rounded-full bg-primary-600 animate-pulse"></div>
                </div>
              </div>
              <p className="text-neutral-600 font-medium">Loading trade details...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (isError || !trade) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50/30 to-accent-50/30">
        <header className="glass border-b border-white/20 sticky top-0 z-sticky backdrop-blur-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                Trade Detail
              </h1>
              <button
                onClick={handleBack}
                className="text-sm text-neutral-600 hover:text-neutral-900 
                  transition-colors duration-200"
              >
                ← Back to Trades
              </button>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl border border-danger-200 shadow-md p-8 animate-slide-down">
            <h2 className="text-xl font-bold text-danger-900 mb-3">
              Failed to Load Trade
            </h2>
            <p className="text-danger-700 mb-6">
              {error ? getErrorMessage(error) : "The trade you're looking for doesn't exist or you don't have permission to view it."}
            </p>
            <button
              onClick={handleBack}
              className="px-6 py-3 bg-danger-600 text-white rounded-lg hover:bg-danger-700 
                transition-all duration-200 hover:shadow-glow-danger font-semibold"
            >
              Back to Trades
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50/30 to-accent-50/30">
      {/* Navigation Header */}
      <header className="glass border-b border-white/20 sticky top-0 z-sticky backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
              Trade Detail
            </h1>
            <div className="flex gap-4">
              <button
                onClick={handleBack}
                className="text-sm text-neutral-600 hover:text-neutral-900 
                  transition-colors duration-200"
              >
                ← Back to Trades
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="text-sm text-neutral-600 hover:text-neutral-900 
                  transition-colors duration-200"
              >
                Dashboard
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TradeDetailComponent
          trade={trade}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Trade</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this trade? This action cannot be undone.
              All associated notes and screenshots will also be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              variant="destructive"
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
