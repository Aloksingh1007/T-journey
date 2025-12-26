import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EnhancedTradeForm } from "@/components/trades/EnhancedTradeForm";
import { tradeService } from "@/services/trade.service";
import { handleAPIError, showSuccess } from "@/lib/error-handler";
import type { CreateTradeDTO } from "@/types";

export const AddTrade = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createTradeMutation = useMutation({
    mutationFn: ({ data, screenshots }: { data: CreateTradeDTO; screenshots?: File[] }) =>
      tradeService.createTrade(data, screenshots),
    onSuccess: () => {
      // Invalidate and refetch trades queries
      queryClient.invalidateQueries({ queryKey: ['trades'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      
      showSuccess("Trade created successfully!");
      
      // Redirect to trades list after a short delay
      setTimeout(() => {
        navigate("/trades");
      }, 1000);
    },
    onError: (err) => {
      handleAPIError(err, "Failed to create trade. Please try again.");
    },
  });

  const handleSubmit = async (data: CreateTradeDTO, screenshots?: File[]) => {
    createTradeMutation.mutate({ data, screenshots });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Add New Trade</h1>
            <button
              onClick={() => navigate("/trades")}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ← Back to Trades
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Trade Form */}
        <EnhancedTradeForm onSubmit={handleSubmit} isLoading={createTradeMutation.isPending} />
      </main>
    </div>
  );
};
