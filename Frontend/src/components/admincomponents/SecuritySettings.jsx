import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Button } from '../ui/button';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { USER_API_ENDPOINT } from '@/utils/data';

const SecuritySettings = () => {
  const [settings, setSettings] = useState({
    minPasswordLength: 8,
    requireSpecialChar: true,
    requireNumbers: true,
    requireUppercase: true,
    passwordExpiryDays: 90,
    maxLoginAttempts: 5,
    lockoutDuration: 30, // minutes
    sessionTimeout: 30, // minutes
    enableTwoFactor: false,
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchSecuritySettings();
  }, []);

  const fetchSecuritySettings = async () => {
    try {
      const response = await axios.get(`${USER_API_ENDPOINT}/security-settings`, {
        withCredentials: true
      });
      if (response.data.success) {
        setSettings(response.data.settings);
      }
    } catch (error) {
      console.error('Error fetching security settings:', error);
      toast.error('Failed to load security settings');
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${USER_API_ENDPOINT}/security-settings`,
        settings,
        { withCredentials: true }
      );
      
      if (response.data.success) {
        toast.success('Security settings updated successfully');
      }
    } catch (error) {
      console.error('Error updating security settings:', error);
      toast.error('Failed to update security settings');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-4">
      <Card className="border border-[#EAECEE] shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-medium text-[#2C3E50]">
            Password Policy Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="minPasswordLength">Minimum Password Length</Label>
              <Input
                id="minPasswordLength"
                type="number"
                min="6"
                max="32"
                value={settings.minPasswordLength}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  minPasswordLength: parseInt(e.target.value)
                }))}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="requireSpecialChar"
                checked={settings.requireSpecialChar}
                onCheckedChange={(checked) => setSettings(prev => ({
                  ...prev,
                  requireSpecialChar: checked
                }))}
              />
              <Label htmlFor="requireSpecialChar">Require Special Characters</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="requireNumbers"
                checked={settings.requireNumbers}
                onCheckedChange={(checked) => setSettings(prev => ({
                  ...prev,
                  requireNumbers: checked
                }))}
              />
              <Label htmlFor="requireNumbers">Require Numbers</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="requireUppercase"
                checked={settings.requireUppercase}
                onCheckedChange={(checked) => setSettings(prev => ({
                  ...prev,
                  requireUppercase: checked
                }))}
              />
              <Label htmlFor="requireUppercase">Require Uppercase Letters</Label>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="passwordExpiryDays">Password Expiry (Days)</Label>
              <Input
                id="passwordExpiryDays"
                type="number"
                min="0"
                value={settings.passwordExpiryDays}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  passwordExpiryDays: parseInt(e.target.value)
                }))}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="maxLoginAttempts">Maximum Login Attempts</Label>
              <Input
                id="maxLoginAttempts"
                type="number"
                min="1"
                max="10"
                value={settings.maxLoginAttempts}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  maxLoginAttempts: parseInt(e.target.value)
                }))}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="lockoutDuration">Account Lockout Duration (Minutes)</Label>
              <Input
                id="lockoutDuration"
                type="number"
                min="5"
                max="1440"
                value={settings.lockoutDuration}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  lockoutDuration: parseInt(e.target.value)
                }))}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="sessionTimeout">Session Timeout (Minutes)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                min="5"
                max="1440"
                value={settings.sessionTimeout}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  sessionTimeout: parseInt(e.target.value)
                }))}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="enableTwoFactor"
                checked={settings.enableTwoFactor}
                onCheckedChange={(checked) => setSettings(prev => ({
                  ...prev,
                  enableTwoFactor: checked
                }))}
              />
              <Label htmlFor="enableTwoFactor">Enable Two-Factor Authentication</Label>
            </div>
          </div>

          <Button 
            onClick={handleSave}
            disabled={isLoading}
            className="w-full bg-[#E67E22] hover:bg-[#D35400] text-white"
          >
            {isLoading ? 'Saving...' : 'Save Security Settings'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecuritySettings; 