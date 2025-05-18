import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Button } from '../ui/button';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { USER_API_ENDPOINT } from '@/utils/data';
import {
  Lock,
  Mail,
  Globe,
  Database,
  Shield,
  Bell,
  FileText,
} from 'lucide-react';

const SystemSettings = () => {
  // Security Settings State
  const [securitySettings, setSecuritySettings] = useState({
    minPasswordLength: 8,
    requireSpecialChar: true,
    requireNumbers: true,
    requireUppercase: true,
    passwordExpiryDays: 90,
    maxLoginAttempts: 5,
    lockoutDuration: 30,
    sessionTimeout: 30,
    enableTwoFactor: false,
  });

  // Email Settings State
  const [emailSettings, setEmailSettings] = useState({
    enableEmailNotifications: true,
    smtpServer: '',
    smtpPort: 587,
    smtpUsername: '',
    smtpPassword: '',
    fromEmail: '',
    emailVerificationRequired: true,
  });

  // General Settings State
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'Job Portal',
    siteDescription: 'Professional Job Portal Platform',
    maintenanceMode: false,
    allowRegistration: true,
    defaultUserRole: 'Employee',
    maxFileUploadSize: 5, // MB
  });

  // Data Privacy Settings State
  const [privacySettings, setPrivacySettings] = useState({
    dataRetentionDays: 365,
    enableDataExport: true,
    enableDataDeletion: true,
    cookieConsentRequired: true,
    privacyPolicyVersion: '1.0',
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSaveSecurity = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${USER_API_ENDPOINT}/system/security-settings`,
        securitySettings,
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

  const handleSaveEmail = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${USER_API_ENDPOINT}/system/email-settings`,
        emailSettings,
        { withCredentials: true }
      );
      
      if (response.data.success) {
        toast.success('Email settings updated successfully');
      }
    } catch (error) {
      console.error('Error updating email settings:', error);
      toast.error('Failed to update email settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveGeneral = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${USER_API_ENDPOINT}/system/general-settings`,
        generalSettings,
        { withCredentials: true }
      );
      
      if (response.data.success) {
        toast.success('General settings updated successfully');
      }
    } catch (error) {
      console.error('Error updating general settings:', error);
      toast.error('Failed to update general settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePrivacy = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${USER_API_ENDPOINT}/system/privacy-settings`,
        privacySettings,
        { withCredentials: true }
      );
      
      if (response.data.success) {
        toast.success('Privacy settings updated successfully');
      }
    } catch (error) {
      console.error('Error updating privacy settings:', error);
      toast.error('Failed to update privacy settings');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-4">
      <Tabs defaultValue="security" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-[#EAECEE] p-1 rounded-lg">
          <TabsTrigger 
            value="security" 
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#2C3E50]"
          >
            <Lock className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger 
            value="email"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#2C3E50]"
          >
            <Mail className="h-4 w-4 mr-2" />
            Email
          </TabsTrigger>
          <TabsTrigger 
            value="general"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#2C3E50]"
          >
            <Globe className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger 
            value="privacy"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#2C3E50]"
          >
            <Shield className="h-4 w-4 mr-2" />
            Privacy
          </TabsTrigger>
        </TabsList>

        {/* Security Settings Tab */}
        <TabsContent value="security">
          <Card className="border border-[#EAECEE] shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-medium text-[#2C3E50]">
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                {/* Password Policy Settings */}
                <div className="grid gap-2">
                  <Label htmlFor="minPasswordLength">Minimum Password Length</Label>
                  <Input
                    id="minPasswordLength"
                    type="number"
                    min="6"
                    max="32"
                    value={securitySettings.minPasswordLength}
                    onChange={(e) => setSecuritySettings(prev => ({
                      ...prev,
                      minPasswordLength: parseInt(e.target.value)
                    }))}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="requireSpecialChar"
                    checked={securitySettings.requireSpecialChar}
                    onCheckedChange={(checked) => setSecuritySettings(prev => ({
                      ...prev,
                      requireSpecialChar: checked
                    }))}
                  />
                  <Label htmlFor="requireSpecialChar">Require Special Characters</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="requireNumbers"
                    checked={securitySettings.requireNumbers}
                    onCheckedChange={(checked) => setSecuritySettings(prev => ({
                      ...prev,
                      requireNumbers: checked
                    }))}
                  />
                  <Label htmlFor="requireNumbers">Require Numbers</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="requireUppercase"
                    checked={securitySettings.requireUppercase}
                    onCheckedChange={(checked) => setSecuritySettings(prev => ({
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
                    value={securitySettings.passwordExpiryDays}
                    onChange={(e) => setSecuritySettings(prev => ({
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
                    value={securitySettings.maxLoginAttempts}
                    onChange={(e) => setSecuritySettings(prev => ({
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
                    value={securitySettings.lockoutDuration}
                    onChange={(e) => setSecuritySettings(prev => ({
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
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => setSecuritySettings(prev => ({
                      ...prev,
                      sessionTimeout: parseInt(e.target.value)
                    }))}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="enableTwoFactor"
                    checked={securitySettings.enableTwoFactor}
                    onCheckedChange={(checked) => setSecuritySettings(prev => ({
                      ...prev,
                      enableTwoFactor: checked
                    }))}
                  />
                  <Label htmlFor="enableTwoFactor">Enable Two-Factor Authentication</Label>
                </div>
              </div>

              <Button 
                onClick={handleSaveSecurity}
                disabled={isLoading}
                className="w-full bg-[#E67E22] hover:bg-[#D35400] text-white"
              >
                {isLoading ? 'Saving...' : 'Save Security Settings'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Settings Tab */}
        <TabsContent value="email">
          <Card className="border border-[#EAECEE] shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-medium text-[#2C3E50]">
                Email Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="enableEmailNotifications"
                    checked={emailSettings.enableEmailNotifications}
                    onCheckedChange={(checked) => setEmailSettings(prev => ({
                      ...prev,
                      enableEmailNotifications: checked
                    }))}
                  />
                  <Label htmlFor="enableEmailNotifications">Enable Email Notifications</Label>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="smtpServer">SMTP Server</Label>
                  <Input
                    id="smtpServer"
                    type="text"
                    value={emailSettings.smtpServer}
                    onChange={(e) => setEmailSettings(prev => ({
                      ...prev,
                      smtpServer: e.target.value
                    }))}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input
                    id="smtpPort"
                    type="number"
                    value={emailSettings.smtpPort}
                    onChange={(e) => setEmailSettings(prev => ({
                      ...prev,
                      smtpPort: parseInt(e.target.value)
                    }))}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="smtpUsername">SMTP Username</Label>
                  <Input
                    id="smtpUsername"
                    type="text"
                    value={emailSettings.smtpUsername}
                    onChange={(e) => setEmailSettings(prev => ({
                      ...prev,
                      smtpUsername: e.target.value
                    }))}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="smtpPassword">SMTP Password</Label>
                  <Input
                    id="smtpPassword"
                    type="password"
                    value={emailSettings.smtpPassword}
                    onChange={(e) => setEmailSettings(prev => ({
                      ...prev,
                      smtpPassword: e.target.value
                    }))}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="fromEmail">From Email Address</Label>
                  <Input
                    id="fromEmail"
                    type="email"
                    value={emailSettings.fromEmail}
                    onChange={(e) => setEmailSettings(prev => ({
                      ...prev,
                      fromEmail: e.target.value
                    }))}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="emailVerificationRequired"
                    checked={emailSettings.emailVerificationRequired}
                    onCheckedChange={(checked) => setEmailSettings(prev => ({
                      ...prev,
                      emailVerificationRequired: checked
                    }))}
                  />
                  <Label htmlFor="emailVerificationRequired">Require Email Verification</Label>
                </div>
              </div>

              <Button 
                onClick={handleSaveEmail}
                disabled={isLoading}
                className="w-full bg-[#E67E22] hover:bg-[#D35400] text-white"
              >
                {isLoading ? 'Saving...' : 'Save Email Settings'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* General Settings Tab */}
        <TabsContent value="general">
          <Card className="border border-[#EAECEE] shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-medium text-[#2C3E50]">
                General Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    type="text"
                    value={generalSettings.siteName}
                    onChange={(e) => setGeneralSettings(prev => ({
                      ...prev,
                      siteName: e.target.value
                    }))}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="siteDescription">Site Description</Label>
                  <Input
                    id="siteDescription"
                    type="text"
                    value={generalSettings.siteDescription}
                    onChange={(e) => setGeneralSettings(prev => ({
                      ...prev,
                      siteDescription: e.target.value
                    }))}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="maintenanceMode"
                    checked={generalSettings.maintenanceMode}
                    onCheckedChange={(checked) => setGeneralSettings(prev => ({
                      ...prev,
                      maintenanceMode: checked
                    }))}
                  />
                  <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="allowRegistration"
                    checked={generalSettings.allowRegistration}
                    onCheckedChange={(checked) => setGeneralSettings(prev => ({
                      ...prev,
                      allowRegistration: checked
                    }))}
                  />
                  <Label htmlFor="allowRegistration">Allow User Registration</Label>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="defaultUserRole">Default User Role</Label>
                  <Input
                    id="defaultUserRole"
                    type="text"
                    value={generalSettings.defaultUserRole}
                    onChange={(e) => setGeneralSettings(prev => ({
                      ...prev,
                      defaultUserRole: e.target.value
                    }))}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="maxFileUploadSize">Maximum File Upload Size (MB)</Label>
                  <Input
                    id="maxFileUploadSize"
                    type="number"
                    min="1"
                    max="100"
                    value={generalSettings.maxFileUploadSize}
                    onChange={(e) => setGeneralSettings(prev => ({
                      ...prev,
                      maxFileUploadSize: parseInt(e.target.value)
                    }))}
                  />
                </div>
              </div>

              <Button 
                onClick={handleSaveGeneral}
                disabled={isLoading}
                className="w-full bg-[#E67E22] hover:bg-[#D35400] text-white"
              >
                {isLoading ? 'Saving...' : 'Save General Settings'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Settings Tab */}
        <TabsContent value="privacy">
          <Card className="border border-[#EAECEE] shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-medium text-[#2C3E50]">
                Privacy Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="dataRetentionDays">Data Retention Period (Days)</Label>
                  <Input
                    id="dataRetentionDays"
                    type="number"
                    min="30"
                    max="3650"
                    value={privacySettings.dataRetentionDays}
                    onChange={(e) => setPrivacySettings(prev => ({
                      ...prev,
                      dataRetentionDays: parseInt(e.target.value)
                    }))}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="enableDataExport"
                    checked={privacySettings.enableDataExport}
                    onCheckedChange={(checked) => setPrivacySettings(prev => ({
                      ...prev,
                      enableDataExport: checked
                    }))}
                  />
                  <Label htmlFor="enableDataExport">Enable Data Export</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="enableDataDeletion"
                    checked={privacySettings.enableDataDeletion}
                    onCheckedChange={(checked) => setPrivacySettings(prev => ({
                      ...prev,
                      enableDataDeletion: checked
                    }))}
                  />
                  <Label htmlFor="enableDataDeletion">Enable Data Deletion</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="cookieConsentRequired"
                    checked={privacySettings.cookieConsentRequired}
                    onCheckedChange={(checked) => setPrivacySettings(prev => ({
                      ...prev,
                      cookieConsentRequired: checked
                    }))}
                  />
                  <Label htmlFor="cookieConsentRequired">Require Cookie Consent</Label>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="privacyPolicyVersion">Privacy Policy Version</Label>
                  <Input
                    id="privacyPolicyVersion"
                    type="text"
                    value={privacySettings.privacyPolicyVersion}
                    onChange={(e) => setPrivacySettings(prev => ({
                      ...prev,
                      privacyPolicyVersion: e.target.value
                    }))}
                  />
                </div>
              </div>

              <Button 
                onClick={handleSavePrivacy}
                disabled={isLoading}
                className="w-full bg-[#E67E22] hover:bg-[#D35400] text-white"
              >
                {isLoading ? 'Saving...' : 'Save Privacy Settings'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemSettings; 