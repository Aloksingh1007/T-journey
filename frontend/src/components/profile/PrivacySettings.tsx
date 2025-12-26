import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X, Shield, Eye, EyeOff, Loader2 } from 'lucide-react';
import { updatePrivacySettings } from '../../services/profile.service';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Select } from '../ui/select';
import { toast } from 'sonner';
import type { PrivacySettings as PrivacySettingsType } from '../../types';

interface PrivacySettingsProps {
  currentSettings: PrivacySettingsType;
  isOpen: boolean;
  onClose: () => void;
}

export function PrivacySettings({ currentSettings, isOpen, onClose }: PrivacySettingsProps) {
  const queryClient = useQueryClient();
  const [settings, setSettings] = useState<PrivacySettingsType>(currentSettings);

  const updateSettingsMutation = useMutation({
    mutationFn: updatePrivacySettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Privacy settings updated successfully');
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Failed to update privacy settings');
    },
  });

  const handleSave = () => {
    updateSettingsMutation.mutate(settings);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Privacy Settings</h2>
              <p className="text-sm text-gray-600">Control who can see your information</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Profile Visibility */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                {settings.profileVisibility === 'PUBLIC' ? (
                  <Eye className="w-5 h-5 text-purple-600" />
                ) : (
                  <EyeOff className="w-5 h-5 text-purple-600" />
                )}
              </div>
              <div className="flex-1">
                <Label htmlFor="profileVisibility" className="text-base font-semibold">
                  Profile Visibility
                </Label>
                <p className="text-sm text-gray-600 mt-1 mb-3">
                  Control who can view your profile
                </p>
                <Select
                  value={settings.profileVisibility}
                  onChange={(e) =>
                    setSettings({ ...settings, profileVisibility: e.target.value as any })
                  }
                >
                  <option value="PUBLIC">Public - Anyone can view your profile</option>
                  <option value="FRIENDS_ONLY">Friends Only - Only your friends can view</option>
                  <option value="PRIVATE">Private - Only you can view your profile</option>
                </Select>
              </div>
            </div>
          </div>

          {/* Data Sharing Settings */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Sharing</h3>
            <div className="space-y-3">
              {/* Share Statistics */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">Share Statistics</div>
                  <div className="text-sm text-gray-600">
                    Allow others to see your trading statistics
                  </div>
                </div>
                <button
                  onClick={() => setSettings({ ...settings, shareStats: !settings.shareStats })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.shareStats ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.shareStats ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Share Trades */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">Share Trades</div>
                  <div className="text-sm text-gray-600">
                    Allow others to see your trade history
                  </div>
                </div>
                <button
                  onClick={() => setSettings({ ...settings, shareTrades: !settings.shareTrades })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.shareTrades ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.shareTrades ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Share Emotions */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">Share Emotions</div>
                  <div className="text-sm text-gray-600">
                    Allow others to see your emotional analysis data
                  </div>
                </div>
                <button
                  onClick={() => setSettings({ ...settings, shareEmotions: !settings.shareEmotions })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.shareEmotions ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.shareEmotions ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Share Patterns */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">Share Patterns</div>
                  <div className="text-sm text-gray-600">
                    Allow others to see your trading patterns and insights
                  </div>
                </div>
                <button
                  onClick={() => setSettings({ ...settings, sharePatterns: !settings.sharePatterns })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.sharePatterns ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.sharePatterns ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-medium mb-1">Your privacy matters</p>
                <p className="text-blue-700">
                  These settings control what information is visible to other users. You can change
                  these settings at any time.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={updateSettingsMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={updateSettingsMutation.isPending}
          >
            {updateSettingsMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
